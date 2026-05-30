# 🎓 CGPA Calculator — Amrita Vishwa Vidyapeetham

A full-stack web app to calculate and track your CGPA across semesters using Amrita's official grading scheme.

**Stack:** React + Vite · Node.js + Express · PostgreSQL · JWT Auth · Docker

---

## Features

- 🔐 Student registration & login with JWT authentication
- ➕ Add subjects with marks and credits per semester
- 📊 Automatic grade and grade point conversion (Amrita rules)
- 📈 SGPA per semester + cumulative CGPA
- 🎨 Bar chart of semester-wise performance
- 🏷️ Classification: First Class with Distinction / First Class / Second Class / Pass
- 👨‍💼 Admin panel to manage grading rules for multiple universities
- 🌙 Dark mode UI

---

## Amrita Grading Scheme (B.Tech 2023 Regulations)

| Marks | Grade | Grade Points |
|-------|-------|-------------|
| 91–100 | O | 10 |
| 81–90 | A+ | 9 |
| 71–80 | A | 8 |
| 61–70 | B+ | 7 |
| 51–60 | B | 6 |
| 45–50 | C | 5 |
| 0–44 | F | 0 |

**SGPA** = Σ(Ci × GPi) / Σ Ci  
**CGPA** = Σ(Semester Credits × SGPA) / Σ(Semester Credits)

---

## Project Structure

```
cgpa-calculator/
├── backend/
│   ├── src/
│   │   ├── config/       # Database connection
│   │   ├── controllers/  # Auth, GPA, Admin logic
│   │   ├── middleware/   # JWT auth guard
│   │   └── routes/       # Express route definitions
│   ├── tests/            # Jest + Supertest tests
│   ├── .env.example
│   └── Dockerfile
├── frontend/
│   ├── src/
│   │   ├── components/   # SemesterCard, Chart, Modal, etc.
│   │   ├── context/      # AuthContext (React Context API)
│   │   ├── pages/        # Login, Register, Dashboard
│   │   └── utils/        # Axios instance with JWT interceptor
│   └── Dockerfile
├── database/
│   └── schema.sql        # All tables + Amrita grading seed
└── docker-compose.yml
```

---

## Quick Start (Docker — recommended)

```bash
git clone https://github.com/YOUR_USERNAME/cgpa-calculator
cd cgpa-calculator
docker-compose up --build
```

Then open http://localhost:5173

---

## Manual Setup (without Docker)

### 1. Database

Install PostgreSQL, then:

```bash
createdb cgpa_calculator
psql cgpa_calculator < database/schema.sql
```

### 2. Backend

```bash
cd backend
cp .env.example .env
# Edit .env with your DATABASE_URL and a JWT_SECRET
npm install
npm run dev
```

Runs on http://localhost:5000

### 3. Frontend

```bash
cd frontend
npm install
npm run dev
```

Runs on http://localhost:5173

---

## API Reference

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/auth/register` | No | Create account |
| POST | `/api/auth/login` | No | Login, get JWT |
| GET | `/api/auth/me` | Yes | Get current user |
| POST | `/api/gpa/subject` | Yes | Add subject with marks |
| PUT | `/api/gpa/subject/:id` | Yes | Update subject |
| DELETE | `/api/gpa/subject/:id` | Yes | Delete subject |
| GET | `/api/gpa/report` | Yes | Full CGPA report |
| POST | `/api/gpa/calculate` | No | Quick SGPA (no save) |
| GET | `/api/admin/users` | Admin | List all users |
| GET | `/api/admin/grading-rules` | Admin | List all rules |
| POST | `/api/admin/grading-rules` | Admin | Add/update rule |

---

## Deployment

### Backend → Render

1. Push to GitHub
2. Create a new Web Service on [render.com](https://render.com)
3. Root directory: `backend`
4. Build command: `npm install`
5. Start command: `node src/server.js`
6. Add environment variables (DATABASE_URL, JWT_SECRET, NODE_ENV=production)

### Frontend → Vercel

1. Create a new project on [vercel.com](https://vercel.com)
2. Root directory: `frontend`
3. Framework preset: Vite
4. Add env variable: `VITE_API_URL=https://your-render-url.onrender.com`
   - Then update `frontend/src/utils/api.js` baseURL to use `import.meta.env.VITE_API_URL`

### Database → Render PostgreSQL or Supabase

Both are free tier. Get the connection string and set it as `DATABASE_URL` in your backend env.

---

## Running Tests

```bash
cd backend
npm test
```

---

## What I Learned Building This

- **JWT authentication** flow: token generation, storage, and protected routes
- **React Context API** for global auth state
- **Axios interceptors** to automatically attach tokens to every request
- **PostgreSQL** schema design with foreign keys and cascades
- **Express middleware** pattern: auth guard reusable across all protected routes
- **CGPA formula**: weighted average across semesters
- **Docker Compose** to wire up multiple services

---

*Built by [Your Name] — CSE, Amrita Vishwa Vidyapeetham Chennai*
