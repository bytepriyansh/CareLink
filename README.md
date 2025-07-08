

# CareLink AI - Intelligent Healthcare Assistant

![CareLink AI Banner](https://raw.githubusercontent.com/bytepriyansh/CareLinkAI/main/public/banner.png)

CareLink AI is an advanced healthcare assistance platform that leverages artificial intelligence to provide personalized medical support, vital monitoring, and health reporting.

## ✨ Features

- **AI-Powered Health Assistant**: 24/7 virtual healthcare companion
- **Vital Signs Monitoring**: Real-time tracking of key health metrics
- **Automated Reporting**: Generate comprehensive health reports
- **Sketch2AI**: Convert medical sketches into actionable insights
- **Body Language Analysis**: AI-driven interpretation of patient non-verbal cues

## 🚀 Getting Started

### Prerequisites
- Node.js v16+
- npm v8+ or yarn
- Python 3.8+ (for AI components)
- Firebase account (for authentication)

### Installation
1. Clone the repository:
```bash
git clone https://github.com/yourusername/carelink-ai.git
cd carelink-ai
```
2. Install dependencies:
```bash
npm install
# or
yarn install
```
3. Set up environment variables:
```bash
cp .env.example .env
# Fill in your Firebase and API keys
```
4. Start the development server:
```bash
npm run dev
# or
yarn dev
```

### 🛠️ Tech Stack

- **Frontend:** React.js, Next.js, Tailwind CSS  
- **AI Backend:** Gemini AI 
- **Database:** Firebase Firestore  
- **Authentication:** Firebase Auth  
- **UI Components:** ShadCN UI, Lucide Icons


### 📂 Project Structure
```
carelink-ai/
├── public/
├── src/
│   ├── components/
│   ├── contexts/
│   ├── features/
│   │   ├── assistant/
│   │   ├── vitals/
│   │   ├── report/
│   │   ├── sketch2ai/
│   │   └── bodylanguage/
│   ├── hooks/
│   ├── lib/
│   ├── pages/
│   ├── styles/
│   └── types/
├── .env.example
├── package.json
└── README.md
```
