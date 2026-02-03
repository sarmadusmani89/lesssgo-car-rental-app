import { User, Mail, Shield } from 'lucide-react';

interface ProfileViewProps {
    user: any;
}

export default function ProfileView({ user }: ProfileViewProps) {
    if (!user) return null;

    return (
        <div className="animate-slide-up">
            <h2 className="font-outfit text-2xl mb-6">My Profile</h2>
            <div className="glass p-8 rounded-2xl max-w-2xl">
                <div className="flex items-center gap-6 mb-8">
                    <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
                        <User size={40} />
                    </div>
                    <div>
                        <h3 className="text-xl font-bold font-outfit">{user.firstName} {user.lastName}</h3>
                        <p className="text-gray-500">{user.email}</p>
                        <div className="mt-2 inline-flex items-center gap-2 px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                            <Shield size={12} />
                            {user.role === 'admin' ? 'Administrator' : 'Verified Member'}
                        </div>
                    </div>
                </div>

                <div className="grid gap-6">
                    <div className="p-4 border border-gray-100 rounded-xl">
                        <label className="block text-sm font-medium text-gray-500 mb-1">Full Name</label>
                        <div className="font-medium text-gray-900">{user.firstName} {user.lastName}</div>
                    </div>

                    <div className="p-4 border border-gray-100 rounded-xl">
                        <label className="block text-sm font-medium text-gray-500 mb-1">Email Address</label>
                        <div className="font-medium text-gray-900 flex items-center gap-2">
                            <Mail size={16} className="text-gray-400" />
                            {user.email}
                        </div>
                    </div>

                    <div className="p-4 border border-gray-100 rounded-xl">
                        <label className="block text-sm font-medium text-gray-500 mb-1">Member Since</label>
                        <div className="font-medium text-gray-900">
                            {new Date(user.createdAt).toLocaleDateString(undefined, {
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
