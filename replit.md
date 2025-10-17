# Inventory Management System

## Project Overview

A full-stack inventory management system with user authentication, product management, stock tracking with approval workflows, and analytics dashboard.

## Recent Changes (Oct 17, 2025)

### Backend Implementation
- ✅ Database schema pushed to PostgreSQL with all tables (users, products, stock_ins, stock_out_requests, stock_movements)
- ✅ Complete storage layer with CRUD operations and analytics methods in `server/storage.ts`
- ✅ Session-based authentication system with bcrypt password hashing
- ✅ Comprehensive REST API with 20+ endpoints for products, stock management, analytics, and user management
- ✅ Swagger/OpenAPI documentation available at `/api-docs`
- ✅ Backend flow documentation created in `BACKEND_DOCUMENTATION.md`

### Frontend Implementation
- ✅ Authentication system with login/register pages
- ✅ Auth context for managing user state
- ✅ Protected routes requiring authentication
- ✅ Dashboard connected to analytics APIs with loading states
- 🚧 Products page needs API connection (currently using mock data)
- 🚧 Stock In page needs API connection (currently using mock data)
- 🚧 Stock Out page needs API connection (currently using mock data)

## Architecture

### Backend Stack
- **Framework**: Express.js with TypeScript
- **Database**: PostgreSQL (Neon) with Drizzle ORM
- **Authentication**: bcrypt + express-session (server-side sessions)
- **Validation**: Zod schemas
- **Documentation**: Swagger/OpenAPI

### Frontend Stack
- **Framework**: React with TypeScript
- **Routing**: Wouter
- **State Management**: React Query (TanStack Query)
- **UI Components**: Shadcn UI + Radix UI
- **Styling**: Tailwind CSS
- **Charts**: Recharts

### Database Schema

**Users**: Authentication and user management
- Roles: admin, manager, staff, employee
- Bcrypt password hashing

**Products**: Inventory catalog
- SKU, category, vendor, quantity, prices
- Low stock threshold tracking

**Stock Ins**: Incoming inventory
- Linked to products and users
- Automatic quantity updates

**Stock Out Requests**: Approval workflow
- Status: pending → approved/rejected → fulfilled
- Multi-user workflow (requester → reviewer → fulfiller)

**Stock Movements**: Audit trail
- Tracks all stock in/out transactions
- Links to reference transactions

## API Endpoints

### Authentication
- `POST /api/auth/register` - Create new user
- `POST /api/auth/login` - Login
- `GET /api/auth/me` - Get current user
- `POST /api/auth/logout` - Logout

### Products
- `GET /api/products` - List all products
- `POST /api/products` - Create product
- `GET /api/products/:id` - Get product
- `PUT /api/products/:id` - Update product
- `DELETE /api/products/:id` - Delete product
- `GET /api/products/low-stock` - Get low stock items

### Stock In
- `GET /api/stock-in` - List stock ins
- `POST /api/stock-in` - Create stock in

### Stock Out
- `GET /api/stock-out` - List requests (filter by status)
- `POST /api/stock-out` - Create request
- `POST /api/stock-out/:id/approve` - Approve request
- `POST /api/stock-out/:id/reject` - Reject request
- `POST /api/stock-out/:id/fulfill` - Fulfill request

### Analytics
- `GET /api/analytics/dashboard` - Dashboard stats
- `GET /api/analytics/stock-in-by-category` - Stock in by category
- `GET /api/analytics/stock-out-by-category` - Stock out by category
- `GET /api/analytics/recent-activity` - Recent activity feed

### Users
- `GET /api/users` - List users (admin/manager only)

## User Preferences

None specified yet.

## Project Structure

```
├── server/
│   ├── index.ts          # Express server entry
│   ├── routes.ts         # API routes
│   ├── storage.ts        # Data access layer
│   ├── auth.ts           # Auth middleware
│   └── db.ts            # Database connection
├── client/src/
│   ├── pages/           # Page components
│   ├── components/      # Reusable components
│   ├── lib/            # Utilities & context
│   └── App.tsx         # Main app with routing
├── shared/
│   └── schema.ts       # Database schema (Drizzle)
└── BACKEND_DOCUMENTATION.md  # API & deployment docs
```

## Running the Project

The workflow "Start application" runs `npm run dev`:
- Backend: Express server on port 5000
- Frontend: Vite dev server proxied through Express
- Database: Connected via DATABASE_URL env var

## Testing Credentials

Create test users via `/api/auth/register`:
- Admin: Full access
- Manager: Can approve/reject, view reports
- Staff: Can manage products, stock in/out
- Employee: Can create stock out requests

## Next Steps

1. ✅ Connect Products page to API
2. ✅ Connect Stock In page to API
3. ✅ Connect Stock Out page to API with approval actions
4. ✅ Test complete workflow end-to-end
5. Publish/deploy the application

## Known Issues

- None currently identified

## Dependencies

See package.json for full list. Key dependencies:
- express, drizzle-orm, zod (backend)
- react, @tanstack/react-query, wouter (frontend)
- shadcn/ui components, tailwindcss (styling)
