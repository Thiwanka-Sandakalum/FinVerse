# Enhanced User Management Service

A comprehensive Node.js/Express backend service for managing users with Auth0 integration, JWT verification, and automatic organization/role management.

## 🚀 Features

- **JWT Token Verification**: Secure authentication using Auth0 JWTs
- **Automatic Organization Creation**: Creates organizations for company users on first login
- **Role Management**: Automatically assigns roles (org_admin/member) based on user type
- **Enhanced User Listing**: Includes organization information in user queries
- **Comprehensive Error Handling**: Detailed logging and error responses
- **TypeScript Support**: Full type safety and IntelliSense support
- **Auth0 Management API Integration**: Complete user and organization management

## 📋 API Endpoints

### Core Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/users/login-callback` | Handle user authentication workflow |
| `GET` | `/users` | List users with organization info |
| `GET` | `/users/:id` | Get user by ID |
| `PUT` | `/users/:id` | Update user metadata |
| `DELETE` | `/users/:id` | Delete user |

### Organization Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/orgs` | List organizations |
| `POST` | `/orgs` | Create organization |
| `GET` | `/orgs/:id` | Get organization by ID |
| `PUT` | `/orgs/:id` | Update organization |
| `DELETE` | `/orgs/:id` | Delete organization |

## 🛠 Setup & Installation

1. **Clone and Install Dependencies**
   ```bash
   cd apps/backend/usermng-service
   npm install
   ```

2. **Environment Configuration**
   ```bash
   cp .env.example .env
   # Edit .env with your Auth0 credentials
   ```

3. **Required Environment Variables**
   ```bash
   AUTH0_DOMAIN=https://your-tenant.auth0.com
   AUTH0_CLIENT_ID=your-management-api-client-id
   AUTH0_CLIENT_SECRET=your-management-api-client-secret
   AUTH0_AUDIENCE=https://your-tenant.auth0.com/api/v2/
   AUTH0_API_AUDIENCE=https://your-api-identifier
   PORT=3000
   ```

4. **Build and Start**
   ```bash
   npm run build
   npm start
   # Or for development
   npm run dev
   ```

## 🔐 Auth0 Setup

### 1. Management API Application (M2M)
Create a Machine-to-Machine application with scopes:
- `read:users`, `update:users`, `create:users`, `delete:users`
- `read:organizations`, `create:organizations`, `update:organizations`

### 2. API Configuration
Create an API in Auth0 for JWT verification with:
- Identifier: Used as `AUTH0_API_AUDIENCE`
- Algorithm: RS256

### 3. User Metadata Structure
```json
{
  "user_metadata": {
    "isCompany": true/false,
    "companyName": "Company Name"
  },
  "app_metadata": {
    "org_id": "org_123456789",
    "role": "org_admin" | "member"
  }
}
```

## 🔄 Login Workflow

1. Frontend sends JWT token to `/users/login-callback`
2. Backend verifies token with Auth0
3. Fetches user profile from Auth0 Management API
4. **If company user without organization:**
   - Creates new organization
   - Assigns user as org_admin
5. **If individual user without role:**
   - Assigns member role
6. Returns enhanced user data with organization info

## 📊 Usage Example

### Login Callback
```javascript
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
  console.log('User:', result.user);
  console.log('Organization:', result.user.organization);
}
```

### List Users with Organizations
```javascript
const users = await fetch('/users?per_page=10');
const data = await users.json();
console.log(data.users); // Enhanced with organization info
```

## 🧪 Testing

```bash
# Run TypeScript compilation check
npm run build

# Test API endpoints
npm run test-api

# Run unit tests (if configured)
npm test
```

## 📁 Project Structure

```
src/
├── modules/
│   ├── users/          # User management
│   ├── organizations/  # Organization management
│   ├── members/        # Member management
│   ├── invitations/    # Invitation system
│   └── roles/          # Role management
├── utils/
│   ├── auth0.ts        # Auth0 Management API
│   ├── jwt.ts          # JWT verification
│   └── errors.ts       # Error handling
├── middleware/
│   ├── auth.ts         # JWT middleware
│   └── errorHandler.ts # Global error handler
├── types/              # Type definitions
└── config/             # Configuration files
```

## 📚 Documentation

- **[Enhanced API Guide](./ENHANCED_API_GUIDE.md)** - Comprehensive API documentation
- **[Frontend Integration Example](./examples/frontend-integration.tsx)** - React integration example
- **[Test Script](./test-api.js)** - API testing utility

## 🔧 Development

### Available Scripts
- `npm run dev` - Start development server with auto-reload
- `npm run build` - Build TypeScript to JavaScript
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run test-api` - Test API endpoints

### Code Quality
- TypeScript for type safety
- ESLint for code quality
- Comprehensive error handling
- Detailed logging with timestamps

## 🚀 Deployment

1. Build the project: `npm run build`
2. Set production environment variables
3. Start with process manager: `pm2 start dist/server.js`
4. Configure reverse proxy (nginx/Apache)
5. Set up SSL certificates

## 🤝 Contributing

1. Fork the repository
2. Create feature branch: `git checkout -b feature/enhancement`
3. Commit changes: `git commit -m 'Add enhancement'`
4. Push to branch: `git push origin feature/enhancement`
5. Submit pull request

## 📄 License

This project is licensed under the ISC License.

## 🆘 Support

For issues and questions:
1. Check the [Enhanced API Guide](./ENHANCED_API_GUIDE.md)
2. Review server logs for error details
3. Verify Auth0 configuration
4. Test with the provided test script