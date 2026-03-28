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
                <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">My <span className="text-primary  ">Profile</span></h2>
                <p className="text-slate-500 mt-1 font-medium  ">Manage your personal information and account security.</p>
            </div>
            <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm w-full relative overflow-hidden mt-8">
                <div className="flex items-center gap-6 mb-8 relative z-10">
                    <div className="w-16 h-16 bg-primary/5 rounded-2xl flex items-center justify-center text-primary">
                        <User size={32} />
                    </div>
                    <div>
                        <h3 className="text-xl font-bold text-slate-900 tracking-tight">{user.name}</h3>
                        <p className="text-slate-500 font-medium text-sm">{user.email}</p>
                        <div className="mt-2 inline-flex items-center gap-2 px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full text-[10px] font-bold uppercase tracking-widest border border-emerald-100/50">
                            {user.role?.toLowerCase() === 'admin' ? 'Administrator' : 'Verified Member'}
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 border border-slate-50 bg-slate-50/30 rounded-2xl relative">
                        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Full Name</label>
                        <div className="font-bold text-slate-900 text-sm">{user.name}</div>
                    </div>

                    <div className="p-4 border border-slate-50 bg-slate-50/30 rounded-2xl relative">
                        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Email Address</label>
                        <div className="font-bold text-slate-900 text-sm flex items-center gap-2">
                            <Mail size={14} className="text-slate-400" />
                            {user.email}
                        </div>
                    </div>

                    <div className="p-4 border border-slate-50 bg-slate-50/30 rounded-2xl relative">
                        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Phone Number</label>
                        <div className="font-bold text-slate-900 text-sm flex items-center gap-2">
                            <Phone size={14} className="text-slate-400" />
                            {user.phoneNumber ? `+675 ${displayPhone(user.phoneNumber)}` : 'N/A'}
                        </div>
                    </div>

                    <div className="p-4 border border-slate-50 bg-slate-50/30 rounded-2xl relative">
                        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Member Since</label>
                        <div className="font-bold text-slate-900 text-sm">
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
