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

import CustomSelect from '@/components/ui/CustomSelect';

export default function RevenueChart({ stats, range, onRangeChange }: { stats: any, range: string, onRangeChange: (val: string) => void }) {
    // Fallback if no stats provided, although stats should be loaded by parent
    const data = stats?.monthlyRevenue || [];

    const rangeOptions = [
        { label: 'Last 6 Months', value: '6m' },
        { label: 'This Year', value: '1y' },
    ];

    if (data.length === 0) {
        return (
            <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6 flex items-center justify-center h-[300px]">
                <p className="text-slate-400 font-medium">No revenue data available yet</p>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h2 className="text-lg font-bold text-slate-900 font-outfit">Revenue Overview</h2>
                    <p className="text-sm text-slate-500">Monthly earnings performance</p>
                </div>
                <CustomSelect
                    options={rangeOptions}
                    value={range}
                    onChange={onRangeChange}
                    className="w-[160px]"
                />
            </div>

            <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                        data={data}
                        margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
                    >
                        <defs>
                            <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                        <XAxis
                            dataKey="name"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: '#64748b', fontSize: 12, fontWeight: 500 }}
                            dy={10}
                        />
                        <YAxis
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: '#64748b', fontSize: 12 }}
                            tickFormatter={(value) => `K${value}`}
                        />
                        <Tooltip
                            contentStyle={{
                                backgroundColor: '#fff',
                                border: '1px solid #e2e8f0',
                                borderRadius: '12px',
                                boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                            }}
                            itemStyle={{ color: '#1e293b', fontWeight: 600 }}
                            formatter={(value: number | undefined) => [`K${value?.toFixed(2) ?? '0.00'}`, 'Revenue']}
                        />
                        <Area
                            type="monotone"
                            dataKey="total"
                            stroke="#3b82f6"
                            strokeWidth={3}
                            fillOpacity={1}
                            fill="url(#colorRevenue)"
                            activeDot={{ r: 6, strokeWidth: 0, fill: '#2563eb' }}
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
