# SnapCove UI

A modern, sleek frontend interface for SnapCove - a campus event photo gallery platform.

## Features

- 🎨 Modern dark theme design
- 📱 Responsive layout
- 🎯 Clean component architecture
- 🚀 Built with React + Vite
- 🎭 Custom design system

## Design Philosophy

This UI showcases a modern, gradient-enhanced design system with:
- Deep purple/indigo color scheme
- Smooth animations and transitions
- Card-based layouts
- Intuitive navigation
- Premium feel

## Getting Started

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build
```

## Project Structure

```
src/
  ├── components/     # Reusable components (Navbar, Sidebar, Layout)
  ├── pages/          # Page components (Dashboard, Events, etc.)
  ├── api/            # API utilities
  ├── auth/           # Authentication components
  └── utils/          # Utility functions
```

## Routes

- `/` - Dashboard
- `/events` - Events list
- `/events/:eventId` - Event detail
- `/events/:eventId/albums/:albumId` - Gallery view
- `/photos/:photoId` - Photo detail view
