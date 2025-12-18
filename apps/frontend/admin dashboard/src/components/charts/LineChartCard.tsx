import { Card, Text } from '@mantine/core'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import type { ChartData } from '../../types'

interface LineChartCardProps {
    title: string
    data: ChartData[]
    dataKey: string
    xAxisKey?: string
    color?: string
    height?: number
}

const LineChartCard = ({
    title,
    data,
    dataKey,
    xAxisKey = 'name',
    color = '#2196f3',
    height = 300
}: LineChartCardProps) => {
    return (
        <Card shadow="sm" padding="lg" radius="md" withBorder>
            <Text size="lg" fw={600} mb="md">
                {title}
            </Text>

            <ResponsiveContainer width="100%" height={height}>
                <LineChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                        dataKey={xAxisKey}
                        tick={{ fontSize: 12 }}
                        axisLine={{ stroke: '#e9ecef' }}
                    />
                    <YAxis
                        tick={{ fontSize: 12 }}
                        axisLine={{ stroke: '#e9ecef' }}
                    />
                    <Tooltip
                        contentStyle={{
                            backgroundColor: 'white',
                            border: '1px solid #e9ecef',
                            borderRadius: '8px',
                            fontSize: '12px'
                        }}
                    />
                    <Legend />
                    <Line
                        type="monotone"
                        dataKey={dataKey}
                        stroke={color}
                        strokeWidth={2}
                        dot={{ fill: color, strokeWidth: 2, r: 4 }}
                        activeDot={{ r: 6, stroke: color, strokeWidth: 2 }}
                    />
                </LineChart>
            </ResponsiveContainer>
        </Card>
    )
}

export default LineChartCard