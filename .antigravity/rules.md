# NeuroTrace — Agent Rules File

## Project Type
MERN Stack (MongoDB, Express, React, Node.js)

## Structure
- Backend lives in /server
- Frontend lives in /client
- Never touch or commit the .env file
- Always install npm packages inside /server for backend
- Always install npm packages inside /client for frontend

## Environment Variables (server/.env)
- MONGO_URI = MongoDB Atlas connection string
- JWT_SECRET = secret key for JWT signing
- JWT_EXPIRE = 7d
- PORT = 5000

## Folder Purposes
- server/config      → MongoDB connection (db.js)
- server/models      → Mongoose schemas
- server/routes      → Express route files
- server/middleware  → JWT auth + admin middleware
- client/src/pages   → React page components
- client/src/api     → Axios instance with JWT interceptor

## Completed Tasks (DO NOT modify these files)
- server/config/db.js ✅
- server/models/User.js ✅
- server/models/Question.js ✅
- server/models/Attempt.js ✅
- server/routes/auth.js ✅
- server/routes/questions.js ✅ (GET only so far)
- server/routes/attempts.js ✅
- server/middleware/authMiddleware.js ✅ (protect only)
- server/seed.js ✅
- client/src/api/axios.js ✅
- client/src/App.jsx ✅

## Critical Field Names — NEVER rename these
Attempt model fields:
- timeToFirstInput (Number) — ms before first keypress
- editCount (Number) — number of answer changes
- totalTime (Number) — total seconds on question
- finalAnswer (String)
- isCorrect (Boolean)
- reasoningText (String)
- hesitationScore (Number, default null)
- confidenceScore (Number, default null)
- impulsivityScore (Number, default null)
- reasoningScore (Number, default null)
- cognitivePattern (String, default null)
- feedback (String, default null)

Question model fields:
- questionText, type, options[], correctAnswer
- idealExplanation (NEVER send this to frontend)
- difficulty, subject

## Auth System
- JWT token payload: { userId, role }
- Token stored in localStorage key: neurotrace_token
- Protected routes use: protect middleware
- Admin routes use: protect + authorizeAdmin middleware
- Student role: 'student'
- Admin role: 'admin'

## API Routes Built So Far
- POST /api/auth/register ✅
- POST /api/auth/login ✅
- GET /api/questions ✅ (protected)
- GET /api/questions/:id ✅ (protected)
- POST /api/attempts ✅ (protected)
- GET /api/attempts/my ✅ (protected)
- GET /api/attempts/my/:questionId ✅ (protected)

## Core Feature Reminder
NeuroTrace captures HOW students think by tracking:
timeToFirstInput, editCount, totalTime, reasoningText
These fields MUST be preserved in every API response
that involves attempts.