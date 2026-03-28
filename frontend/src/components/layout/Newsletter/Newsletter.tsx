"use client";

import { useState } from 'react';
import { toast } from 'sonner';
import { newsletterApi } from '@/lib/api';

export default function Newsletter() {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubscribe = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email) return;

        setLoading(true);
        try {
            await newsletterApi.subscribe(email);
            toast.success('Joined the club!', {
                description: 'You are now on the list for exclusive updates.'
            });
            setEmail('');
        } catch (error: any) {
            const message = error.response?.data?.message || 'Failed to join. Please try again.';
            toast.error(message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <section className="bg-primary py-20 relative overflow-hidden border-b border-white/5">
            <div className="container">
                <div className="relative z-10 bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-md border border-white/5 rounded-[24px] p-12 lg:p-16 flex flex-col lg:flex-row items-center justify-between gap-16">
                    <div className="flex-1">
                        <h2 className="text-3xl lg:text-4xl font-extrabold text-white mb-3 tracking-tight">Join the Exclusive Club</h2>
                        <p className="text-slate-400 text-lg lg:text-xl leading-relaxed">Get priority access to new arrivals, special offers, and invite-only events.</p>
                    </div>
                    <form className="flex-1 w-full max-w-[500px]" onSubmit={handleSubscribe}>
                        <div className="flex flex-col md:flex-row gap-4 bg-white/5 p-2 rounded-[16px] border border-white/5">
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Enter your email address"
                                className="flex-1 bg-transparent border-none text-white px-6 py-3 text-lg outline-none placeholder:text-slate-500"
                                required
                            />
                            <button 
                                type="submit" 
                                disabled={loading} 
                                className="bg-accent hover:opacity-90 hover:shadow-[0_0_20px_rgba(var(--accent),0.3)] text-white px-8 py-3 rounded-[12px] font-bold whitespace-nowrap transition-all disabled:opacity-50"
                            >
                                {loading ? 'Joining...' : 'Subscribe'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </section>
    );
}

