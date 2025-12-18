import { useState } from 'react'
import {
    Table,
    Card,
    Group,
    Text,
    TextInput,
    Select,
    Button,
    ActionIcon,
    Badge,
    Pagination,
    Stack,
    Flex
} from '@mantine/core'
import { IconSearch, IconEye, IconEdit, IconTrash } from '@tabler/icons-react'
import type { TableColumn, FilterOption } from '../../types'

interface DataTableProps<T> {
    data: T[]
    columns: TableColumn[]
    title?: string
    searchable?: boolean
    searchPlaceholder?: string
    filters?: {
        label: string
        key: string
        options: FilterOption[]
    }[]
    actions?: {
        view?: (item: T) => void
        edit?: (item: T) => void
        delete?: (item: T) => void
    }
    itemsPerPage?: number
    onRowClick?: (item: T) => void
}

const DataTable = <T extends Record<string, any>>({
    data,
    columns,
    title,
    searchable = true,
    searchPlaceholder = 'Search...',
    filters = [],
    actions,
    itemsPerPage = 10,
    onRowClick
}: DataTableProps<T>) => {
    const [searchQuery, setSearchQuery] = useState('')
    const [filterValues, setFilterValues] = useState<Record<string, string>>({})
    const [currentPage, setCurrentPage] = useState(1)
    const [sortColumn, setSortColumn] = useState<string | null>(null)
    const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc')

    // Filter and search data
    const filteredData = data.filter(item => {
        // Apply search filter
        if (searchQuery && searchable) {
            const searchLower = searchQuery.toLowerCase()
            const matchesSearch = columns.some(column => {
                const value = item[column.key]
                return value?.toString().toLowerCase().includes(searchLower)
            })
            if (!matchesSearch) return false
        }

        // Apply filter values
        for (const filter of filters) {
            const filterValue = filterValues[filter.key]
            if (filterValue && item[filter.key] !== filterValue) {
                return false
            }
        }

        return true
    })

    // Sort data
    const sortedData = [...filteredData].sort((a, b) => {
        if (!sortColumn) return 0

        const aValue = a[sortColumn]
        const bValue = b[sortColumn]

        if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1
        if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1
        return 0
    })

    // Paginate data
    const startIndex = (currentPage - 1) * itemsPerPage
    const paginatedData = sortedData.slice(startIndex, startIndex + itemsPerPage)
    const totalPages = Math.ceil(sortedData.length / itemsPerPage)

    const handleSort = (columnKey: string) => {
        if (sortColumn === columnKey) {
            setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc')
        } else {
            setSortColumn(columnKey)
            setSortDirection('asc')
        }
    }

    const renderCellContent = (column: TableColumn, item: T) => {
        const value = item[column.key]

        if (column.render) {
            return column.render(value, item)
        }

        return value?.toString() || '-'
    }

    return (
        <Card shadow="sm" padding="lg" radius="md" withBorder>
            {(title || searchable || filters.length > 0) && (
                <Stack gap="md" mb="lg">
                    {title && (
                        <Text size="lg" fw={600}>
                            {title}
                        </Text>
                    )}

                    <Flex gap="md" wrap="wrap" align="end">
                        {searchable && (
                            <TextInput
                                placeholder={searchPlaceholder}
                                leftSection={<IconSearch size={16} />}
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.currentTarget.value)}
                                style={{ flex: 1, minWidth: '200px' }}
                            />
                        )}

                        {filters.map(filter => (
                            <Select
                                key={filter.key}
                                label={filter.label}
                                placeholder={`All ${filter.label}`}
                                data={filter.options}
                                value={filterValues[filter.key] || null}
                                onChange={(value) => setFilterValues(prev => ({
                                    ...prev,
                                    [filter.key]: value || ''
                                }))}
                                clearable
                                style={{ minWidth: '150px' }}
                            />
                        ))}
                    </Flex>
                </Stack>
            )}

            <Table.ScrollContainer minWidth={800}>
                <Table striped highlightOnHover>
                    <Table.Thead>
                        <Table.Tr>
                            {columns.map(column => (
                                <Table.Th
                                    key={column.key}
                                    style={{
                                        cursor: column.sortable ? 'pointer' : 'default',
                                        width: column.width
                                    }}
                                    onClick={() => column.sortable && handleSort(column.key)}
                                >
                                    <Group gap="xs" justify="space-between">
                                        <Text fw={600}>{column.label}</Text>
                                        {column.sortable && sortColumn === column.key && (
                                            <Text size="xs" c="dimmed">
                                                {sortDirection === 'asc' ? '↑' : '↓'}
                                            </Text>
                                        )}
                                    </Group>
                                </Table.Th>
                            ))}
                            {actions && <Table.Th style={{ width: '120px' }}>Actions</Table.Th>}
                        </Table.Tr>
                    </Table.Thead>

                    <Table.Tbody>
                        {paginatedData.length === 0 ? (
                            <Table.Tr>
                                <Table.Td colSpan={columns.length + (actions ? 1 : 0)}>
                                    <Text ta="center" c="dimmed" py="xl">
                                        No data found
                                    </Text>
                                </Table.Td>
                            </Table.Tr>
                        ) : (
                            paginatedData.map((item, index) => (
                                <Table.Tr
                                    key={index}
                                    style={{
                                        cursor: onRowClick ? 'pointer' : 'default'
                                    }}
                                    onClick={() => onRowClick?.(item)}
                                >
                                    {columns.map(column => (
                                        <Table.Td key={column.key}>
                                            {renderCellContent(column, item)}
                                        </Table.Td>
                                    ))}

                                    {actions && (
                                        <Table.Td>
                                            <Group gap="xs">
                                                {actions.view && (
                                                    <ActionIcon
                                                        variant="subtle"
                                                        color="blue"
                                                        onClick={(e) => {
                                                            e.stopPropagation()
                                                            actions.view!(item)
                                                        }}
                                                    >
                                                        <IconEye size={16} />
                                                    </ActionIcon>
                                                )}
                                                {actions.edit && (
                                                    <ActionIcon
                                                        variant="subtle"
                                                        color="yellow"
                                                        onClick={(e) => {
                                                            e.stopPropagation()
                                                            actions.edit!(item)
                                                        }}
                                                    >
                                                        <IconEdit size={16} />
                                                    </ActionIcon>
                                                )}
                                                {actions.delete && (
                                                    <ActionIcon
                                                        variant="subtle"
                                                        color="red"
                                                        onClick={(e) => {
                                                            e.stopPropagation()
                                                            actions.delete!(item)
                                                        }}
                                                    >
                                                        <IconTrash size={16} />
                                                    </ActionIcon>
                                                )}
                                            </Group>
                                        </Table.Td>
                                    )}
                                </Table.Tr>
                            ))
                        )}
                    </Table.Tbody>
                </Table>
            </Table.ScrollContainer>

            {totalPages > 1 && (
                <Group justify="center" mt="lg">
                    <Pagination
                        value={currentPage}
                        onChange={setCurrentPage}
                        total={totalPages}
                        size="sm"
                    />
                </Group>
            )}

            <Group justify="space-between" mt="xs">
                <Text size="sm" c="dimmed">
                    Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, sortedData.length)} of {sortedData.length} entries
                </Text>
                {filteredData.length !== data.length && (
                    <Text size="sm" c="dimmed">
                        (filtered from {data.length} total entries)
                    </Text>
                )}
            </Group>
        </Card>
    )
}

export default DataTable