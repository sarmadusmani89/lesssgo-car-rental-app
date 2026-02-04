'use client';

export default function CheckoutSupport() {
    return (
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
    );
}
