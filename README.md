# Endor API

A NodeJS/Express API for handling user authentication, payments, and data management with Stripe and Stytch integration.

## Initial Requirements

Before setting up the project, you need:

1. Heroku account with PostgreSQL addon
2. Stytch account (for authentication)
3. Stripe account (for payments)
4. Node.js (v14 or higher)
5. Set up its client at <repository-url>

## Setup Procedure

1. Clone the repository.
 ```bash
      git clone <repository-url>
      cd endor-api
   ```


2. Install dependencies.
'''bash
   npm install
'''

3. Create a `.env` file in the api's root directory with the following variables:

```env
Environment
ENV=development
Database
HEROKU_DEVELOPMENT_DB_HOST=your_db_host
HEROKU_DEVELOPMENT_DB_USER=your_db_user
HEROKU_DEVELOPMENT_DB_PASSWORD=your_db_password
HEROKU_DEVELOPMENT_DB_NAME=your_db_name
HEROKU_DEVELOPMENT_DB_PORT=5432
Server
PORT=4321
LOCAL_URL=http://localhost:4321
WEB_LOCAL_PORT=4321
Stytch (Test Environment)
STYTCH_TEST_PROJECT_ID=your_project_id
STYTCH_TEST_SECRET=your_secret
STYTCH_TEST_PUBLIC_TOKEN=your_public_token
Stripe
STRIPE_SECRET=your_stripe_secret
STRIPE_WEBHOOK_SECRET=your_webhook_secret
```

4. Run database migration.
```bash
npx sequelize-cli db:migrate
```

5. Start the development server.
```bash
npm run dev
```

## Revisions

### v1.0.0
- Initial release with core functionality
- Magic link authentication with Stytch
- Stripe payment integration
- API key generation and validation
- Customer data storage

## To-Dos

1. Security
   - Implement rate limiting
   - Add request validation middleware
   - Enhance error handling
   - Add input sanitization
   - Fix SSL rejectUnauthorized in database config

2. Code Quality
   - Implement consistent error handling across controllers
   - Add proper TypeScript support
   - Add JSDoc comments to all functions
   - Change instances of CustomerData and Intake to one or the other

3. Testing
   - Add unit tests
   - Add integration tests
   - Set up CI pipeline with test automation

4. Documentation
   - Add OpenAPI/Swagger documentation
   - Add endpoint usage examples

5. Features
   - Implement webhook retry mechanism
   - Add user roles and permissions
   - Add batch processing capabilities
   - Enhance payment error handling

6. DevOps
   - Add Docker support
   - Set up automated deployments
   - Add monitoring and alerting
   - Implement proper logging system