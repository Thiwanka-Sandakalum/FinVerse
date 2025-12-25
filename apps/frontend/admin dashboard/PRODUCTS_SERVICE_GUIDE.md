# Products Service Integration Guide

This guide shows you how to use the generated ProductsService for CRUD operations in your React admin dashboard.

## Service Overview

The ProductsService provides the following operations:
- **Create**: `ProductsService.postProducts(productData)`
- **Read**: `ProductsService.getProducts(filters)` and `ProductsService.getProducts1(id)`
- **Update**: `ProductsService.putProducts(id, productData)`
- **Delete**: `ProductsService.deleteProducts(id)`

## Custom Hooks

### useProducts Hook

The `useProducts` hook provides a complete interface for managing products:

```typescript
import { useProducts } from '../hooks/useProducts'

const MyComponent = () => {
  const {
    products,           // Current products array
    loading,            // Loading state
    error,              // Error message
    total,              // Total count
    fetchProducts,      // Fetch with filters
    getProduct,         // Get single product
    createProduct,      // Create new product
    updateProduct,      // Update existing product
    deleteProduct,      // Delete product
    toggleSaveProduct,  // Save/unsave product
    getSavedProducts    // Get user's saved products
  } = useProducts()

  // Usage examples below...
}
```

### useProductCategories Hook

The `useProductCategories` hook manages product categories:

```typescript
import { useProductCategories } from '../hooks/useProductCategories'

const MyComponent = () => {
  const {
    categories,           // Current categories array
    loading,              // Loading state
    error,                // Error message
    fetchCategories,      // Fetch categories
    getCategoryHierarchy, // Get full hierarchy
    getCategory,          // Get single category
    createCategory,       // Create new category
    updateCategory,       // Update existing category
    deleteCategory,       // Delete category
    getCategoryFields,    // Get category fields
    addCategoryField,     // Add field to category
    updateCategoryField,  // Update category field
    deleteCategoryField   // Delete category field
  } = useProductCategories()
}
```

## CRUD Operations Examples

### 1. Fetching Products

```typescript
// Basic fetch
useEffect(() => {
  fetchProducts()
}, [fetchProducts])

// Fetch with filters
const handleFilter = async () => {
  await fetchProducts({
    categoryId: 'loan-category-id',
    isActive: true,
    search: 'business loan',
    page: 1,
    limit: 20,
    sort: 'createdAt',
    order: 'desc'
  })
}

// Get single product
const loadProduct = async (productId: string) => {
  try {
    const product = await getProduct(productId)
    console.log('Product:', product)
  } catch (error) {
    console.error('Failed to load product:', error)
  }
}
```

### 2. Creating Products

```typescript
const handleCreateProduct = async () => {
  const newProductData: Product = {
    name: 'Business Loan Premium',
    institutionId: 'bank-123',
    categoryId: 'loan-category-id',
    details: {
      interestRate: 5.5,
      minAmount: 10000,
      maxAmount: 500000,
      termMonths: 60,
      description: 'Premium business loan for established businesses'
    },
    isFeatured: true,
    isActive: true
  }

  try {
    const createdProduct = await createProduct(newProductData)
    console.log('Product created:', createdProduct)
    // Redirect or update UI
    navigate(`/products/${createdProduct.id}`)
  } catch (error) {
    console.error('Failed to create product:', error)
  }
}
```

### 3. Updating Products

```typescript
const handleUpdateProduct = async (productId: string) => {
  const updatedData: Product = {
    name: 'Updated Product Name',
    institutionId: 'bank-123',
    categoryId: 'loan-category-id',
    details: {
      interestRate: 4.8, // Updated rate
      minAmount: 5000,   // Updated minimum
      maxAmount: 1000000,
      termMonths: 72
    },
    isFeatured: false,
    isActive: true
  }

  try {
    const updatedProduct = await updateProduct(productId, updatedData)
    console.log('Product updated:', updatedProduct)
  } catch (error) {
    console.error('Failed to update product:', error)
  }
}
```

### 4. Deleting Products

```typescript
const handleDeleteProduct = async (productId: string, productName: string) => {
  // Show confirmation modal
  modals.openConfirmModal({
    title: 'Delete Product',
    children: `Are you sure you want to delete "${productName}"? This action cannot be undone.`,
    labels: { confirm: 'Delete', cancel: 'Cancel' },
    confirmProps: { color: 'red' },
    onConfirm: async () => {
      try {
        await deleteProduct(productId)
        console.log('Product deleted successfully')
        // Refresh the list or redirect
      } catch (error) {
        console.error('Failed to delete product:', error)
      }
    }
  })
}
```

### 5. Working with Categories

