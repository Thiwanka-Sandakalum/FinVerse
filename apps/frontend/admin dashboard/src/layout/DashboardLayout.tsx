import { Outlet } from 'react-router-dom'
import { AppShell } from '@mantine/core'
import { useUI } from '../context/UIContext'
import Navbar from './Navbar'
import Sidebar from './Sidebar'

const DashboardLayout = () => {
    const { sidebarCollapsed } = useUI()

    return (
        <AppShell
            navbar={{
                width: sidebarCollapsed ? 80 : 280,
                breakpoint: 'sm',
                collapsed: { mobile: sidebarCollapsed }
            }}
            header={{ height: 70 }}
            padding="md"
        >
            <AppShell.Header>
                <Navbar />
            </AppShell.Header>

            <AppShell.Navbar>
                <Sidebar />
            </AppShell.Navbar>

            <AppShell.Main>
                <Outlet />
            </AppShell.Main>
        </AppShell>
    )
}

export default DashboardLayout