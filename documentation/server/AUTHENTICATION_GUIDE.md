# Simple Authentication System - How It Works

## Overview
This authentication system uses **JWT (JSON Web Tokens)** to manage user login and protect routes. Here's how each piece works:

## 🔧 Core Components

### 1. **Auth Config** (`src/config/auth.config.ts`)
- Stores the JWT secret key and settings
- Sets token expiration time (7 days)
- Configures password hashing rounds

### 2. **Auth Utils** (`src/utils/auth.utils.ts`)
- **`hashPassword()`**: Converts plain text passwords to encrypted hashes
- **`comparePassword()`**: Checks if a password matches the stored hash
- **`generateToken()`**: Creates a JWT token for logged-in users
- **`verifyToken()`**: Checks if a token is valid

### 3. **User Repository** (`src/repositories/user.repository.ts`)
- Handles database operations for users
- Find user by email, create new users, etc.

### 4. **Auth Controller** (`src/controllers/auth.controller.ts`)
- **`register()`**: Creates new user accounts
- **`login()`**: Authenticates users and returns a token
- **`getMe()`**: Returns current user info (protected route)

### 5. **Auth Middleware** (`src/middleware/auth.middleware.ts`)
- **`authenticateToken()`**: Protects routes by checking for valid tokens
- Runs before protected routes to verify the user is logged in

### 6. **Auth Routes** (`src/routes/auth.routes.ts`)
- **POST `/auth/register`**: Create new account
- **POST `/auth/login`**: Login with email/password
- **GET `/auth/me`**: Get current user info (requires token)

## 🔄 How Authentication Flow Works

### Registration Flow:
1. User sends email, password, name to `/auth/register`
2. System checks if email already exists
3. Password gets hashed (encrypted)
4. User is saved to database
5. JWT token is generated and returned
6. User is now logged in

### Login Flow:
1. User sends email, password to `/auth/login`
2. System finds user by email
3. Password is compared with stored hash
4. If valid, JWT token is generated and returned
5. User is now logged in

### Protected Route Access:
1. User sends request with token in Authorization header
2. Auth middleware checks if token is valid
3. If valid, user info is added to request
4. Route handler can access user info
5. Response is sent back

## 🛡️ Security Features

- **Password Hashing**: Passwords are never stored in plain text
- **JWT Tokens**: Stateless authentication (no server-side sessions)
- **Token Expiration**: Tokens expire after 7 days
- **Route Protection**: Some routes require authentication

## 🚀 Usage Examples

### Register a new user:
```bash
curl -X POST http://localhost:3002/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email": "user@example.com", "password": "secret123", "name": "John Doe"}'
```

### Login:
```bash
curl -X POST http://localhost:3002/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "user@example.com", "password": "secret123"}'
```

### Access protected route:
```bash
curl -X GET http://localhost:3002/auth/me \
  -H "Authorization: Bearer YOUR_JWT_TOKEN_HERE"
```

## 📝 What Routes Are Protected?

- **Public Routes** (no login required):
  - `GET /recipes` - View all recipes
  - `GET /recipes/:id` - View single recipe
  - `POST /auth/register` - Register
  - `POST /auth/login` - Login

- **Protected Routes** (login required):
  - `POST /recipes` - Create recipe
  - `PUT /recipes/:id` - Update recipe
  - `DELETE /recipes/:id` - Delete recipe
  - `GET /auth/me` - Get user info

## 🔑 Key Concepts

- **JWT Token**: A string that proves you're logged in
- **Authorization Header**: Where you send the token (`Authorization: Bearer <token>`)
- **Middleware**: Code that runs before your route handlers
- **Password Hashing**: Converting passwords to unreadable strings for security

This system is simple but secure and can be extended with features like password reset, email verification, role-based permissions, etc.
