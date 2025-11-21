import { Card, Group, Text, ThemeIcon } from '@mantine/core'
import {
    IconBuilding,
    IconUsers,
    IconPackage,
    IconCurrencyDollar,
    IconTrendingUp,
    IconTrendingDown
} from '@tabler/icons-react'
import type { KPI } from '../../types'

interface KPICardProps {
    data: KPI
}

const getIcon = (iconName: string) => {
    const icons = {
        building: IconBuilding,
        users: IconUsers,
        package: IconPackage,
        'currency-dollar': IconCurrencyDollar
    }

    const IconComponent = icons[iconName as keyof typeof icons] || IconPackage
    return <IconComponent size={24} />
}

const KPICard = ({ data }: KPICardProps) => {
    const { title, value, change, changeType, icon, color } = data

    return (
        <Card shadow="sm" padding="lg" radius="md" withBorder>
            <Group justify="space-between" align="flex-start">
                <div style={{ flex: 1 }}>
                    <Text size="sm" c="dimmed" mb="xs">
                        {title}
                    </Text>
                    <Text size="xl" fw={700} mb="xs">
                        {value}
                    </Text>
                    <Group gap="xs">
                        <ThemeIcon
                            size="sm"
                            variant="light"
                            color={changeType === 'increase' ? 'green' : 'red'}
                        >
                            {changeType === 'increase' ? (
                                <IconTrendingUp size={12} />
                            ) : (
                                <IconTrendingDown size={12} />
                            )}
                        </ThemeIcon>
                        <Text
                            size="xs"
                            c={changeType === 'increase' ? 'green' : 'red'}
                            fw={500}
                        >
                            {change > 0 ? '+' : ''}{change}%
                        </Text>
                    </Group>
                </div>

                <ThemeIcon
                    size="lg"
                    variant="light"
                    color={color}
                >
                    {getIcon(icon)}
                </ThemeIcon>
            </Group>
        </Card>
    )
}

export default KPICard