```typescript
// Fetch all categories
useEffect(() => {
  fetchCategories()
}, [fetchCategories])

// Get category hierarchy (useful for dropdown menus)
const loadCategoryHierarchy = async () => {
  try {
    const hierarchy = await getCategoryHierarchy()
    console.log('Category hierarchy:', hierarchy)
  } catch (error) {
    console.error('Failed to load categories:', error)
  }
}

// Create a new category
const handleCreateCategory = async () => {
  const newCategory: ProductCategory = {
    name: 'Personal Loans',
    description: 'Personal loan products',
    parentId: null, // Root category
    level: 1
  }

  try {
    const createdCategory = await createCategory(newCategory)
    console.log('Category created:', createdCategory)
  } catch (error) {
    console.error('Failed to create category:', error)
  }
}
```

### 6. Save/Unsave Products (User Favorites)

```typescript
const handleToggleSave = async (productId: string) => {
  try {
    const isSaved = await toggleSaveProduct(productId)
    console.log(`Product ${isSaved ? 'saved' : 'unsaved'}`)
  } catch (error) {
    console.error('Failed to toggle save:', error)
  }
}

// Get user's saved products
const loadSavedProducts = async () => {
  try {
    const savedProducts = await getSavedProducts(1, 20)
    console.log('Saved products:', savedProducts)
  } catch (error) {
    console.error('Failed to load saved products:', error)
  }
}
```

### 7. Advanced Filtering and Search

```typescript
const ProductsListWithAdvancedFilters = () => {
  const { products, loading, fetchProducts } = useProducts()
  const [filters, setFilters] = useState({
    search: '',
    categoryId: '',
    isActive: undefined as boolean | undefined,
    isFeatured: undefined as boolean | undefined,
    page: 1,
    limit: 20
  })

  // Fetch products when filters change
  useEffect(() => {
    fetchProducts(filters)
  }, [filters, fetchProducts])

  const handleFilterChange = (key: string, value: any) => {
    setFilters(prev => ({
      ...prev,
      [key]: value,
      page: 1 // Reset page when filters change
    }))
  }

  const handlePageChange = (page: number) => {
    setFilters(prev => ({ ...prev, page }))
  }

  return (
    <Stack>
      {/* Filter Controls */}
      <Group>
        <TextInput
          placeholder="Search products..."
          value={filters.search}
          onChange={(e) => handleFilterChange('search', e.target.value)}
        />
        <Select
          placeholder="Category"
          data={categoryOptions}
          value={filters.categoryId}
          onChange={(value) => handleFilterChange('categoryId', value)}
        />
        <Select
          placeholder="Status"
          data={[
            { label: 'Active', value: 'true' },
            { label: 'Inactive', value: 'false' },
            { label: 'All', value: '' }
          ]}
          value={filters.isActive?.toString() || ''}
          onChange={(value) => handleFilterChange('isActive', 
            value === '' ? undefined : value === 'true'
          )}
        />
      </Group>

      {/* Results */}
      {loading ? (
        <LoadingOverlay visible />
      ) : (
        <DataTable
          data={products}
          columns={columns}
          onPageChange={handlePageChange}
        />
      )}
    </Stack>
  )
}
```

## Error Handling

The hooks automatically handle errors and show notifications, but you can also handle them manually:

```typescript
try {
  await createProduct(productData)
  // Success - notification shown automatically
} catch (error: any) {
  // Additional error handling if needed
  console.error('Product creation failed:', error)
  
  // Access error details
  if (error.body?.message) {
    console.log('Server error:', error.body.message)
  }
  
  // Custom error handling based on status
  if (error.status === 403) {
    console.log('Insufficient permissions')
  }
}
```

## API Configuration

Make sure to configure the OpenAPI base URL in your application:

```typescript
// In your app initialization
import { OpenAPI } from '../types/products'

OpenAPI.BASE = 'https://your-api-domain.com/api'
OpenAPI.TOKEN = async () => {
  // Return your auth token
  return localStorage.getItem('authToken') || ''
}
```

## Component Integration Examples

### Product List Component

```typescript
const ProductsList = () => {
  const { products, loading, error, fetchProducts, deleteProduct } = useProducts()

  useEffect(() => {
    fetchProducts()
  }, [fetchProducts])

  return (
    <Stack pos="relative">
      <LoadingOverlay visible={loading} />
      
      {error && (
        <Alert color="red">
          {error}
        </Alert>
      )}

      <DataTable
        data={products}
        columns={[
          { key: 'name', label: 'Name' },
          { key: 'categoryId', label: 'Category' },
          { key: 'institutionId', label: 'Institution' },
          {
            key: 'isActive',
            label: 'Status',
            render: (value) => (
              <Badge color={value ? 'green' : 'red'}>
                {value ? 'Active' : 'Inactive'}
              </Badge>
            )
          }
        ]}
        actions={{
          edit: (product) => navigate(`/products/${product.id}/edit`),
          delete: (product) => deleteProduct(product.id!)
        }}
      />
    </Stack>
  )
}
```

This guide provides a comprehensive overview of how to use the ProductsService for all CRUD operations in your React application. The service handles all the API communication, while the custom hooks provide a convenient React interface with automatic state management and error handling.