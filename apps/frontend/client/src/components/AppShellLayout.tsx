import React from 'react';
import {
    AppShell,
    Burger,
    Group,
    Text,
    UnstyledButton,
    Drawer,
    Stack,
    Affix,
    ActionIcon,
    Transition,
    rem,
} from '@mantine/core';
import { useDisclosure, useViewportSize } from '@mantine/hooks';
import { IconMessageCircle } from '@tabler/icons-react';
import type { ReactNode } from 'react';

import ComparisonModal from './ComparisonModal';
import { useState } from 'react';
import { useComparison } from '../context/ComparisonContext';
import Navbar from './Navbar';
import ChatPanel from './ChatPanel';
import Footer from './Footer';

interface AppShellLayoutProps {
    children: ReactNode;
}

const AppShellLayout: React.FC<AppShellLayoutProps> = ({ children }) => {
    const [mobileNavOpened, { toggle: toggleMobileNav, close: closeMobileNav }] = useDisclosure();
    const [comparisonOpened, { open: openComparison, close: closeComparison }] = useDisclosure();
    const { width } = useViewportSize();
    const isMobile = width < 768;

    // Local state for chat
    const [chatOpen, setChatOpen] = useState(false);
    const [chatMaximized, setChatMaximized] = useState(false);
    const { comparisonProducts } = useComparison();

    const handleChatToggle = () => {
        setChatOpen(!chatOpen);
    };

    const handleChatMaximize = () => {
        setChatMaximized(!chatMaximized);
    };

    return (
        <>
            <AppShell
                header={{ height: { base: 60, md: 70 } }}
                navbar={{
                    width: { base: '100%', md: 250 },
                    breakpoint: 'md',
                    collapsed: { desktop: true, mobile: !mobileNavOpened }
                }}
                padding="md"
            >
                {/* Header */}
                <AppShell.Header>
                    <Group h="100%" px="md" justify="space-between" align="center">
                        {isMobile && (
                            <Burger
                                opened={mobileNavOpened}
                                onClick={toggleMobileNav}
                                size="sm"
                            />
                        )}
                        <Navbar />
                    </Group>
                </AppShell.Header>

                {/* Mobile Navigation Drawer */}
                <AppShell.Navbar p="md">
                    <Stack gap="sm">
                        <Text size="sm" fw={500} c="dimmed" tt="uppercase">
                            Navigation
                        </Text>
                        <UnstyledButton onClick={closeMobileNav}>
                            <Text size="sm">Home</Text>
                        </UnstyledButton>
                        <UnstyledButton onClick={closeMobileNav}>
                            <Text size="sm">Categories</Text>
                        </UnstyledButton>
                        <UnstyledButton onClick={closeMobileNav}>
                            <Text size="sm">Profile</Text>
                        </UnstyledButton>
                    </Stack>
                </AppShell.Navbar>

                {/* Main Content */}
                <AppShell.Main>
                    <div >
                        {children}
                    </div>
                    <Footer />
                </AppShell.Main>
            </AppShell>

            {/* Floating Action Buttons */}
            <Affix position={{ bottom: rem(20), right: rem(20) }}>
                <Stack gap="sm">
                    {/* Comparison Button */}
                    {comparisonProducts.length > 0 && (
                        <Transition transition="slide-up" mounted={!chatOpen}>
                            {(transitionStyles) => (
                                <ActionIcon
                                    size="xl"
                                    radius="xl"
                                    variant="filled"
                                    color="finGreen"
                                    style={{
                                        ...transitionStyles,
                                        boxShadow: '0 4px 20px rgba(32, 201, 151, 0.3)',
                                        position: 'relative'
                                    }}
                                    onClick={openComparison}
                                    aria-label="Open comparison"
                                >
                                    <Text size="xs" fw={700} c="white">
                                        {comparisonProducts.length}
                                    </Text>
                                    {comparisonProducts.length > 0 && (
                                        <div
                                            style={{
                                                position: 'absolute',
                                                top: -8,
                                                right: -8,
                                                background: 'red',
                                                borderRadius: '50%',
                                                width: 20,
                                                height: 20,
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                fontSize: '10px',
                                                color: 'white',
                                                fontWeight: 'bold'
                                            }}
                                        >
                                            {comparisonProducts.length}
                                        </div>
                                    )}
                                </ActionIcon>
                            )}
                        </Transition>
                    )}

                    {/* Chat Button */}
                    <Transition transition="slide-up" mounted={!chatOpen}>
                        {(transitionStyles) => (
                            <ActionIcon
                                size="xl"
                                radius="xl"
                                variant="gradient"
                                gradient={{ from: 'finBlue.6', to: 'finGreen.6', deg: 135 }}
                                style={{ ...transitionStyles, boxShadow: '0 4px 20px rgba(11, 116, 255, 0.3)' }}
                                onClick={handleChatToggle}
                                aria-label="Open chat"
                            >
                                <IconMessageCircle size={24} />
                            </ActionIcon>
                        )}
                    </Transition>
                </Stack>
            </Affix>

            {/* Chat Panel Drawer */}
            <Drawer
                opened={chatOpen}
                onClose={() => setChatOpen(false)}
                position="right"
                size={chatMaximized ? "100%" : "md"}
                overlayProps={{ backgroundOpacity: 0.5, blur: 4 }}
                styles={{
                    content: {
                        height: chatMaximized ? '100vh' : 'auto',
                    },
                    body: {
                        height: chatMaximized ? 'calc(100vh - 60px)' : 'auto',
                        padding: 0,
                    }
                }}
            >
                <ChatPanel
                    isMaximized={chatMaximized}
                    onToggleMaximize={handleChatMaximize}
                />
            </Drawer>

            {/* Comparison Modal */}
            <ComparisonModal
                opened={comparisonOpened}
                onClose={closeComparison}
            />
        </>
    );
};

export default AppShellLayout;