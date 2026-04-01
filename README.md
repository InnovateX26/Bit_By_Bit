# 🏥 CareBot+ | Your Privacy-First Personal Health AI

Welcome to the **CareBot+ Dashboard**! This is a comprehensive, modern, and highly interactive healthcare assistant application built entirely with **Next.js 15**, **React 19**, and robust security protocols. Whether you need immediate medical advice, medication tracking, or emergency service routing, CareBot+ provides a unified, beautiful interface to handle it all securely.

---

## ✨ Features Overview

### 💬 Multilingual AI Chat Assistant
Powered by **Google's Gemini Flash** and integrated seamlessly via the **Vercel AI SDK**, our Chat Assistant acts like a personal doctor in your pocket. 
- **Image Recognition**: Upload photos of prescriptions or symptoms and the AI will analyze them on the fly.
- **Multilingual Support**: Completely fluent in English, Spanish, Hindi, Bengali, French, and Arabic to assist users in their native language—dynamic system-injected constraints instantly pivot the AI accurately.
- **Advanced Context Parsing**: Memory retention to ensure consistent conversations, dynamically rendering rich medical logic directly in the UI.

### 🛡️ Native MongoDB Authentication
Say goodbye to insecure local storage. CareBot+ features a deeply integrated, blazing-fast native authentication suite.
- Leverages Next.js `route.ts` API mechanics to securely hash (`bcryptjs`) and sign (`jsonwebtoken`) all credentials without relying on an external server.
- Built across a solid Mongoose Schema to govern user data cleanly across your MongoDB Atlas cluster.

### 💊 Medication Management
A fully fleshed-out manager allowing users to log, track, and monitor their daily medical prescriptions and habits on automated timelines.

### 🚨 Emergency & Nearby Services
Utilizes integrated interactive mapping frameworks (`React Leaflet`) to pull up essential geographical health services around the user's immediate coordinates:
- 🏥 Nearby Hospitals
- 🚓 Police Stations 
- 💊 Pharmacies

### 🧠 Mental Wellness Suite
A dedicated section designed to help users track emotional states, log mental health notes, and receive privacy-safe AI-backed guidance without sharing sensitive data externally.

---

## 💻 Tech Stack

- **Framework**: [Next.js 15](https://nextjs.org) (App Router)
- **Library**: [React 19](https://react.dev)
- **Styling**: [Tailwind CSS](https://tailwindcss.com) + [Shadcn UI](https://ui.shadcn.com)
- **Database**: [MongoDB](https://www.mongodb.com) (via [Mongoose](https://mongoosejs.com))
- **AI Core**: [Google Generative AI](https://deepmind.google/technologies/gemini/) + [Vercel AI SDK](https://sdk.vercel.ai/docs)
- **Mapping**: [Leaflet](https://leafletjs.com)

---

## 🛠️ Getting Started Locally

### Prerequisites
Make sure you have Node.js version `^20.0.0` or higher installed.

### 1. Clone the repository
```bash
git clone https://github.com/your-username/carebot.git
cd carebot
```

### 2. Install dependencies
```bash
npm install
```

### 3. Configure your Environment
Take the `.env` template and create a new local environment overrides file:
```bash
touch .env.local
```
Inside your new `.env.local` file, input the following configuration blocks:
```env
# Essential Next.js Variable (Forces the app to hit its own backend API)
NEXT_PUBLIC_API_URL=/api

# Google Generative AI API Key
GOOGLE_GENERATIVE_AI_API_KEY=your-gemini-key

# MongoDB Connection String (Note: If your password contains '@', encode it to '%40')
MONGODB_URI="mongodb+srv://<username>:<password>@cluster0.db.mongodb.net/?appName=CareBot"

# Authentication Secret
NEXTAUTH_SECRET=your-super-secret-jwt-encryption-key-minimum-32-chars
```

### 4. Run the Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) with your browser to experience CareBot+!

*(Note: If you plan on testing visually across different devices on your same WiFi network like a mobile phone, run `npm run dev -- -H 0.0.0.0` instead to broadcast your `localhost` address!)*

---

## 🔒 Security Notice
Carebot+ aims to guide its users seamlessly through healthcare concepts. However, AI responses naturally simulate logic and **should never replace professional medical diagnoses**. The system prominently logs chat messages against risk-classification rulesets to encourage users to actively seek 911 / emergency services if imminent threat flags are tripped.
