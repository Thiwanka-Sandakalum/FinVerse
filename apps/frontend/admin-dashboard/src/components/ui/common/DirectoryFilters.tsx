import React from 'react';
import { Search } from 'lucide-react';
import { Button } from './Button';
import { Input } from './Input';
import { Select } from './Select';

interface DirectoryFiltersProps {
    searchPlaceholder: string;
    searchValue?: string;
    onSearchChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
    selects: Array<{
        className?: string;
        options: { label: string; value: string }[];
        value?: string;
        onChange?: (value: string) => void;
    }>;
    onReset?: () => void;
    resetLabel?: string;
}

const DirectoryFilters: React.FC<DirectoryFiltersProps> = ({
    searchPlaceholder,
    searchValue,
    onSearchChange,
    selects,
    onReset,
    resetLabel = 'Reset',
}) => (
    <div className="flex flex-col sm:flex-row items-center gap-2 w-full xl:w-auto">
        <div className="relative w-full sm:w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-400 z-10" />
            <Input
                placeholder={searchPlaceholder}
                className="pl-9 w-full"
                value={searchValue}
                onChange={onSearchChange}
            />
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
            {selects.map((select, i) => (
                <Select
                    key={i}
                    className={select.className || 'w-full sm:w-32'}
                    options={select.options}
                    value={select.value}
                    onChange={select.onChange}
                />
            ))}
            <Button variant="outline" onClick={onReset}>{resetLabel}</Button>
        </div>
    </div>
);

export default DirectoryFilters;