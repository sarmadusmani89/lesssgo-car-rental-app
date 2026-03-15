import { CreditCard, Sparkles, Receipt, RefreshCw, Banknote } from 'lucide-react';
import { useState } from 'react';
import api from '@/lib/api';
import { toast } from 'sonner';
import { submitKinaPaymentForm } from '@/lib/kinaPayment';

export default function PaymentStatusAndMethod({ booking, isAdmin = false }: { booking: any; isAdmin?: boolean }) {
  const [loading, setLoading] = useState(false);
  const [bondStatus, setBondStatus] = useState(booking?.bondStatus || 'PENDING');
  const [paymentStatus, setPaymentStatus] = useState(booking?.paymentStatus || 'PENDING');

  if (!booking) return null;

  const handleReleaseBond = async () => {
    if (!confirm('Are you sure you want to release this bond?')) return;
    try {
      setLoading(true);
      const res = await api.post(`/payment/release-bond/${booking.id}`);
      
      if (res.data.status) {
        setBondStatus(res.data.status);
      }
      toast.success(res.data.message || 'Refund request processed');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to release bond');
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsPaid = async () => {
    if (!confirm('Mark this booking and bond as PAID?')) return;
    try {
      setLoading(true);
      // Use the specialized confirm-payment endpoint to trigger specialized backend logic
      await api.patch(`/booking/${booking.id}/confirm-payment`);
      setPaymentStatus('PAID');
      setBondStatus('PAID');
      toast.success('Payment and Bond marked as PAID');
    } catch (error: any) {
      toast.error('Failed to update status');
    } finally {
      setLoading(false);
    }
  };

  const handleCaptureBond = async () => {
    if (!confirm('Are you sure you want to CAPTURE (claim) this bond? This will take the money from the customer.')) return;
    try {
      setLoading(true);
      const res = await api.post(`/payment/capture-bond/${booking.id}`);
      
      if (res.data.status) {
        setBondStatus(res.data.status);
      }
      toast.success(res.data.message || 'Bond capture processed');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to capture bond');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 bg-white shadow-xl shadow-gray-100 rounded-[2rem] border border-gray-100">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-black font-outfit uppercase tracking-tight text-gray-900">Payment & Settlement</h2>
        <div className="flex gap-2">
          {isAdmin && paymentStatus !== 'PAID' && booking.status !== 'CANCELLED' && (
            <button
              onClick={handleMarkAsPaid}
              disabled={loading}
              className="px-4 py-2 bg-green-600 text-white text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-green-700 transition-all flex items-center gap-2"
            >
              <Banknote size={14} />
              Payment Received
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Payment Logic */}
        <div className="space-y-4 p-6 bg-gray-50 rounded-3xl border border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-blue-600 shadow-sm">
              <CreditCard size={20} />
            </div>
            <div>
              <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-0.5 block">Method</span>
              <p className="font-bold text-gray-900 text-sm">
                {booking.paymentMethod === 'ONLINE' ? 'Debit/Credit Card' : 'Cash on Collection'}
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-4 p-6 bg-gray-50 rounded-3xl border border-gray-100">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm ${paymentStatus === 'PAID' ? 'text-green-500' : 'text-yellow-500'}`}>
              <Sparkles size={20} />
            </div>
            <div>
              <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-0.5 block">Payment Status</span>
              <p className="font-bold text-gray-900 text-sm uppercase tracking-tight">{paymentStatus}</p>
            </div>
          </div>
        </div>

        <div className="space-y-4 p-6 bg-blue-50/50 rounded-3xl border border-blue-100 relative overflow-hidden">
          <div className="flex items-center gap-3 relative z-10">
            <div className={`w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm ${bondStatus === 'PAID' ? 'text-blue-600' : bondStatus === 'REFUNDED' ? 'text-green-500' : bondStatus === 'CLAIMED' ? 'text-red-500' : bondStatus === 'REFUND_PENDING' ? 'text-yellow-500' : 'text-gray-400'}`}>
              <Receipt size={20} />
            </div>
            <div className="flex-1">
              <span className="text-[10px] font-black text-blue-400 uppercase tracking-widest mb-0.5 block">Security Bond</span>
              <div className="flex flex-col gap-2">
                <p className="font-bold text-gray-900 text-sm uppercase tracking-tight">{bondStatus}</p>
                {isAdmin && bondStatus === 'PAID' && (
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={handleReleaseBond}
                      disabled={loading}
                      className="flex items-center gap-1.5 px-3 py-1 bg-white text-blue-600 text-[9px] font-black uppercase tracking-widest rounded-lg border border-blue-100 hover:bg-blue-600 hover:text-white transition-all shadow-sm"
                    >
                      <RefreshCw size={10} className={loading ? 'animate-spin' : ''} />
                      {booking.paymentMethod === 'ONLINE' ? 'Refund Hold' : 'Mark Refunded'}
                    </button>
                    <button
                      onClick={handleCaptureBond}
                      disabled={loading}
                      className="flex items-center gap-1.5 px-3 py-1 bg-white text-red-600 text-[9px] font-black uppercase tracking-widest rounded-lg border border-red-100 hover:bg-red-600 hover:text-white transition-all shadow-sm"
                    >
                      <Sparkles size={10} className={loading ? 'animate-spin' : ''} />
                      Capture Bond
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
