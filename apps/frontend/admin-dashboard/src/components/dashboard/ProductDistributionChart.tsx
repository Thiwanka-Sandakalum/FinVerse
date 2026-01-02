import React from 'react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts';
import { CHART_DATA_PRODUCTS } from '@/constants';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/common/Card';

const COLORS = ['#6366f1', '#8b5cf6', '#ec4899', '#f43f5e'];

const ProductDistributionChart: React.FC = () => (
    <Card className="lg:col-span-3">
        <CardHeader>
            <CardTitle>Product Distribution</CardTitle>
        </CardHeader>
        <CardContent>
            <div className="h-[300px] flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={CHART_DATA_PRODUCTS}
                            innerRadius={60}
                            outerRadius={80}
                            paddingAngle={5}
                            dataKey="value"
                        >
                            {CHART_DATA_PRODUCTS.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Pie>
                        <Tooltip />
                    </PieChart>
                </ResponsiveContainer>
            </div>
            <div className="flex justify-center gap-4 text-sm">
                {CHART_DATA_PRODUCTS.map((entry, index) => (
                    <div key={entry.name} className="flex items-center gap-1">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }}></div>
                        <span className="text-slate-600">{entry.name}</span>
                    </div>
                ))}
            </div>
        </CardContent>
    </Card>
);

export default ProductDistributionChart;
