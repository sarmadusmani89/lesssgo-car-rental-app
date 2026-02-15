'use client';

interface TestimonialAuthorInfoProps {
    name: string;
    role?: string;
    avatar?: string;
}

export default function TestimonialAuthorInfo({ name, role, avatar }: TestimonialAuthorInfoProps) {
    return (
        <div className="flex items-center gap-3">
            {avatar ? (
                <img src={avatar} alt={name} className="w-10 h-10 rounded-full object-cover" />
            ) : (
                <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold">
                    {name.charAt(0)}
                </div>
            )}
            <div>
                <div className="font-semibold text-gray-900">{name}</div>
                <div className="text-sm text-gray-500">{role}</div>
            </div>
        </div>
    );
}
