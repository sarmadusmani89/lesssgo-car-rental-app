"use client";

interface StatCardProps {
    value: string;
    label: string;
}

export default function StatCard({ value, label }: StatCardProps) {
    return (
        <div className="text-center">
            <div className="text-4xl md:text-5xl font-black mb-2 text-accent tracking-tighter">{value}</div>
            <div className="text-sm md:text-base opacity-90 font-bold uppercase tracking-widest">{label}</div>
        </div>
    );
}
