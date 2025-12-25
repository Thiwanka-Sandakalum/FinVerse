# Unit Test Plan - User Management Service

## Testing Strategy

### Priority Levels
- **P0 (Critical)** - Must test, core business logic and security
- **P1 (High)** - Should test, important utilities and validations  
- **P2 (Medium)** - Nice to test, edge cases and helpers
- **P3 (Low)** - Optional, simple pass-through functions

---

## Test Coverage Plan

### 1. **Validations Layer** (P0 - Critical)

#### `organization.validation.ts` ✅
**Priority:** P0  
**Why:** Security-critical, prevents invalid data from reaching Auth0  
**Tests:**
- ✅ `validateOrgName()` - Test name normalization, length limits, regex validation
- ✅ `validateDisplayName()` - Test fallback logic, special characters
- ✅ `validateMetadata()` - Test allowed fields, type validation
- ✅ `validateOrganizationCreate()` - Integration of all validators
- ✅ `validateOrganizationUpdate()` - Partial update validation

**Coverage Target:** 95%+

#### `invitation.validation.ts` ✅
**Priority:** P0  
**Why:** Role mapping is critical for security, wrong role = security breach  
**Tests:**
- ✅ `validateInvitationCreate()` - Email validation, role mapping
- ✅ Role name to ID conversion (member, org_admin, super_admin)
- ✅ Invalid role names handling
- ✅ Empty roles array handling
- ✅ Client ID assignment

**Coverage Target:** 100%

#### `user.validation.ts` ✅
**Priority:** P1  
**Why:** Prevents unauthorized user data modification  
**Tests:**
- ✅ `validateUserUpdate()` - Allowed fields filtering
- ✅ Reject app_metadata, user_id changes
- ✅ Accept name, email, user_metadata changes

**Coverage Target:** 90%+

---

### 2. **Response Utilities** (P0 - Critical)

#### `utils/response.ts` ✅
**Priority:** P0  
**Why:** Every API response goes through these functions  
**Tests:**
- ✅ `successResponse()` - Envelope structure, status codes
- ✅ `createdResponse()` - 201 status, message format
- ✅ `updatedResponse()` - 200 status, data inclusion
- ✅ `deletedResponse()` - No data field, correct message
- ✅ `itemResponse()` - Single item structure
- ✅ `paginatedResponse()` - Pagination metadata calculation
- ✅ `errorResponse()` - Error envelope, details array
- ✅ `generateMeta()` - Request ID and timestamp inclusion

**Coverage Target:** 100%

---

### 3. **Middleware** (P0 - Critical)

#### `middlewares/requestId.ts` ✅
**Priority:** P0  
**Why:** Request tracing is critical for production debugging  
**Tests:**
- ✅ Generates unique request ID when header not present
- ✅ Uses existing X-Request-ID header if present
- ✅ Attaches ID to req.id
- ✅ Calls next() to continue middleware chain

**Coverage Target:** 100%

#### `middlewares/errorHandler.ts` ✅
**Priority:** P0  
**Why:** All errors go through this handler  
**Tests:**
- ✅ ValidationError → 400 with field details
- ✅ UnauthorizedError → 401 
- ✅ ForbiddenError → 403
- ✅ NotFoundError → 404
- ✅ Generic errors → 500
- ✅ Request ID inclusion in all errors
- ✅ Auth0 error handling

**Coverage Target:** 95%+

---

### 4. **Services Layer** (P1 - High)

#### `services/organization.service.ts` ⚠️
**Priority:** P1  
**Why:** Core business logic, but depends heavily on models (mock-heavy)  
**Tests:**
- ✅ `createOrganization()` - Calls validation, calls model, formats response
- ✅ `updateOrganization()` - ID validation, update flow
- ✅ Error propagation from validation layer
- ⚠️ Skip pagination logic tests (simple pass-through to model)

**Coverage Target:** 70%+ (mock Auth0 model layer)

#### `services/invitation.service.ts` ⚠️
**Priority:** P1  
**Tests:**
- ✅ `createOrganizationInvitation()` - Validation → Model flow
- ⚠️ Skip getInvitations (pass-through)

**Coverage Target:** 60%+

#### `services/user.service.ts` ⚠️
**Priority:** P1  
**Tests:**
- ✅ `updateUser()` - Validation integration
- ⚠️ Skip enhanceUsersWithOrganizations (complex, needs integration test)

**Coverage Target:** 50%+

---

### 5. **Models Layer** (P3 - Low Priority)

#### `models/*.model.ts` ❌
**Priority:** P3 - SKIP  
**Why:** 
- Pure Auth0 API calls (no business logic)
- Better tested in integration tests
- Would require extensive Auth0 API mocking
- High effort, low value for unit tests

