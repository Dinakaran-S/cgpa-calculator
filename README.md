# CGPA Calculator — Amrita Vishwa Vidyapeetham

A full-stack web application to calculate and track CGPA across semesters using Amrita's official grading scheme.

🔗 **Live Demo:** [cgpa-calculator-five-black.vercel.app](https://cgpa-calculator-five-black.vercel.app)

---

## Screenshots

> <img width="300" height="300" alt="image" src="https://github.com/user-attachments/assets/88308f5a-69b9-4915-8d50-c8e66f8dc667" />
 → <img width="300" height="300" alt="image" src="https://github.com/user-attachments/assets/5e9803e6-4da9-434a-b302-299511f5612e" />
 → Track your CGPA across semesters with a live bar chart.

---

## Features

- Student registration and login with JWT authentication
- Add subjects with marks and credits per semester
- Automatic grade and grade point conversion using Amrita's B.Tech 2023 regulations
- SGPA calculated per semester, CGPA calculated across all semesters
- Bar chart showing semester-wise performance
- Degree classification: First Class with Distinction / First Class / Second Class / Pass
- Dark mode UI

---

## Grading Scheme (B.Tech Regulations 2023)

| Marks   | Grade | Grade Points |
|---------|-------|-------------|
| 91–100  | O     | 10          |
| 81–90   | A+    | 9           |
| 71–80   | A     | 8           |
| 61–70   | B+    | 7           |
| 51–60   | B     | 6           |
| 45–50   | C     | 5           |
| 0–44    | F     | 0           |

**Formulas used:**

SGPA = Σ(Credits × Grade Points) / Σ Credits

CGPA = Σ(Semester Credits × SGPA) / Σ Semester Credits

---

## Tech Stack

| Layer     | Technology                        |
|-----------|-----------------------------------|
| Frontend  | React.js, Vite, Tailwind CSS, Chart.js |
| Backend   | Node.js, Express.js               |
| Database  | PostgreSQL                        |
| Auth      | JWT (JSON Web Tokens), bcrypt     |
| Deployment| Vercel (frontend), Render (backend + DB) |

---

## Project Structure

```
cgpa-calculator/
├── backend/
│   ├── src/
│   │   ├── config/         # PostgreSQL connection
│   │   ├── controllers/    # Auth, GPA, Admin logic
│   │   ├── middleware/     # JWT auth guard
│   │   └── routes/         # Express route definitions
│   └── tests/              # Jest + Supertest tests
├── frontend/
│   └── src/
│       ├── components/     # SemesterCard, Chart, Modal
│       ├── context/        # AuthContext (React Context API)
│       ├── pages/          # Login, Register, Dashboard
│       └── utils/          # Axios instance with JWT interceptor
└── database/
    └── schema.sql          # Tables + Amrita grading rules seed
```

---

## Run Locally

### Prerequisites
- Node.js
- PostgreSQL

### 1. Clone the repo
```bash
git clone https://github.com/Dinakaran-S/cgpa-calculator.git
cd cgpa-calculator
```

### 2. Set up the database
```bash
createdb cgpa_calculator
psql cgpa_calculator < database/schema.sql
```

### 3. Backend
```bash
cd cgpa-calculator/backend
cp .env.example .env
# Fill in DATABASE_URL and JWT_SECRET in .env
npm install
npm run dev
```

### 4. Frontend
```bash
cd cgpa-calculator/frontend
npm install
npm run dev
```

Open `http://localhost:5173`

---

## API Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/auth/register` | No | Create account |
| POST | `/api/auth/login` | No | Login, receive JWT |
| GET | `/api/auth/me` | Yes | Get current user |
| POST | `/api/gpa/subject` | Yes | Add subject with marks |
| PUT | `/api/gpa/subject/:id` | Yes | Update subject |
| DELETE | `/api/gpa/subject/:id` | Yes | Delete subject |
| GET | `/api/gpa/report` | Yes | Full CGPA report |
| POST | `/api/gpa/calculate` | No | Quick SGPA (no save) |

---

## Deployment

- **Frontend** → [Vercel](https://vercel.com) — root directory: `cgpa-calculator/frontend`
- **Backend** → [Render](https://render.com) — root directory: `cgpa-calculator/backend`
- **Database** → Render PostgreSQL (free tier)

---

## What I Learned

- JWT authentication flow — token generation, protected routes, interceptors
- React Context API for global auth state management
- Axios interceptors to automatically attach tokens to every request
- PostgreSQL schema design with foreign keys and cascading deletes
- Express middleware pattern for reusable route protection
- Deploying a full-stack app across Vercel + Render

---

*Built by Dinakaran S — B.Tech CSE, Amrita Vishwa Vidyapeetham Chennai (2025)*
