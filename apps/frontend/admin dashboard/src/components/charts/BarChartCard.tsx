import { Card, Text } from '@mantine/core'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import type { ChartData } from '../../types'

interface BarChartCardProps {
    title: string
    data: ChartData[]
    dataKey: string
    xAxisKey?: string
    color?: string
    height?: number
}

const BarChartCard = ({
    title,
    data,
    dataKey,
    xAxisKey = 'name',
    color = '#4caf50',
    height = 300
}: BarChartCardProps) => {
    return (
        <Card shadow="sm" padding="lg" radius="md" withBorder>
            <Text size="lg" fw={600} mb="md">
                {title}
            </Text>

            <ResponsiveContainer width="100%" height={height}>
                <BarChart data={data}>
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
                    <Bar
                        dataKey={dataKey}
                        fill={color}
                        radius={[4, 4, 0, 0]}
                    />
                </BarChart>
            </ResponsiveContainer>
        </Card>
    )
}

export default BarChartCard