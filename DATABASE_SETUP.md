# Database Setup Instructions

## Prerequisites
- PostgreSQL installed and running
- Node.js installed

## Setup Steps

### 1. Create a PostgreSQL Database

```bash
# Connect to PostgreSQL
psql -U postgres

# Create database
CREATE DATABASE wedding_guests;

# Create a user (optional, recommended for production)
CREATE USER wedding_user WITH PASSWORD 'your_secure_password';
GRANT ALL PRIVILEGES ON DATABASE wedding_guests TO wedding_user;
\q
```

### 2. Configure Environment Variables

Create a `.env` file in the backend directory:

```bash
cp .env.example backend/.env
```

Edit `backend/.env` with your database connection string:

```
DATABASE_URL=postgresql://wedding_user:your_secure_password@localhost:5432/wedding_guests
```

Or if using the default postgres user:

```
DATABASE_URL=postgresql://postgres@localhost:5432/wedding_guests
```

### 3. Run Database Migration

```bash
# Connect to the database
psql -U postgres -d wedding_guests

# Run the migration file
\i backend/migrations/001_create_guests_table.sql

# Exit
\q
```

This will create the `guests` table with the following schema:
- `id`: UUID (primary key)
- `name`: VARCHAR(100) (unique)
- `submitted_at`: TIMESTAMP WITH TIME ZONE

### 4. Install Dependencies

```bash
# Install root dependencies
npm install

# Install backend dependencies
cd backend && npm install

# Install frontend dependencies
cd ../frontend && npm install
```

### 5. Start the Development Servers

```bash
# From project root - starts both backend and frontend
npm run dev
```

Or run them separately:

```bash
# Backend (port 3001)
cd backend && npm run dev

# Frontend (port 5173)
cd frontend && npm run dev
```

The application will now:
- Store guest confirmations in PostgreSQL
- Persist data across sessions and devices
- Handle duplicate names automatically

## Troubleshooting

### Connection Errors
If you get "connection refused" or "password authentication failed":
- Verify PostgreSQL is running: `brew services list` (macOS) or `systemctl status postgresql` (Linux)
- Check your DATABASE_URL matches your PostgreSQL credentials
- Ensure the database name is correct

### Migration Errors
If the migration fails:
- Verify the database exists: `psql -U postgres -l`
- Check you have the right permissions
- Ensure the migration file path is correct

## Production Considerations

For production deployment:
1. Use a managed PostgreSQL service (Supabase, Neon, Railway, etc.)
2. Set strong database passwords
3. Use environment variables for all secrets
4. Enable SSL for database connections
5. Set up database backups
6. Build the frontend: `npm run build:frontend`
7. Use a process manager like PM2 for the backend
