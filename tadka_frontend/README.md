# Tadka Tales - Recipe Assistant Frontend

A beautiful React web application for recipe discovery and cooking assistance with voice guidance and bilingual support.

## Features

- 🍳 Recipe discovery and search
- 🎤 Voice assistant for hands-free cooking
- 🌐 Bilingual support (English/Hindi)
- 💖 Save favorite recipes
- 📱 Mobile-first responsive design
- ✨ Beautiful animations with Framer Motion

## Quick Start

### Prerequisites
- Node.js (v18 or higher)
- npm or bun

### Installation

1. **Navigate to frontend directory**
   ```bash
   cd Tadka_Tales/frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Open browser**
   Navigate to `http://localhost:3000`

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

## Project Structure

```
src/
├── components/     # Reusable UI components
├── pages/         # Page components
├── hooks/         # Custom React hooks
├── utils/         # Utility functions
├── assets/        # Images and assets
├── App.jsx        # Main app component
└── main.jsx       # Entry point
```

## Technologies Used

- React 18
- React Router DOM
- Tailwind CSS
- Framer Motion
- Heroicons
- Vite

## Voice Assistant

The app includes a voice assistant that can:
- Listen for cooking commands
- Provide step-by-step guidance
- Support both English and Hindi
- Quick actions for common tasks

## Backend Integration

This frontend is designed to work with a Django backend. Replace mock data with actual API calls when connecting to your backend.

## License

MIT License
