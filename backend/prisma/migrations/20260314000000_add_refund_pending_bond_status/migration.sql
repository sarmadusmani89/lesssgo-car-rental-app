-- Migration: add REFUND_PENDING to BondStatus enum
-- This adds an intermediate state used during Stripe/Kina Bank bond refund flow.
-- bondStatus transitions: PAID → REFUND_PENDING → REFUNDED
-- REFUND_PENDING is set when refund is initiated; REFUNDED is set by webhook/callback confirmation.

ALTER TYPE "BondStatus" ADD VALUE 'REFUND_PENDING' BEFORE 'REFUNDED';
