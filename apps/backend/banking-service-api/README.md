# Banking Service API

A comprehensive RESTful API for banking services, financial products management, and currency exchange rates.

## Features

- **Bank Management**: Create, read, update, and delete banks
- **Product Management**: Manage various financial products including:
  - Credit Cards
  - Personal Loans
  - Car Loans
  - Mortgages
  - Insurance
  - Bank Accounts
  - Investment Products
- **Forex (Currency Exchange)**: Access current and historical exchange rates
- **User Authentication**: Secure JWT-based authentication and authorization
- **Analytics**: View product usage, user engagement, and search patterns
- **System Monitoring**: Monitor API health, performance metrics, and error rates

## Tech Stack

- **Framework**: Express.js
- **Language**: TypeScript
- **Database ORM**: Prisma
- **Authentication**: JWT (JSON Web Tokens)
- **Validation**: Express Validator
- **Logging**: Winston

## Database Models

- **Bank**: Banking institutions offering financial products
- **Product**: Base model for all financial products
  - **Card**: Credit and debit card products
  - **Loan**: Personal, business, and other loan types
  - **Mortgage**: Home and property mortgage offerings
  - **Insurance**: Various insurance product types
  - **BankAccount**: Checking, savings, and other account types
  - **Investment**: Investment products and offerings
- **ForexRate**: Currency exchange rates with historical data
- **ProductFeature**: Features associated with financial products
- **ProductTag**: Categorization tags for products
- **ViewLog**: Product view tracking for analytics

## Setup Instructions

### Prerequisites

- Node.js
- MySQL 
- npm, yarn, or pnpm

### Installation

1. Clone the repository:
   ```
   git clone [repository-url]
   cd apps/banking-service-api
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Configure environment variables:
   ```
   cp .env.example .env
   ```
   - Edit `.env` file with your actual database connection details and JWT secret

4. Run database migrations:
   ```
   npm run prisma:migrate
   ```

5. Generate Prisma client:
   ```
   npm run prisma:generate
   ```

6. Start the development server:
   ```
   npm run dev
   ```

### Docker Deployment

#### Using Docker Compose (Recommended)

1. Copy the environment file:
   ```
   cp .env.example .env
   ```

2. Update the `.env` file with your configuration

3. Run with Docker Compose:
   ```bash
   # For production
   docker-compose up -d
   
   # For development
   docker-compose -f docker-compose.dev.yml up -d
   ```

4. Run database migrations:
   ```bash
   # Access the container and run migrations
   docker-compose exec banking-service npx prisma migrate deploy
   
   # Seed the database (optional)
   docker-compose exec banking-service npm run prisma:seed
   ```

#### Using Docker Only

1. Build the Docker image:
   ```bash
   docker build -t banking-service-api .
   ```

2. Run the container:
   ```bash
   docker run -p 3000:3000 \
     -e DATABASE_URL="your_database_url" \
     -e NODE_ENV=production \
     banking-service-api
   ```

### Production Deployment

1. Build the application:
   ```
   npm run build
   ```

2. Start the production server:
   ```
   npm start
   ```

## API Endpoints

### Authentication

- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login and receive a JWT token
- `GET /api/auth/profile` - Get current user profile

### Banks

- `GET /api/banks` - Get all banks
- `GET /api/banks/:id` - Get a single bank by ID
- `POST /api/banks` - Create a new bank (Admin only)
- `PUT /api/banks/:id` - Update a bank (Admin only)
- `DELETE /api/banks/:id` - Delete a bank (Admin only)
- `GET /api/banks/:id/products` - Get all products for a bank

### Financial Products

- `GET /api/products` - Get all products with filtering
- `GET /api/products/:id` - Get a single product by ID
- `POST /api/products` - Create a new product (Admin only)
- `PUT /api/products/:id` - Update a product (Admin only)
- `DELETE /api/products/:id` - Delete a product (Admin only)
- `GET /api/products/featured` - Get featured products
- `GET /api/products/types/:type` - Get products by type

### Forex Rates

- `GET /api/forex/rates` - Get current forex rates
- `GET /api/forex/historical` - Get historical forex rates
- `POST /api/forex/rates` - Create a new forex rate (Admin only)
- `PUT /api/forex/rates/:id` - Update a forex rate (Admin only)
- `DELETE /api/forex/rates/:id` - Delete a forex rate (Admin only)
- `GET /api/forex/currency/:code` - Get rates by currency

### Analytics (Admin Only)

- `GET /api/analytics/metrics/product-views` - Get product view analytics
- `GET /api/analytics/metrics/search-patterns` - Get search pattern analytics
- `GET /api/analytics/metrics/user-engagement` - Get user engagement analytics
- `GET /api/analytics/metrics/feature-usage` - Get feature usage analytics

### System Monitoring (Admin Only)

- `GET /api/health` - Get overall system health
- `GET /api/monitoring/health/database` - Get database status
- `GET /api/monitoring/metrics/api` - Get API performance metrics
- `GET /api/monitoring/metrics/errors` - Get error rates and logs

## Development

### Scripts

- `npm run dev` - Start development server with hot-reload
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier
- `npm run test` - Run tests
- `npm run prisma:generate` - Generate Prisma client
- `npm run prisma:migrate` - Run database migrations
- `npm run prisma:studio` - Open Prisma Studio for database exploration

### Migration Notes

- May 2025: Removed Branch model from the database schema. Branch management functionalities have been deprecated.

## License

This project is licensed under the MIT License.