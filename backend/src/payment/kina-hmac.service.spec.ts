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

  // ─── buildRequestMacString ───────────────────────────────────────────────

  describe('buildRequestMacString (PDF Page 11)', () => {
    it('matches the example from PDF Page 13', () => {
      // Data from PDF Page 12/13 example
      const fields = {
        TERMINAL: '99999999',
        TRTYPE: '1',
        AMOUNT: '11.48',
        CURRENCY: 'USD',
        ORDER: '771446',
        MERCHANT: '123456789012345',
        EMAIL: 'pgw@mail.sample.com',
        BACKREF: 'https://www.sample.com/shop/reply',
        TIMESTAMP: '20030105153021',
        MERCH_NAME: 'Books Online Inc.',
        COUNTRY: '',
        MERCH_URL: 'www.sample.com',
        MERCH_GMT: '',
        DESC: 'IT Books. Qty: 2',
        NONCE: 'F2B2DD7E603A7ADA',
      };

      const mac = service.buildRequestMacString(fields);
      // Expected string from PDF Page 13:
      const expectedMac = '89999999911511.483USD67714461512345678901234519pgw@mail.sample.com33https://www.sample.com/shop/reply142003010515302117Books Online Inc.-14www.sample.com-16IT Books. Qty: 216F2B2DD7E603A7ADA';
      
      expect(mac).toBe(expectedMac);
    });
  });

  // ─── buildResponseMacString ───────────────────────────────────────────────

  describe('buildResponseMacString (PDF Page 11)', () => {
    it('produces a deterministic MAC string with MERCHANT field', () => {
      const fields = {
        ACTION: '0',
        RC: '00',
        APPROVAL: 'A12345',
        CURRENCY: 'PGK',
        AMOUNT: '250.00',
        TERMINAL: 'T001',
        TRTYPE: '1',
        ORDER: '1234567890',
        RRN: '123456789012',
        MERCHANT: '000000999990001',
        TIMESTAMP: '20260315123456',
        INT_REF: 'INTREF001',
        NONCE: 'FF00FF00FF00FF00FF00FF00FF00FF00',
      };

      const mac = service.buildResponseMacString(fields);
      
      // Verify order: ACTION, RC, APPROVAL, CURRENCY, AMOUNT, TERMINAL, TRTYPE, ORDER, RRN, MERCHANT, TIMESTAMP, INT_REF, NONCE
      expect(mac).toBe('102006A123453PGK6250.004T00111101234567890121234567890121500000099999000114202603151234569INTREF00132FF00FF00FF00FF00FF00FF00FF00FF00');
    });

    it('handles null/undefined optional fields as "-"', () => {
      const mac = service.buildResponseMacString({
        ACTION: '2',
        RC: '05',
        APPROVAL: null,
        CURRENCY: 'PGK',
        AMOUNT: '100.00',
        TERMINAL: 'T001',
        TRTYPE: '1',
        ORDER: '123',
        RRN: undefined,
        MERCHANT: 'M1',
        TIMESTAMP: '20260315123456',
        INT_REF: null,
        NONCE: 'N1',
      });

      // APPROVAL(-), RRN(-), INT_REF(-) positions should have "-"
      expect(mac).toContain('-');
      expect(mac).toBe('12205-3PGK6100.004T001113123-2M11420260315123456-2N1');
    });
  });

  // ─── buildManagementMacString ─────────────────────────────────────────────

  describe('buildManagementMacString (PDF Page 7/8)', () => {
    it('builds a MAC string in the order: ORDER, AMOUNT, CURRENCY, RRN, INT_REF, TRTYPE, TERMINAL, TIMESTAMP, NONCE', () => {
      const mac = service.buildManagementMacString({
        ORDER: 'ORD001',
        AMOUNT: '50.00',
        CURRENCY: 'PGK',
        RRN: 'RRN001',
        INT_REF: 'INT001',
        TRTYPE: '21',
        TERMINAL: 'T001',
        TIMESTAMP: '20260315123456',
        NONCE: 'NONCE001',
      });

      expect(mac).toBe('6ORD001550.003PGK6RRN0016INT0012214T00114202603151234568NONCE001');
    });
  });
});
