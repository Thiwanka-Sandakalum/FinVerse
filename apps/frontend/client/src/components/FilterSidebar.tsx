/**
 * Filter sidebar component for product filtering and sorting
 * Includes filters for product type, provider, rates, fees, and features
 */

import React from 'react';
import {
    Stack,
    Text,
    Checkbox,
    RangeSlider,
    NumberInput,
    Group,
    Button,
    Divider,
    Select,
    MultiSelect,
    Rating,
    Paper,
} from '@mantine/core';
import { IconRefresh } from '@tabler/icons-react';

// FilterSidebar component - currently unused but available for implementation

const productTypes = [
    { value: 'credit_card', label: 'Credit Cards' },
    { value: 'debit_card', label: 'Debit Cards' },
    { value: 'personal_loan', label: 'Personal Loans' },
    { value: 'auto_loan', label: 'Auto Loans' },
    { value: 'home_loan', label: 'Home Loans' },
    { value: 'investment', label: 'Investments' },
    { value: 'savings', label: 'Savings' },
];

const providers = [
    'Chase', 'Citi', 'Bank of America', 'Wells Fargo', 'Capital One',
    'Discover', 'American Express', 'SoFi', 'Marcus', 'Ally Bank'
];

const commonFeatures = [
    'No Annual Fee',
    'No Foreign Transaction Fees',
    'Travel Insurance',
    'Cash Back',
    'Travel Rewards',
    'Balance Transfer',
    'Fraud Protection',
    'Mobile Banking',
    'ATM Access',
    'Online Banking'
];

interface FilterSidebarProps {
    filters?: any;
    onFiltersChange?: (filters: any) => void;
}

