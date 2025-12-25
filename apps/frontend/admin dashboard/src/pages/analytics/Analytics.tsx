import { Grid, Stack, Title } from '@mantine/core'
import LineChartCard from '../../components/charts/LineChartCard'
import BarChartCard from '../../components/charts/BarChartCard'
import PieChartCard from '../../components/charts/PieChartCard'
import KPICard from '../../components/shared/KPICard'
import {
    kpiData,
    organizationGrowthData,
    userActivityData,
    productTypesData,
    revenueData,
    applicationStatusData,
    organizationTypeData,
    monthlyApplicationsData
} from '../../dummy/charts'

const Analytics = () => {
    return (
        <Stack gap="lg">
            <Title order={1}>Analytics Dashboard</Title>

            {/* KPI Overview */}
            <Grid>
                {kpiData.map((kpi, index) => (
                    <Grid.Col key={index} span={{ base: 12, sm: 6, lg: 3 }}>
                        <KPICard data={kpi} />
                    </Grid.Col>
                ))}
            </Grid>

            {/* Organization Analytics */}
            <Grid>
                <Grid.Col span={{ base: 12, lg: 8 }}>
                    <LineChartCard
                        title="Organization Growth Over Time"
                        data={organizationGrowthData}
                        dataKey="value"
                        color="#2196f3"
                        height={350}
                    />
                </Grid.Col>
                <Grid.Col span={{ base: 12, lg: 4 }}>
                    <PieChartCard
                        title="Organization Types"
                        data={organizationTypeData}
                        height={350}
                    />
                </Grid.Col>
            </Grid>

            {/* User & Product Analytics */}
            <Grid>
                <Grid.Col span={{ base: 12, lg: 6 }}>
                    <BarChartCard
                        title="Monthly User Activity"
                        data={userActivityData}
                        dataKey="value"
                        color="#4caf50"
                        height={300}
                    />
                </Grid.Col>
                <Grid.Col span={{ base: 12, lg: 6 }}>
                    <PieChartCard
                        title="Product Types Distribution"
                        data={productTypesData}
                        height={300}
                    />
                </Grid.Col>
            </Grid>

            {/* Application & Revenue Analytics */}
            <Grid>
                <Grid.Col span={{ base: 12, lg: 4 }}>
                    <PieChartCard
                        title="Application Status"
                        data={applicationStatusData}
                        height={300}
                    />
                </Grid.Col>
                <Grid.Col span={{ base: 12, lg: 8 }}>
                    <LineChartCard
                        title="Revenue Trend"
                        data={revenueData}
                        dataKey="value"
                        color="#9c27b0"
                        height={300}
                    />
                </Grid.Col>
            </Grid>

            {/* Application Analytics */}
            <Grid>
                <Grid.Col span={{ base: 12 }}>
                    <BarChartCard
                        title="Monthly Applications Trend"
                        data={monthlyApplicationsData}
                        dataKey="value"
                        color="#ff9800"
                        height={350}
                    />
                </Grid.Col>
            </Grid>
        </Stack>
    )
}

export default Analytics