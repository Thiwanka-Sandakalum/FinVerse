import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Layers, Plus, Upload, MoreHorizontal, ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';
import DataTable from '../../components/ui/common/DataTable';
import { Button } from '@/src/components/ui/common/Button';
import { Card, CardHeader, CardTitle, CardContent } from '@/src/components/ui/common/Card';
import { DropdownMenu } from '@/src/components/ui/common/DropdownMenu';
import { Select } from '@/src/components/ui/common/Select';
import { Input } from '@/src/components/ui/common/Input';
import { Product, ProductsService } from '@/src/api/products';
import { useForm, useWatch } from 'react-hook-form';

interface ProductListProps {
    sortedProducts: Product[];
    requestSort: (key: keyof Product | 'keyRate' | 'type') => void;
    sortConfig: { key: keyof Product | 'keyRate' | 'type'; direction: 'asc' | 'desc' } | null;
    setIsImportOpen: (open: boolean) => void;
    setSelectedProduct: (product: Product | null) => void;
    setView: (view: 'list' | 'create' | 'edit' | 'detail') => void;
}

const SortIcon = ({ column, sortConfig }: {
    column: 'name' | 'createdAt' | 'updatedAt';
    sortConfig: { key: 'name' | 'createdAt' | 'updatedAt'; direction: 'asc' | 'desc' } | null
}) => {
    if (sortConfig?.key !== column) return <ArrowUpDown className="w-4 h-4 ml-1 text-slate-300" />;
    return sortConfig.direction === 'asc' ?
        <ArrowUp className="w-4 h-4 ml-1 text-indigo-600" /> :
        <ArrowDown className="w-4 h-4 ml-1 text-indigo-600" />;
};

