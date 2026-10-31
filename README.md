# Dukunde Kiliziya - Wedding Invitation App

A wedding invitation application for the 80th Jubilee celebration.

## Project Structure

- `frontend/` - React + Vite frontend application
- `backend/` - Node.js + Express backend API

## Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

The frontend runs on port 5173.

## Backend Setup

```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your DATABASE_URL
npm run dev
```

The backend runs on port 3001.

## Environment Variables

Backend requires:
- `DATABASE_URL` - PostgreSQL connection string (for Supabase or local database)

## Deployment

### Frontend Deployment
Deploy the `frontend` folder to Vercel, Netlify, or similar platform.

### Backend Deployment
Deploy the `backend` folder to Render, Railway, or similar platform.
Set the `DATABASE_URL` environment variable in your deployment platform.

## Database Setup

For Supabase:
1. Create a Supabase project
2. Run the SQL migration in `backend/migrations/`
3. Copy the DATABASE_URL from Supabase settings
4. Set it as environment variable in your backend deployment
