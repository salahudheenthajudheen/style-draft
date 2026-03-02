# ✂️ Style Draft — AI Outfit Designer

An AI-powered fashion design tool that generates professional 2D draft layouts and trending style recommendations based on your fabric, body type, and occasion.

![Style Draft](https://img.shields.io/badge/AI-Powered-black?style=for-the-badge) ![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=white) ![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178C6?style=for-the-badge&logo=typescript&logoColor=white) ![Vite](https://img.shields.io/badge/Vite-6-646CFF?style=for-the-badge&logo=vite&logoColor=white)

## ✨ Features

- **AI Design Recommendations** — Input your fabric details and body type to get 3 unique outfit concepts powered by Google Gemini
- **AI-Generated Illustrations** — Each design comes with a technical fashion flat drawing generated via Pollinations AI
- **2D Draft Layouts** — View SVG-based garment pattern layouts for each recommendation
- **Save & Revisit** — Bookmark your favorite designs to localStorage for later reference
- **Responsive UI** — Clean, brutalist-inspired design that works on desktop and mobile

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Framework** | React 19 + TypeScript |
| **Build Tool** | Vite 6 |
| **Styling** | Tailwind CSS 4 |
| **AI Text** | Google Gemini API (`gemini-3-flash-preview`) |
| **AI Images** | Pollinations AI (Flux model) |
| **Animations** | Motion (Framer Motion) |
| **Icons** | Lucide React |

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or higher)
- A [Gemini API key](https://aistudio.google.com/apikey)
- A [Pollinations API key](https://pollinations.ai) (optional, for image generation)

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/salahudheenthajudheen/style-draft.git
   cd style-draft
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**
   ```bash
   cp .env.example .env
   ```
   Then open `.env` and add your API keys:
   ```env
   GEMINI_API_KEY="your_gemini_api_key"
   VITE_POLLINATIONS_API_KEY="your_pollinations_api_key"
   ```

4. **Start the dev server:**
   ```bash
   npm run dev
   ```

5. Open **http://localhost:3000** in your browser.

## 📁 Project Structure

```
style-draft/
├── src/
│   ├── components/
│   │   ├── DesignForm.tsx        # Input form for fabric & body details
│   │   └── RecommendationCard.tsx # Card displaying each design recommendation
│   ├── services/
│   │   └── gemini.ts             # Gemini API integration & image generation
│   ├── App.tsx                   # Main app with layout, history sidebar
│   ├── types.ts                  # TypeScript interfaces
│   ├── utils.ts                  # Utility functions (cn helper)
│   ├── index.css                 # Global styles & Tailwind config
│   └── main.tsx                  # React entry point
├── index.html                    # HTML template
├── vite.config.ts                # Vite configuration
├── tsconfig.json                 # TypeScript configuration
├── .env.example                  # Environment variable template
└── package.json
```

## 🎨 How It Works

1. **Input** — Fill in your fabric type, color, material length, body type, height, and occasion
2. **Generate** — The app sends your inputs to Google Gemini, which returns 3 tailored outfit concepts with structured JSON
3. **Visualize** — Each concept gets an AI-generated technical fashion illustration via Pollinations AI
4. **Save** — Bookmark designs you like; they're stored in your browser's localStorage

## 📜 Available Scripts

| Command | Description |
|---------|------------|
| `npm run dev` | Start development server on port 3000 |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
| `npm run lint` | TypeScript type checking |

## 📄 License

This project is private.

---

<p align="center">Built with ❤️ using Google Gemini & React</p>
