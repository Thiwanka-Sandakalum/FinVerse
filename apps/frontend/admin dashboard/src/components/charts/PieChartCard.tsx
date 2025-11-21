import { Card, Text } from '@mantine/core'
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts'
import type { ChartData } from '../../types'

interface PieChartCardProps {
    title: string
    data: ChartData[]
    dataKey?: string
    nameKey?: string
    height?: number
    colors?: string[]
}

const defaultColors = ['#2196f3', '#4caf50', '#ff9800', '#f44336', '#9c27b0', '#00bcd4', '#795548']

const PieChartCard = ({
    title,
    data,
    dataKey = 'value',
    nameKey = 'name',
    height = 300,
    colors = defaultColors
}: PieChartCardProps) => {
    const renderCustomizedLabel = (entry: any) => {
        const percent = ((entry.value / data.reduce((sum, item) => sum + item.value, 0)) * 100).toFixed(0)
        return `${percent}%`
    }

    return (
        <Card shadow="sm" padding="lg" radius="md" withBorder>
            <Text size="lg" fw={600} mb="md">
                {title}
            </Text>

            <ResponsiveContainer width="100%" height={height}>
                <PieChart>
                    <Pie
                        data={data}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={renderCustomizedLabel}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey={dataKey}
                        nameKey={nameKey}
                    >
                        {data.map((entry, index) => (
                            <Cell
                                key={`cell-${index}`}
                                fill={colors[index % colors.length]}
                            />
                        ))}
                    </Pie>
                    <Tooltip
                        contentStyle={{
                            backgroundColor: 'white',
                            border: '1px solid #e9ecef',
                            borderRadius: '8px',
                            fontSize: '12px'
                        }}
                    />
                    <Legend
                        wrapperStyle={{ fontSize: '12px' }}
                    />
                </PieChart>
            </ResponsiveContainer>
        </Card>
    )
}

export default PieChartCard