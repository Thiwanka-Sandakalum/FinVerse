import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Upload, X, Plus, Trash2, Check, RefreshCw } from 'lucide-react';

import { ProductsService } from '@/src/api/products/services/ProductsService';
import { ConfirmDialog } from '@/src/components/ui/common/ConfirmDialog';
import { Skeleton, FullPageLoader } from '@/src/components/ui/common/Loading';

const ProductForm = () => {
    const { productId } = useParams();
    const navigate = useNavigate();
    const isEditMode = Boolean(productId);

    const [step, setStep] = useState(0);
    const [loading, setLoading] = useState(isEditMode);
    const [formData, setFormData] = useState({
        name: '',
        code: '',
        categoryId: '',
        description: '',
        image: null as any
    });
    const [imagePreview, setImagePreview] = useState(null);
    const [detailRows, setDetailRows] = useState([{ field: '', value: '', isCustom: false }]);
    const [categories, setCategories] = useState([]);
    const [fieldDefs, setFieldDefs] = useState([]);
    const [errors, setErrors] = useState({});
    const [pendingDetails, setPendingDetails] = useState(null);
    const [alertDialog, setAlertDialog] = useState({
        isOpen: false,
        title: '',
        message: '',
        variant: 'info',
    });

    const steps = ['Basic Information', 'Product Details', 'Review & Submit'];

    // Function to generate product code
    const generateProductCode = () => {
        const selectedCategory = categories.find(cat => cat.id === formData.categoryId);
        const categoryPrefix = selectedCategory?.name
            .split(' ')
            .map(word => word[0])
            .join('')
            .toUpperCase()
            .slice(0, 3) || 'PRD';

        const timestamp = Date.now().toString().slice(-6);
        const random = Math.random().toString(36).substring(2, 5).toUpperCase();

        return `${categoryPrefix}-${timestamp}-${random}`;
    };

    // Auto-generate code when category changes (only in create mode)
    useEffect(() => {
        if (!isEditMode && formData.categoryId && !formData.code) {
            setFormData(prev => ({ ...prev, code: generateProductCode() }));
        }
    }, [formData.categoryId, isEditMode]);

    // Fetch product data if in edit mode
    useEffect(() => {
        if (isEditMode && productId) {
            setLoading(true);
            ProductsService.getProducts1(productId)
                .then((response: any) => {
                    const product = response.data || response;
                    const details = product.details || {};

                    // Populate form data
                    setFormData({
                        name: product.name || '',
                        code: product.code || '',
                        categoryId: product.categoryId || '',
                        description: product.description || '',
                        image: null
                    });

                    // Set image preview if available
                    if (details.img_url || details.imageUrl || details.image) {
                        setImagePreview(details.img_url || details.imageUrl || details.image);
                    }

                    // Store details temporarily - will process after fieldDefs load
                    setPendingDetails(details);

                    setLoading(false);
                })
                .catch((err) => {
                    console.error('Failed to fetch product:', err);
                    setAlertDialog({
                        isOpen: true,
                        title: 'Error',
                        message: 'Failed to load product data. Please try again.',
                        variant: 'danger',
                    });
                    setLoading(false);
                });
        }
    }, [productId, isEditMode]);

    useEffect(() => {
        // Fetch categories from API
        ProductsService.getProductsCategories().then((res: any) => {
            if (res && Array.isArray(res.data)) {
                setCategories(res.data);
            } else if (Array.isArray(res)) {
                setCategories(res);
            } else {
                setCategories([]);
            }
        });
    }, []);

    useEffect(() => {
        if (formData.categoryId) {
            ProductsService.getProductsCategoriesFields(formData.categoryId).then((defs: any) => {
                if (defs && Array.isArray(defs.data)) {
                    setFieldDefs(defs.data);
                } else if (Array.isArray(defs)) {
                    setFieldDefs(defs);
                } else {
                    setFieldDefs([]);
                }
            });
        } else {
            setFieldDefs([]);
        }
    }, [formData.categoryId]);

    // Process pending details after fieldDefs are loaded (for edit mode)
    useEffect(() => {
        if (pendingDetails && fieldDefs.length > 0) {
            const fieldDefNames = fieldDefs.map(def => def.name);

            // Convert details object to detail rows
            const rows = Object.entries(pendingDetails)
                .filter(([key]) => !key.toLowerCase().includes('url') && !key.toLowerCase().includes('image'))
                .map(([field, value]) => ({
                    field,
                    value: typeof value === 'object' ? JSON.stringify(value) : String(value),
                    isCustom: !fieldDefNames.includes(field)
                }));

            if (rows.length > 0) {
                setDetailRows(rows);
            }

            setPendingDetails(null);
        }
    }, [fieldDefs, pendingDetails]);

    const handleImageUpload = (e) => {
        const file = e.target.files?.[0];
        if (file) {
            setFormData({ ...formData, image: file });
            const reader = new FileReader();
            reader.onloadend = () => setImagePreview(reader.result);
            reader.readAsDataURL(file);
        }
    };

    const removeImage = () => {
        setFormData({ ...formData, image: null });
        setImagePreview(null);
    };

    const validateStep = (currentStep: number) => {
        const newErrors: any = {};

        if (currentStep === 0) {
            if (!formData.name?.trim()) newErrors.name = 'Product name is required';
            if (!formData.code?.trim()) newErrors.code = 'Product code is required';
            if (!formData.categoryId) newErrors.categoryId = 'Category is required';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleNext = () => {
        if (validateStep(step)) {
            setStep(step + 1);
        }
    };

    const handleBack = () => {
        setStep(step - 1);
    };

    const handleSubmit = async () => {
        const institutionId = 'd7e8-4f9a-9b1c-3d4e5f6a7b8c';

        // Convert detailRows to an object with proper data types
        const detailsObj = {};
        try {
            detailRows.filter(row => row.field).forEach(row => {
                const fieldDef = fieldDefs.find(def => def.name === row.field);
                const dataType = fieldDef?.dataType || 'string';
                let parsedValue = row.value;

                // Parse value based on data type
                if (dataType === 'number') {
                    parsedValue = parseFloat(row.value);
                    if (isNaN(parsedValue)) {
                        throw new Error(`Invalid number for field "${row.field}"`);
                    }
                } else if (dataType === 'boolean') {
                    parsedValue = row.value === 'true';
                } else if (dataType === 'object' || dataType === 'array') {
                    try {
                        parsedValue = JSON.parse(row.value);
                        // Validate array type
                        if (dataType === 'array' && !Array.isArray(parsedValue)) {
                            throw new Error(`Field "${row.field}" must be an array`);
                        }
                        // Validate object type
                        if (dataType === 'object' && (Array.isArray(parsedValue) || typeof parsedValue !== 'object')) {
                            throw new Error(`Field "${row.field}" must be an object`);
                        }
                    } catch (e) {
                        throw new Error(`Invalid JSON for field "${row.field}": ${e.message}`);
                    }
                }

                detailsObj[row.field] = parsedValue;
            });
        } catch (err) {
            setAlertDialog({
                isOpen: true,
                title: 'Validation Error',
                message: err.message,
                variant: 'warning',
            });
            return;
        }

        const payload = {
            name: formData.name,
            code: formData.code,
            categoryId: formData.categoryId,
            description: formData.description,
            institutionId: institutionId,
            details: detailsObj,
        };

        try {
            if (isEditMode) {
                // Update existing product
                await ProductsService.putProducts(productId, payload);
                console.log('Product updated');
                setAlertDialog({
                    isOpen: true,
                    title: 'Success',
                    message: 'Product updated successfully!',
                    variant: 'info',
                });
                setTimeout(() => navigate(`/products/${productId}`), 1500);
            } else {
                // Create new product
                const res = await ProductsService.postProducts(payload);
                console.log('Product created:', res);
                setAlertDialog({
                    isOpen: true,
                    title: 'Success',
                    message: 'Product created successfully!',
                    variant: 'info',
                });
                setTimeout(() => navigate('/products'), 1500);
            }
        } catch (err) {
            setAlertDialog({
                isOpen: true,
                title: 'Error',
                message: `Failed to ${isEditMode ? 'update' : 'create'} product. Please try again.`,
                variant: 'danger',
            });
            console.error(err);
        }
    };

    const addDetailRow = (isCustom = false) => {
        setDetailRows([...detailRows, { field: '', value: '', isCustom }]);
    };

    const removeDetailRow = (index) => {
        if (detailRows.length > 1) {
            setDetailRows(detailRows.filter((_, i) => i !== index));
        }
    };

    const updateDetailRow = (index, key, value) => {
        const newRows = [...detailRows];
        newRows[index][key] = value;
        setDetailRows(newRows);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100 py-8 px-4">
            {loading ? (
                <div className="max-w-4xl mx-auto space-y-6">
                    <Skeleton height={60} />
                    <Skeleton height={120} />
                    <Skeleton height={80} />
                    <div className="space-y-4">
                        {Array.from({ length: 4 }).map((_, i) => (
                            <Skeleton key={i} height={80} />
                        ))}
                    </div>
                </div>
            ) : (
                <div className="max-w-4xl mx-auto">
                    {/* Header */}
                    <div className="mb-8">
                        <button
                            onClick={() => window.history.back()}
                            className="flex items-center gap-2 text-slate-600 hover:text-slate-900 mb-4 transition-colors"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            <span className="text-sm font-medium">Back</span>
                        </button>
                        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                            <h1 className="text-3xl font-bold text-slate-900 mb-2">
                                {isEditMode ? 'Edit Product' : 'Create New Product'}
                            </h1>
                            <p className="text-slate-600">
                                {isEditMode ? 'Update product information and details' : 'Configure a new financial offering for your platform'}
                            </p>
                        </div>
                    </div>

                    {/* Stepper */}
                    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-6">
                        <div className="flex items-center justify-between">
                            {steps.map((label, index) => (
                                <React.Fragment key={index}>
                                    <div className="flex items-center gap-3">
                                        <div
                                            className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all ${index < step
                                                ? 'bg-green-500 text-white'
                                                : index === step
                                                    ? 'bg-blue-600 text-white'
                                                    : 'bg-slate-200 text-slate-500'
                                                }`}
                                        >
                                            {index < step ? <Check className="w-5 h-5" /> : index + 1}
                                        </div>
                                        <div className="hidden md:block">
                                            <div className={`font-medium text-sm ${index === step ? 'text-blue-600' : 'text-slate-600'}`}>
                                                {label}
                                            </div>
                                        </div>
                                    </div>
                                    {index < steps.length - 1 && (
                                        <div className={`flex-1 h-0.5 mx-4 ${index < step ? 'bg-green-500' : 'bg-slate-200'}`} />
                                    )}
                                </React.Fragment>
                            ))}
                        </div>
                    </div>

                    {/* Form Card */}
                    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8">
                        {/* Step 0: Basic Information */}
                        {step === 0 && (
                            <div className="space-y-6">
                                <div>
                                    <h2 className="text-xl font-semibold text-slate-900 mb-6">Basic Information</h2>
                                </div>

                                {/* Image Upload */}
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                                        Product Image
                                    </label>
                                    {!imagePreview ? (
                                        <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-slate-300 rounded-lg cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition-all">
                                            <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                                <Upload className="w-10 h-10 text-slate-400 mb-3" />
                                                <p className="text-sm text-slate-600 font-medium">Click to upload product image</p>
                                                <p className="text-xs text-slate-500 mt-1">PNG, JPG or WEBP (MAX. 5MB)</p>
                                            </div>
                                            <input
                                                type="file"
                                                className="hidden"
                                                accept="image/*"
                                                onChange={handleImageUpload}
                                            />
                                        </label>
                                    ) : (
                                        <div className="relative w-full h-48 border-2 border-slate-200 rounded-lg overflow-hidden">
                                            <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                                            <button
                                                onClick={removeImage}
                                                className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                                            >
                                                <X className="w-4 h-4" />
                                            </button>
                                        </div>
                                    )}
                                </div>

                                {/* Product Name */}
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                                        Product Name <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${errors.name ? 'border-red-500' : 'border-slate-300'
                                            }`}
                                        placeholder="e.g., Premium Savings Account"
                                    />
                                    {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                                </div>

                                {/* Product Code */}
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                                        Product Code <span className="text-red-500">*</span>
                                    </label>
                                    <div className="flex gap-2">
                                        <input
                                            type="text"
                                            value={formData.code}
                                            onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                                            className={`flex-1 px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${errors.code ? 'border-red-500' : 'border-slate-300'
                                                }`}
                                            placeholder="e.g., PSA-001"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setFormData({ ...formData, code: generateProductCode() })}
                                            className="px-4 py-3 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors flex items-center gap-2 text-slate-700"
                                            title="Generate new code"
                                        >
                                            <RefreshCw className="w-4 h-4" />
                                            <span className="hidden sm:inline text-sm font-medium">Generate</span>
                                        </button>
                                    </div>
                                    {errors.code && <p className="text-red-500 text-xs mt-1">{errors.code}</p>}
                                    <p className="text-xs text-slate-500 mt-1">Auto-generated based on category. You can edit or regenerate.</p>
                                </div>

                                {/* Category */}
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                                        Category <span className="text-red-500">*</span>
                                    </label>
                                    <select
                                        value={formData.categoryId}
                                        onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${errors.categoryId ? 'border-red-500' : 'border-slate-300'
                                            }`}
                                    >
                                        <option value="">Select a category</option>
                                        {categories.map((cat) => (
                                            <option key={cat.id} value={cat.id}>
                                                {cat.name}
                                            </option>
                                        ))}
                                    </select>
                                    {errors.categoryId && <p className="text-red-500 text-xs mt-1">{errors.categoryId}</p>}
                                </div>

                                {/* Description */}
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                                        Description
                                    </label>
                                    <textarea
                                        value={formData.description}
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                        rows={4}
                                        className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
                                        placeholder="Provide a detailed description of the product..."
                                    />
                                </div>
                            </div>
                        )}

                        {/* Step 1: Product Details */}
                        {step === 1 && (
                            <div className="space-y-6">
                                <div>
                                    <h2 className="text-xl font-semibold text-slate-900 mb-2">Product Details</h2>
                                    <p className="text-slate-600 text-sm">Add specific attributes and values for this product</p>
                                </div>

                                <div className="space-y-4">
                                    {detailRows.map((row, idx) => (
                                        <div key={idx} className="flex gap-3 items-start p-4 bg-slate-50 rounded-lg border border-slate-200">
                                            <div className="flex-1">
                                                <label className="block text-xs font-semibold text-slate-600 mb-2">Field</label>
                                                {row.isCustom ? (
                                                    <input
                                                        type="text"
                                                        placeholder="Custom field name"
                                                        value={row.field}
                                                        onChange={(e) => updateDetailRow(idx, 'field', e.target.value)}
                                                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                                                    />
                                                ) : (
                                                    <select
                                                        value={row.field}
                                                        onChange={(e) => updateDetailRow(idx, 'field', e.target.value)}
                                                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                                                    >
                                                        <option value="">Select field</option>
                                                        {fieldDefs.map((def) => (
                                                            <option key={def.id} value={def.name}>
                                                                {def.name}
                                                            </option>
                                                        ))}
                                                    </select>
                                                )}
                                            </div>
                                            <div className="flex-1">
                                                <label className="block text-xs font-semibold text-slate-600 mb-2">Value</label>
                                                {(() => {
                                                    const fieldDef = fieldDefs.find(def => def.name === row.field);
                                                    const dataType = fieldDef?.dataType || 'string';

                                                    if (dataType === 'boolean') {
                                                        return (
                                                            <select
                                                                value={row.value}
                                                                onChange={(e) => updateDetailRow(idx, 'value', e.target.value)}
                                                                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                                                            >
                                                                <option value="">Select value</option>
                                                                <option value="true">True</option>
                                                                <option value="false">False</option>
                                                            </select>
                                                        );
                                                    } else if (dataType === 'number') {
                                                        return (
                                                            <input
                                                                type="number"
                                                                placeholder="Enter number"
                                                                value={row.value}
                                                                onChange={(e) => updateDetailRow(idx, 'value', e.target.value)}
                                                                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                                                            />
                                                        );
                                                    } else if (dataType === 'object' || dataType === 'array') {
                                                        return (
                                                            <textarea
                                                                placeholder={`Enter valid JSON ${dataType}`}
                                                                value={row.value}
                                                                onChange={(e) => updateDetailRow(idx, 'value', e.target.value)}
                                                                rows={3}
                                                                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm font-mono"
                                                            />
                                                        );
                                                    } else {
                                                        // Default to string
                                                        return (
                                                            <input
                                                                type="text"
                                                                placeholder="Enter value"
                                                                value={row.value}
                                                                onChange={(e) => updateDetailRow(idx, 'value', e.target.value)}
                                                                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                                                            />
                                                        );
                                                    }
                                                })()}
                                                {(() => {
                                                    const fieldDef = fieldDefs.find(def => def.name === row.field);
                                                    const dataType = fieldDef?.dataType;
                                                    if (dataType) {
                                                        return (
                                                            <p className="text-xs text-slate-500 mt-1">Type: {dataType}</p>
                                                        );
                                                    }
                                                    return null;
                                                })()}
                                            </div>
                                            <div className="pt-6">
                                                <button
                                                    type="button"
                                                    onClick={() => removeDetailRow(idx)}
                                                    disabled={detailRows.length === 1}
                                                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div className="flex gap-3 pt-2">
                                    <button
                                        type="button"
                                        onClick={() => addDetailRow(false)}
                                        className="flex items-center gap-2 px-4 py-2 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors text-sm font-medium"
                                    >
                                        <Plus className="w-4 h-4" />
                                        Add Field
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => addDetailRow(true)}
                                        className="flex items-center gap-2 px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors text-sm font-medium"
                                    >
                                        <Plus className="w-4 h-4" />
                                        Add Custom Field
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Step 2: Review */}
                        {step === 2 && (
                            <div className="space-y-6">
                                <div>
                                    <h2 className="text-xl font-semibold text-slate-900 mb-2">Review & Submit</h2>
                                    <p className="text-slate-600 text-sm">Please review all information before submitting</p>
                                </div>

                                <div className="bg-slate-50 rounded-lg p-6 space-y-6">
                                    {imagePreview && (
                                        <div>
                                            <h3 className="text-sm font-semibold text-slate-700 mb-3">Product Image</h3>
                                            <img src={imagePreview} alt="Product" className="h-32 w-32 object-cover rounded-lg border-2 border-slate-200" />
                                        </div>
                                    )}

                                    <div className="grid grid-cols-2 gap-6">
                                        <div>
                                            <h3 className="text-sm font-semibold text-slate-700 mb-2">Product Name</h3>
                                            <p className="text-slate-900">{formData.name || '-'}</p>
                                        </div>
                                        <div>
                                            <h3 className="text-sm font-semibold text-slate-700 mb-2">Product Code</h3>
                                            <p className="text-slate-900">{formData.code || '-'}</p>
                                        </div>
                                        <div className="col-span-2">
                                            <h3 className="text-sm font-semibold text-slate-700 mb-2">Category</h3>
                                            <p className="text-slate-900">
                                                {categories.find((c) => c.id === formData.categoryId)?.name || '-'}
                                            </p>
                                        </div>
                                        <div className="col-span-2">
                                            <h3 className="text-sm font-semibold text-slate-700 mb-2">Description</h3>
                                            <p className="text-slate-900">{formData.description || '-'}</p>
                                        </div>
                                    </div>

                                    {detailRows.filter(row => row.field).length > 0 && (
                                        <div>
                                            <h3 className="text-sm font-semibold text-slate-700 mb-3">Product Details</h3>
                                            <div className="space-y-2">
                                                {detailRows.filter(row => row.field).map((row, idx) => {
                                                    const fieldDef = fieldDefs.find(def => def.name === row.field);
                                                    const dataType = fieldDef?.dataType || 'string';
                                                    let displayValue = row.value;

                                                    // Format display value based on type
                                                    if (dataType === 'object' || dataType === 'array') {
                                                        try {
                                                            const parsed = JSON.parse(row.value);
                                                            displayValue = JSON.stringify(parsed, null, 2);
                                                        } catch (e) {
                                                            displayValue = row.value;
                                                        }
                                                    }

                                                    return (
                                                        <div key={idx} className="flex justify-between py-2 border-b border-slate-200 last:border-0">
                                                            <span className="font-medium text-slate-700">
                                                                {row.field}
                                                                {dataType && <span className="text-xs text-slate-400 ml-2">({dataType})</span>}
                                                            </span>
                                                            <span className="text-slate-900 max-w-md text-right">
                                                                {dataType === 'object' || dataType === 'array' ? (
                                                                    <pre className="text-xs bg-slate-100 p-2 rounded overflow-auto max-h-32">{displayValue}</pre>
                                                                ) : (
                                                                    displayValue
                                                                )}
                                                            </span>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Navigation Buttons */}
                        <div className="flex justify-between mt-8 pt-6 border-t border-slate-200">
                            <button
                                type="button"
                                onClick={handleBack}
                                disabled={step === 0}
                                className="px-6 py-3 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                            >
                                Back
                            </button>
                            {step < steps.length - 1 ? (
                                <button
                                    type="button"
                                    onClick={handleNext}
                                    className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium shadow-sm"
                                >
                                    Continue
                                </button>
                            ) : (
                                <button
                                    type="button"
                                    onClick={handleSubmit}
                                    className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium shadow-sm"
                                >
                                    {isEditMode ? 'Update Product' : 'Create Product'}
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Alert Dialog */}
            <ConfirmDialog
                isOpen={alertDialog.isOpen}
                onClose={() => setAlertDialog({ ...alertDialog, isOpen: false })}
                onConfirm={() => setAlertDialog({ ...alertDialog, isOpen: false })}
                title={alertDialog.title}
                message={alertDialog.message}
                variant={alertDialog.variant}
                confirmText="OK"
                cancelText=""
            />
        </div>
    );
};

export default ProductForm;