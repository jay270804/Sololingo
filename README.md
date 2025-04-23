# 🌍 Sololingo

Sololingo is a Duolingo-inspired language learning web application built with a modern tech stack. It offers a gamified learning experience that helps users master new languages through interactive lessons, quizzes, and challenges.

---

## 🚀 Features

- **Language Lessons**: Choose from multiple languages and complete lessons tailored to different skill levels.
- **Progress Tracking**: Rounded progress bars visually show your learning journey.
- **Hearts System**: Lose hearts on wrong answers. When depleted, a modal prompts actions like practicing previous lessons or subscribing.
- **Practice Mode**: Revisit completed lessons to strengthen understanding.
- **Gamification**:
  - Earn points for correct answers
  - Complete daily/weekly quests
  - Climb the leaderboard against other learners
- **Subscription System**: Unlock premium features like unlimited hearts, exclusive content, and more.
- **Responsive UI**: Built using **Shadcn/ui** and Tailwind for a clean, intuitive interface.
- **AI Chatbot Integration**: Practice conversations with a chatbot powered by **Langchain**, **Ollama**, and **Llama 3.1**.

---

## 🧱 Tech Stack

| Layer         | Tech                                      |
| ------------- | ----------------------------------------- |
| Frontend      | Next.js, Tailwind CSS, Shadcn/ui          |
| Backend       | Django / FastAPI (for chatbot & APIs)     |
| Database      | DrizzleORM with Neon (PostgreSQL)         |
| Auth          | Clerk                                     |
| Payments      | Razorpay                                  |
| AI/LLM        | Langchain + Ollama + Llama 3.1            |
| Realtime Comm | Socket connection between Next.js & Python|

---

## 📦 Installation

1. **Clone the repo**  
   ```bash
   git clone https://github.com/your-username/sololingo.git
   cd sololingo
2. **Install frontend dependencies**
    ```bash
    npm install
3. **Start the dev server**
    ```bash
    npm run dev
---
 
