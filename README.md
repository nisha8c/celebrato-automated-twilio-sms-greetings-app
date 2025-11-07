# 🎉 Celebrato — Automated Greetings & Celebration App

> Send beautiful, personalized greetings automatically for birthdays, anniversaries, and special days — without remembering them!  
> Built with modern technologies and a mobile-first design.

---

## ✨ Overview

**Celebrato** is a full-stack application that manages contacts, stores birthdays/anniversaries, and automatically sends them rich SMS greetings using Twilio.  
It features a modern glassmorphism-styled dashboard for managing templates, schedules, and recipients.

---

## 🚀 Features

- 🎂 Auto-send birthday & anniversary SMS messages  
- 🪩 Beautiful animated greeting templates  
- 💾 Manage message templates from a rich dashboard  
- 👥 Contact management with dates & phone numbers  
- 🔐 JWT-based login & authentication  
- ⏰ Daily cron scheduler for sending messages  
- 📱 Fully responsive (mobile-first) UI with floating glass screens  
- 🌈 Built with TypeScript across frontend and backend

---

## 🧠 Tech Stack

### 🔧 Backend
| Technology | Purpose |
|-------------|----------|
| **Node.js / Express** | Core API server |
| **Apollo Server (GraphQL)** | API schema & resolver layer |
| **Prisma + PostgreSQL** | ORM & database |
| **Twilio API** | SMS sending service |
| **Node-Cron** | Scheduled message automation |
| **TypeScript** | Type safety |
| **dotenv** | Environment configuration |
| **HTTPS + mkcert** | Secure local development |

### 🎨 Frontend
| Technology | Purpose |
|-------------|----------|
| **Vite + React + TypeScript** | Frontend framework |
| **Apollo Client** | GraphQL client for API communication |
| **shadcn/ui** | Pre-built accessible UI components |
| **TailwindCSS** | Styling & responsive layout |
| **Framer Motion** | Smooth animations |
| **Lucide Icons** | Crisp vector icons |

---

## 🏗️ Project Structure

_Yet to be added_



---

## ⚙️ Environment Variables

Create `.env` inside `backend/`:

```bash
DATABASE_URL="postgresql://USER:PASSWORD@localhost:5432/celebrato"
JWT_SECRET="supersecretkey"
TWILIO_ACCOUNT_SID="your_twilio_account_sid"
TWILIO_AUTH_TOKEN="your_twilio_auth_token"
TWILIO_PHONE_NUMBER="+1234567890"



## 💻 Setup & Run
### 🧩 1. Clone the repository
git clone https://github.com/<your-username>/celebrato.git
cd celebrato

### ⚙️ 2. Backend Setup
cd backend
npm install


### Generate Prisma client and apply migrations:

npx prisma generate
npx prisma migrate dev --name init


### Create local HTTPS certificates (only once):

brew install mkcert
mkcert -install
mkcert localhost


### Start the backend server:

npm run dev


### You’ll see:

🔒 HTTPS Server running at https://localhost:4000/graphql


Open the local Apollo Sandbox:
👉 https://localhost:4000/graphql



## 🎨 3. Frontend Setup
cd ../frontend
npm install
npm run dev


Visit the app at:

http://localhost:5173
