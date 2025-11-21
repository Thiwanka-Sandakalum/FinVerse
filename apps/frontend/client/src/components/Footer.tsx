/**
 * Footer component with company information, links, and social media
 * Responsive layout with proper branding and navigation
 */

import React from 'react';
import { Link } from 'react-router-dom';
import {
    Container,
    Group,
    Text,
    Stack,
    Grid,
    Divider,
    ActionIcon,
    rem,
    Anchor,
} from '@mantine/core';
import {
    IconBrandTwitter,
    IconBrandLinkedin,
    IconBrandFacebook,
} from '@tabler/icons-react';

const Footer: React.FC = () => {
    return (
        <footer style={{ marginTop: rem(80), paddingTop: rem(40) }}>
            <Divider mb="xl" />
            <Container size="xl">
                <Grid>
                    <Grid.Col span={{ base: 12, md: 4 }}>
                        <Stack gap="sm">
                            <Group gap="sm">
                                <div
                                    style={{
                                        width: rem(32),
                                        height: rem(32),
                                        background: 'linear-gradient(135deg, #0B74FF 0%, #20C997 100%)',
                                        borderRadius: rem(8),
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        color: 'white',
                                        fontSize: rem(16),
                                        fontWeight: 'bold',
                                    }}
                                >
                                    F
                                </div>
                                <Text size="xl" fw={700} className="gradient-text">
                                    FinVerse
                                </Text>
                            </Group>
                            <Text size="sm" c="dimmed" style={{ maxWidth: rem(300) }}>
                                Compare financial products and make smarter decisions. Find the best loans,
                                credit cards, and investment opportunities tailored for you.
                            </Text>
                            <Group gap="xs" mt="md">
                                <ActionIcon variant="light" size="lg" radius="md">
                                    <IconBrandTwitter size={18} />
                                </ActionIcon>
                                <ActionIcon variant="light" size="lg" radius="md">
                                    <IconBrandLinkedin size={18} />
                                </ActionIcon>
                                <ActionIcon variant="light" size="lg" radius="md">
                                    <IconBrandFacebook size={18} />
                                </ActionIcon>
                            </Group>
                        </Stack>
                    </Grid.Col>

                    <Grid.Col span={{ base: 12, sm: 6, md: 2 }}>
                        <Stack gap="sm">
                            <Text size="sm" fw={600}>
                                Products
                            </Text>
                            <Anchor component={Link} to="/products?category=credit-cards" size="sm" c="dimmed">
                                Credit Cards
                            </Anchor>
                            <Anchor component={Link} to="/products?category=loans" size="sm" c="dimmed">
                                Loans
                            </Anchor>
                            <Anchor component={Link} to="/products?category=mortgages" size="sm" c="dimmed">
                                Mortgages
                            </Anchor>
                            <Anchor component={Link} to="/products?category=investments" size="sm" c="dimmed">
                                Investments
                            </Anchor>
                            <Anchor component={Link} to="/products?category=savings" size="sm" c="dimmed">
                                Savings
                            </Anchor>
                        </Stack>
                    </Grid.Col>

                    <Grid.Col span={{ base: 12, sm: 6, md: 2 }}>
                        <Stack gap="sm">
                            <Text size="sm" fw={600}>
                                Company
                            </Text>
                            <Anchor href="#" size="sm" c="dimmed">
                                About Us
                            </Anchor>
                            <Anchor href="#" size="sm" c="dimmed">
                                Careers
                            </Anchor>
                            <Anchor href="#" size="sm" c="dimmed">
                                Press
                            </Anchor>
                            <Anchor href="#" size="sm" c="dimmed">
                                Partners
                            </Anchor>
                            <Anchor href="#" size="sm" c="dimmed">
                                Contact
                            </Anchor>
                        </Stack>
                    </Grid.Col>

                    <Grid.Col span={{ base: 12, sm: 6, md: 2 }}>
                        <Stack gap="sm">
                            <Text size="sm" fw={600}>
                                Resources
                            </Text>
                            <Anchor href="#" size="sm" c="dimmed">
                                Financial Guides
                            </Anchor>
                            <Anchor href="#" size="sm" c="dimmed">
                                Calculators
                            </Anchor>
                            <Anchor href="#" size="sm" c="dimmed">
                                Credit Score
                            </Anchor>
                            <Anchor href="#" size="sm" c="dimmed">
                                Blog
                            </Anchor>
                            <Anchor href="#" size="sm" c="dimmed">
                                Help Center
                            </Anchor>
                        </Stack>
                    </Grid.Col>

                    <Grid.Col span={{ base: 12, sm: 6, md: 2 }}>
                        <Stack gap="sm">
                            <Text size="sm" fw={600}>
                                Legal
                            </Text>
                            <Anchor href="#" size="sm" c="dimmed">
                                Privacy Policy
                            </Anchor>
                            <Anchor href="#" size="sm" c="dimmed">
                                Terms of Service
                            </Anchor>
                            <Anchor href="#" size="sm" c="dimmed">
                                Disclosures
                            </Anchor>
                            <Anchor href="#" size="sm" c="dimmed">
                                Licenses
                            </Anchor>
                        </Stack>
                    </Grid.Col>
                </Grid>

                <Divider my="xl" />

                <Group justify="space-between" align="center">
                    <Text size="sm" c="dimmed">
                        © 2024 FinVerse. All rights reserved.
                    </Text>
                    <Group gap="md">
                        <Text size="xs" c="dimmed">
                            Secure & Encrypted
                        </Text>
                        <Text size="xs" c="dimmed">
                            FDIC Partner Banks
                        </Text>
                        <Text size="xs" c="dimmed">
                            Equal Housing Lender
                        </Text>
                    </Group>
                </Group>
            </Container>
        </footer>
    );
};

export default Footer;