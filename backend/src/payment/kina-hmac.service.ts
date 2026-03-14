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
      this.logger.error('KINA_SECRET_KEY is not defined in environment variables');
    }
  }

  /**
   * Assembles the MAC source string for a payment request.
   * Order is CRITICAL based on Kina Bank specification.
   */
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
  }): string {
    const values = [
      fields.TERMINAL,
      fields.TRTYPE,
      fields.AMOUNT,
      fields.CURRENCY,
      fields.ORDER,
      fields.DESC,
      fields.MERCH_NAME,
      fields.MERCH_URL,
      fields.MERCHANT,
      fields.EMAIL,
      fields.TIMESTAMP,
      fields.NONCE,
      fields.BACKREF,
    ];

    return values.map(val => (val ? `${val.length}${val}` : '-')).join('');
  }

  /**
   * Assembles the MAC source string for a payment response/callback.
   * Order is CRITICAL based on Kina Bank specification.
   */
  buildResponseMacString(fields: {
    ACTION: string;
    RC: string;
    APPROVAL: string;
    STAN: string;
    RRN: string;
    INT_REF: string;
    TERMINAL: string;
    TRTYPE: string;
    AMOUNT: string;
    CURRENCY: string;
    ORDER: string;
    TIMESTAMP: string;
    NONCE: string;
  }): string {
    const values = [
      fields.ACTION,
      fields.RC,
      fields.APPROVAL,
      fields.STAN,
      fields.RRN,
      fields.INT_REF,
      fields.TERMINAL,
      fields.TRTYPE,
      fields.AMOUNT,
      fields.CURRENCY,
      fields.ORDER,
      fields.TIMESTAMP,
      fields.NONCE,
    ];

    return values.map(val => (val ? `${val.length}${val}` : '-')).join('');
  }

  /**
   * Computes HMAC-SHA256 signature using the hex secret key.
   */
  computeHmac(macString: string): string {
    if (!this.secretKey) throw new Error('KINA_SECRET_KEY missing');
    
    // Secret key is provided as a HEX string in the Kina docs
    const keyBuffer = Buffer.from(this.secretKey, 'hex');
    
    return crypto
      .createHmac('sha256', keyBuffer)
      .update(macString)
      .digest('hex')
      .toUpperCase();
  }

  /**
   * Verifies a received signature against a computed one.
   */
  verifySignature(macString: string, receivedPSign: string): boolean {
    const computedSignature = this.computeHmac(macString);
    
    this.logger.debug(`MAC String: ${macString}`);
    this.logger.debug(`Computed Signature: ${computedSignature}`);
    this.logger.debug(`Received Signature: ${receivedPSign}`);

    try {
      return crypto.timingSafeEqual(
        Buffer.from(computedSignature, 'hex'),
        Buffer.from(receivedPSign.toUpperCase(), 'hex')
      );
    } catch (e: any) {
      this.logger.error(`Signature verification failed: ${e.message}`);
      return false;
    }
  }
}