export const ProductList: React.FC<ProductListProps> = ({ setIsImportOpen }) => {
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(5);
    const [sort, setSort] = useState<'name' | 'createdAt' | 'updatedAt'>('createdAt');
    const [order, setOrder] = useState<'asc' | 'desc'>('desc');
    const [sortConfig, setSortConfig] = useState<{ key: 'name' | 'createdAt' | 'updatedAt'; direction: 'asc' | 'desc' } | null>({
        key: 'createdAt',
        direction: 'desc'
    });
    const [categories, setCategories] = useState([]);
    const [products, setProducts] = useState<Product[]>([]);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    // react-hook-form for filters
    const { register, setValue, watch, reset, control } = useForm({
        defaultValues: {
            categoryId: '',
            productIds: '',
            isActive: 'all',
        },
    });
    // Use useWatch to avoid object reference churn
    const categoryId = useWatch({ control, name: 'categoryId' });
    const productIds = useWatch({ control, name: 'productIds' });
    const isActive = useWatch({ control, name: 'isActive' });

    // Fetch categories on mount
    useEffect(() => {
        ProductsService.getProductsCategories().then((res: any) => {
            setCategories(res.data || []);
        }).catch(err => {
            console.error('Failed to fetch categories:', err);
        });
    }, []);

    // Fetch products when filters/sorting/page/limit change
    useEffect(() => {
        setLoading(true);
        setError(null);
        const productIdsArray =
            typeof productIds === 'string'
                ? productIds.split(',').map(id => id.trim()).filter(id => id.length > 0)
                : undefined;
        ProductsService.getProducts(
            categoryId || undefined,
            undefined, // institutionId
            isActive === 'all' ? undefined : isActive === 'true',
            undefined, // isFeatured
            productIdsArray && productIdsArray.length > 0 ? productIdsArray : undefined,
            page,
            limit,
            sort,
            order
        )
            .then((res: any) => {
                setProducts(res.data || []);
                setTotal(res.meta?.total || 0);
            })
            .catch((err) => {
                setError('Failed to fetch products');
                console.error(err);
            })
            .finally(() => setLoading(false));
    }, [page, limit, sort, order, categoryId, productIds, isActive]);

    // Handle sorting
    const handleSort = (key: 'name' | 'createdAt' | 'updatedAt') => {
        const newDirection = sortConfig?.key === key && sortConfig.direction === 'asc' ? 'desc' : 'asc';
        setSortConfig({ key, direction: newDirection });
        setSort(key);
        setOrder(newDirection);
        setPage(1);
    };

    // Reset all filters
    const handleReset = () => {
        reset();
        setSort('createdAt');
        setOrder('desc');
        setSortConfig({ key: 'createdAt', direction: 'desc' });
        setPage(1);
    };


    return (
        <>
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900">Products</h1>
                    <p className="text-slate-500">Manage financial products catalog and configurations.</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" onClick={() => setIsImportOpen(true)}>
                        <Upload className="mr-2 h-4 w-4" /> Import CSV
                    </Button>
                    <Button onClick={() => navigate('/products/create')}>
                        <Plus className="mr-2 h-4 w-4" /> Create Product
                    </Button>
                </div>
            </div>
            <Card>
                <CardHeader>
                    <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
                        <CardTitle className="shrink-0">Product Catalog</CardTitle>
                        <div className="flex flex-col sm:flex-row items-center gap-2 w-full xl:w-auto">
                            <div className="relative w-full sm:w-64">
                                <Input
                                    placeholder="Product IDs (comma separated)"
                                    className="pl-3 w-full"
                                    {...register('productIds')}
                                    onChange={e => {
                                        setValue('productIds', e.target.value);
                                        setPage(1);
                                    }}
                                />
                            </div>
                            <div className="flex gap-2 w-full sm:w-auto">
                                <Select
                                    className="w-full sm:w-32"
                                    options={[
                                        { label: 'All Categories', value: '' },
                                        ...categories
                                            .filter((cat) => cat.level === 1)
                                            .map((cat) => ({ label: cat.name, value: cat.id }))
                                    ]}
                                    value={categoryId}
                                    onChange={e => {
                                        const val = e && e.target ? e.target.value : e;
                                        setValue('categoryId', val || '');
                                        setPage(1);
                                    }}
                                />
                                <Select
                                    className="w-full sm:w-32"
                                    value={isActive}
                                    onChange={e => {
                                        const value = e && e.target ? e.target.value : e;
                                        setValue('isActive', value);
                                        setPage(1);
                                    }}
                                    options={[
                                        { label: 'All Statuses', value: 'all' },
                                        { label: 'Active', value: 'true' },
                                        { label: 'Inactive', value: 'false' },
                                    ]}
                                />
                                {/* Per page limit dropdown */}
                                <Select
                                    className="w-full sm:w-28"
                                    value={String(limit)}
                                    onChange={e => {
                                        const value = e && e.target ? e.target.value : e;
                                        setLimit(Number(value));
                                        setPage(1);
                                    }}
                                    options={[
                                        { label: '5 / page', value: '5' },
                                        { label: '10 / page', value: '10' },
                                        { label: '20 / page', value: '20' },
                                        { label: '50 / page', value: '50' },
                                    ]}
                                />
                                <Button variant="outline" onClick={handleReset}>Reset</Button>
                            </div>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    {error && (
                        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-600">
                            {error}
                        </div>
                    )}
                    <DataTable
                        isLoading={loading}
                        loadingRows={5}
                        columns={[
                            {
                                key: 'name',
                                header: (
                                    <div
                                        className="flex items-center cursor-pointer"
                                        onClick={() => handleSort('name')}
                                    >
                                        Product Name <SortIcon column="name" sortConfig={sortConfig} />
                                    </div>
                                ),
                                render: (product: any) => (
                                    <div
                                        className="flex items-center gap-3 cursor-pointer"
                                        onClick={() => navigate(`/products/${product.id}`)}
                                    >
                                        <div className={`p-2 rounded-lg ${product.type === 'Loan' ? 'bg-blue-100 text-blue-600' :
                                            product.type === 'Card' ? 'bg-purple-100 text-purple-600' :
                                                product.type === 'Lease' ? 'bg-orange-100 text-orange-600' :
                                                    'bg-emerald-100 text-emerald-600'
                                            }`}>
                                            <Layers className="w-4 h-4" />
                                        </div>
                                        <div>
                                            <div className="font-medium text-slate-900 group-hover:text-indigo-600 transition-colors">
                                                {product.name}
                                            </div>
                                            <div className="text-xs text-slate-500">{product.code}</div>
                                        </div>
                                    </div>
                                ),
                            },
                            {
                                key: 'type',
                                header: <div>Type</div>,
                                render: (product) => <span className="text-slate-600">{product.category.name}</span>,
                            },
                            {
                                key: 'status',
                                header: <div>Status</div>,
                                render: (product) => (
                                    <span className={product.isActive === true ? "text-green-600" : "text-yellow-600"}>
                                        {product.isActive === true ? 'Active' : 'Inactive'}
                                    </span>
                                ),
                            },
                            {
                                key: 'createdAt',
                                header: (
                                    <div
                                        className="flex items-center cursor-pointer"
                                        onClick={() => handleSort('createdAt')}
                                    >
                                        Created At <SortIcon column="createdAt" sortConfig={sortConfig} />
                                    </div>
                                ),
                                render: (product) => (
                                    <span className="text-slate-600">
                                        {new Date(product.createdAt).toLocaleDateString()}
                                    </span>
                                ),
                            },
                            {
                                key: 'actions',
                                header: <span className="text-right block">Actions</span>,
                                className: 'text-right',
                                render: (product) => (
                                    <DropdownMenu
                                        trigger={
                                            <button className="p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100">
                                                <MoreHorizontal className="w-4 h-4" />
                                            </button>
                                        }
                                        items={[
                                            {
                                                label: 'View Details',
                                                onClick: () => navigate(`/products/${product.id}`)
                                            },
                                            {
                                                label: 'Edit Product',
                                                onClick: () => navigate(`/products/${product.id}/edit`)
                                            },
                                            {
                                                label: 'Duplicate',
                                                onClick: () => console.log('Duplicate product:', product.id)
                                            },
                                            {
                                                label: 'Deactivate',
                                                onClick: () => console.log('Deactivate product:', product.id),
                                                danger: true
                                            },
                                        ]}
                                    />
                                ),
                            },
                        ]}
                        data={products}
                        emptyMessage="No products found."
                        footer={
                            <div className="flex items-center justify-between border-t border-slate-100 px-6 py-4">
                                <div className="text-xs text-slate-500">
                                    Showing {products.length === 0 ? 0 : (page - 1) * limit + 1}-{Math.min(page * limit, total)} of {total}
                                </div>
                                <div className="flex gap-2">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        disabled={page === 1}
                                        onClick={() => setPage(page - 1)}
                                    >
                                        Previous
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        disabled={page * limit >= total}
                                        onClick={() => setPage(page + 1)}
                                    >
                                        Next
                                    </Button>
                                </div>
                            </div>
                        }
                    />
                </CardContent>
            </Card>
        </>
    );
};