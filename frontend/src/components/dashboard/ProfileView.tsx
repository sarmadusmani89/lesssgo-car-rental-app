import { User, Mail, Shield, Phone } from 'lucide-react';
import { displayPhone } from '@/lib/utils';

interface ProfileViewProps {
    user: any;
}

export default function ProfileView({ user }: ProfileViewProps) {
    if (!user) return null;

    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div>
                <h2 className="text-3xl font-black text-slate-900 tracking-tight">My <span className="text-primary  ">Profile</span></h2>
                <p className="text-slate-500 mt-1 font-medium  ">Manage your personal information and account security.</p>
            </div>
            <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm w-full relative overflow-hidden group mt-8">
                <div className="absolute top-0 right-0 w-64 h-64 bg-primary/[0.02] rounded-full -mr-32 -mt-32 blur-3xl" />
                <div className="flex items-center gap-6 mb-10 relative z-10">
                    <div className="w-24 h-24 bg-primary/5 rounded-3xl flex items-center justify-center text-primary shadow-inner">
                        <User size={48} />
                    </div>
                    <div>
                        <h3 className="text-2xl font-black text-slate-900 tracking-tight">{user.name}</h3>
                        <p className="text-slate-500 font-medium  ">{user.email}</p>
                        <div className="mt-3 inline-flex items-center gap-2 px-4 py-1.5 bg-emerald-50 text-emerald-600 rounded-full text-[10px] font-bold uppercase tracking-widest shadow-sm">
                            <Shield size={12} className="fill-emerald-600/20" />
                            {user.role?.toLowerCase() === 'admin' ? 'Administrator' : 'Verified Member'}
                        </div>
                    </div>
                </div>

                <div className="grid gap-6">
                    <div className="p-5 border border-slate-50 bg-slate-50/30 rounded-2xl transition-all hover:bg-slate-50 hover:border-slate-100">
                        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-1.5">Full Name</label>
                        <div className="font-bold text-slate-900">{user.name}</div>
                    </div>

                    <div className="p-5 border border-slate-50 bg-slate-50/30 rounded-2xl transition-all hover:bg-slate-50 hover:border-slate-100">
                        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-1.5">Email Address</label>
                        <div className="font-bold text-slate-900 flex items-center gap-3">
                            <Mail size={18} className="text-primary/40" />
                            {user.email}
                        </div>
                    </div>

                    <div className="p-5 border border-slate-50 bg-slate-50/30 rounded-2xl transition-all hover:bg-slate-50 hover:border-slate-100">
                        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-1.5">Phone Number</label>
                        <div className="font-bold text-slate-900 flex items-center gap-3">
                            <Phone size={18} className="text-primary/40" />
                            {user.phoneNumber ? `+675 ${displayPhone(user.phoneNumber)}` : 'N/A'}
                        </div>
                    </div>

                    <div className="p-5 border border-slate-50 bg-slate-50/30 rounded-2xl transition-all hover:bg-slate-50 hover:border-slate-100">
                        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-1.5">Member Since</label>
                        <div className="font-bold text-slate-900">
                            {new Date(user.createdAt).toLocaleDateString('en-AU', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                            })}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
