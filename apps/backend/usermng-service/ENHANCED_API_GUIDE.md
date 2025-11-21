# Enhanced User Management API with Auth0 Integration

This document describes the enhanced User Management API that handles Auth0 integration, JWT verification, and automatic organization/role management for user sign-ins.

## Features

- JWT token verification using Auth0
- Automatic organization creation for company users
- Role assignment for users
- Enhanced user listing with organization information
- Comprehensive error handling and logging
- TypeScript support with full type definitions

## API Endpoints

### 1. User Login Callback - `/users/login-callback`

**Method:** `POST`

**Description:** Handles the authentication workflow when a user logs in through Auth0.

**Request Body:**
```json
{
  "token": "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Alternative:** You can also send the token in the Authorization header:
```
Authorization: Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Workflow:**
1. Verifies the JWT token
2. Fetches user profile from Auth0
3. If `user_metadata.isCompany` is true and no `org_id` exists:
   - Creates a new organization
   - Assigns user as org admin
4. If `user_metadata.isCompany` is false and no role exists:
   - Assigns 'member' role
5. Returns enhanced user data with organization information

**Response:**
```json
{
  "success": true,
  "message": "User login successful. Organization created and user assigned as admin.",
  "user": {
    "user_id": "auth0|...",
    "email": "user@company.com",
    "name": "John Doe",
    "app_metadata": {
      "org_id": "org_123456789",
      "role": "org_admin"
    },
    "user_metadata": {
      "isCompany": true,
      "companyName": "Acme Corp"
    },
    "organization": {
      "id": "org_123456789",
      "name": "acme-corp-123456",
      "display_name": "Acme Corp"
    }
  }
}
```

### 2. List Users - `/users`

**Method:** `GET`

**Description:** Lists all users with enhanced organization information.

**Query Parameters:**
- `page`: Page number (default: 0)
- `per_page`: Items per page (default: 25)
- `include_totals`: Include total count (default: true)
- `sort`: Sort field and order
- `q`: Search query
- `fields`: Specific fields to include
- `include_fields`: Whether to include or exclude fields

**Response:**
```json
{
  "pagination": {
    "page": 0,
    "limit": 25,
    "total": 100
  },
  "users": [
    {
      "user_id": "auth0|...",
      "email": "user@company.com",
      "name": "John Doe",
      "app_metadata": {
        "org_id": "org_123456789",
        "role": "org_admin"
      },
      "organization": {
        "id": "org_123456789",
        "name": "acme-corp-123456",
        "display_name": "Acme Corp"
      }
    }
  ]
}
```

### 3. Get User by ID - `/users/:id`

**Method:** `GET`

**Description:** Retrieves a specific user by ID with organization information.

### 4. Update User - `/users/:id`

**Method:** `PUT`

**Description:** Updates user metadata (name, user_metadata, picture).

### 5. Delete User - `/users/:id`

**Method:** `DELETE`

**Description:** Deletes a user from Auth0.

## Environment Variables

Create a `.env` file based on `.env.example`:

```bash
# Auth0 domain
AUTH0_DOMAIN=https://your-tenant.auth0.com

# Auth0 Management API credentials (M2M application)
AUTH0_CLIENT_ID=your-management-api-client-id
AUTH0_CLIENT_SECRET=your-management-api-client-secret
AUTH0_AUDIENCE=https://your-tenant.auth0.com/api/v2/

# Your API's audience for JWT verification
AUTH0_API_AUDIENCE=https://your-api-identifier

# Server configuration
PORT=3000
NODE_ENV=development
```

## Auth0 Setup Requirements

### 1. Management API Application (Machine-to-Machine)

Create an M2M application in Auth0 with the following scopes:
- `read:users`
- `update:users`
- `create:users`
- `delete:users`
- `read:organizations`
- `create:organizations`
- `update:organizations`
- `delete:organizations`

### 2. API Configuration

1. Create an API in Auth0 for your backend
2. Set the API identifier (used as `AUTH0_API_AUDIENCE`)
3. Configure signing algorithm as RS256

### 3. User Metadata Structure

Ensure your Auth0 users have the following metadata structure:

**user_metadata:**
```json
{
  "isCompany": true|false,
  "companyName": "Company Name",
  "firstName": "First Name",
  "lastName": "Last Name"
}
```

**app_metadata (managed by the API):**
```json
{
  "org_id": "org_123456789",
  "role": "org_admin"|"member",
  "permissions": ["read:data", "write:data"]
}
```

## Organization Connections Configuration

Create a file at `src/config/organizationConnections.json` to define enabled connections for new organizations:

```json
[
  {
    "connection_id": "con_...",
    "assign_membership_on_login": true
  }
]
```

## Usage Example

### Frontend Integration

```typescript
// After Auth0 authentication
const handleAuth0Callback = async (accessToken: string) => {
  try {
    const response = await fetch('/users/login-callback', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`
      },
      body: JSON.stringify({ token: accessToken })
    });

    const result = await response.json();
    
    if (result.success) {
      console.log('User login successful:', result.user);
      // Store user data and redirect to dashboard
      localStorage.setItem('user', JSON.stringify(result.user));
      window.location.href = '/dashboard';
    } else {
      console.error('Login failed:', result.message);
    }
  } catch (error) {
    console.error('Login callback failed:', error);
  }
};
```

### Protecting Routes (Optional)

```typescript
import { authenticateToken } from './middleware/auth';

// Protect specific routes
router.get('/protected-route', authenticateToken, (req, res) => {
  res.json({ user: req.user });
});
```

## Error Handling

The API includes comprehensive error handling:

- JWT verification errors
- Auth0 API errors
- Organization creation failures
- Network timeouts
- Invalid request data

All errors are logged with timestamps and context for debugging.

## Security Considerations

1. **JWT Verification**: All tokens are verified against Auth0's JWKS
2. **Secure Token Handling**: Tokens are never logged in production
3. **Rate Limiting**: Consider implementing rate limiting for production
4. **CORS**: Configure CORS appropriately for your frontend domains
5. **Environment Variables**: Never commit `.env` files to version control

## Development

1. Install dependencies: `npm install`
2. Copy `.env.example` to `.env` and configure
3. Start development server: `npm run dev`
4. Build for production: `npm run build`
5. Start production server: `npm start`

## Testing

The API can be tested using tools like Postman or curl:

```bash
# Test login callback
curl -X POST http://localhost:3000/users/login-callback \
  -H "Content-Type: application/json" \
  -d '{"token": "your-jwt-token"}'

# List users
curl -X GET http://localhost:3000/users?per_page=10
```