**Alternative:** Integration tests with Auth0 test tenant

---

### 6. **Controllers Layer** (P2 - Medium)

#### `controllers/*.controller.ts` ⚠️
**Priority:** P2 - PARTIAL  
**Why:** Thin layer, mostly req/res handling  
**Tests:**
- ✅ Request parameter extraction
- ✅ Service call and response formatting
- ✅ Error handling (next() call)
- ⚠️ Only test 1-2 controllers as examples (pattern is same across all)

**Coverage Target:** 50%+ (sample testing)

---

### 7. **Utilities** (P1 - High)

#### `utils/errors.ts` ✅
**Priority:** P1  
**Tests:**
- ✅ Custom error classes
- ✅ Error message formatting
- ✅ Auth0 error handling utility

**Coverage Target:** 90%+

---

## Test Implementation Priority

### Phase 1: Critical Path (Week 1) ✅
1. ✅ **Validation Layer** - All validators
2. ✅ **Response Utilities** - All response functions
3. ✅ **Request ID Middleware** - Request tracing
4. ✅ **Error Handler** - Error response formatting

**Estimated:** 6-8 hours  
**Coverage:** ~40% of codebase, 90% of critical logic

### Phase 2: Business Logic (Week 2) ⚠️
1. ⚠️ **Services** - Core service functions (with mocked models)
2. ⚠️ **Sample Controller** - Organization controller only

**Estimated:** 4-6 hours  
**Coverage:** +20% codebase

### Phase 3: Edge Cases (Week 3) ❌
1. ❌ Additional controllers (if needed)
2. ❌ Integration tests (Auth0 test tenant)

**Estimated:** 8-10 hours  
**Coverage:** +15% codebase

---

## Testing Tools & Setup

### Jest Configuration
```javascript
// jest.config.js
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/src'],
  testMatch: ['**/__tests__/**/*.ts', '**/?(*.)+(spec|test).ts'],
  moduleFileExtensions: ['ts', 'js', 'json'],
  collectCoverageFrom: [
    'src/**/*.ts',
    '!src/**/*.d.ts',
    '!src/tests/**',
    '!src/server.ts',
    '!src/app.ts'
  ],
  coverageThreshold: {
    global: {
      branches: 70,
      functions: 70,
      lines: 70,
      statements: 70
    }
  }
};
```

### Test File Structure
```
src/tests/unit/
├── validations/
│   ├── organization.validation.test.ts
│   ├── invitation.validation.test.ts
│   └── user.validation.test.ts
├── utils/
│   ├── response.test.ts
│   └── errors.test.ts
├── middlewares/
│   ├── requestId.test.ts
│   └── errorHandler.test.ts
├── services/
│   ├── organization.service.test.ts
│   └── invitation.service.test.ts
└── controllers/
    └── organization.controller.test.ts (sample)
```

---

## What NOT to Test (and Why)

### ❌ Models Layer
- Pure Auth0 API calls (no logic)
- Better covered by integration tests
- Mocking Auth0 responses = testing mocks, not code

### ❌ Configuration
- `config/env.ts` - Environment variable mapping (no logic)
- `config/loadEnv.ts` - dotenv wrapper (library code)

### ❌ Type Definitions
- `types/*.types.ts` - No runtime logic
- `interfaces/*.ts` - Type declarations only

### ❌ Simple Pass-Through Functions
- Services that just call models without transformation
- Getters with no business logic

---

## Coverage Goals

| Layer | Target Coverage | Priority |
|-------|----------------|----------|
| Validations | 95%+ | P0 |
| Response Utils | 100% | P0 |
| Middlewares | 95%+ | P0 |
| Services | 70%+ | P1 |
| Controllers | 50%+ | P2 |
| Models | 0% (integration) | P3 |
| **Overall** | **70%+** | - |

---

## Success Criteria

### Phase 1 Complete ✅
- [ ] All validation functions tested
- [ ] All response utilities tested
- [ ] Request ID middleware tested
- [ ] Error handler tested
- [ ] Test coverage report shows 70%+ overall
- [ ] All tests passing in CI/CD

### Phase 2 Complete ⚠️
- [ ] Key service functions tested with mocks
- [ ] Sample controller tested
- [ ] Edge cases covered
- [ ] Documentation updated

---

## Running Tests

```bash
# Run all tests
npm test

# Run with coverage
npm test -- --coverage

# Run specific test file
npm test -- organization.validation.test

# Watch mode
npm test -- --watch

# Verbose output
npm test -- --verbose
```

---

**Status:** Planning Complete - Ready for Phase 1 Implementation  
**Next Step:** Implement Phase 1 tests (Critical Path)  
**Estimated Time:** 6-8 hours for complete Phase 1
