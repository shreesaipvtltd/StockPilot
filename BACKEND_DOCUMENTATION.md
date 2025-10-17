# Inventory Management System - Backend Documentation

## Overview

This document provides comprehensive information about the backend architecture, API flows, database design, and deployment instructions for the Inventory Management System.

## Table of Contents

1. [Architecture Overview](#architecture-overview)
2. [Technology Stack](#technology-stack)
3. [Database Schema](#database-schema)
4. [Authentication & Authorization](#authentication--authorization)
5. [API Endpoints](#api-endpoints)
6. [Backend Flows](#backend-flows)
7. [Deployment Guide](#deployment-guide)

---

## Architecture Overview

The backend follows a layered architecture pattern:

```
┌─────────────────────────────────────┐
│         Client (React SPA)          │
└─────────────────┬───────────────────┘
                  │ HTTP/REST
┌─────────────────▼───────────────────┐
│         Express.js Server           │
│  ┌─────────────────────────────┐   │
│  │   Routes Layer (API)        │   │
│  │   - Validation              │   │
│  │   - Auth Middleware         │   │
│  └────────────┬────────────────┘   │
│               │                     │
│  ┌────────────▼────────────────┐   │
│  │   Storage Layer (Business)  │   │
│  │   - CRUD Operations         │   │
│  │   - Analytics               │   │
│  └────────────┬────────────────┘   │
│               │                     │
│  ┌────────────▼────────────────┐   │
│  │   Database Layer (Drizzle)  │   │
│  │   - Query Builder           │   │
│  │   - Type Safety             │   │
│  └────────────┬────────────────┘   │
└───────────────┼─────────────────────┘
                │
┌───────────────▼─────────────────────┐
│   PostgreSQL Database (Neon)       │
└─────────────────────────────────────┘
```

## Technology Stack

### Backend
- **Runtime**: Node.js 20+
- **Framework**: Express.js
- **Language**: TypeScript
- **ORM**: Drizzle ORM
- **Database**: PostgreSQL (Neon)
- **Session Store**: PostgreSQL (via connect-pg-simple)
- **Authentication**: bcrypt + express-session
- **Validation**: Zod
- **API Documentation**: Swagger/OpenAPI

### Security
- **Password Hashing**: bcrypt (10 rounds)
- **Session Management**: Server-side sessions with PostgreSQL store
- **Cookie Security**: httpOnly, sameSite, secure (in production)

---

## Database Schema

### Users Table

Stores user information and credentials.

```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  full_name TEXT NOT NULL,
  role user_role NOT NULL DEFAULT 'employee',
  email TEXT UNIQUE NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Enum for user roles
CREATE TYPE user_role AS ENUM ('admin', 'manager', 'staff', 'employee');
```

**Roles & Permissions:**
- `admin`: Full access to all features
- `manager`: Can manage products, approve/reject stock requests, view reports
- `staff`: Can manage products, create stock-in/out records
- `employee`: Can view products, create stock-out requests

### Products Table

Manages product inventory information.

```sql
CREATE TABLE products (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  sku VARCHAR(100) UNIQUE NOT NULL,
  category TEXT NOT NULL,
  vendor TEXT NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 0,
  total_quantity INTEGER NOT NULL DEFAULT 0,
  reorder_threshold INTEGER NOT NULL DEFAULT 0,
  cost_price DECIMAL(10,2) NOT NULL,
  selling_price DECIMAL(10,2) NOT NULL,
  description TEXT,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);
```

### Stock Ins Table

Records incoming inventory transactions.

```sql
CREATE TABLE stock_ins (
  id SERIAL PRIMARY KEY,
  product_id INTEGER NOT NULL REFERENCES products(id),
  quantity INTEGER NOT NULL,
  supplier TEXT NOT NULL,
  notes TEXT,
  attachment_url TEXT,
  created_by INTEGER NOT NULL REFERENCES users(id),
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);
```

### Stock Out Requests Table

Manages stock out request workflow.

```sql
CREATE TABLE stock_out_requests (
  id SERIAL PRIMARY KEY,
  product_id INTEGER NOT NULL REFERENCES products(id),
  requester_id INTEGER NOT NULL REFERENCES users(id),
  quantity INTEGER NOT NULL,
  purpose TEXT NOT NULL,
  status request_status NOT NULL DEFAULT 'pending',
  reviewed_by INTEGER REFERENCES users(id),
  reviewed_at TIMESTAMP,
  fulfilled_by INTEGER REFERENCES users(id),
  fulfilled_at TIMESTAMP,
  confirmed_by INTEGER REFERENCES users(id),
  confirmed_at TIMESTAMP,
  rejection_reason TEXT,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Enum for request status
CREATE TYPE request_status AS ENUM ('pending', 'approved', 'rejected', 'fulfilled');
```

### Stock Movements Table

Audit log for all stock movements.

```sql
CREATE TABLE stock_movements (
  id SERIAL PRIMARY KEY,
  product_id INTEGER NOT NULL REFERENCES products(id),
  type movement_type NOT NULL,
  quantity INTEGER NOT NULL,
  reference_id INTEGER,  -- Links to stock_ins or stock_out_requests
  user_id INTEGER NOT NULL REFERENCES users(id),
  notes TEXT,
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Enum for movement types
CREATE TYPE movement_type AS ENUM ('stock_in', 'stock_out');
```

---

## Authentication & Authorization

### Authentication Flow

1. **Registration** (`POST /api/auth/register`)
   - User provides: username, password, fullName, email, role (optional)
   - Password is hashed using bcrypt (10 rounds)
   - User record created in database
   - Returns user data (without password)

2. **Login** (`POST /api/auth/login`)
   - User provides: username, password
   - System validates credentials
   - Password compared with bcrypt
   - Session created with userId and userRole
   - Session stored in PostgreSQL
   - Returns user data with session cookie

3. **Session Management**
   - Sessions stored in PostgreSQL (session table)
   - Cookie: httpOnly, sameSite=lax, secure (production only)
   - Expiry: 30 days
   - Session cookie name: connect.sid

4. **Logout** (`POST /api/auth/logout`)
   - Session destroyed from database
   - Cookie cleared

### Authorization Middleware

**`requireAuth`**: Validates that user is logged in
- Checks session.userId exists
- Fetches user from database
- Attaches user to request object
- Returns 401 if not authenticated

**`requireRole(...roles)`**: Validates user has required role
- Checks if user.role is in allowed roles
- Returns 403 if insufficient permissions

---

## API Endpoints

### Swagger Documentation

Access interactive API documentation at:
```
GET /api/docs
```

Download OpenAPI JSON spec:
```
GET /api/docs.json
```

### Authentication Endpoints

#### Register User
```http
POST /api/auth/register
Content-Type: application/json

{
  "username": "john_doe",
  "password": "securepass123",
  "fullName": "John Doe",
  "email": "john@example.com",
  "role": "staff"  // Optional: admin|manager|staff|employee
}
```

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "username": "john_doe",
  "password": "securepass123"
}
```

#### Get Current User
```http
GET /api/auth/me
```

#### Logout
```http
POST /api/auth/logout
```

### Product Endpoints

#### Get All Products
```http
GET /api/products
```

#### Get Product by ID
```http
GET /api/products/:id
```

#### Create Product
```http
POST /api/products
Content-Type: application/json
Authorization: Required (admin|manager|staff)

{
  "name": "Wireless Mouse",
  "sku": "WM-001",
  "category": "Electronics",
  "vendor": "Tech Supplies Co",
  "quantity": 100,
  "totalQuantity": 100,
  "reorderThreshold": 50,
  "costPrice": "15.00",
  "sellingPrice": "25.99",
  "description": "Ergonomic wireless mouse"
}
```

#### Update Product
```http
PUT /api/products/:id
Content-Type: application/json
Authorization: Required (admin|manager|staff)

{
  "quantity": 150,
  "reorderThreshold": 75
}
```

#### Delete Product
```http
DELETE /api/products/:id
Authorization: Required (admin|manager)
```

#### Get Low Stock Products
```http
GET /api/products/low-stock
```

### Stock In Endpoints

#### Get All Stock Ins
```http
GET /api/stock-in
```

#### Create Stock In
```http
POST /api/stock-in
Content-Type: application/json
Authorization: Required (admin|manager|staff)

{
  "productId": 1,
  "quantity": 50,
  "supplier": "Tech Supplies Co",
  "notes": "Regular shipment",
  "attachmentUrl": "https://example.com/invoice.pdf"
}
```

### Stock Out Endpoints

#### Get Stock Out Requests
```http
GET /api/stock-out?status=pending
```

#### Create Stock Out Request
```http
POST /api/stock-out
Content-Type: application/json
Authorization: Required (all authenticated users)

{
  "productId": 1,
  "quantity": 10,
  "purpose": "Office Setup - New Hires"
}
```

#### Approve Stock Out Request
```http
POST /api/stock-out/:id/approve
Authorization: Required (admin|manager)
```

#### Reject Stock Out Request
```http
POST /api/stock-out/:id/reject
Content-Type: application/json
Authorization: Required (admin|manager)

{
  "rejectionReason": "Insufficient inventory"
}
```

#### Fulfill Stock Out Request
```http
POST /api/stock-out/:id/fulfill
Authorization: Required (admin|manager|staff)
```

### Analytics Endpoints

#### Dashboard Stats
```http
GET /api/analytics/dashboard

Response:
{
  "totalProducts": 1234,
  "lowStockCount": 23,
  "totalStockValue": 45678,
  "activeUsers": 12
}
```

#### Stock In by Category
```http
GET /api/analytics/stock-in-by-category

Response:
[
  { "category": "Electronics", "value": 450 },
  { "category": "Accessories", "value": 380 }
]
```

#### Stock Out by Category
```http
GET /api/analytics/stock-out-by-category
```

#### Recent Activity
```http
GET /api/analytics/recent-activity
```

### User Management Endpoints

#### Get All Users
```http
GET /api/users
Authorization: Required (admin|manager)
```

---

## Backend Flows

### 1. Stock In Flow

```
┌─────────────┐
│   Staff     │
│  Creates    │
│  Stock In   │
└──────┬──────┘
       │
       ▼
┌──────────────────────┐
│ POST /api/stock-in   │
│ - Validate data      │
│ - Check auth & role  │
└──────┬───────────────┘
       │
       ▼
┌─────────────────────────────┐
│  Storage Layer              │
│  1. Create stock_in record  │
│  2. Update product quantity │
│     quantity += stock_in.qty│
│     totalQty += stock_in.qty│
│  3. Create stock_movement   │
│     (type: stock_in)        │
└─────────────────────────────┘
       │
       ▼
┌──────────────────┐
│  Return Success  │
└──────────────────┘
```

**Transaction Safety**: 
- Product quantity update and stock movement creation happen in sequence
- If stock movement creation fails, product quantity is already updated
- Consider wrapping in database transaction for ACID compliance

### 2. Stock Out Request Flow

```
┌──────────────┐
│   Employee   │
│   Creates    │
│   Request    │
└──────┬───────┘
       │
       ▼
┌────────────────────────┐
│ POST /api/stock-out    │
│ - Validate data        │
│ - Auto set requesterId │
│ - Status: pending      │
└──────┬─────────────────┘
       │
       ▼
┌──────────────────────────┐
│  Manager/Admin Reviews   │
│                          │
│  Approve or Reject?      │
└────┬─────────────────┬───┘
     │                 │
     │ Approve         │ Reject
     ▼                 ▼
┌──────────────┐   ┌──────────────────┐
│ POST         │   │ POST             │
│ /stock-out/  │   │ /stock-out/      │
│ :id/approve  │   │ :id/reject       │
│              │   │ + reason         │
│ Status:      │   │                  │
│ approved     │   │ Status: rejected │
└──────┬───────┘   └──────────────────┘
       │                   │
       │                   │ (END)
       ▼                   ▼
┌──────────────────┐
│  Staff Fulfills  │
│  POST /stock-out │
│  /:id/fulfill    │
└──────┬───────────┘
       │
       ▼
┌─────────────────────────────┐
│  Storage Layer              │
│  1. Validate status=approved│
│  2. Update request status   │
│     to fulfilled            │
│  3. Reduce product quantity │
│     quantity -= request.qty │
│  4. Create stock_movement   │
│     (type: stock_out)       │
└─────────────────────────────┘
       │
       ▼
┌──────────────────┐
│  Return Success  │
└──────────────────┘
```

**Business Rules**:
- Only approved requests can be fulfilled
- Quantity is deducted only when fulfilled (not when approved)
- Stock movement is created only on fulfillment

### 3. Product Management Flow

```
┌─────────────────┐
│  Admin/Manager/ │
│  Staff Creates  │
│  New Product    │
└────────┬────────┘
         │
         ▼
┌─────────────────────┐
│ POST /api/products  │
│ - Validate SKU      │
│ - Check duplicates  │
└────────┬────────────┘
         │
         ▼
┌──────────────────────┐
│  Product Created     │
│  - quantity: 0       │
│  - totalQty: 0       │
└──────────────────────┘
         │
         ▼
┌──────────────────────┐
│  Stock In Process    │
│  Adds initial stock  │
└──────────────────────┘
```

### 4. Analytics Flow

```
┌────────────────────┐
│  Dashboard Loads   │
└─────────┬──────────┘
          │
          ▼
┌─────────────────────────────────┐
│  GET /api/analytics/dashboard   │
│  - Count products               │
│  - Count low stock items        │
│  - Calculate total value        │
│  - Count active users           │
└─────────────────────────────────┘
          │
          ▼
┌─────────────────────────────────┐
│  GET /api/analytics/stock-in-   │
│  by-category                    │
│  - Join stock_ins + products    │
│  - GROUP BY category            │
│  - SUM quantity                 │
└─────────────────────────────────┘
          │
          ▼
┌─────────────────────────────────┐
│  GET /api/analytics/recent-     │
│  activity                       │
│  - Fetch recent stock_ins       │
│  - Fetch recent stock_outs      │
│  - Combine and sort by date     │
│  - Return latest 10             │
└─────────────────────────────────┘
```

---

## Deployment Guide

### Prerequisites

- Node.js 20+
- PostgreSQL database (Neon or any PostgreSQL provider)
- npm or yarn

### Environment Variables

Create a `.env` file with:

```env
# Database
DATABASE_URL=postgresql://user:password@host:5432/database

# Session
SESSION_SECRET=your-super-secret-session-key-change-this

# Server
PORT=5000
NODE_ENV=production
```

### Database Setup

1. **Create Database Tables**
   ```bash
   npm run db:push
   ```

2. **Verify Schema**
   ```bash
   # Check tables exist
   psql $DATABASE_URL -c "\dt"
   ```

### Build & Deploy

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Build Frontend**
   ```bash
   npm run build
   ```

3. **Start Server**
   ```bash
   npm start
   ```

### Production Checklist

- [ ] Set `NODE_ENV=production`
- [ ] Use strong `SESSION_SECRET`
- [ ] Enable HTTPS (cookie secure flag)
- [ ] Set up database backups
- [ ] Configure CORS if needed
- [ ] Set up monitoring/logging
- [ ] Use connection pooling for database
- [ ] Rate limiting for API endpoints
- [ ] Input sanitization

### Scaling Considerations

1. **Database**
   - Use connection pooling (already configured via Neon)
   - Add database indexes on foreign keys
   - Consider read replicas for analytics

2. **Session Storage**
   - Session table will grow over time
   - Set up cleanup job for expired sessions
   - Consider Redis for high-traffic scenarios

3. **API**
   - Add caching for analytics endpoints
   - Implement rate limiting
   - Use CDN for static assets

---

## Error Handling

### Error Response Format

All errors return consistent format:

```json
{
  "message": "Error description"
}
```

### HTTP Status Codes

- `200`: Success
- `201`: Created
- `400`: Bad Request (validation errors)
- `401`: Unauthorized (not logged in)
- `403`: Forbidden (insufficient permissions)
- `404`: Not Found
- `500`: Internal Server Error

### Validation Errors

Powered by Zod with friendly error messages:

```json
{
  "message": "Validation error: Required at \"username\"; Invalid email at \"email\""
}
```

---

## Testing

### Test Accounts

Create test users with different roles:

```bash
# Admin
POST /api/auth/register
{
  "username": "admin",
  "password": "admin123",
  "fullName": "System Admin",
  "email": "admin@example.com",
  "role": "admin"
}

# Manager
POST /api/auth/register
{
  "username": "manager",
  "password": "manager123",
  "fullName": "Inventory Manager",
  "email": "manager@example.com",
  "role": "manager"
}

# Staff
POST /api/auth/register
{
  "username": "staff",
  "password": "staff123",
  "fullName": "Warehouse Staff",
  "email": "staff@example.com",
  "role": "staff"
}
```

### API Testing

Use the Swagger UI at `/api/docs` for interactive testing, or use curl:

```bash
# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}' \
  -c cookies.txt

# Create Product
curl -X POST http://localhost:5000/api/products \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -d '{
    "name": "Test Product",
    "sku": "TEST-001",
    "category": "Test",
    "vendor": "Test Vendor",
    "quantity": 100,
    "totalQuantity": 100,
    "reorderThreshold": 50,
    "costPrice": "10.00",
    "sellingPrice": "15.00"
  }'
```

---

## Support & Maintenance

### Logs

Server logs available in console output. Consider integrating:
- Winston or Pino for structured logging
- Log aggregation service (LogDNA, Papertrail)

### Monitoring

Recommended monitoring:
- API response times
- Error rates
- Database connection pool
- Session count
- Low stock alerts

### Backup & Recovery

1. **Database Backups**
   - Daily automated backups
   - Point-in-time recovery capability
   - Test restore procedures

2. **Data Retention**
   - Stock movements: Permanent
   - Sessions: 30 days
   - Audit logs: 1 year

---

## Security Best Practices

1. **Password Security**
   - bcrypt with 10 rounds
   - Minimum 6 characters (increase for production)
   - Never log passwords

2. **Session Security**
   - httpOnly cookies
   - Secure flag in production
   - 30-day expiry
   - Server-side storage

3. **Input Validation**
   - Zod schema validation
   - SQL injection protection (Drizzle ORM)
   - XSS protection (React escapes by default)

4. **Authorization**
   - Role-based access control
   - Middleware checks on every protected route
   - Principle of least privilege

---

## API Rate Limits (Recommended)

For production, implement rate limiting:

- Authentication: 5 requests/minute per IP
- General API: 100 requests/minute per user
- Analytics: 20 requests/minute per user

---

## Changelog

### Version 1.0.0 (Current)
- Initial release
- User authentication & authorization
- Product management
- Stock in/out workflow
- Analytics dashboard
- Swagger documentation

---

## Contact

For technical support or questions about the backend:
- Email: support@inventory.com
- Documentation: /api/docs
- GitHub: [repository-url]
