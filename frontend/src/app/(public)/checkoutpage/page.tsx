'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import BookingSummary from '@/components/pages/checkoutpage/bookingsummary';
import CustomerInformationForm from '@/components/pages/checkoutpage/customerinformationform';
import PaymentMethodSelection from '@/components/pages/checkoutpage/paymentmethodselection';
import TermsAndConditionsCheckbox from '@/components/pages/checkoutpage/termsandconditioncheckbox';
import ConfirmBookingButton from '@/components/pages/checkoutpage/confirmbookingbutton';
import api from '@/lib/api';
import { toast } from 'sonner';
import { Loader2, ArrowLeft, ShieldCheck } from 'lucide-react';
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
    email: '',
    phoneNumber: '',
  });
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

  const calculateDays = () => {
    if (!startDate || !endDate) return 0;
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const days = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return days >= 0 ? days + 1 : 0; // Sync with car detail page (inclusive)
  };

  const isFormValid = customerData.firstName && customerData.lastName && customerData.email && acceptedTerms && startDate && endDate;

  const handleConfirmBooking = async () => {
    if (!isFormValid) {
      toast.error("Please fill in all required fields and accept terms.");
      return;
    }

    try {
      setLoading(true);

      const days = calculateDays();
      const totalAmount = car.pricePerDay * days;

      // 1. Create the booking FIRST
      const bookingData = {
        carId,
        startDate: new Date(startDate).toISOString(),
        endDate: new Date(endDate).toISOString(),
        totalPrice: totalAmount,
        status: 'PENDING',
        customerName: `${customerData.firstName} ${customerData.lastName}`,
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
      <div className="bg-white border-b border-gray-100 mb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
          <Link href={`/car?id=${carId}`} className="inline-flex items-center text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 hover:text-blue-600 transition-colors mb-6">
            <ArrowLeft size={14} className="mr-2" />
            Back to vehicle
          </Link>
          <h1 className="text-4xl md:text-5xl font-black text-gray-900 font-outfit uppercase tracking-tighter leading-none">
            Complete your <span className="text-blue-600">Reservation</span>
          </h1>
          <p className="text-gray-400 mt-3 text-sm font-bold uppercase tracking-[0.3em]">
            Exquisite <span className="text-blue-600/50">Professional Registry</span>
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-12">
          <div className="xl:col-span-8 space-y-10">
            <div>
              <CustomerInformationForm onChange={(data: any) => setCustomerData({ ...customerData, ...data })} />
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
                <div className="bg-white p-10 rounded-[2.5rem] flex flex-col items-center gap-4 border border-blue-100 shadow-blue-50 shadow-2xl">
                  <Loader2 className="animate-spin text-blue-600" size={32} />
                  <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">Securing your reservation...</p>
                </div>
              ) : (
                <ConfirmBookingButton
                  disabled={!isFormValid}
                  onConfirm={handleConfirmBooking}
                />
              )}
            </div>
          </div>

          <div className="xl:col-span-4 space-y-8">
            <div className="xl:sticky xl:top-28 space-y-8">
              <div className="bg-white p-2 rounded-[2.5rem] shadow-2xl shadow-gray-200/50 border border-white overflow-hidden">
                <BookingSummary car={car} startDate={startDate} endDate={endDate} />
              </div>

              <div className="p-8 bg-blue-600 rounded-[2.5rem] text-white shadow-xl shadow-blue-200 overflow-hidden relative group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 transition-transform duration-700 group-hover:scale-150" />
                <div className="relative z-10">
                  <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/60 mb-2">Registry Support</p>
                  <h4 className="text-xl font-black font-outfit mb-4 uppercase leading-tight">Need assistance?</h4>
                  <p className="text-white/80 text-sm font-medium leading-relaxed mb-6 italic">
                    "Safe and secure payments powered by Stripe."
                  </p>
                  <p className="text-white font-black uppercase tracking-widest text-xs">Support 24/7 Available</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
