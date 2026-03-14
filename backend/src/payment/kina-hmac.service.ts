import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as crypto from 'crypto';

@Injectable()
export class KinaHmacService {
  private readonly logger = new Logger(KinaHmacService.name);
  private readonly secretKey: string;

  constructor(private readonly configService: ConfigService) {
    this.secretKey = this.configService.get<string>('KINA_SECRET_KEY') || '';
    if (!this.secretKey) {
      this.logger.error('❌ KINA_SECRET_KEY is not defined — payment signatures will fail');
    }
  }

  // ---------------------------------------------------------------------------
  // ENCODING RULE (Kina Bank IPG spec)
  //   present field  → "<length><value>"   e.g.  "3PGK"
  //   absent/empty   → "-"
  // ---------------------------------------------------------------------------
  private encodeField(val: string | null | undefined): string {
    if (val === null || val === undefined || val === '') return '-';
    return `${val.length}${val}`;
  }

  private buildMacString(values: (string | null | undefined)[]): string {
    return values.map((v) => this.encodeField(v)).join('');
  }

  // ---------------------------------------------------------------------------
  // REQUEST MAC  (merchant → IPG, with P_SIGN in the POST form)
  // Field order per Kina Bank IPG Integration Guide:
  //   TERMINAL, TRTYPE, AMOUNT, CURRENCY, ORDER, MERCHANT, EMAIL,
  //   BACKREF, TIMESTAMP, MERCH_NAME, COUNTRY, MERCH_URL, MERCH_GMT, DESC, NONCE
  // ---------------------------------------------------------------------------
  buildRequestMacString(fields: {
    TERMINAL: string;
    TRTYPE: string;
    AMOUNT: string;
    CURRENCY: string;
    ORDER: string;
    DESC: string;
    MERCH_NAME: string;
    MERCH_URL: string;
    MERCHANT: string;
    EMAIL: string;
    TIMESTAMP: string;
    NONCE: string;
    BACKREF: string;
    COUNTRY?: string;
    MERCH_GMT?: string;
  }): string {
    const values = [
      fields.TERMINAL,
      fields.TRTYPE,
      fields.AMOUNT,
      fields.CURRENCY,
      fields.ORDER,
      fields.MERCHANT,
      fields.EMAIL,
      fields.BACKREF,
      fields.TIMESTAMP,
      fields.MERCH_NAME,
      fields.COUNTRY ?? '',    // absent → "-"
      fields.MERCH_URL,
      fields.MERCH_GMT ?? '',  // absent → "-"
      fields.DESC,
      fields.NONCE,
    ];

    const macString = this.buildMacString(values);
    this.logger.debug(`[REQUEST MAC] String: ${macString}`);
    return macString;
  }

  // ---------------------------------------------------------------------------
  // RESPONSE MAC  (IPG → merchant, verified by us)
  // Field order per Kina Bank IPG Integration Guide:
  //   ACTION, RC, APPROVAL, STAN, RRN, INT_REF,
  //   TERMINAL, TRTYPE, AMOUNT, CURRENCY, ORDER, TIMESTAMP, NONCE
  // ---------------------------------------------------------------------------
  buildResponseMacString(fields: {
    TERMINAL: string | null | undefined;
    TRTYPE: string | null | undefined;
    AMOUNT: string | null | undefined;
    CURRENCY: string | null | undefined;
    ORDER: string | null | undefined;
    ACTION: string | null | undefined;
    RC: string | null | undefined;
    APPROVAL: string | null | undefined;
    RRN: string | null | undefined;
    INT_REF: string | null | undefined;
    TIMESTAMP: string | null | undefined;
    NONCE: string | null | undefined;
  }): string {
    const values = [
      fields.TERMINAL,
      fields.TRTYPE,
      fields.AMOUNT,
      fields.CURRENCY,
      fields.ORDER,
      fields.ACTION,
      fields.RC,
      fields.APPROVAL,
      fields.RRN,
      fields.INT_REF,
      fields.TIMESTAMP,
      fields.NONCE,
    ];

    const macString = this.buildMacString(values);
    this.logger.debug(`[RESPONSE MAC] String: ${macString}`);
    return macString;
  }

  // ---------------------------------------------------------------------------
  // REVERSAL MAC  (TRTYPE=24, merchant → IPG)
  // Field order: TERMINAL, TRTYPE, AMOUNT, CURRENCY, ORDER, RRN, INT_REF, TIMESTAMP, NONCE, BACKREF
  // ---------------------------------------------------------------------------
  buildReversalMacString(fields: {
    TERMINAL: string;
    TRTYPE: string;
    AMOUNT: string;
    CURRENCY: string;
    ORDER: string;
    RRN: string | null | undefined;
    INT_REF: string | null | undefined;
    TIMESTAMP: string;
    NONCE: string;
    BACKREF: string;
  }): string {
    const values = [
      fields.TERMINAL,
      fields.TRTYPE,
      fields.AMOUNT,
      fields.CURRENCY,
      fields.ORDER,
      fields.RRN,
      fields.INT_REF,
      fields.TIMESTAMP,
      fields.NONCE,
      fields.BACKREF,
    ];

    const macString = this.buildMacString(values);
    this.logger.debug(`[REVERSAL MAC] String: ${macString}`);
    return macString;
  }

  // ---------------------------------------------------------------------------
  // HMAC-SHA256 computation
  // The secret key is provided as a HEX string per Kina Bank documentation.
  // ---------------------------------------------------------------------------
  computeHmac(macString: string): string {
    if (!this.secretKey) throw new Error('KINA_SECRET_KEY is missing — cannot compute HMAC');

    const keyBuffer = Buffer.from(this.secretKey, 'hex');

    return crypto
      .createHmac('sha256', keyBuffer)
      .update(macString, 'utf8')
      .digest('hex')
      .toUpperCase();
  }

  // ---------------------------------------------------------------------------
  // Constant-time signature comparison to prevent timing attacks.
  // ---------------------------------------------------------------------------
  verifySignature(macString: string, receivedPSign: string): boolean {
    if (!receivedPSign) {
      this.logger.error('❌ P_SIGN is missing in callback body');
      return false;
    }

    const computedSignature = this.computeHmac(macString);

    this.logger.debug(`[VERIFY] MAC String        : ${macString}`);
    this.logger.debug(`[VERIFY] Computed Signature : ${computedSignature}`);
    this.logger.debug(`[VERIFY] Received Signature : ${receivedPSign.toUpperCase()}`);

    try {
      const computedBuf = Buffer.from(computedSignature, 'hex');
      const receivedBuf = Buffer.from(receivedPSign.toUpperCase(), 'hex');

      if (computedBuf.length !== receivedBuf.length) {
        this.logger.error(
          `❌ Signature length mismatch: computed=${computedBuf.length} received=${receivedBuf.length}`,
        );
        return false;
      }

      return crypto.timingSafeEqual(computedBuf, receivedBuf);
    } catch (e: any) {
      this.logger.error(`❌ Signature verification threw: ${e.message}`);
      return false;
    }
  }
}