const FilterSidebar: React.FC<FilterSidebarProps> = ({
    filters: propsFilters,
    onFiltersChange
}) => {
    // Default filters if not provided via props
    const [localFilters, setLocalFilters] = React.useState({
        productTypes: [],
        providers: [],
        interestRateRange: [0, 30] as [number, number],
        annualFeeRange: [0, 1000] as [number, number],
        minRating: 0,
        features: [],
        sortBy: 'rating',
        sortOrder: 'desc' as 'asc' | 'desc'
    });

    const filters = propsFilters || localFilters;

    const updateFilters = (newFilters: any) => {
        if (onFiltersChange) {
            onFiltersChange({ ...filters, ...newFilters });
        } else {
            setLocalFilters({ ...localFilters, ...newFilters });
        }
    };

    const handleProductTypeChange = (types: string[]) => {
        updateFilters({ productTypes: types });
    };

    const handleProviderChange = (providers: string[]) => {
        updateFilters({ providers });
    };

    const handleInterestRateChange = (range: [number, number]) => {
        updateFilters({ interestRateRange: range });
    };

    const handleAnnualFeeChange = (range: [number, number]) => {
        updateFilters({ annualFeeRange: range });
    };

    const handleRatingChange = (rating: number) => {
        updateFilters({ minRating: rating });
    };

    const handleFeaturesChange = (features: string[]) => {
        updateFilters({ features });
    };

    const handleSortChange = (value: string | null) => {
        if (!value) return;

        const [sortBy, sortOrder] = value.split('-');
        updateFilters({
            sortBy: sortBy as any,
            sortOrder: sortOrder as 'asc' | 'desc'
        });
    };

    const handleResetFilters = () => {
        const resetFilters = {
            productTypes: [],
            providers: [],
            interestRateRange: [0, 30] as [number, number],
            annualFeeRange: [0, 1000] as [number, number],
            minRating: 0,
            features: [],
            sortBy: 'rating',
            sortOrder: 'desc' as 'asc' | 'desc'
        };

        if (onFiltersChange) {
            onFiltersChange(resetFilters);
        } else {
            setLocalFilters(resetFilters);
        }
    };

    const getCurrentSortValue = () => {
        return `${filters.sortBy}-${filters.sortOrder}`;
    };

    return (
        <Paper p="md" withBorder>
            <Stack gap="lg">
                <Group justify="space-between">
                    <Text fw={600} size="lg">
                        Filters
                    </Text>
                    <Button
                        variant="subtle"
                        size="xs"
                        leftSection={<IconRefresh size={14} />}
                        onClick={handleResetFilters}
                    >
                        Reset
                    </Button>
                </Group>

                <Divider />

                {/* Sort By */}
                <Stack gap="sm">
                    <Text fw={500} size="sm">
                        Sort By
                    </Text>
                    <Select
                        placeholder="Choose sorting"
                        data={[
                            { value: 'rating-desc', label: 'Highest Rated' },
                            { value: 'rating-asc', label: 'Lowest Rated' },
                            { value: 'interestRate-asc', label: 'Lowest APR' },
                            { value: 'interestRate-desc', label: 'Highest APR' },
                            { value: 'annualFee-asc', label: 'Lowest Fee' },
                            { value: 'annualFee-desc', label: 'Highest Fee' },
                            { value: 'name-asc', label: 'A to Z' },
                            { value: 'name-desc', label: 'Z to A' },
                        ]}
                        value={getCurrentSortValue()}
                        onChange={handleSortChange}
                    />
                </Stack>

                <Divider />

                {/* Product Types */}
                <Stack gap="sm">
                    <Text fw={500} size="sm">
                        Product Type
                    </Text>
                    <Stack gap="xs">
                        {productTypes.map((type) => (
                            <Checkbox
                                key={type.value}
                                label={type.label}
                                checked={filters.productTypes.includes(type.value)}
                                onChange={(event) => {
                                    const checked = event.currentTarget.checked;
                                    const newTypes: string[] = checked
                                        ? [...filters.productTypes, type.value]
                                        : filters.productTypes.filter((t: string) => t !== type.value);
                                    handleProductTypeChange(newTypes);
                                }}
                            />
                        ))}
                    </Stack>
                </Stack>

                <Divider />

                {/* Providers */}
                <Stack gap="sm">
                    <Text fw={500} size="sm">
                        Providers
                    </Text>
                    <MultiSelect
                        placeholder="Select providers"
                        data={providers}
                        value={filters.providers}
                        onChange={handleProviderChange}
                        maxValues={5}
                        searchable
                    />
                </Stack>

                <Divider />

                {/* Interest Rate Range */}
                <Stack gap="sm">
                    <Text fw={500} size="sm">
                        Interest Rate (APR %)
                    </Text>
                    <RangeSlider
                        value={filters.interestRateRange}
                        onChange={handleInterestRateChange}
                        min={0}
                        max={30}
                        step={0.5}
                        marks={[
                            { value: 0, label: '0%' },
                            { value: 15, label: '15%' },
                            { value: 30, label: '30%' },
                        ]}
                    />
                    <Group justify="space-between">
                        <NumberInput
                            placeholder="Min"
                            value={filters.interestRateRange[0]}
                            onChange={(value) =>
                                handleInterestRateChange([Number(value) || 0, filters.interestRateRange[1]])
                            }
                            min={0}
                            max={30}
                            step={0.5}
                            size="xs"
                            w={70}
                        />
                        <NumberInput
                            placeholder="Max"
                            value={filters.interestRateRange[1]}
                            onChange={(value) =>
                                handleInterestRateChange([filters.interestRateRange[0], Number(value) || 30])
                            }
                            min={0}
                            max={30}
                            step={0.5}
                            size="xs"
                            w={70}
                        />
                    </Group>
                </Stack>

                <Divider />

                {/* Annual Fee Range */}
                <Stack gap="sm">
                    <Text fw={500} size="sm">
                        Annual Fee ($)
                    </Text>
                    <RangeSlider
                        value={filters.annualFeeRange}
                        onChange={handleAnnualFeeChange}
                        min={0}
                        max={1000}
                        step={25}
                        marks={[
                            { value: 0, label: '$0' },
                            { value: 500, label: '$500' },
                            { value: 1000, label: '$1000' },
                        ]}
                    />
                    <Group justify="space-between">
                        <NumberInput
                            placeholder="Min"
                            value={filters.annualFeeRange[0]}
                            onChange={(value) =>
                                handleAnnualFeeChange([Number(value) || 0, filters.annualFeeRange[1]])
                            }
                            min={0}
                            max={1000}
                            step={25}
                            size="xs"
                            w={70}
                        />
                        <NumberInput
                            placeholder="Max"
                            value={filters.annualFeeRange[1]}
                            onChange={(value) =>
                                handleAnnualFeeChange([filters.annualFeeRange[0], Number(value) || 1000])
                            }
                            min={0}
                            max={1000}
                            step={25}
                            size="xs"
                            w={70}
                        />
                    </Group>
                </Stack>

                <Divider />

                {/* Minimum Rating */}
                <Stack gap="sm">
                    <Text fw={500} size="sm">
                        Minimum Rating
                    </Text>
                    <Group gap="sm">
                        <Rating
                            value={filters.minRating}
                            onChange={handleRatingChange}
                            fractions={1}
                        />
                        <Text size="sm" c="dimmed">
                            {filters.minRating > 0 ? `${filters.minRating}+ stars` : 'Any rating'}
                        </Text>
                    </Group>
                </Stack>

                <Divider />

                {/* Features */}
                <Stack gap="sm">
                    <Text fw={500} size="sm">
                        Features
                    </Text>
                    <MultiSelect
                        placeholder="Select features"
                        data={commonFeatures}
                        value={filters.features}
                        onChange={handleFeaturesChange}
                        maxValues={5}
                        searchable
                    />
                </Stack>
            </Stack>
        </Paper>
    );
};

export default FilterSidebar;