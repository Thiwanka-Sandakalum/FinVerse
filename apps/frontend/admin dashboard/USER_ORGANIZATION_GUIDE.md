# User & Organization Management Services Integration Guide

This guide shows you how to use the generated User, Organization, and Member services for complete user and organization management in your React admin dashboard.

## Services Overview

### User Management
- **List Users**: `UsersService.getUsers(filters)`
- **Get User**: `UsersService.getUsers1(userId)`
- **Update User**: `UsersService.putUsers(userId, userData)`
- **Deactivate User**: `UsersService.deleteUsers(userId)`

### Organization Management
- **Create Organization**: `OrganizationsService.postOrgs(orgData)`
- **List Organizations**: `OrganizationsService.getOrgs(page, limit, search)`
- **Get Organization**: `OrganizationsService.getOrgs1(orgId)`
- **Update Organization**: `OrganizationsService.putOrgs(orgId, updateData)`
- **Delete Organization**: `OrganizationsService.deleteOrgs(orgId)`

### Member Management
- **List Members**: `MembersService.getOrgsMembers(orgId, page, limit)`
- **Remove Members**: `MembersService.deleteOrgsMembers(memberIds)`
- **Get Member Roles**: `MembersService.getOrgsMembersRoles(orgId, userId)`
- **Assign Roles**: `MembersService.postOrgsMembersRoles(orgId, userId, roles)`

## Custom Hooks

### useUsers Hook

```typescript
import { useUsers } from '../hooks/useUsers'

const MyComponent = () => {
  const {
    users,              // Current users array
    loading,            // Loading state
    error,              // Error message
    pagination,         // Pagination info
    fetchUsers,         // Fetch users with filters
    getUser,            // Get single user
    updateUser,         // Update user
    deleteUser          // Deactivate user
  } = useUsers()

  // Usage examples below...
}
```

### useOrganizations Hook

```typescript
import { useOrganizations } from '../hooks/useOrganizations'

const MyComponent = () => {
  const {
    organizations,        // Current organizations array
    loading,              // Loading state
    error,                // Error message
    pagination,           // Pagination info
    fetchOrganizations,   // Fetch organizations
    getOrganization,      // Get single organization
    createOrganization,   // Create new organization
    updateOrganization,   // Update organization
    deleteOrganization    // Delete organization
  } = useOrganizations()
}
```

### useMembers Hook

```typescript
import { useMembers } from '../hooks/useMembers'

const MyComponent = () => {
  const {
    members,              // Current members array
    loading,              // Loading state
    error,                // Error message
    pagination,           // Pagination info
    memberRoles,          // Member roles array
    rolesLoading,         // Roles loading state
    fetchMembers,         // Fetch organization members
    removeMembers,        // Remove multiple members
    removeMember,         // Remove single member
    getMemberRoles,       // Get member's roles
    assignRolesToMember   // Assign roles to member
  } = useMembers()
}
```

## User Management Examples

### 1. Fetching Users

```typescript
// Basic fetch
useEffect(() => {
  fetchUsers()
}, [fetchUsers])

// Fetch with organization filter
const handleOrganizationFilter = async (organizationId: string) => {
  await fetchUsers({
    organizationId,
    page: 1,
    limit: 25
  })
}

// Get single user details
const loadUserDetails = async (userId: string) => {
  try {
    const user = await getUser(userId)
    console.log('User details:', user)
  } catch (error) {
    console.error('Failed to load user:', error)
  }
}
```

### 2. Updating Users

```typescript
const handleUpdateUser = async (userId: string) => {
  const updateData = {
    name: 'John Doe Updated',
    email: 'john.updated@example.com',
    picture: 'https://example.com/new-avatar.jpg',
    metadata: {
      role: 'Manager',
      department: 'Finance',
      phone: '+1234567890'
    }
  }

  try {
    const updatedUser = await updateUser(userId, updateData)
    console.log('User updated:', updatedUser)
  } catch (error) {
    console.error('Failed to update user:', error)
  }
}
```

### 3. Deactivating Users

```typescript
const handleDeactivateUser = async (userId: string, userName: string) => {
  modals.openConfirmModal({
    title: 'Deactivate User',
    children: `Are you sure you want to deactivate "${userName}"? They will lose access to the system.`,
    labels: { confirm: 'Deactivate', cancel: 'Cancel' },
    confirmProps: { color: 'red' },
    onConfirm: async () => {
      try {
        await deleteUser(userId)
        console.log('User deactivated successfully')
      } catch (error) {
        console.error('Failed to deactivate user:', error)
      }
    }
  })
}
```

