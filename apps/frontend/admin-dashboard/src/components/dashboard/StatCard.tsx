import React from 'react';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { Card, CardContent } from '../ui/common/Card';

interface StatCardProps {
    title: string;
    value: string;
    trend: string;
    trendUp: boolean;
    icon: any;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, trend, trendUp, icon: Icon }) => (
    <Card>
        <CardContent className="p-6">
            <div className="flex items-center justify-between">
                <div className="rounded-lg bg-indigo-50 p-3 text-indigo-600">
                    <Icon className="h-6 w-6" />
                </div>
                <span className={`flex items-center text-sm font-medium ${trendUp ? 'text-green-600' : 'text-red-600'}`}>
                    {trendUp ? <ArrowUpRight className="mr-1 h-4 w-4" /> : <ArrowDownRight className="mr-1 h-4 w-4" />}
                    {trend}
                </span>
            </div>
            <div className="mt-4">
                <p className="text-sm font-medium text-slate-500">{title}</p>
                <h3 className="text-2xl font-bold text-slate-900">{value}</h3>
            </div>
        </CardContent>
    </Card>
);

export default StatCard;
