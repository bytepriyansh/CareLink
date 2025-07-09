# 🩺 CareLink AI – Your Emergency Health Companion

**“Clarity. Calm. Care — exactly when it matters.”**

CareLink AI is a real-time, AI-powered emergency assistant designed to help users during medical crises — even when alone. It listens to your symptoms via voice or text, analyzes urgency using Gemini AI, locates nearby hospitals, and alerts your emergency contacts. It’s fast, accessible, and built for every life-or-death moment.

---

## 🌐 Live Preview

🔗 [carelinkai.vercel.app](https://carelinkai.vercel.app)

---

## 📂 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Pages](#-pages-overview)
- [Setup Instructions](#-setup-instructions)
- [Folder Structure](#-folder-structure)
- [Future Scope](#-future-scope)
- [Team](#-team)

---

## ✨ Features

- ✅ Voice/Text symptom input  
- ✅ Gemini AI medical guidance in real-time  
- ✅ Nearby hospital locator via Google Maps  
- ✅ SOS alert system (email/SMS) to family  
- ✅ Vitals analysis tools  
- ✅ Scan-to-AI visual diagnosis (Sketch2AI)  
- ✅ Body language-based condition detection  
- ✅ Accessibility-first design for elderly and kids

---

## ⚙️ Tech Stack

| Layer      | Tech                              |
|------------|------------------------------------|
| Frontend   | React.js, Tailwind CSS             |
| AI Engine  | Gemini API (Google AI)             |
| Voice Input| Web Speech API                     |
| Animations | GSAP (GreenSock)                   |

---

## 📄 Pages Overview

### 🏠 Home
- Clean animated landing page
- Smooth GSAP transitions
- Sections for feature previews, CTA buttons, and vision

### 🤖 Assistant
- Real-time emergency chat powered by Gemini
- Voice or text input with natural medical responses
- Handles symptoms, confusion, panic-friendly replies

### ❤️ Vitals
- Track heart rate, temperature, BP, etc. *(Mock UI or external integrations possible)*
- Designed for wearable device sync *(future-ready)*

### 📊 Report
- Post-emergency summaries
- User logs (non-personal, mock data)
- Shareable with doctors or emergency contacts

### ✍️ Sketch2AI
- Upload or draw basic body diagrams showing pain areas
- Gemini interprets sketches to provide probable causes
- Unique visual-to-AI interaction feature

### 🧍 BodyLanguage
- Describe what you see in someone (e.g., "He’s sweating and shaking")
- Gemini infers possible emergency (stroke, heart attack, etc.)
- Perfect for bystanders helping unresponsive patients

---

## 📁 Folder Structure
```bash
/carelink-ai
├── public/
├── src/
│ ├── components/
│ ├── pages/
│ │ ├── Home.jsx
│ │ ├── Assistant.jsx
│ │ ├── Vitals.jsx
│ │ ├── Report.jsx
│ │ ├── Sketch2AI.jsx
│ │ └── BodyLanguage.jsx
│ ├── utils/
│ └── App.jsx
├── .env
└── README.md
```


---

## 🛠️ Setup Instructions

```bash
git clone https://github.com/bytepriyansh/carelink-ai.git
cd carelink-ai
npm install
npm run dev
```

## 👥 Team – The Git Reapers

- **Priyansh Narang** – Frontend, UI Logic  
- **Shivam Kharat** – Backend, Firebase/Auth  
- **Kaushal Loya** – UI/UX, Testing, Design


