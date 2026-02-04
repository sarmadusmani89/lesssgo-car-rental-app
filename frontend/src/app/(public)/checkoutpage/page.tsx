'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import BookingSummary from '@/components/pages/checkoutpage/bookingsummary';
import CustomerInformationForm from '@/components/pages/checkoutpage/customerinformationform';
import PaymentMethodSelection from '@/components/pages/checkoutpage/paymentmethodselection';
import TermsAndConditionsCheckbox from '@/components/pages/checkoutpage/termsandconditioncheckbox';
import ConfirmBookingButton from '@/components/pages/checkoutpage/confirmbookingbutton';
import LoadingStatesDuringPayment from '@/components/pages/checkoutpage/loadingstatesduringpayment';
import api from '@/lib/api';
import { toast } from 'sonner';
import { Loader2, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function CheckoutPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const carId = searchParams.get('id');
  const startDate = searchParams.get('startDate') || '';
  const endDate = searchParams.get('endDate') || '';

  const [car, setCar] = useState<any>(null);
  const [customerData, setCustomerData] = useState<any>({
    firstName: '',
    lastName: '',
    phoneNumber: '',
    address: '',
    townCity: '',
  });
  const [paymentMethod, setPaymentMethod] = useState<string>('card');
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);

  useEffect(() => {
    if (!carId) {
      router.push('/cars');
      return;
    }

    const fetchCar = async () => {
      try {
        setPageLoading(true);
        const res = await api.get(`/car/${carId}`);
        setCar(res.data);
      } catch (error) {
        console.error("Failed to fetch car for checkout:", error);
        toast.error("Failed to load vehicle details");
      } finally {
        setPageLoading(false);
      }
    };

    fetchCar();
  }, [carId]);

  const isFormValid = customerData.firstName && customerData.lastName && acceptedTerms && startDate && endDate;

  const handleConfirmBooking = async () => {
    if (!isFormValid) {
      toast.error("Please fill in all required fields and accept terms.");
      return;
    }

    try {
      setLoading(true);

      // Prepare data for backend
      const bookingData = {
        carId,
        startDate: new Date(startDate).toISOString(),
        endDate: new Date(endDate).toISOString(),
        totalPrice: car.pricePerDay * Math.ceil((new Date(endDate).getTime() - new Date(startDate).getTime()) / (1000 * 3600 * 24)),
        status: 'PENDING',
        // Customer basic info usually comes from User profile in backend via token
        // but we can pass extra info if DTO supports it
      };

      const res = await api.post('/booking', bookingData);

      toast.success('✅ Reservation confirmed successfully!');

      // Redirect to user dashboard after success
      setTimeout(() => {
        router.push('/dashboard');
      }, 1500);

    } catch (error: any) {
      console.error("Booking error:", error);
      toast.error(error.response?.data?.message || "Booking failed! Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (pageLoading) return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <Loader2 className="animate-spin text-blue-600" size={48} />
    </div>
  );

  return (
    <div className="bg-gray-50 min-h-screen pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="mb-8">
          <Link href={`/car?id=${carId}`} className="inline-flex items-center text-gray-500 hover:text-blue-600 transition font-medium text-sm">
            <ArrowLeft size={16} className="mr-2" />
            Back to vehicle details
          </Link>
          <h1 className="text-4xl font-black text-gray-900 font-outfit mt-4">Complete your <span className="text-blue-600">Reservation</span></h1>
          <p className="text-gray-500 mt-2">Professional rental service you can trust.</p>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-12 gap-10">
          <div className="xl:col-span-8 space-y-8">
            <CustomerInformationForm onChange={(data: any) => setCustomerData({ ...customerData, ...data })} />

            <PaymentMethodSelection
              selected={paymentMethod}
              onChange={setPaymentMethod}
            />

            <TermsAndConditionsCheckbox
              checked={acceptedTerms}
              onChange={setAcceptedTerms}
            />

            <div className="hidden xl:block">
              {loading ? (
                <LoadingStatesDuringPayment />
              ) : (
                <ConfirmBookingButton
                  disabled={!isFormValid}
                  onConfirm={handleConfirmBooking}
                />
              )}
            </div>
          </div>

          <div className="xl:col-span-4 h-fit sticky top-24">
            <BookingSummary car={car} startDate={startDate} endDate={endDate} />

            <div className="xl:hidden mt-8">
              {loading ? (
                <LoadingStatesDuringPayment />
              ) : (
                <ConfirmBookingButton
                  disabled={!isFormValid}
                  onConfirm={handleConfirmBooking}
                />
              )}
            </div>

            <div className="mt-8 p-6 bg-blue-50 rounded-3xl border border-blue-100 italic text-sm text-blue-700">
              <p className="font-bold mb-2 uppercase tracking-tight">Need help?</p>
              <p>Our 24/7 support line is available for any questions regarding your reservation.</p>
              <p className="not-italic font-bold mt-2">Call: +1 (555) 012-3456</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
