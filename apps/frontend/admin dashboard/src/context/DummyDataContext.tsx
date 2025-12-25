import { createContext, useContext, useState, type ReactNode } from 'react'
import type { Organization, User, Product, LogItem } from '../types'
import { dummyOrganizations } from '../dummy/orgs'
import { dummyUsers } from '../dummy/users'
import { dummyProducts } from '../dummy/products'
import { recentActivityLogs } from '../dummy/charts'

interface DummyDataContextType {
    // Organizations
    organizations: Organization[]
    addOrganization: (org: Omit<Organization, 'id' | 'createdAt' | 'updatedAt'>) => void
    updateOrganization: (id: string, updates: Partial<Organization>) => void
    deleteOrganization: (id: string) => void

    // Users
    users: User[]
    addUser: (user: Omit<User, 'id' | 'createdAt'>) => void
    updateUser: (id: string, updates: Partial<User>) => void
    deleteUser: (id: string) => void

    // Products
    products: Product[]
    addProduct: (product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => void
    updateProduct: (id: string, updates: Partial<Product>) => void
    deleteProduct: (id: string) => void

    // Activity Logs
    activityLogs: LogItem[]
    addActivityLog: (log: Omit<LogItem, 'id' | 'timestamp'>) => void

    // Filter and search
    searchOrganizations: (query: string) => Organization[]
    searchUsers: (query: string) => User[]
    searchProducts: (query: string) => Product[]
}

const DummyDataContext = createContext<DummyDataContextType | undefined>(undefined)

export const useDummyData = () => {
    const context = useContext(DummyDataContext)
    if (context === undefined) {
        throw new Error('useDummyData must be used within a DummyDataProvider')
    }
    return context
}

interface DummyDataProviderProps {
    children: ReactNode
}

export const DummyDataProvider = ({ children }: DummyDataProviderProps) => {
    const [organizations, setOrganizations] = useState<Organization[]>(dummyOrganizations)
    const [users, setUsers] = useState<User[]>(dummyUsers)
    const [products, setProducts] = useState<Product[]>(dummyProducts)
    const [activityLogs, setActivityLogs] = useState<LogItem[]>(recentActivityLogs)

    const generateId = (prefix: string): string => {
        return `${prefix}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    }

    // Organization functions
    const addOrganization = (orgData: Omit<Organization, 'id' | 'createdAt' | 'updatedAt'>) => {
        const newOrg: Organization = {
            ...orgData,
            id: generateId('org'),
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        }
        setOrganizations(prev => [newOrg, ...prev])
        addActivityLog({
            action: 'New organization created',
            user: 'Admin',
            details: `${newOrg.name} has been created`,
            type: 'success'
        })
    }

    const updateOrganization = (id: string, updates: Partial<Organization>) => {
        setOrganizations(prev => prev.map(org =>
            org.id === id ? { ...org, ...updates, updatedAt: new Date().toISOString() } : org
        ))
        addActivityLog({
            action: 'Organization updated',
            user: 'Admin',
            details: `Organization ${id} has been updated`,
            type: 'info'
        })
    }

    const deleteOrganization = (id: string) => {
        const org = organizations.find(o => o.id === id)
        setOrganizations(prev => prev.filter(org => org.id !== id))
        addActivityLog({
            action: 'Organization deleted',
            user: 'Admin',
            details: `${org?.name} has been deleted`,
            type: 'warning'
        })
    }

    // User functions
    const addUser = (userData: Omit<User, 'id' | 'createdAt'>) => {
        const newUser: User = {
            ...userData,
            id: generateId('user'),
            createdAt: new Date().toISOString()
        }
        setUsers(prev => [newUser, ...prev])
        addActivityLog({
            action: 'New user created',
            user: 'Admin',
            details: `${newUser.firstName} ${newUser.lastName} has been added`,
            type: 'success'
        })
    }

    const updateUser = (id: string, updates: Partial<User>) => {
        setUsers(prev => prev.map(user =>
            user.id === id ? { ...user, ...updates } : user
        ))
        addActivityLog({
            action: 'User updated',
            user: 'Admin',
            details: `User ${id} has been updated`,
            type: 'info'
        })
    }

    const deleteUser = (id: string) => {
        const user = users.find(u => u.id === id)
        setUsers(prev => prev.filter(user => user.id !== id))
        addActivityLog({
            action: 'User deleted',
            user: 'Admin',
            details: `${user?.firstName} ${user?.lastName} has been removed`,
            type: 'warning'
        })
    }

    // Product functions
    const addProduct = (productData: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => {
        const newProduct: Product = {
            ...productData,
            id: generateId('prod'),
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        }
        setProducts(prev => [newProduct, ...prev])
        addActivityLog({
            action: 'New product created',
            user: 'Admin',
            details: `${newProduct.name} has been created`,
            type: 'success'
        })
    }

    const updateProduct = (id: string, updates: Partial<Product>) => {
        setProducts(prev => prev.map(product =>
            product.id === id ? { ...product, ...updates, updatedAt: new Date().toISOString() } : product
        ))
        addActivityLog({
            action: 'Product updated',
            user: 'Admin',
            details: `Product ${id} has been updated`,
            type: 'info'
        })
    }

    const deleteProduct = (id: string) => {
        const product = products.find(p => p.id === id)
        setProducts(prev => prev.filter(product => product.id !== id))
        addActivityLog({
            action: 'Product deleted',
            user: 'Admin',
            details: `${product?.name} has been deleted`,
            type: 'warning'
        })
    }

    // Activity log functions
    const addActivityLog = (logData: Omit<LogItem, 'id' | 'timestamp'>) => {
        const newLog: LogItem = {
            ...logData,
            id: generateId('log'),
            timestamp: new Date().toISOString()
        }
        setActivityLogs(prev => [newLog, ...prev.slice(0, 49)]) // Keep only last 50 logs
    }

    // Search functions
    const searchOrganizations = (query: string): Organization[] => {
        if (!query.trim()) return organizations
        const lowercaseQuery = query.toLowerCase()
        return organizations.filter(org =>
            org.name.toLowerCase().includes(lowercaseQuery) ||
            org.type.toLowerCase().includes(lowercaseQuery) ||
            org.email.toLowerCase().includes(lowercaseQuery)
        )
    }

    const searchUsers = (query: string): User[] => {
        if (!query.trim()) return users
        const lowercaseQuery = query.toLowerCase()
        return users.filter(user =>
            user.firstName.toLowerCase().includes(lowercaseQuery) ||
            user.lastName.toLowerCase().includes(lowercaseQuery) ||
            user.email.toLowerCase().includes(lowercaseQuery) ||
            user.role.toLowerCase().includes(lowercaseQuery) ||
            user.organizationName?.toLowerCase().includes(lowercaseQuery)
        )
    }

    const searchProducts = (query: string): Product[] => {
        if (!query.trim()) return products
        const lowercaseQuery = query.toLowerCase()
        return products.filter(product =>
            product.name.toLowerCase().includes(lowercaseQuery) ||
            product.type.toLowerCase().includes(lowercaseQuery) ||
            product.category.toLowerCase().includes(lowercaseQuery) ||
            product.organizationName.toLowerCase().includes(lowercaseQuery)
        )
    }

    const value = {
        organizations,
        addOrganization,
        updateOrganization,
        deleteOrganization,
        users,
        addUser,
        updateUser,
        deleteUser,
        products,
        addProduct,
        updateProduct,
        deleteProduct,
        activityLogs,
        addActivityLog,
        searchOrganizations,
        searchUsers,
        searchProducts
    }

    return (
        <DummyDataContext.Provider value={value}>
            {children}
        </DummyDataContext.Provider>
    )
}