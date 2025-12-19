# SnapCove Frontend - Authentication Testing

A React frontend application to test the SnapCove backend authentication system.

## Features

- User Signup with role selection
- User Login
- JWT Token Management
- Protected Dashboard
- User Profile Display

## Setup

1. Install dependencies:
```bash
npm install
```

2. Make sure your Django backend is running on `http://localhost:8000`

3. Start the development server:
```bash
npm run dev
```

4. Open your browser to `http://localhost:3000`

## API Endpoints Used

- `POST /api/auth/signup/` - User registration
- `POST /api/auth/login/` - User login
- `GET /api/auth/me/` - Get current user profile

## Notes

- Tokens are stored in localStorage
- The app automatically redirects authenticated users
- CORS must be configured in your Django backend settings

