import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Autocomplete,
    ActionIcon,
    rem,
} from '@mantine/core';
import { IconSearch } from '@tabler/icons-react';
import { useDebouncedValue } from '@mantine/hooks';

import { ProductsService } from '../types/products';

const SearchBar: React.FC = () => {
    const [searchValue, setSearchValue] = useState('');
    const [debouncedSearchValue] = useDebouncedValue(searchValue, 300);
    const [suggestions, setSuggestions] = useState<any[]>([]);
    const navigate = useNavigate();

    useEffect(() => {
        let ignore = false;
        const fetchSuggestions = async () => {
            if (debouncedSearchValue.length < 2) {
                setSuggestions([]);
                return;
            }
            try {
                const products = await ProductsService.getProducts(undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, debouncedSearchValue);
                const productList = products && Array.isArray(products.data) ? products.data : [];
                if (!ignore) {
                    setSuggestions(productList.slice(0, 5).map(product => ({
                        value: product.name,
                        group: product.category?.name || '',
                        id: product.id,
                    })));
                }
            } catch {
                setSuggestions([]);
            }
        };
        fetchSuggestions();
        return () => { ignore = true; };
    }, [debouncedSearchValue]);

    const handleSearch = (value: string) => {
        if (!value.trim()) return;

        // Navigate to products page with search query
        navigate(`/products?search=${encodeURIComponent(value.trim())}`);
        setSearchValue('');
    };

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        handleSearch(searchValue);
    };

    const handleSuggestionSelect = (value: string) => {
        const selectedProduct = suggestions.find(s => s.value === value);
        if (selectedProduct) {
            navigate(`/product/${selectedProduct.id}`);
        } else {
            handleSearch(value);
        }
        setSearchValue('');
    };

    return (
        <form onSubmit={handleSubmit}>
            <Autocomplete
                placeholder="Search for loans, credit cards, or banks..."
                value={searchValue}
                onChange={setSearchValue}
                onOptionSubmit={handleSuggestionSelect}
                data={suggestions}
                maxDropdownHeight={300}
                limit={5}
                radius="md"
                size="sm"
                leftSection={<IconSearch size={16} />}
                rightSection={
                    <ActionIcon
                        type="submit"
                        variant="gradient"
                        gradient={{ from: 'finBlue.6', to: 'finGreen.6', deg: 135 }}
                        size="sm"
                        radius="md"
                    >
                        <IconSearch size={14} />
                    </ActionIcon>
                }
                styles={{
                    input: {
                        paddingRight: rem(40),
                    },
                }}

            />
        </form>
    );
};

export default SearchBar;