## Organization Management Examples

### 1. Creating Organizations

```typescript
const handleCreateOrganization = async () => {
  const newOrgData = {
    name: 'New Financial Institution',
    display_name: 'NFI Bank',
    metadata: {
      description: 'A leading financial services provider',
      industryType: 'Bank' as const,
      registrationNumber: 'REG123456',
      country: 'United States',
      region: 'North America',
      headquartersAddress: '123 Main St, New York, NY 10001',
      contactEmail: 'info@nfibank.com',
      contactPhone: '+1-555-0123',
      website: 'https://www.nfibank.com',
      establishedYear: '2020',
      supportedProducts: ['SavingsAccount', 'CurrentAccount', 'PersonalLoan', 'CreditCard'],
      numberOfBranches: '25',
      numberOfEmployees: '500',
      logoUrl: 'https://www.nfibank.com/logo.png',
      swiftCode: 'NFIBUS33'
    }
  }

  try {
    const createdOrg = await createOrganization(newOrgData)
    console.log('Organization created:', createdOrg)
    navigate(`/organizations/${createdOrg.id}`)
  } catch (error) {
    console.error('Failed to create organization:', error)
  }
}
```

### 2. Fetching Organizations

```typescript
// Basic fetch
useEffect(() => {
  fetchOrganizations()
}, [fetchOrganizations])

// Fetch with search
const handleSearch = async (searchTerm: string) => {
  await fetchOrganizations({
    q: searchTerm,
    page: 1,
    limit: 25
  })
}

// Fetch with pagination
const handlePageChange = async (page: number) => {
  await fetchOrganizations({
    page,
    limit: 25
  })
}
```

### 3. Updating Organizations

```typescript
const handleUpdateOrganization = async (orgId: string) => {
  const updateData = {
    name: 'Updated Organization Name',
    metadata: {
      description: 'Updated description',
      contactEmail: 'newemail@organization.com',
      numberOfEmployees: '750',
      website: 'https://www.newwebsite.com'
    }
  }

  try {
    const updatedOrg = await updateOrganization(orgId, updateData)
    console.log('Organization updated:', updatedOrg)
  } catch (error) {
    console.error('Failed to update organization:', error)
  }
}
```

### 4. Deleting Organizations

```typescript
const handleDeleteOrganization = async (orgId: string, orgName: string) => {
  modals.openConfirmModal({
    title: 'Delete Organization',
    children: `Are you sure you want to delete "${orgName}"? This action cannot be undone and will remove all associated data.`,
    labels: { confirm: 'Delete', cancel: 'Cancel' },
    confirmProps: { color: 'red' },
    onConfirm: async () => {
      try {
        await deleteOrganization(orgId)
        console.log('Organization deleted successfully')
      } catch (error) {
        console.error('Failed to delete organization:', error)
      }
    }
  })
}
```

## Member Management Examples

### 1. Managing Organization Members

```typescript
const OrganizationMembersPage = ({ orgId }: { orgId: string }) => {
  const { members, loading, fetchMembers, removeMembers } = useMembers()

  useEffect(() => {
    fetchMembers({ orgId })
  }, [orgId, fetchMembers])

  const handleRemoveMembers = async (memberIds: string[]) => {
    modals.openConfirmModal({
      title: 'Remove Members',
      children: `Are you sure you want to remove ${memberIds.length} member(s) from this organization?`,
      labels: { confirm: 'Remove', cancel: 'Cancel' },
      confirmProps: { color: 'red' },
      onConfirm: () => removeMembers(memberIds)
    })
  }

  return (
    <Stack>
      <LoadingOverlay visible={loading} />
      
      <DataTable
        data={members}
        columns={[
          {
            key: 'user.name',
            label: 'Name',
            render: (_, member) => (
              <Group>
                <Avatar src={member.user.picture} size="sm">
                  {member.user.name?.charAt(0) || member.user.email.charAt(0)}
                </Avatar>
                <div>
                  <Text fw={600}>{member.user.name || 'Unnamed'}</Text>
                  <Text size="xs" c="dimmed">{member.user.email}</Text>
                </div>
              </Group>
            )
          },
          {
            key: 'role',
            label: 'Role',
            render: (value) => <Badge>{value}</Badge>
          },
          {
            key: 'status',
            label: 'Status',
            render: (value) => (
              <Badge color={value === 'active' ? 'green' : 'red'}>
                {value}
              </Badge>
            )
          },
          {
            key: 'joinedAt',
            label: 'Joined',
            render: (value) => value ? new Date(value).toLocaleDateString() : 'N/A'
          }
        ]}
        actions={{
          delete: (member) => handleRemoveMembers([member.userId])
        }}
      />
    </Stack>
  )
}
```

