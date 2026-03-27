## Deployed on vercel:

https://auth-lab-five.vercel.app/

- Register a user first and then log in with that user

## Set up locally:

- Pull repo
- cd auth_lab
- Run npm run start

## Tech Stack: 

- TypeScript
- Next.js
- React
- REST API Routes
- LocalStorage (For JWT)
- Vercel Deployment
- Node.js (AWS Lambda)
- Serverless Framework
- Amazon API Gateway (HTTP API)
- Amazon DynamoDB

## Authentication & Security

- JWT (jsonwebtoken)
- bcryptjs (password hashing)
- CORS config (API Gateway)

## Testing 

### Jest - Unit Testing (backend)

Tests JWT in isolation, dependencies mocked so tests run offline and fast

**Install and run:**
```bash
cd backend
npm install --save-dev jest
npm test
```

**What is tested:**
- `login()` - mockes DynamoDB and bcrypt, verifies a vlid JWT is returned on correct credentials
- `getProfile()` - verifies a valid JWT grants access and returns user data
- `getProfile()` - verifies an invalid or tampered JWT returns 401
- `getProfile()` - verifies a missing Authorization header returns 401

### Playwright - End to end testing in root

Tests full app flow simulating a user experience

**Install and run:**
```bash
npm run dev
npm run test:e2e
```

**What is tested:**
- Login page loads with email input, password, and login/register buttons
- Invalid credentials cause an error message to appear on the page
- Valid credentials redirect the user to the dashboard

**Note:** `headless: false` in `playwright.config.js` means a real browser opens during tests so you can watch the interactions happen live, set to `true` to run silently in the background/ in CI pipelines.

## Infrastructure & DevOps

- AWS CLI
- AWS IAM (specific permissions and roles)
- CloudWatch (logging and debugging)

## General description

- User registration, password hashed and saved in db
- Secure login with JWT authentication
- Protected API route (with token generated at login)
- Fetches current user profile
- Delete users on click of card
- Serverless backend architecture

