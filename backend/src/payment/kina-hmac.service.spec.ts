import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { KinaHmacService } from './kina-hmac.service';
import * as crypto from 'crypto';

// ---------------------------------------------------------------------------
// A real 64-char hex secret (32 bytes) so we can compute known-good HMACs
// ---------------------------------------------------------------------------
const TEST_SECRET_HEX = 'a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6a7b8c9d0e1f2a3b4c5d6a7b8c9d0e1f2';

function knownGoodHmac(macString: string): string {
  const keyBuffer = Buffer.from(TEST_SECRET_HEX, 'hex');
  return crypto.createHmac('sha256', keyBuffer).update(macString, 'utf8').digest('hex').toUpperCase();
}

describe('KinaHmacService', () => {
  let service: KinaHmacService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        KinaHmacService,
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn().mockReturnValue(TEST_SECRET_HEX),
          },
        },
      ],
    }).compile();

    service = module.get<KinaHmacService>(KinaHmacService);
  });

  // ─── encodeField rules ───────────────────────────────────────────────────

  describe('field encoding (via buildRequestMacString)', () => {
    it('encodes a present field as "<length><value>"', () => {
      // Terminal="12345678" (8 chars) → "812345678"
      const mac = service.buildRequestMacString({
        AMOUNT: '100.00',
        CURRENCY: 'PGK',
        ORDER: '123456',
        DESC: 'Car Rental',
        MERCH_NAME: 'LesssGo',
        MERCH_URL: 'https://lesssgo.com',
        MERCHANT: 'MERCH01',
        TERMINAL: '12345678',
        EMAIL: 'user@example.com',
        TRTYPE: '1',
        TIMESTAMP: '20260314094500',
        NONCE: 'ABCD1234ABCD1234ABCD1234ABCD1234',
        BACKREF: 'https://api.lesssgo.com/payment/callback',
      });

      expect(mac).toContain('812345678');
    });

    it('encodes an absent/empty field as "-"', () => {
      const mac = service.buildRequestMacString({
        AMOUNT: '100.00',
        CURRENCY: 'PGK',
        ORDER: '123456',
        DESC: 'Car Rental',
        MERCH_NAME: 'LesssGo',
        MERCH_URL: 'https://lesssgo.com',
        MERCHANT: 'MERCH01',
        TERMINAL: '12345678',
        EMAIL: 'user@example.com',
        TRTYPE: '1',
        TIMESTAMP: '20260314094500',
        NONCE: 'ABCD1234ABCD1234ABCD1234ABCD1234',
        BACKREF: 'https://api.lesssgo.com/payment/callback',
        COUNTRY: '',     // absent
        MERCH_GMT: '',   // absent
      });

      expect(mac).toMatch(/-/);
    });
  });

  // ─── buildRequestMacString field order ───────────────────────────────────

  describe('buildRequestMacString', () => {
    it('produces a deterministic MAC string for fixed input', () => {
      const fields = {
        AMOUNT: '250.00',
        CURRENCY: 'PGK',
        ORDER: '12345678901234',
        DESC: 'Car Rental - RAV4',
        MERCH_NAME: 'LesssGo Car Rental',
        MERCH_URL: 'https://lesssgo.com',
        MERCHANT: 'M001',
        TERMINAL: 'T001',
        EMAIL: 'john@test.com',
        TRTYPE: '1',
        TIMESTAMP: '20260314123456',
        NONCE: 'FF00FF00FF00FF00FF00FF00FF00FF00',
        BACKREF: 'https://api.lesssgo.com/payment/callback',
      };

      const mac1 = service.buildRequestMacString(fields);
      const mac2 = service.buildRequestMacString(fields);

      expect(mac1).toBe(mac2);
      expect(mac1).toBeTruthy();
    });
  });

  // ─── buildResponseMacString ───────────────────────────────────────────────

  describe('buildResponseMacString', () => {
    it('handles null/undefined optional fields gracefully', () => {
      expect(() =>
        service.buildResponseMacString({
          TERMINAL: 'T001',
          TRTYPE: '1',
          ORDER: '12345678901234',
          AMOUNT: '250.00',
          CURRENCY: 'PGK',
          ACTION: '0',
          RC: '00',
          APPROVAL: null,
          RRN: '123456789012',
          INT_REF: 'INTREF001',
          TIMESTAMP: '20260314123456',
          NONCE: 'AABBCCDD11223344AABBCCDD11223344',
        }),
      ).not.toThrow();
    });

    it('produces a deterministic result', () => {
      const fields = {
        TERMINAL: 'T001',
        TRTYPE: '1',
        ORDER: '12345678901234',
        AMOUNT: '250.00',
        CURRENCY: 'PGK',
        ACTION: '0',
        RC: '00',
        APPROVAL: 'A12345',
        RRN: '123456789012',
        INT_REF: 'INTREF001',
        TIMESTAMP: '20260314123456',
        NONCE: 'AABBCCDD11223344AABBCCDD11223344',
      };

      expect(service.buildResponseMacString(fields)).toBe(service.buildResponseMacString(fields));
    });
  });

  // ─── buildManagementMacString ───────────────────────────────────────────────

  describe('buildManagementMacString', () => {
    it('builds a non-empty management MAC string', () => {
      const mac = service.buildManagementMacString({
        ORDER: '12345678901234',
        AMOUNT: '50.00',
        CURRENCY: 'PGK',
        RRN: '123456789012',
        INT_REF: 'INTREF001',
        TRTYPE: '24',
        TERMINAL: 'T001',
        TIMESTAMP: '20260314123456',
        NONCE: 'FF00FF00FF00FF00FF00FF00FF00FF00',
      });

      expect(mac).toBeTruthy();
      expect(mac).toContain('24');
      expect(mac).toContain('T001');
    });
  });

  // ─── computeHmac ─────────────────────────────────────────────────────────

  describe('computeHmac', () => {
    it('returns an uppercase hex string of 64 chars', () => {
      const result = service.computeHmac('testMacString');
      expect(result).toMatch(/^[0-9A-F]{64}$/);
    });
  });

  // ─── verifySignature ─────────────────────────────────────────────────────

  describe('verifySignature', () => {
    it('returns true for a correct P_SIGN', () => {
      const macString = 'someTestMacString';
      const correctSign = knownGoodHmac(macString);
      expect(service.verifySignature(macString, correctSign)).toBe(true);
    });

    it('returns false for a tampered P_SIGN', () => {
      const macString = 'someTestMacString';
      const wrongSign = knownGoodHmac('completely-different-string');
      expect(service.verifySignature(macString, wrongSign)).toBe(false);
    });
  });
});
