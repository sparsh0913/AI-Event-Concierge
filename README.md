# AI Event Concierge Platform

A full-stack web application designed to help teams plan corporate offsites. The platform takes a natural language description of an offsite event, processes it through Google's Gemini API, generates a structured venue proposal, and persists the history in MongoDB.

## Tech Stack
- **Frontend**: Next.js 16 (App Router), React 19, TypeScript
- **Styling**: Tailwind CSS v4 (Clean, minimalist UI)
- **Backend**: Next.js API Routes (`/api/propose`, `/api/history`)
- **Database**: MongoDB (via Mongoose ORM)
- **AI Integration**: Google Gen AI SDK (`@google/genai`) and Gemini 2.5 Flash

---

## Features
- **AI Event Planning**: Enter group size, budget, retreat duration, and preferred environment (e.g. mountains, beach, city) in natural language.
- **Structured Proposal Output**: Returns structured details:
  - **Venue Name**
  - **Location**
  - **Estimated Cost**
  - **"Why it fits" justification**
- **MongoDB Persistence**: Stores every prompt and its corresponding AI recommendation.
- **Search History**: Sidebar/list showing previous searches. Clicking any history card loads that proposal immediately.
- **Loading State**: Visual "AI is planning..." loader during API generation.
- **Error Handling**: Graceful client-side handling for missing keys, connection errors, or database failures.

---

## Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (v18.x or newer)
- [MongoDB](https://www.mongodb.com/try/download/community) running locally (or a MongoDB Atlas connection string)
- A Google Gemini API Key (get one free at [Google AI Studio](https://aistudio.google.com/))

### Installation

1. **Clone or navigate to the repository directory**:
   ```bash
   cd ai-event-concierge
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment Variables**:
   Create a `.env.local` file in the root directory:
   ```bash
   cp .env.local.example .env.local
   ```
   Open `.env.local` and fill in your MongoDB connection string and Gemini API Key:
   ```env
   MONGODB_URI=mongodb://localhost:27017/event-concierge
   GEMINI_API_KEY=your_gemini_api_key_here
   ```

4. **Start the Development Server**:
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser to view the application.

5. **Build for Production**:
   ```bash
   npm run build
   ```

---

## Project Structure
```text
ai-event-concierge/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── propose/
│   │   │   │   └── route.ts     # POST API to prompt Gemini & store results
│   │   │   └── history/
│   │   │       └── route.ts     # GET API to fetch search history
│   │   ├── globals.css          # Tailwind CSS import & theme settings
│   │   ├── layout.tsx           # Global HTML layout (Geist font)
│   │   └── page.tsx             # Interactive dashboard (Search & History UI)
│   ├── lib/
│   │   └── db.ts                # cached MongoDB connection helper
│   └── models/
│       └── SearchRequest.ts     # Mongoose schema for SearchRequest logs
├── .env.local.example           # Example environment file
├── tsconfig.json                # TypeScript configurations
└── package.json                 # Node dependencies & run scripts
```
