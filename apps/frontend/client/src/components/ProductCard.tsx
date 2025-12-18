interface ProductCardProps {
    product: Product;
    onCompareToggle?: (product: Product) => void;
    showCompareButton?: boolean;
    compact?: boolean;
}
/**
 * Product card component for displaying financial products in lists and grids
 * Includes comparison toggle, save functionality, and key product details
 */

import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Card,
    Group,
    Text,
    Button,
    Badge,
    Stack,
    Divider,
    Tooltip,
    rem,
} from '@mantine/core';
import {
    IconPlus,
    IconMinus,
    IconArrowRight,
    IconStar,
} from '@tabler/icons-react';

import { useState, useEffect } from 'react';
import {
    getComparisonProducts,
    addToComparison as addProductToComparison,
    removeFromComparison,
    isInComparison
} from '../utils/localStorage';
import type { Product } from '../types';

// Removed broken interface lines

const ProductCard: React.FC<ProductCardProps> = ({
    product,
    onCompareToggle,
    // onSave removed
    showCompareButton = true,
    compact = false,
}) => {
    const navigate = useNavigate();
    // Local state for real-time updates
    const [isProductInComparison, setIsProductInComparison] = useState(false);
    const [comparisonCount, setComparisonCount] = useState(0);

    // Initialize and listen for changes
    useEffect(() => {
        setIsProductInComparison(isInComparison(product.id));
        setComparisonCount(getComparisonProducts().length);

        const handleComparisonUpdate = () => {
            setIsProductInComparison(isInComparison(product.id));
            setComparisonCount(getComparisonProducts().length);
        };

        window.addEventListener('finverse-comparison-updated', handleComparisonUpdate);

        return () => {
            window.removeEventListener('finverse-comparison-updated', handleComparisonUpdate);
        };
    }, [product.id]);

    const canAddToComparison = comparisonCount < 4;

    const handleCompareToggle = (event: React.MouseEvent) => {
        event.stopPropagation();

        if (isProductInComparison) {
            removeFromComparison(product.id);
        } else if (canAddToComparison) {
            addProductToComparison(product);
        }

        onCompareToggle?.(product);
    };

    // Removed saved product toggle handler

    const handleCardClick = () => {
        navigate(`/product/${product.id}`);
    };

    const formatFeatures = (features: string[]) => {
        return features.slice(0, 3).map((feature, index) => (
            <Text key={index} size="xs" c="dimmed">
                • {feature}
            </Text>
        ));
    };

    return (
        <Card
            p={compact ? "md" : "lg"}
            radius="md"
            withBorder
            className="hover-lift"
            style={{ cursor: 'pointer', height: '100%' }}
            onClick={handleCardClick}
        >
            <Stack gap="sm" h="100%">
                {/* Header */}
                <Group justify="space-between" align="flex-start">
                    <Badge
                        variant="light"
                        color={product.type.includes('card') ? 'finBlue' : 'finGreen'}
                        size={compact ? "xs" : "sm"}
                    >
                        {product.type.replace('_', ' ').toUpperCase()}
                    </Badge>
                    {/* Removed saved product UI (heart icon) */}
                </Group>

                {/* Product Info */}
                <div style={{ flex: 1 }}>
                    <Text size={compact ? "md" : "lg"} fw={600} mb="xs">
                        {product.name}
                    </Text>
                    <Group gap="xs" mb="sm">
                        <Text size="sm" c="dimmed">
                            {product.provider}
                        </Text>
                        <Text size="xs" c="dimmed">•</Text>
                        <Group gap="xs">
                            <IconStar size={14} fill="currentColor" color="gold" />
                            <Text size="sm" fw={500}>
                                {product.rating}
                            </Text>
                        </Group>
                    </Group>

                    {!compact && (
                        <Text size="sm" c="dimmed" mb="md" style={{ minHeight: rem(40) }}>
                            {product.description.length > 120
                                ? `${product.description.substring(0, 120)}...`
                                : product.description}
                        </Text>
                    )}

                    {/* Key Features */}
                    {!compact && product.features.length > 0 && (
                        <Stack gap="xs" mb="md">
                            {formatFeatures(product.features)}
                        </Stack>
                    )}
                </div>

                {/* Product Details */}
                <Stack gap="xs">
                    {product.interestRate && (
                        <Group justify="space-between">
                            <Text size="sm" c="dimmed">
                                {product.type.includes('card') ? 'APR' : 'Interest Rate'}
                            </Text>
                            <Text size="sm" fw={500}>
                                {product.interestRate}%
                            </Text>
                        </Group>
                    )}

                    {product.annualFee !== undefined && (
                        <Group justify="space-between">
                            <Text size="sm" c="dimmed">Annual Fee</Text>
                            <Text size="sm" fw={500} c={product.annualFee === 0 ? "finGreen" : undefined}>
                                {product.annualFee === 0 ? 'Free' : `$${product.annualFee}`}
                            </Text>
                        </Group>
                    )}

                    {product.rewards && (
                        <Group justify="space-between">
                            <Text size="sm" c="dimmed">Rewards</Text>
                            <Text size="sm" fw={500} style={{ textAlign: 'right', maxWidth: '60%' }}>
                                {product.rewards.length > 30
                                    ? `${product.rewards.substring(0, 30)}...`
                                    : product.rewards}
                            </Text>
                        </Group>
                    )}

                    {product.minAmount && (
                        <Group justify="space-between">
                            <Text size="sm" c="dimmed">Min Amount</Text>
                            <Text size="sm" fw={500}>
                                ${product.minAmount.toLocaleString()}
                            </Text>
                        </Group>
                    )}
                </Stack>

                {/* Tags */}
                {!compact && product.tags.length > 0 && (
                    <>
                        <Divider />
                        <Group gap="xs">
                            {product.tags.slice(0, 3).map((tag) => (
                                <Badge key={tag} size="xs" variant="dot" color="gray">
                                    {tag}
                                </Badge>
                            ))}
                        </Group>
                    </>
                )}

                {/* Action Buttons */}
                <Group gap="sm" mt="auto">
                    {showCompareButton && (
                        <Tooltip
                            label={
                                isProductInComparison
                                    ? "Remove from comparison"
                                    : canAddToComparison
                                        ? "Add to comparison"
                                        : "Maximum 4 products allowed"
                            }
                        >
                            <Button
                                variant={isProductInComparison ? "filled" : "light"}
                                size="sm"
                                flex={1}
                                leftSection={
                                    isProductInComparison ? <IconMinus size={14} /> : <IconPlus size={14} />
                                }
                                onClick={handleCompareToggle}
                                disabled={!isProductInComparison && !canAddToComparison}
                                color={isProductInComparison ? "finGreen" : "finBlue"}
                            >
                                {isProductInComparison ? "Remove" : "Compare"}
                            </Button>
                        </Tooltip>
                    )}

                    <Button
                        variant="light"
                        size="sm"
                        flex={showCompareButton ? 1 : 2}
                        rightSection={<IconArrowRight size={14} />}
                        onClick={(event) => {
                            event.stopPropagation();
                            navigate(`/product/${product.id}`);
                        }}
                    >
                        Details
                    </Button>
                </Group>
            </Stack>
        </Card>
    );
};

export default ProductCard;