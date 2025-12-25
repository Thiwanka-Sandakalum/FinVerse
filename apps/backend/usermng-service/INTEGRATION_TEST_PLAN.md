# Integration Test Plan

## Overview
Integration tests verify that different components of the application work together correctly. Unlike unit tests that mock dependencies, integration tests use real HTTP requests and test the full request-response cycle.

## Strategy

### What We Test
1. **API Endpoints** - Full HTTP request/response cycle
2. **Middleware Chain** - Auth, request ID, error handling
3. **Request/Response Formatting** - Envelope structure, status codes
4. **Error Handling** - Validation errors, Auth0 errors, 404s
5. **Route Parameters** - Path params, query params, body parsing

### What We Mock
1. **Auth0 API Calls** - Mock the Auth0 Management API client
2. **JWT Verification** - Mock token decoding middleware
3. **External Services** - Any third-party APIs

### Test Environment
- **Framework**: Jest + Supertest
- **Approach**: API-level testing with mocked Auth0
- **Coverage Target**: 70%+ for critical API flows

## Test Structure

### Phase 1: Organization API (Priority: P0)
**Time Estimate**: 4-5 hours

#### Test Cases
1. **POST /orgs** - Create Organization
   - ✅ Success: Returns 201 with organization data
   - ✅ Validation Error: Returns 400 for invalid data
   - ✅ Auth0 Error: Returns 500 with proper error envelope
   - ✅ Request ID: Includes X-Request-ID in response

2. **GET /orgs** - List Organizations
   - ✅ Success: Returns 200 with paginated list
   - ✅ Empty List: Returns 200 with empty array
   - ✅ Pagination: Query params (page, per_page, q)

3. **GET /orgs/:id** - Get Organization by ID
   - ✅ Success: Returns 200 with organization data
   - ✅ Not Found: Returns 404 with error envelope
   - ✅ Invalid ID: Returns appropriate error

4. **PUT /orgs/:id** - Update Organization
   - ✅ Success: Returns 200 with updated data
   - ✅ Validation Error: Returns 400
   - ✅ Not Found: Returns 404

5. **DELETE /orgs/:id** - Delete Organization
   - ✅ Success: Returns 204 (no content)
   - ✅ Not Found: Returns 404

### Phase 2: User API (Priority: P0)
**Time Estimate**: 3-4 hours

#### Test Cases
1. **GET /users** - List Users
   - ✅ Success: Returns 200 with paginated users
   - ✅ Filtering: Query params (q, connection)
   - ✅ Pagination works correctly

2. **GET /users/:id** - Get User by ID
   - ✅ Success: Returns 200 with user data
   - ✅ Not Found: Returns 404
   - ✅ Fields param: Filters returned fields

3. **PUT /users/:id** - Update User
   - ✅ Success: Returns 200 with updated user
   - ✅ Validation Error: Returns 400
   - ✅ Prevents metadata changes

4. **DELETE /users/:id** - Delete User
   - ✅ Success: Returns 204
   - ✅ Not Found: Returns 404

### Phase 3: Member & Invitation API (Priority: P1)
**Time Estimate**: 4-5 hours

#### Member Routes
1. **GET /orgs/:orgId/members** - Get Organization Members
   - ✅ Success: Returns 200 with members list
   - ✅ Invalid org ID: Returns 404

2. **DELETE /orgs/:orgId/members** - Remove Members
   - ✅ Success: Returns 204
   - ✅ Validation Error: Returns 400 (missing user_ids)

3. **GET /orgs/:orgId/members/:userId/roles** - Get Member Roles
   - ✅ Success: Returns 200 with roles array

4. **POST /orgs/:orgId/members/:userId/roles** - Assign Roles
   - ✅ Success: Returns 200
   - ✅ Validation Error: Returns 400

#### Invitation Routes
1. **POST /orgs/:orgId/invitations** - Create Invitation
   - ✅ Success: Returns 201 with invitation
   - ✅ Role Mapping: member → org_member, org_admin → org_admin
   - ✅ Validation Error: Returns 400
   - ✅ Invalid Role: Returns 400

### Phase 4: Role API (Priority: P2)
**Time Estimate**: 2 hours

#### Test Cases
1. **GET /roles** - List Roles
   - ✅ Success: Returns 200 with roles
   - ✅ Filtering: name_filter param works
   - ✅ Empty results handled

### Phase 5: Middleware Integration (Priority: P1)
**Time Estimate**: 2-3 hours

#### Test Cases
1. **Request ID Middleware**
   - ✅ Generates X-Request-ID if not provided
   - ✅ Uses provided X-Request-ID from header
   - ✅ Includes in response headers

2. **Error Handler Middleware**
   - ✅ ValidationError → 400 with proper envelope
   - ✅ Auth0Error → 500 with error details
   - ✅ Generic Error → 500 with message
   - ✅ 404 Not Found handling

3. **Auth Middleware** (Mocked)
   - ✅ Mock valid JWT decode
   - ✅ Mock invalid token (401)
   - ✅ Attaches user info to request

## Test Utilities

### Setup Files
1. **testServer.ts** - Express app instance for testing
2. **mockAuth0.ts** - Mock Auth0 Management API
3. **testHelpers.ts** - Common test utilities

### Helper Functions
- `mockAuth0Client()` - Returns mocked Auth0 client
- `mockValidToken()` - Mocks JWT middleware for valid user
- `mockInvalidToken()` - Mocks JWT middleware for invalid token
- `expectSuccessResponse()` - Assert success envelope structure
- `expectErrorResponse()` - Assert error envelope structure

## Coverage Goals

| Component | Target Coverage |
|-----------|----------------|
| Routes | 80%+ |
| Controllers | 75%+ |
| Middleware | 85%+ |
| Error Handler | 90%+ |
| Overall | 70%+ |

## Dependencies to Install

```bash
npm install --save-dev supertest @types/supertest
```

## Running Tests

```bash
# Run all integration tests
npm run test:integration

# Run with coverage
npm run test:integration -- --coverage

# Run specific test file
npm run test:integration -- organization.api.test.ts

# Watch mode
npm run test:integration -- --watch
```

## Success Metrics

- ✅ All critical API endpoints tested
- ✅ Request/response envelope validated
- ✅ Error handling verified for all routes
- ✅ Middleware integration confirmed
- ✅ 70%+ coverage achieved
- ✅ Tests run in under 30 seconds
- ✅ No flaky tests (100% deterministic)

## Implementation Order

1. **Setup** - Install dependencies, create test utilities
2. **Organization API** - Most critical, establishes pattern
3. **User API** - Second most critical
4. **Member/Invitation API** - Complex nested routes
5. **Role API** - Simple, quick wins
6. **Middleware Tests** - Cross-cutting concerns
7. **Documentation** - Summary and usage guide

## Notes

- Integration tests complement unit tests (not replace)
- Mock Auth0 API to avoid rate limits and test tenant dependency
- Test real HTTP layer (headers, status codes, body parsing)
- Verify envelope structure in all responses
- Test both success and error paths
- Keep tests fast (mock external calls)
- Ensure tests are isolated (no shared state)