### 2. Managing Member Roles

```typescript
const MemberRoleManager = ({ orgId, userId }: { orgId: string, userId: string }) => {
  const { memberRoles, rolesLoading, getMemberRoles, assignRolesToMember } = useMembers()

  useEffect(() => {
    getMemberRoles(orgId, userId)
  }, [orgId, userId, getMemberRoles])

  const handleAssignRoles = async (roleIds: string[]) => {
    try {
      await assignRolesToMember(orgId, userId, roleIds)
      console.log('Roles assigned successfully')
    } catch (error) {
      console.error('Failed to assign roles:', error)
    }
  }

  return (
    <Stack>
      <Title order={4}>Member Roles</Title>
      
      {rolesLoading ? (
        <Loader />
      ) : (
        <Stack>
          {memberRoles.map(role => (
            <Group key={role.id}>
              <Badge>{role.name}</Badge>
              <Text size="sm">{role.description}</Text>
            </Group>
          ))}
          
          <Button onClick={() => {
            // Open role assignment modal
            // Implementation depends on available roles
          }}>
            Assign Roles
          </Button>
        </Stack>
      )}
    </Stack>
  )
}
```

## Advanced Filtering and Search

```typescript
const AdvancedUserManagement = () => {
  const { users, loading, fetchUsers } = useUsers()
  const { organizations, fetchOrganizations } = useOrganizations()
  
  const [filters, setFilters] = useState({
    organizationId: '',
    page: 1,
    limit: 25
  })

  useEffect(() => {
    fetchOrganizations()
  }, [fetchOrganizations])

  useEffect(() => {
    fetchUsers(filters)
  }, [filters, fetchUsers])

  const handleOrganizationFilter = (orgId: string | null) => {
    setFilters(prev => ({
      ...prev,
      organizationId: orgId || '',
      page: 1 // Reset page
    }))
  }

  const organizationOptions = organizations.map(org => ({
    label: org.name,
    value: org.id
  }))

  return (
    <Stack>
      <Group>
        <Select
          placeholder="Filter by organization"
          data={[
            { label: 'All Organizations', value: '' },
            ...organizationOptions
          ]}
          value={filters.organizationId}
          onChange={handleOrganizationFilter}
          clearable
        />
      </Group>

      <DataTable
        data={users}
        columns={userColumns}
        loading={loading}
      />
    </Stack>
  )
}
```

## API Configuration

Make sure to configure the OpenAPI base URL for user services:

```typescript
// In your app initialization
import { OpenAPI } from '../types/user'

OpenAPI.BASE = 'https://your-api-domain.com/api'
OpenAPI.TOKEN = async () => {
  // Return your auth token
  return localStorage.getItem('authToken') || ''
}
```

## Industry Types and Supported Products

The organization service supports these industry types:
- Bank, Insurance, Fintech, CreditUnion, InvestmentFirm
- PaymentProvider, Microfinance, LeasingCompany, FinanceCompany
- StockBroker, UnitTrust, PawnBroker, MoneyTransfer
- DevelopmentBank, CooperativeSociety, InsuranceBroker, Other

And these product types:
- SavingsAccount, CurrentAccount, FixedDeposit, PersonalLoan, HomeLoan
- Leasing, Microfinance, CreditCard, DebitCard, Insurance, LifeInsurance
- GeneralInsurance, Investment, StockTrading, UnitTrust, Remittance
- MobileBanking, InternetBanking, PaymentGateway, PawnBroking, Other

## Error Handling

All hooks automatically handle errors and show notifications. Common error scenarios:

- **403 Forbidden**: User doesn't have required permissions
- **404 Not Found**: Resource doesn't exist
- **400 Bad Request**: Invalid data submitted

Example of custom error handling:

```typescript
try {
  await updateUser(userId, userData)
} catch (error: any) {
  if (error.status === 403) {
    notifications.show({
      title: 'Access Denied',
      message: 'You do not have permission to update this user',
      color: 'red'
    })
  } else if (error.status === 404) {
    notifications.show({
      title: 'User Not Found',
      message: 'The user you are trying to update does not exist',
      color: 'red'
    })
  }
}
```

This guide provides a complete integration for user and organization management using your generated services. The hooks handle all the API communication while providing a convenient React interface with automatic state management and error handling.