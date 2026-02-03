'use client';

import { useState } from 'react';

import BookingSummary from '@/components/pages/checkoutpage/bookingsummary';
import CustomerInformationForm from '@/components/pages/checkoutpage/customerinformationform';
import PaymentMethodSelection from '@/components/pages/checkoutpage/paymentmethodselection';
import TermsAndConditionsCheckbox from '@/components/pages/checkoutpage/termsandconditioncheckbox';
import ConfirmBookingButton from '@/components/pages/checkoutpage/confirmbookingbutton';
import LoadingStatesDuringPayment from '@/components/pages/checkoutpage/loadingstatesduringpayment';

export default function CheckoutPage() {
  const [customerData, setCustomerData] = useState<any>(null);
  const [paymentMethod, setPaymentMethod] = useState<string>('card');
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [loading, setLoading] = useState(false);

  const isFormValid =
    customerData &&
    customerData.name &&
    customerData.email &&
    acceptedTerms;

  const handleConfirmBooking = async () => {
    if (!isFormValid) return;

    setLoading(true);

    // Simulate payment processing
    setTimeout(() => {
      setLoading(false);
      alert('✅ Booking confirmed successfully!');
    }, 2000);
  };

  return (
    <div className="max-w-5xl mx-auto p-8 space-y-6">
      <h1 className="text-2xl font-bold">Checkout</h1>

      <BookingSummary />

      <CustomerInformationForm onChange={setCustomerData} />

      <PaymentMethodSelection
        selected={paymentMethod}
        onChange={setPaymentMethod}
      />

      <TermsAndConditionsCheckbox
        checked={acceptedTerms}
        onChange={setAcceptedTerms}
      />

      {loading ? (
        <LoadingStatesDuringPayment />
      ) : (
        <ConfirmBookingButton
          disabled={!isFormValid}
          onConfirm={handleConfirmBooking}
        />
      )}
    </div>
  );
}
