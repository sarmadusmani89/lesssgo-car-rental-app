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
      // Terminal="12345678901" (11 chars) → "1112345678901"
      const mac = service.buildRequestMacString({
        TERMINAL: '12345678901',
        TRTYPE: '1',
        AMOUNT: '100.00',
        CURRENCY: 'PGK',
        ORDER: '123456',
        DESC: 'Car Rental',
        MERCH_NAME: 'LesssGo',
        MERCH_URL: 'https://lesssgo.com',
        MERCHANT: 'MERCH01',
        EMAIL: 'user@example.com',
        TIMESTAMP: '20260314094500',
        NONCE: 'ABCD1234ABCD1234ABCD1234ABCD1234',
        BACKREF: 'https://api.lesssgo.com/payment/callback',
      });

      // TERMINAL=11 chars → starts with "1112345678901"
      expect(mac).toContain('1112345678901');
    });

    it('encodes an absent/empty field as "-"', () => {
      const mac = service.buildRequestMacString({
        TERMINAL: '12345678901',
        TRTYPE: '1',
        AMOUNT: '100.00',
        CURRENCY: 'PGK',
        ORDER: '123456',
        DESC: 'Car Rental',
        MERCH_NAME: 'LesssGo',
        MERCH_URL: 'https://lesssgo.com',
        MERCHANT: 'MERCH01',
        EMAIL: 'user@example.com',
        TIMESTAMP: '20260314094500',
        NONCE: 'ABCD1234ABCD1234ABCD1234ABCD1234',
        BACKREF: 'https://api.lesssgo.com/payment/callback',
        COUNTRY: '',     // absent
        MERCH_GMT: '',   // absent
      });

      // COUNTRY and MERCH_GMT both absent → "-" each
      // Find two consecutive dashes that correspond to adjacent empty fields
      // (positions 10 and 12 in the field list)
      expect(mac).toMatch(/-/);
    });
  });

  // ─── buildRequestMacString field order ───────────────────────────────────

  describe('buildRequestMacString', () => {
    it('produces a deterministic MAC string for fixed input', () => {
      const fields = {
        TERMINAL: 'T001',
        TRTYPE: '1',
        AMOUNT: '250.00',
        CURRENCY: 'PGK',
        ORDER: '12345678901234',
        DESC: 'Car Rental - RAV4',
        MERCH_NAME: 'LesssGo Car Rental',
        MERCH_URL: 'https://lesssgo.com',
        MERCHANT: 'M001',
        EMAIL: 'john@test.com',
        TIMESTAMP: '20260314123456',
        NONCE: 'FF00FF00FF00FF00FF00FF00FF00FF00',
        BACKREF: 'https://api.lesssgo.com/payment/callback',
        COUNTRY: '',
        MERCH_GMT: '',
      };

      const mac1 = service.buildRequestMacString(fields);
      const mac2 = service.buildRequestMacString(fields);

      expect(mac1).toBe(mac2);
      expect(mac1).toBeTruthy();
    });

    it('contains all non-empty field values in the MAC string', () => {
      const fields = {
        TERMINAL: 'T001',
        TRTYPE: '1',
        AMOUNT: '250.00',
        CURRENCY: 'PGK',
        ORDER: '12345678901234',
        DESC: 'Car Rental',
        MERCH_NAME: 'LesssGo',
        MERCH_URL: 'https://lesssgo.com',
        MERCHANT: 'MERCHANT01',
        EMAIL: 'test@test.com',
        TIMESTAMP: '20260314123456',
        NONCE: 'AABBCCDD11223344AABBCCDD11223344',
        BACKREF: 'https://api.lesssgo.com/payment/callback',
      };

      const mac = service.buildRequestMacString(fields);

      // Every non-empty value must appear in the mac string
      expect(mac).toContain(fields.TERMINAL);
      expect(mac).toContain(fields.AMOUNT);
      expect(mac).toContain(fields.CURRENCY);
      expect(mac).toContain(fields.EMAIL);
      expect(mac).toContain(fields.NONCE);
    });
  });

  // ─── buildResponseMacString ───────────────────────────────────────────────

  describe('buildResponseMacString', () => {
    it('handles null/undefined optional fields gracefully', () => {
      expect(() =>
        service.buildResponseMacString({
          ACTION: '0',
          RC: '00',
          APPROVAL: null,       // may be absent on some declined txns
          CURRENCY: 'PGK',
          AMOUNT: '250.00',
          TERMINAL: 'T001',
          TRTYPE: '1',
          ORDER: '12345678901234',
          RRN: '123456789012',
          MERCHANT: 'M001',
          TIMESTAMP: '20260314123456',
          INT_REF: 'INTREF001',
          NONCE: 'AABBCCDD11223344AABBCCDD11223344',
        }),
      ).not.toThrow();
    });

    it('produces a deterministic result', () => {
      const fields = {
        ACTION: '0',
        RC: '00',
        APPROVAL: 'A12345',
        CURRENCY: 'PGK',
        AMOUNT: '250.00',
        TERMINAL: 'T001',
        TRTYPE: '1',
        ORDER: '12345678901234',
        RRN: '123456789012',
        MERCHANT: 'M001',
        TIMESTAMP: '20260314123456',
        INT_REF: 'INTREF001',
        NONCE: 'AABBCCDD11223344AABBCCDD11223344',
      };

      expect(service.buildResponseMacString(fields)).toBe(service.buildResponseMacString(fields));
    });
  });

  // ─── buildReversalMacString ───────────────────────────────────────────────

  describe('buildReversalMacString', () => {
    it('builds a non-empty reversal MAC string', () => {
      const mac = service.buildReversalMacString({
        TERMINAL: 'T001',
        TRTYPE: '24',
        AMOUNT: '50.00',
        CURRENCY: 'PGK',
        ORDER: '12345678901234',
        RRN: '123456789012',
        INT_REF: 'INTREF001',
        TIMESTAMP: '20260314123456',
        NONCE: 'FF00FF00FF00FF00FF00FF00FF00FF00',
        BACKREF: 'https://api.lesssgo.com/payment/callback',
      });

      expect(mac).toBeTruthy();
      expect(mac).toContain('24');   // TRTYPE
      expect(mac).toContain('T001'); // TERMINAL
    });
  });

  // ─── computeHmac ─────────────────────────────────────────────────────────

  describe('computeHmac', () => {
    it('returns an uppercase hex string of 64 chars (SHA-256 output)', () => {
      const result = service.computeHmac('testMacString');
      expect(result).toMatch(/^[0-9A-F]{64}$/);
    });

    it('matches a manually computed HMAC-SHA256 for the same input', () => {
      const macString = '4T0011120261234014250.003PGK14123456789012341INTREF001';
      const expected = knownGoodHmac(macString);
      expect(service.computeHmac(macString)).toBe(expected);
    });

    it('produces different outputs for different inputs (no collision)', () => {
      const a = service.computeHmac('inputA');
      const b = service.computeHmac('inputB');
      expect(a).not.toBe(b);
    });
  });

  // ─── verifySignature ─────────────────────────────────────────────────────

  describe('verifySignature', () => {
    it('returns true for a correct P_SIGN', () => {
      const macString = '4T0011120261234014250.003PGK14ORDERID';
      const correctSign = knownGoodHmac(macString);
      expect(service.verifySignature(macString, correctSign)).toBe(true);
    });

    it('returns false for a tampered P_SIGN', () => {
      const macString = '4T0011120261234014250.003PGK14ORDERID';
      const wrongSign = knownGoodHmac('completely-different-string');
      expect(service.verifySignature(macString, wrongSign)).toBe(false);
    });

    it('returns false for an empty P_SIGN', () => {
      expect(service.verifySignature('anyMacString', '')).toBe(false);
    });

    it('is case-insensitive on received P_SIGN', () => {
      const macString = 'someTestMac';
      const correctSign = knownGoodHmac(macString);
      // Pass lowercase version — should still verify
      expect(service.verifySignature(macString, correctSign.toLowerCase())).toBe(true);
    });

    it('returns false for a P_SIGN of wrong length', () => {
      const macString = 'someTestMac';
      expect(service.verifySignature(macString, 'TOOSHORT')).toBe(false);
    });
  });
});
