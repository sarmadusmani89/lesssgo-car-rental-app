'use client';

import React from 'react';
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer
} from 'recharts';

export default function RevenueChart({ stats, range, onRangeChange }: { stats: any, range: string, onRangeChange: (val: string) => void }) {
    const data = stats?.monthlyRevenue || [];

    const rangeTabs = [
        { label: '6 Months', value: '6m' },
        { label: 'This Year', value: '1y' },
    ];

    if (data.length === 0) return null;

    return (
        <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h2 className="text-lg font-bold text-slate-900 tracking-tight">Revenue Overview</h2>
                    <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider mt-0.5">Monthly performance</p>
                </div>
                
                <div className="flex bg-slate-50 p-1 rounded-lg border border-slate-100">
                    {rangeTabs.map((tab) => (
                        <button
                            key={tab.value}
                            onClick={() => onRangeChange(tab.value)}
                            className={`px-4 py-1.5 rounded-md text-[10px] font-bold uppercase tracking-widest transition-all ${
                                range === tab.value 
                                ? 'bg-white text-primary shadow-sm' 
                                : 'text-slate-500 hover:text-slate-700'
                            }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>
            </div>

            <div className="h-[250px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                        data={data}
                        margin={{ top: 10, right: 10, left: -25, bottom: 0 }}
                    >
                        <defs>
                            <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1} />
                                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                        <XAxis
                            dataKey="name"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 700 }}
                            dy={10}
                        />
                        <YAxis
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 700 }}
                            tickFormatter={(value) => `K${value}`}
                        />
                        <Tooltip
                            contentStyle={{
                                backgroundColor: '#fff',
                                border: '1px solid #f1f5f9',
                                borderRadius: '12px',
                                boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                                padding: '10px'
                            }}
                            itemStyle={{ color: '#1e293b', fontWeight: 700, fontSize: '12px' }}
                            formatter={(value: number | undefined) => [`K${value?.toLocaleString() ?? '0.00'}`, 'Revenue']}
                        />
                        <Area
                            type="monotone"
                            dataKey="total"
                            stroke="#3b82f6"
                            strokeWidth={2}
                            fillOpacity={1}
                            fill="url(#colorRevenue)"
                            activeDot={{ r: 5, fill: '#3b82f6' }}
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
