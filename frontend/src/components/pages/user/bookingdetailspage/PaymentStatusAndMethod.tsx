import { CreditCard, Sparkles, Receipt, RefreshCw, Banknote } from 'lucide-react';
import { useState } from 'react';
import api from '@/lib/api';
import { toast } from 'sonner';
import { Button } from '@/components/ui/Button';

export default function PaymentStatusAndMethod({ booking, isAdmin = false }: { booking: any; isAdmin?: boolean }) {
  const [loading, setLoading] = useState(false);
  const [bondStatus, setBondStatus] = useState(booking?.bondStatus || 'PENDING');
  const [paymentStatus, setPaymentStatus] = useState(booking?.paymentStatus || 'PENDING');

  if (!booking) return null;

  const handleReleaseBond = async () => {
    if (!confirm('Are you sure you want to release this bond?')) return;
    try {
      setLoading(true);
      await api.post(`/payment/release-bond/${booking.id}`);
      setBondStatus('REFUND_PENDING');
      toast.success('Bond refund initiated — awaiting confirmation');
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

  return (
    <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
      <div className="flex justify-between items-center mb-6 pb-4 border-b border-slate-50">
        <h2 className="text-lg font-black text-slate-900 tracking-tight uppercase">Settlement</h2>
        {isAdmin && paymentStatus !== 'PAID' && booking.status !== 'CANCELLED' && (
          <Button
            variant="accent"
            onClick={handleMarkAsPaid}
            isLoading={loading}
            className="bg-emerald-600 hover:bg-emerald-700 text-[10px] font-bold uppercase tracking-widest h-auto py-2 px-4 rounded-xl border-none"
          >
            Payment Received
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Method</label>
          <div className="flex items-center gap-2">
            <CreditCard size={14} className="text-slate-400" />
            <p className="text-xs font-bold text-slate-700 uppercase">
              {booking.paymentMethod === 'ONLINE' ? 'Stripe' : booking.paymentMethod === 'CARD' ? 'Card' : 'Cash'}
            </p>
          </div>
        </div>

        <div>
          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Status</label>
          <div className="flex items-center gap-2 text-primary font-bold text-xs uppercase">
            <Sparkles size={14} />
            {paymentStatus}
          </div>
        </div>

        <div className="relative">
          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Security Bond</label>
          <div className="flex items-center justify-between">
            <div className={`flex items-center gap-2 text-xs font-bold uppercase ${bondStatus === 'PAID' ? 'text-primary' : 'text-slate-400'}`}>
              <Receipt size={14} />
              {bondStatus}
            </div>
            {isAdmin && bondStatus === 'PAID' && (
              <Button
                variant="outline"
                onClick={handleReleaseBond}
                isLoading={loading}
                className="px-2 py-1 bg-white text-[9px] font-bold uppercase tracking-widest rounded-lg border-slate-200 h-auto min-h-0"
              >
                Refund
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
