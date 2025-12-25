/**
 * Comparison modal component for side-by-side product comparison
 * Includes AI summary, detailed comparison table, and action buttons
 */

import React, { useEffect, useState } from 'react';
import {
    Modal,
    Table,
    Stack,
    Group,
    Text,
    Button,
    Badge,
    ActionIcon,
    ScrollArea,
    Card,
    Divider,
    Loader,
    CopyButton,
    Tooltip,
    rem,
} from '@mantine/core';
import {
    IconX,
    IconShare,
    IconDownload,
    IconCopy,
    IconCheck,
} from '@tabler/icons-react';
import { notifications } from '@mantine/notifications';

import { ProductsService } from '../types/products/services/ProductsService';
import { OrganizationsService } from '../types/user/services/OrganizationsService';
import { ProductComparisonService } from '../types/chatbot/services/ProductComparisonService';
import type { Product } from '../types/products/models/Product';
import { useComparison } from '../context/ComparisonContext';


// Utility function to safely extract product details
const getProductDetail = (product: Product, key: string, fallback: any = null) => {
    return (product.details as any)?.[key] ?? fallback;
};

interface ComparisonModalProps {
    opened: boolean;
    onClose: () => void;
}

const ComparisonModal: React.FC<ComparisonModalProps> = ({ opened, onClose }) => {
    const [loadingSummary, setLoadingSummary] = useState(false);
    const [aiSummary, setAiSummary] = useState<string>('');

    // Comparison context
    const { comparisonProducts: selectedProducts, removeFromComparison, clearComparison } = useComparison();
    const [fullProducts, setFullProducts] = useState<Product[]>([]);

    // Clear AI summary when clearing comparison
    const handleClearComparison = () => {
        clearComparison();
        setAiSummary('');
    };

    // Store organization names for each product by institutionId
    const [orgNames, setOrgNames] = useState<Record<string, string>>({});

    // Check if all products are in the same category
    const showCategoryWarning = React.useMemo(() => {
        if (fullProducts.length < 2) return false;
        const firstCat = fullProducts[0]?.categoryId;
        return fullProducts.some((p: Product) => p.categoryId !== firstCat);
    }, [fullProducts]);

    // Fetch full product data for each selected product id and their organizations
    useEffect(() => {
        let isMounted = true;
        const fetchProductsAndOrgs = async () => {
            if (!selectedProducts.length) {
                setFullProducts([]);
                setOrgNames({});
                return;
            }
            try {
                const prods: Product[] = [];
                const orgNameMap: Record<string, string> = {};
                for (const p of selectedProducts) {
                    let prod: Product | null = null;
                    if ('details' in p && p.details) {
                        prod = p as Product;
                    } else if (p.id) {
                        try {
                            prod = await ProductsService.getProducts1(p.id);
                        } catch (e) {
                            prod = null;
                        }
                    }
                    if (prod) {
                        prods.push(prod);
                        // Fetch org name if institutionId exists and not already fetched
                        if (prod.institutionId && !orgNameMap[prod.institutionId]) {
                            try {
                                const org = await OrganizationsService.getOrgs1(prod.institutionId);
                                orgNameMap[prod.institutionId] = org.name || 'Unknown';
                            } catch {
                                orgNameMap[prod.institutionId] = 'Unknown';
                            }
                        }
                    }
                }
                if (isMounted) {
                    setFullProducts(prods);
                    setOrgNames(orgNameMap);
                }
            } catch (e) {
                if (isMounted) {
                    setFullProducts([]);
                    setOrgNames({});
                }
            }
        };
        fetchProductsAndOrgs();
        return () => { isMounted = false; };
    }, [selectedProducts]);

    // Generate AI summary when modal opens and products are selected
    useEffect(() => {
        if (opened && selectedProducts.length >= 2 && !aiSummary && !loadingSummary) {
            generateSummary();
        }
    }, [opened, selectedProducts.length, aiSummary, loadingSummary]);

    const generateSummary = async () => {
        setLoadingSummary(true);
        try {
            // Extract product IDs for the ProductComparisonService
            const productIds = selectedProducts
                .map(p => p.id)
                .filter(id => id != null) as string[];

            if (productIds.length < 2) {
                notifications.show({
                    title: 'Comparison Error',
                    message: 'At least 2 products are required for comparison.',
                    color: 'red',
                });
                return;
            }

            // Call the ProductComparisonService
            const response = await ProductComparisonService.postCompareProducts({
                product_ids: productIds,
                conversation_id: null // Optional conversation context
            });

            if (response && response.summary) {
                setAiSummary(response.summary);
            } else {
                notifications.show({
                    title: 'Summary Error',
                    message: 'Could not generate AI summary. Please try again.',
                    color: 'red',
                });
            }
        } catch (error) {
            console.error('ProductComparisonService error:', error);
            notifications.show({
                title: 'Summary Error',
                message: 'Failed to generate AI summary. Please check your connection.',
                color: 'red',
            });
        } finally {
            setLoadingSummary(false);
        }
    };

    const handleRemoveProduct = (productId: string) => {
        removeFromComparison(productId);
        if (selectedProducts.length <= 1) {
            onClose();
        }
    };

    const handleShareComparison = () => {
        const comparisonData = {
            products: selectedProducts.map((p: any) => ({
                id: p.id,
                name: p.name,
                provider: p.provider,
                type: p.type
            })),
            timestamp: new Date().toISOString(),
            summary: aiSummary
        };

        navigator.clipboard.writeText(JSON.stringify(comparisonData, null, 2));
        notifications.show({
            title: 'Comparison Copied',
            message: 'Comparison data has been copied to your clipboard.',
            color: 'green',
        });
    };

    // Utility to format field names
    const formatFieldName = (key: string): string => {
        return key
            .replace(/([a-z])([A-Z])/g, '$1 $2')
            .replace(/_/g, ' ')
            .replace(/^./, l => l.toUpperCase());
    };

    // Utility to format values
    const formatFieldValue = (value: any): string => {
        if (value === null || value === undefined) return 'N/A';
        if (typeof value === 'boolean') return value ? 'Yes' : 'No';
        if (typeof value === 'number') {
            if (value <= 100 && (value % 1 !== 0 || value < 10)) return `${value}%`;
            if (value >= 1000) return `LKR ${value.toLocaleString()}`;
            return value.toString();
        }
        if (Array.isArray(value)) return value.join(', ');
        if (typeof value === 'object') return JSON.stringify(value);
        return value.toString();
    };

    const getComparisonRows = () => {
        if (fullProducts.length === 0) return [];

        const rows: Array<{
            label: string;
            values: Array<{ value: string; highlight?: boolean; color?: string }>;
        }> = [];

        // Provider (from orgNames)
        rows.push({
            label: 'Provider',
            values: fullProducts.map(p => ({ value: (p.institutionId && orgNames[p.institutionId]) || 'N/A' }))
        });

        // Type (from details)
        rows.push({
            label: 'Type',
            values: fullProducts.map(p => ({
                value: (getProductDetail(p, 'type') || getProductDetail(p, 'productType') || 'N/A').toString().replace('_', ' ').toUpperCase()
            }))
        });

        // Collect all unique detail keys
        const allDetailKeys = Array.from(new Set(fullProducts.flatMap(p => Object.keys(p.details || {}))));

        // Render each detail key as a row
        allDetailKeys.forEach(key => {
            rows.push({
                label: formatFieldName(key),
                values: fullProducts.map(p => ({ value: formatFieldValue(getProductDetail(p, key)) }))
            });
        });

        return rows;
    };

    if (selectedProducts.length === 0) {
        return (
            <Modal opened={opened} onClose={onClose} title="Product Comparison" size="md">
                <Stack gap="lg" ta="center" py="xl">
                    <Text size="lg">No products selected for comparison</Text>
                    <Text c="dimmed">Add products to comparison from the product listings</Text>
                    <Button onClick={onClose}>Close</Button>
                </Stack>
            </Modal>
        );
    }
    if (fullProducts.length === 0) {
        return (
            <Modal opened={opened} onClose={onClose} title="Product Comparison" size="md">
                <Stack gap="lg" ta="center" py="xl">
                    <Loader />
                    <Text size="lg">Loading product details...</Text>
                </Stack>
            </Modal>
        );
    }

    return (
        <Modal
            opened={opened}
            onClose={onClose}
            title={
                <Group justify="space-between" w="100%">
                    <Text fw={600}>Compare {selectedProducts.length} Products</Text>
                    <Group gap="xs">
                        <Tooltip label="Share comparison">
                            <ActionIcon variant="light" onClick={handleShareComparison}>
                                <IconShare size={16} />
                            </ActionIcon>
                        </Tooltip>
                        <ActionIcon variant="light" onClick={handleClearComparison} color="red">
                            <IconX size={16} />
                        </ActionIcon>
                    </Group>
                </Group>
            }
            size="90vw"
            styles={{
                body: { padding: 0 },
                header: { paddingBottom: rem(16) }
            }}
        >
            <Stack gap={0}>
                {/* Category mismatch warning */}
                {showCategoryWarning && (
                    <Card p="md" radius={0} withBorder bg="yellow.1" mb="xs">
                        <Text c="yellow.9" fw={600}
                            style={{ textAlign: 'center' }}>
                            Warning: You are comparing products from different categories!
                        </Text>
                    </Card>
                )}
                {/* AI Summary Section */}
                {(aiSummary || loadingSummary) && (
                    <Card p="lg" radius={0} withBorder>
                        <Stack gap="md">
                            <Group justify="space-between">
                                <Text fw={600} size="lg">AI Comparison Summary</Text>
                                <Group gap="xs">
                                    {aiSummary && (
                                        <CopyButton value={aiSummary}>
                                            {({ copied, copy }) => (
                                                <Tooltip label={copied ? 'Copied!' : 'Copy summary'}>
                                                    <ActionIcon variant="light" onClick={copy}>
                                                        {copied ? <IconCheck size={16} /> : <IconCopy size={16} />}
                                                    </ActionIcon>
                                                </Tooltip>
                                            )}
                                        </CopyButton>
                                    )}
                                    <Button
                                        size="xs"
                                        variant="light"
                                        onClick={generateSummary}
                                        loading={loadingSummary}
                                    >
                                        Regenerate
                                    </Button>
                                </Group>
                            </Group>

                            {loadingSummary ? (
                                <Group gap="sm">
                                    <Loader size="sm" />
                                    <Text c="dimmed">Generating AI summary...</Text>
                                </Group>
                            ) : aiSummary ? (
                                <div
                                    style={{
                                        fontSize: rem(14),
                                        lineHeight: 1.6,
                                        whiteSpace: 'pre-wrap'
                                    }}
                                    dangerouslySetInnerHTML={{
                                        __html: aiSummary
                                            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                                            .replace(/\n/g, '<br />')
                                    }}
                                />
                            ) : null}
                        </Stack>
                    </Card>
                )}

                <Divider />

                {/* Comparison Table */}
                <ScrollArea h="60vh">
                    <Table highlightOnHover>
                        <Table.Thead>
                            <Table.Tr>
                                <Table.Th style={{ minWidth: rem(150) }}>Feature</Table.Th>
                                {fullProducts.map((product) => (
                                    <Table.Th key={product.id} style={{ minWidth: rem(200) }}>
                                        <Stack gap="xs">
                                            <Group justify="space-between">
                                                <Text fw={600} size="sm">
                                                    {product.name}
                                                </Text>
                                                <ActionIcon
                                                    size="sm"
                                                    color="red"
                                                    variant="subtle"
                                                    onClick={() => handleRemoveProduct(product.id!)}
                                                >
                                                    <IconX size={14} />
                                                </ActionIcon>
                                            </Group>
                                            <Badge
                                                size="xs"
                                                color={
                                                    (getProductDetail(product, 'type') || getProductDetail(product, 'productType') || '').toString().toLowerCase().includes('card')
                                                        ? 'finBlue'
                                                        : 'finGreen'
                                                }
                                            >
                                                {getProductDetail(product, 'provider') || getProductDetail(product, 'issuer') || 'N/A'}
                                            </Badge>
                                        </Stack>
                                    </Table.Th>
                                ))}
                            </Table.Tr>
                        </Table.Thead>
                        <Table.Tbody>
                            {getComparisonRows().map((row, index) => (
                                <Table.Tr key={index}>
                                    <Table.Td fw={500}>{row.label}</Table.Td>
                                    {row.values.map((cell, cellIndex) => (
                                        <Table.Td
                                            key={cellIndex}
                                            fw={cell.highlight ? 600 : 400}
                                            c={cell.color}
                                        >
                                            {cell.value}
                                        </Table.Td>
                                    ))}
                                </Table.Tr>
                            ))}
                        </Table.Tbody>
                    </Table>
                </ScrollArea>

                <Divider />

                {/* Action Buttons */}
                <Card p="lg" radius={0}>
                    <Group justify="space-between">
                        <Group gap="sm">
                            <Button
                                variant="light"
                                leftSection={<IconShare size={16} />}
                                onClick={handleShareComparison}
                            >
                                Share Comparison
                            </Button>
                            <Button
                                variant="light"
                                leftSection={<IconDownload size={16} />}
                                onClick={() => {
                                    // TODO: Implement PDF export
                                    notifications.show({
                                        title: 'Export',
                                        message: 'PDF export feature coming soon!',
                                        color: 'blue',
                                    });
                                }}
                            >
                                Export PDF
                            </Button>
                        </Group>

                        <Group gap="sm">
                            <Button
                                variant="light"
                                onClick={handleClearComparison}
                                color="red"
                            >
                                Clear All
                            </Button>
                            <Button onClick={onClose}>
                                Close
                            </Button>
                        </Group>
                    </Group>
                </Card>
            </Stack>
        </Modal>
    );
};

export default ComparisonModal;