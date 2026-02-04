'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import BookingSummary from '@/components/pages/checkout/BookingSummary';
import CustomerInformationForm from '@/components/pages/checkout/CustomerInformationForm';
import PaymentMethodSelection from '@/components/pages/checkout/PaymentMethodSelection';
import TermsAndConditionsCheckbox from '@/components/pages/checkout/TermsAndConditionCheckbox';
import ConfirmBookingButton from '@/components/pages/checkout/ConfirmBookingButton';
import CheckoutHeader from '@/components/pages/checkout/CheckoutHeader';
import CheckoutSupport from '@/components/pages/checkout/CheckoutSupport';
import LoadingStatesDuringPayment from '@/components/pages/checkout/LoadingStatesDuringPayment';
import api from '@/lib/api';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

export default function CheckoutPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const carId = searchParams.get('id');
  const startDate = searchParams.get('startDate') || '';
  const endDate = searchParams.get('endDate') || '';

  const [car, setCar] = useState<any>(null);
  const [customerData, setCustomerData] = useState<any>({
    fullName: '',
    email: '',
    phoneNumber: '',
  });
  const [initialUserData, setInitialUserData] = useState<any>(null);
  const [paymentMethod, setPaymentMethod] = useState<string>('stripe');
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [bookingId, setBookingId] = useState<string | null>(null);

  useEffect(() => {
    if (!carId) {
      router.push('/vehicles');
      return;
    }

    const fetchData = async () => {
      try {
        setPageLoading(true);
        // Fetch car
        const carRes = await api.get(`/car/${carId}`);
        setCar(carRes.data);

        // Pre-fill user data from localStorage if logged in
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
          try {
            const userData = JSON.parse(storedUser);
            setInitialUserData({
              fullName: userData.name,
              email: userData.email,
              phoneNumber: userData.phoneNumber || '',
            });
          } catch (err) {
            console.error("Failed to parse stored user data:", err);
          }
        }
      } catch (error) {
        console.error("Failed to fetch data for checkout:", error);
        toast.error("Failed to load reservation details");
      } finally {
        setPageLoading(false);
      }
    };

    fetchData();
  }, [carId]);

  const calculateDays = () => {
    if (!startDate || !endDate) return 0;
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const days = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return days >= 0 ? days + 1 : 0; // Sync with car detail page (inclusive)
  };

  const days = calculateDays();
  const totalAmount = car ? car.pricePerDay * days : 0;

  const isFormValid = customerData.fullName && customerData.email && acceptedTerms && startDate && endDate;

  const handleConfirmBooking = async () => {
    if (!isFormValid) {
      toast.error("Please fill in all required fields and accept terms.");
      return;
    }

    try {
      setLoading(true);

      // 1. Create the booking FIRST
      const storedUser = localStorage.getItem('user');
      const userId = storedUser ? JSON.parse(storedUser).id : null;

      if (!userId) {
        toast.error("Please log in to complete your booking.");
        router.push('/auth/login?redirect=' + window.location.pathname + window.location.search);
        return;
      }

      const bookingData = {
        userId,
        carId,
        startDate: new Date(startDate).toISOString(),
        endDate: new Date(endDate).toISOString(),
        totalAmount,
        status: 'PENDING',
        paymentStatus: 'PENDING',
        customerName: customerData.fullName,
        customerEmail: customerData.email,
        customerPhone: customerData.phoneNumber || '',
        paymentMethod: paymentMethod === 'stripe' ? 'ONLINE' : 'CASH',
      };

      const bookingRes = await api.post('/booking', bookingData);
      const newBookingId = bookingRes.data.id;
      setBookingId(newBookingId);

      if (paymentMethod === 'stripe') {
        // 2. Create Stripe Checkout Session
        const sessionRes = await api.post('/payment/create-session', { bookingId: newBookingId });
        window.location.href = sessionRes.data.url; // Redirect to hosted Stripe page
      } else {
        // Cash payment direct success
        toast.success('✅ Reservation confirmed successfully!');
        const params = new URLSearchParams({
          carName: car.name,
          startDate,
          endDate,
          total: totalAmount.toString(),
          payment: 'CASH'
        });
        router.push(`/thank-you?${params.toString()}`);
      }

    } catch (error: any) {
      console.error("Booking error:", error);
      toast.error(error.response?.data?.message || "Booking failed! Please try again.");
    } finally {
      if (paymentMethod !== 'stripe') setLoading(false);
    }
  };

  if (pageLoading) return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4 bg-gray-50">
      <Loader2 className="animate-spin text-blue-600" size={48} />
      <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">Preparing your experience...</p>
    </div>
  );

  return (
    <div className="bg-gray-50 min-h-screen pb-32">
      <CheckoutHeader carId={carId} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-12">
          <div className="xl:col-span-8 space-y-10">
            <div>
              <CustomerInformationForm
                initialData={initialUserData}
                onChange={(data: any) => setCustomerData(data)}
              />
              <div className="mt-10">
                <PaymentMethodSelection
                  selected={paymentMethod}
                  onChange={setPaymentMethod}
                />
              </div>
              <div className="mt-10 bg-white rounded-[2.5rem] p-4 border border-gray-100 shadow-xl shadow-gray-100/50">
                <TermsAndConditionsCheckbox
                  checked={acceptedTerms}
                  onChange={setAcceptedTerms}
                />
              </div>
            </div>

            <div className="xl:block">
              {loading ? (
                <LoadingStatesDuringPayment />
              ) : (
                <ConfirmBookingButton
                  disabled={!isFormValid}
                  onConfirm={handleConfirmBooking}
                  paymentMethod={paymentMethod}
                  total={totalAmount}
                />
              )}
            </div>
          </div>

          <div className="xl:col-span-4 space-y-8">
            <div className="xl:sticky xl:top-28 space-y-8">
              <div className="bg-white p-2 rounded-[2.5rem] shadow-2xl shadow-gray-200/50 border border-white overflow-hidden">
                <BookingSummary car={car} startDate={startDate} endDate={endDate} />
              </div>

              <CheckoutSupport />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
