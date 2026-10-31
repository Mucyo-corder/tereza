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

### Frontend Deployment (Render)
1. Create a new Web Service on Render
2. Connect your GitHub repository
3. Set Root Directory to `frontend`
4. Build Command: `npm install && npm run build`
5. Publish Directory: `dist`
6. Add Environment Variable:
   - `VITE_API_URL`: Your backend URL (e.g., `https://dukunde-kiliziya-api.onrender.com`)
7. Deploy

### Backend Deployment (Render)
1. Create a new Web Service on Render
2. Connect your GitHub repository
3. Set Root Directory to `backend`
4. Build Command: `npm install`
5. Start Command: `node server.js`
6. Add Environment Variable:
   - `DATABASE_URL`: Your Supabase PostgreSQL connection string
7. Deploy

## Database Setup

For Supabase:
1. Create a Supabase project
2. Run the SQL migration in `backend/migrations/`
3. Copy the DATABASE_URL from Supabase settings
4. Set it as environment variable in your backend deployment
