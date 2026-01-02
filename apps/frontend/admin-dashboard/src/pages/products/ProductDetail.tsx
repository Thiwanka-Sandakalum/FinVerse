import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Copy, Edit2, Calendar, Tag, Star, Image as ImageIcon, Trash2 } from 'lucide-react';
import { ProductsService } from '@/src/api/products';
import { Button } from '@/src/components/ui/common/Button';
import { Card, CardContent } from '@/src/components/ui/common/Card';
import { ConfirmDialog } from '@/src/components/ui/common/ConfirmDialog';
import { Skeleton, FullPageLoader } from '@/src/components/ui/common/Loading';

export const ProductDetail: React.FC = () => {
    const { productId } = useParams();
    const navigate = useNavigate();
    const [productData, setProductData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [confirmDialog, setConfirmDialog] = useState<{
        isOpen: boolean;
        title: string;
        message: string;
        onConfirm: () => void;
        variant?: 'danger' | 'warning' | 'info';
    }>({ isOpen: false, title: '', message: '', onConfirm: () => { } });

    useEffect(() => {
        if (!productId) return;

        setLoading(true);
        ProductsService.getProducts1(productId)
            .then((response: any) => {
                // Handle wrapped response or direct product
                const product = response.data || response;
                setProductData(product);
                setLoading(false);
            })
            .catch((err) => {
                console.error('Failed to fetch product:', err);
                setError('Failed to load product');
                setLoading(false);
            });
    }, [productId]);

    if (loading) {
        return (
            <div className="space-y-4">
                <Button variant="ghost" size="sm" disabled>
                    <ArrowLeft className="w-4 h-4 mr-2" /> Back to Products
                </Button>
                <Card>
                    <CardContent className="p-8">
                        <div className="space-y-4">
                            <Skeleton height={300} />
                            <div className="space-y-3">
                                <Skeleton height={30} width={200} />
                                <Skeleton height={20} />
                                <Skeleton height={20} />
                                <Skeleton height={20} width={150} />
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        );
    }

    if (error || !productData) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-center">
                    <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <ImageIcon className="w-8 h-8 text-slate-400" />
                    </div>
                    <p className="text-slate-600 font-medium mb-2">Product not found</p>
                    <Button variant="outline" size="sm" onClick={() => navigate('/products')}>
                        Back to Products
                    </Button>
                </div>
            </div>
        );
    }

    const details = productData.details || {};
    const category = productData.category || {};
    const imageUrl = details.img_url || details.imageUrl || details.image;

    // Helper to format detail keys
    const formatKey = (key: string) => {
        return key
            .replace(/([A-Z])/g, ' $1')
            .replace(/_/g, ' ')
            .replace(/\b\w/g, c => c.toUpperCase())
            .trim();
    };

    // Helper to format values
    const formatValue = (value: any): React.ReactNode => {
        if (value === null || value === undefined) return '-';
        if (typeof value === 'boolean') return value ? 'Yes' : 'No';
        if (typeof value === 'object' && !Array.isArray(value)) {
            return (
                <div className="space-y-1 mt-2">
                    {Object.entries(value).map(([k, v]) => (
                        <div key={k} className="flex items-start gap-2 text-xs">
                            <span className="text-slate-400 min-w-[80px]">{formatKey(k)}:</span>
                            <span className="text-slate-700 font-medium">{String(v)}</span>
                        </div>
                    ))}
                </div>
            );
        }
        if (Array.isArray(value)) return value.join(', ');
        return String(value);
    };

    const handleToggleStatus = () => {
        setConfirmDialog({
            isOpen: true,
            title: `${productData.isActive ? 'Disable' : 'Enable'} Product`,
            message: `Are you sure you want to ${productData.isActive ? 'disable' : 'enable'} this product?`,
            variant: 'warning',
            onConfirm: async () => {
                try {
                    await ProductsService.putProducts(productData.id, {
                        ...productData,
                        isActive: !productData.isActive,
                    });
                    setProductData((prev: any) => ({
                        ...prev,
                        isActive: !prev.isActive,
                    }));
                } catch (err) {
                    console.error('Toggle status error:', err);
                    // Show error dialog
                    setConfirmDialog({
                        isOpen: true,
                        title: 'Error',
                        message: 'Failed to update product status. Please try again.',
                        variant: 'danger',
                        onConfirm: () => { },
                    });
                }
            },
        });
    };

    const handleDelete = () => {
        setConfirmDialog({
            isOpen: true,
            title: 'Delete Product',
            message: 'Are you sure you want to delete this product? This action cannot be undone.',
            variant: 'danger',
            onConfirm: async () => {
                try {
                    await ProductsService.deleteProducts(productData.id);
                    navigate('/products');
                } catch (err) {
                    console.error('Delete product error:', err);
                    // Show error dialog
                    setConfirmDialog({
                        isOpen: true,
                        title: 'Error',
                        message: 'Failed to delete product. Please try again.',
                        variant: 'danger',
                        onConfirm: () => { },
                    });
                }
            }
        });
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <Button variant="ghost" size="sm" onClick={() => navigate('/products')}>
                    <ArrowLeft className="w-4 h-4 mr-2" /> Back to Products
                </Button>
                <div className="flex items-center gap-4">
                    <Button variant="outline" size="sm">
                        <Copy className="w-4 h-4 mr-2" /> Copy ID
                    </Button>
                    <Button variant="primary" size="sm" onClick={() => navigate(`/products/${productData.id}/edit`)}>
                        <Edit2 className="w-4 h-4 mr-2" /> Edit
                    </Button>

                    {/* Enable/Disable Switch */}
                    <div className="flex items-center gap-2 px-3 py-2 bg-slate-50 rounded-lg border border-slate-200">
                        <span className="text-xs font-medium text-slate-600">
                            {productData.isActive ? 'Enabled' : 'Disabled'}
                        </span>
                        <button
                            onClick={handleToggleStatus}
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${productData.isActive ? 'bg-indigo-600' : 'bg-slate-300'
                                }`}
                        >
                            <span
                                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${productData.isActive ? 'translate-x-6' : 'translate-x-1'
                                    }`}
                            />
                        </button>
                    </div>

                    {/* Delete Icon Button */}
                    <button
                        onClick={handleDelete}
                        className="p-2 rounded-lg text-red-600 hover:bg-red-50 border border-slate-200 hover:border-red-300 transition-colors"
                        title="Delete Product"
                    >
                        <Trash2 className="w-4 h-4" />
                    </button>
                </div>
            </div>

            {/* Product Detail Card */}
            <div>
                <div className="space-y-6">
                    <div className="max-w-4xl mx-auto">
                        {/* Product Header Card */}
                        <Card className="overflow-hidden">
                            {imageUrl && (
                                <div className="relative h-64 bg-gradient-to-br from-indigo-500 to-purple-600 overflow-hidden">
                                    <img
                                        src={imageUrl}
                                        alt={productData.name}
                                        className="w-full h-full object-cover"
                                        onError={(e) => {
                                            (e.target as HTMLImageElement).style.display = 'none';
                                        }}
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                                    <div className="absolute bottom-4 left-4 right-4">
                                        <div className="flex items-center gap-2 mb-2">
                                            {productData.isFeatured && (
                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-400 text-yellow-900">
                                                    <Star className="w-3 h-3 mr-1" /> Featured
                                                </span>
                                            )}
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${productData.isActive
                                                ? 'bg-green-400 text-green-900'
                                                : 'bg-gray-400 text-gray-900'
                                                }`}>
                                                {productData.isActive ? 'Active' : 'Inactive'}
                                            </span>
                                            {productData.isSaved && (
                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-400 text-blue-900">
                                                    Saved
                                                </span>
                                            )}
                                            {category.name && (
                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-400 text-indigo-900">
                                                    <Tag className="w-3 h-3 mr-1" /> {category.name}
                                                </span>
                                            )}
                                        </div>
                                        <h1 className="text-2xl font-bold text-white mb-1">{productData.name}</h1>
                                        <div className="flex items-center gap-3 text-white/80 text-xs">
                                            <span className="flex items-center gap-1">
                                                <Calendar className="w-3 h-3" />
                                                {productData.createdAt ? new Date(productData.createdAt).toLocaleDateString('en-US', {
                                                    month: 'short', day: 'numeric', year: 'numeric'
                                                }) : '-'}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            )}
                            <CardContent className={imageUrl ? 'pt-6' : 'pt-8'}>
                                {!imageUrl && (
                                    <div className="mb-6">
                                        <div className="flex items-center gap-2 mb-3 flex-wrap">
                                            {productData.isFeatured && (
                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                                                    <Star className="w-3 h-3 mr-1" /> Featured
                                                </span>
                                            )}
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${productData.isActive
                                                ? 'bg-green-100 text-green-800'
                                                : 'bg-gray-100 text-gray-800'
                                                }`}>
                                                {productData.isActive ? 'Active' : 'Inactive'}
                                            </span>
                                            {category.name && (
                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                                                    <Tag className="w-3 h-3 mr-1" /> {category.name}
                                                </span>
                                            )}
                                            <span className="flex items-center gap-1 text-slate-500 text-xs ml-auto">
                                                <Calendar className="w-3 h-3" />
                                                {productData.createdAt ? new Date(productData.createdAt).toLocaleDateString('en-US', {
                                                    month: 'short', day: 'numeric', year: 'numeric'
                                                }) : '-'}
                                            </span>
                                        </div>
                                        <h1 className="text-3xl font-bold text-slate-900 mb-2">{productData.name}</h1>
                                    </div>
                                )}

                                {/* Product Details Grid */}
                                <div className="space-y-4">
                                    <h3 className="text-lg font-semibold text-slate-900 flex items-center gap-2 pb-2 border-b border-slate-200">
                                        Product Details
                                    </h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {Object.entries(details)
                                            .filter(([key]) => !key.toLowerCase().includes('url') && !key.toLowerCase().includes('image'))
                                            .map(([key, value]) => (
                                                <div key={key} className="bg-slate-50 rounded-lg p-4 border border-slate-100 hover:border-indigo-200 transition-colors">
                                                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">
                                                        {formatKey(key)}
                                                    </p>
                                                    <div className="text-sm font-medium text-slate-900">
                                                        {formatValue(value)}
                                                    </div>
                                                </div>
                                            ))}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
            {/* Confirm Dialog */}
            <ConfirmDialog
                isOpen={confirmDialog.isOpen}
                onClose={() => setConfirmDialog({ ...confirmDialog, isOpen: false })}
                onConfirm={confirmDialog.onConfirm}
                title={confirmDialog.title}
                message={confirmDialog.message}
                variant={confirmDialog.variant}
                confirmText={confirmDialog.variant === 'danger' ? 'Delete' : 'Confirm'}
            />        </div>
    );
};
