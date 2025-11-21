import { Card, Text, Group, ThemeIcon, Stack } from '@mantine/core'
import {
    IconTrendingUp,
    IconTrendingDown,
    IconBuilding,
    IconUsers,
    IconPackage,
    IconCurrencyDollar
} from '@tabler/icons-react'
import type { KPI } from '../../types'

interface KPICardProps {
    data: KPI
}

const iconMap = {
    'building': IconBuilding,
    'users': IconUsers,
    'package': IconPackage,
    'currency-dollar': IconCurrencyDollar
}

const KPICard = ({ data }: KPICardProps) => {
    const IconComponent = iconMap[data.icon as keyof typeof iconMap] || IconPackage
    const isPositive = data.changeType === 'increase'

    return (
        <Card shadow="sm" padding="lg" radius="md" withBorder>
            <Group justify="space-between" mb="md">
                <ThemeIcon
                    size="xl"
                    variant="light"
                    color={data.color}
                    radius="md"
                >
                    <IconComponent size={24} />
                </ThemeIcon>

                <Group gap="xs">
                    <ThemeIcon
                        size="sm"
                        variant="light"
                        color={isPositive ? 'green' : 'red'}
                        radius="xl"
                    >
                        {isPositive ? <IconTrendingUp size={12} /> : <IconTrendingDown size={12} />}
                    </ThemeIcon>
                    <Text size="sm" c={isPositive ? 'green' : 'red'} fw={600}>
                        {isPositive ? '+' : ''}{data.change}%
                    </Text>
                </Group>
            </Group>

            <Stack gap="xs">
                <Text size="lg" fw={700}>
                    {data.value}
                </Text>
                <Text size="sm" c="dimmed">
                    {data.title}
                </Text>
            </Stack>
        </Card>
    )
}

export default KPICard