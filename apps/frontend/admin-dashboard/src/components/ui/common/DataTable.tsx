import React from 'react';
import { Skeleton } from './Loading';

export interface DataTableColumn<T> {
    key: string;
    header: React.ReactNode;
    render: (row: T) => React.ReactNode;
    className?: string;
    thClassName?: string;
    sortable?: boolean;
    onSort?: () => void;
}

interface DataTableProps<T> {
    columns: DataTableColumn<T>[];
    data: T[];
    emptyMessage?: string;
    footer?: React.ReactNode;
    tableClassName?: string;
    headClassName?: string;
    bodyClassName?: string;
    isLoading?: boolean;
    loadingRows?: number;
}

function DataTable<T>({
    columns,
    data,
    emptyMessage,
    footer,
    tableClassName = '',
    headClassName = '',
    bodyClassName = '',
    isLoading = false,
    loadingRows = 8
}: DataTableProps<T>) {
    // Render loading skeleton rows
    const renderLoadingSkeleton = () => {
        return Array.from({ length: loadingRows }).map((_, rowIndex) => (
            <tr key={`loading-${rowIndex}`} className="hover:bg-slate-50/50 group transition-colors">
                {columns.map((col) => (
                    <td key={`${col.key}-${rowIndex}`} className={`px-6 py-4 ${col.className || ''}`}>
                        <Skeleton height={24} width="80%" className="rounded" />
                    </td>
                ))}
            </tr>
        ));
    };

    return (
        <div className="overflow-x-auto min-h-[200px]">
            <table className={`w-full text-sm text-left ${tableClassName}`}>
                <thead className={`bg-slate-50 text-xs uppercase text-slate-500 ${headClassName}`}>
                    <tr>
                        {columns.map((col) => (
                            <th
                                key={col.key}
                                className={`px-6 py-4 font-medium ${col.thClassName || ''} ${col.sortable ? 'cursor-pointer hover:bg-slate-100' : ''}`}
                                onClick={col.sortable && col.onSort ? col.onSort : undefined}
                            >
                                {col.header}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody className={`divide-y divide-slate-100 ${bodyClassName}`}>
                    {isLoading ? (
                        renderLoadingSkeleton()
                    ) : data.length === 0 ? (
                        <tr>
                            <td colSpan={columns.length} className="px-6 py-8 text-center text-slate-400">{emptyMessage || 'No data found.'}</td>
                        </tr>
                    ) : (
                        data.map((row, i) => (
                            <tr key={i} className="hover:bg-slate-50/50 group transition-colors">
                                {columns.map((col) => (
                                    <td key={col.key} className={`px-6 py-4 ${col.className || ''}`}>{col.render(row)}</td>
                                ))}
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
            {footer}
        </div>
    );
}

export default DataTable;
