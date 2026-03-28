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
    <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
      <div className="flex justify-between items-center mb-8 pb-6 border-b border-slate-50">
        <div>
          <h2 className="text-xl font-black text-slate-900 tracking-tight uppercase">Payment & Settlement</h2>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Transaction Status & Method</p>
        </div>
        <div className="flex gap-2">
          {isAdmin && paymentStatus !== 'PAID' && booking.status !== 'CANCELLED' && (
            <Button
              variant="accent"
              onClick={handleMarkAsPaid}
              isLoading={loading}
              className="bg-emerald-600 hover:bg-emerald-700 text-[10px] font-black uppercase tracking-widest gap-2 h-auto py-2.5 px-4 rounded-xl border-none shadow-lg shadow-emerald-100"
            >
              <Banknote size={14} />
              Payment Received
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 bg-slate-50/50 rounded-2xl border border-slate-100/50">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-primary shadow-sm border border-slate-100">
              <CreditCard size={24} />
            </div>
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-0.5 block">Method</span>
              <p className="font-black text-slate-900 text-sm tracking-tight uppercase">
                {booking.paymentMethod === 'ONLINE' ? 'Stripe Secure' : booking.paymentMethod === 'CARD' ? 'Terminal Card' : 'Cash on Pickup'}
              </p>
            </div>
          </div>
        </div>

        <div className="p-6 bg-slate-50/50 rounded-2xl border border-slate-100/50">
          <div className="flex items-center gap-4">
            <div className={`w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-sm border border-slate-100 ${paymentStatus === 'PAID' ? 'text-emerald-600' : 'text-primary'}`}>
              <Sparkles size={24} />
            </div>
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-0.5 block">Payment Status</span>
              <p className={`font-black text-sm uppercase tracking-tight ${paymentStatus === 'PAID' ? 'text-emerald-600' : 'text-primary'}`}>{paymentStatus}</p>
            </div>
          </div>
        </div>

        <div className="p-6 bg-primary/[0.02] rounded-2xl border border-primary/10 relative overflow-hidden group">
          <div className="flex items-center gap-4 relative z-10">
            <div className={`w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-sm border border-slate-100 ${bondStatus === 'PAID' ? 'text-primary' : bondStatus === 'REFUNDED' ? 'text-emerald-600' : bondStatus === 'REFUND_PENDING' ? 'text-amber-500' : 'text-slate-400'}`}>
              <Receipt size={24} className={bondStatus === 'REFUND_PENDING' ? 'animate-pulse' : ''} />
            </div>
            <div className="flex-1">
              <span className="text-[10px] font-bold text-primary/60 uppercase tracking-widest mb-0.5 block">Security Bond</span>
              <div className="flex items-center justify-between gap-2">
                <p className="font-black text-slate-900 text-sm uppercase tracking-tight">{bondStatus}</p>
                {isAdmin && bondStatus === 'PAID' && (
                  <Button
                    variant="outline"
                    onClick={handleReleaseBond}
                    isLoading={loading}
                    className="px-3 py-1.5 bg-white text-primary text-[9px] font-black uppercase tracking-widest rounded-lg border-primary/20 hover:bg-primary hover:text-white transition-all shadow-sm h-auto min-h-0"
                  >
                    {!loading && <RefreshCw size={10} />}
                    {booking.paymentMethod === 'ONLINE' ? 'Refund' : 'Complete'}
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
