export const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
    }).format(amount)
}

export const formatNumber = (num: number): string => {
    return new Intl.NumberFormat('en-US').format(num)
}

export const formatPercent = (num: number): string => {
    return new Intl.NumberFormat('en-US', {
        style: 'percent',
        minimumFractionDigits: 1,
        maximumFractionDigits: 1
    }).format(num / 100)
}

export const formatDate = (date: string | Date): string => {
    const d = new Date(date)
    return d.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    })
}

export const formatDateTime = (date: string | Date): string => {
    const d = new Date(date)
    return d.toLocaleString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    })
}

export const getStatusColor = (status: string): string => {
    switch (status.toLowerCase()) {
        case 'active':
            return 'green'
        case 'inactive':
            return 'gray'
        case 'pending':
            return 'yellow'
        case 'suspended':
            return 'red'
        case 'draft':
            return 'blue'
        default:
            return 'gray'
    }
}

export const generateId = (prefix: string): string => {
    return `${prefix}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
}

export const truncateText = (text: string, maxLength: number): string => {
    if (text.length <= maxLength) return text
    return text.substring(0, maxLength) + '...'
}

export const capitalizeFirst = (str: string): string => {
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase()
}