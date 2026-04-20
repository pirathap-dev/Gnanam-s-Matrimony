# Gnanam's Matrimony

Gnanam's Matrimony is a premium, beautifully designed bilingual matchmaking platform dedicated to serving the Tamil community. Built with a focus on cultural authenticity, privacy, and modern user experience, the application offers a fully responsive interface in both English and Tamil.

## 🌟 Key Features

- **Complete Bilingual Support:** Seamlessly toggle between English and culturally resonant, native Tamil translations.
- **Dynamic Tamil Typography:** Implements intelligent scaling and native layout geometry (`Noto Sans Tamil`) to accommodate complex Tamil script metrics without breaking grid layouts.
- **Mobile-First Design:** Fully responsive UI engineered with complex Tailwind CSS configurations for beautiful rendering on edge-to-edge desktop displays and compact mobile screens alike.
- **Micro-Animations:** Fluid, professional interactions powered by Framer Motion.
- **Multi-Step Registration:** A secure, intuitive 5-step form pipeline capable of capturing user preferences alongside secure profile picture and horoscope file uploads.

## 💻 Tech Stack

**Frontend:**
- React (Vite)
- Tailwind CSS (Utility-first styling mechanism)
- Framer Motion (Declarative animations)
- Lucide React (Iconography)
- React Hot Toast (System notifications)

**Backend:**
- Node.js & Express
- MongoDB (Database operations)
- Cloudinary (For secure asset storage)
- Multer (File upload handling)

## 🚀 Getting Started

To run the application locally, you will need to start both the frontend and backend servers.

### 1. Backend Setup
Navigate to the backend directory, install dependencies, configure your environment variables, and start the server:

```bash
cd backend
npm install
# Set up your .env file with MongoDB URI, Cloudinary credentials, etc.
npm run dev
```

### 2. Frontend Setup
Open a new terminal, navigate to the frontend directory, install dependencies, and start the Vite development server:

```bash
cd frontend
npm install
npm run dev
```

Your frontend should now be running on `http://localhost:5173`.

## 🎨 Cultural Design Philosophy

This project prioritizes **trust and familiarity**. Rather than utilizing robotic, direct dictionary translations, the Tamil localization (`translations.js`) was completely rewritten to use polite, culturally native phrasing tailored specifically for matchmaking. Furthermore, custom CSS mechanics specifically inject "breathing room" (line-height normalizations and vertical padding) ensuring that native Tamil font loops and descenders are rendered elegantly under all conditions.
