import * as Joi from 'joi';

/**
 * Joi schema that validates all required environment variables at startup.
 * If any variable is missing or malformed the application will REFUSE to start,
 * printing a clear error message — no more silent "undefined" values at runtime.
 *
 * How to add a new variable:
 *   - Required in all envs → Joi.string().required()
 *   - Optional with default  → Joi.string().default('value')
 *   - Required in prod only  → condition on NODE_ENV (see KINA_* below)
 */
export const configValidationSchema = Joi.object({
  // ── Runtime ────────────────────────────────────────────────────────────────
  NODE_ENV: Joi.string()
    .valid('development', 'test', 'production', 'staging')
    .default('development'),

  PORT: Joi.number().default(3001),

  // ── Database ───────────────────────────────────────────────────────────────
  DATABASE_URL: Joi.string().uri().required().messages({
    'string.uri': 'DATABASE_URL must be a valid connection URI (e.g. postgresql://user:pass@host:5432/db)',
    'any.required': 'DATABASE_URL is required',
  }),

  // ── JWT Auth ───────────────────────────────────────────────────────────────
  JWT_SECRET: Joi.string().min(16).required().messages({
    'string.min': 'JWT_SECRET must be at least 16 characters long',
    'any.required': 'JWT_SECRET is required',
  }),

  JWT_EXPIRES_IN: Joi.string().default('7d'),

  // ── Frontend ───────────────────────────────────────────────────────────────
  FRONTEND_URL: Joi.string().uri().required().messages({
    'string.uri': 'FRONTEND_URL must be a valid URL (e.g. https://lesssgo.com)',
    'any.required': 'FRONTEND_URL is required — it is used to build payment redirect URLs',
  }),

  // ── Email (SendGrid / SMTP) ────────────────────────────────────────────────
  SENDGRID_API_KEY: Joi.string().optional(),
  SMTP_HOST: Joi.string().optional(),
  SMTP_PORT: Joi.number().optional(),
  SMTP_USER: Joi.string().optional(),
  SMTP_PASS: Joi.string().optional(),
  EMAIL_FROM: Joi.string().email().optional(),

  // ── Cloudinary ─────────────────────────────────────────────────────────────
  CLOUDINARY_CLOUD_NAME: Joi.string().optional(),
  CLOUDINARY_API_KEY: Joi.string().optional(),
  CLOUDINARY_API_SECRET: Joi.string().optional(),

  // ── Stripe (legacy / optional) ─────────────────────────────────────────────
  STRIPE_SECRET_KEY: Joi.string().optional(),
  STRIPE_WEBHOOK_SECRET: Joi.string().optional(),

  // ── Kina Bank IPG ─────────────────────────────────────────────────────────
  //    All four are REQUIRED for the payment flow to work.
  //    KINA_SECRET_KEY must be a valid HEX string.
  KINA_GATEWAY_URL: Joi.string().uri().required().messages({
    'string.uri': 'KINA_GATEWAY_URL must be a valid URL pointing to the Kina IPG endpoint',
    'any.required': 'KINA_GATEWAY_URL is required for Kina Bank payment processing',
  }),

  KINA_TERMINAL_ID: Joi.string().required().messages({
    'any.required': 'KINA_TERMINAL_ID is required — obtain this from Kina Bank',
  }),

  KINA_MERCHANT_ID: Joi.string().required().messages({
    'any.required': 'KINA_MERCHANT_ID is required — obtain this from Kina Bank',
  }),

  KINA_SECRET_KEY: Joi.string()
    .pattern(/^[0-9a-fA-F]{32,128}$/)
    .required()
    .messages({
      'string.pattern.base':
        'KINA_SECRET_KEY must be a valid hexadecimal string (typically 48 or 64 characters long)',
      'any.required': 'KINA_SECRET_KEY is required for HMAC signature verification',
    }),

  KINA_BACKREF_URL: Joi.string()
    .uri()
    .custom((value, helpers) => {
      // In production, BACKREF must NOT be a localhost URL — Kina can't reach it
      if (
        process.env.NODE_ENV === 'production' &&
        (value.includes('localhost') || value.includes('127.0.0.1'))
      ) {
        return helpers.error('any.invalid');
      }
      return value;
    })
    .required()
    .messages({
      'string.uri': 'KINA_BACKREF_URL must be a valid public URL (e.g. https://api.lesssgo.com/payment/callback)',
      'any.required': 'KINA_BACKREF_URL is required — Kina Bank POSTs payment results to this URL',
      'any.invalid': 'KINA_BACKREF_URL cannot be a localhost URL in production — Kina cannot reach it',
    }),

  KINA_MERCH_NAME: Joi.string().default('LesssGo Car Rental'),
  KINA_MERCH_URL: Joi.string().uri().default('https://lesssgo.com').messages({
    'string.uri': 'KINA_MERCH_URL must be a valid URL',
  }),
});
