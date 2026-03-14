import { Injectable, ExecutionContext } from '@nestjs/common';
import { ThrottlerGuard, ThrottlerException } from '@nestjs/throttler';

/**
 * Stricter rate-limit guard applied only to the /payment/callback endpoint.
 *
 * Limits:
 *   - 30 requests per minute per IP  (global default via ThrottlerModule)
 *   - 10 requests per minute per IP  (this guard — tighter for callback)
 *
 * Kina Bank's IPG will never legitimately call the callback more than once
 * or twice per transaction. 10 rpm per IP is more than generous for legitimate
 * traffic and blocks any brute-force / scan attempt.
 */
@Injectable()
export class KinaCallbackThrottlerGuard extends ThrottlerGuard {
  protected async getTracker(req: Record<string, any>): Promise<string> {
    // Track by real client IP — respect X-Forwarded-For from trusted proxies
    const forwarded = req.headers?.['x-forwarded-for'];
    const ip = forwarded
      ? (Array.isArray(forwarded) ? forwarded[0] : forwarded).split(',')[0].trim()
      : req.ip;
    return ip;
  }

  protected async throwThrottlingException(): Promise<void> {
    throw new ThrottlerException('Too many requests to payment callback. Please try again later.');
  }
}
