# Tereza & Michel Wedding Invitation

A simple wedding invitation website with guest confirmation system.

## Architecture

- **Frontend**: React with Vite (port 5173)
- **Backend**: Node.js with Express (port 3001)
- **Database**: PostgreSQL

## Development

### Prerequisites

- Node.js and npm
- PostgreSQL installed and running

### Setup

1. Install dependencies:
```bash
npm install
cd backend && npm install
cd ../frontend && npm install
```

2. Set up the database (see [DATABASE_SETUP.md](DATABASE_SETUP.md))

3. Start the development servers:
```bash
npm run dev
```

This will start both the backend (port 3001) and frontend (port 5173) simultaneously.

Or run them separately:
```bash
# Backend
cd backend && npm run dev

# Frontend (in another terminal)
cd frontend && npm run dev
```

## Project Structure

```
.
├── backend/           # Node.js/Express API server
│   ├── server.js      # Main server file
│   ├── migrations/    # Database migration files
│   └── .env.example   # Environment variables template
├── frontend/          # React application
│   ├── src/
│   │   ├── App.jsx    # Main React component
│   │   ├── main.jsx   # React entry point
│   │   └── styles.css # Global styles
│   └── vite.config.js # Vite configuration with API proxy
└── DATABASE_SETUP.md  # Database setup instructions
```

## Built with

- React
- Vite
- Express
- PostgreSQL
- Tailwind CSS
