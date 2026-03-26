# NeuroTrace — API Documentation

This document provides a detailed reference for all API endpoints in the NeuroTrace platform.

## Summary Table

| Method | Route | Access | Description |
|--------|-------|--------|-------------|
| POST | /api/auth/register | Public | Register a new user |
| POST | /api/auth/login | Public | Login and receive JWT token |
| GET | /api/questions | Student | List all questions (basic info) |
| GET | /api/questions/:id | Student | Get single question detail |
| POST | /api/questions | Admin | Create a new question |
| PUT | /api/questions/:id | Admin | Update an existing question |
| DELETE | /api/questions/:id | Admin | Delete a question |
| POST | /api/attempts | Student | Submit a question attempt |
| GET | /api/attempts/my | Student | Get logged-in user's attempt history |
| GET | /api/attempts/my/:questionId | Student | Get user's attempts for a specific question |
| GET | /api/profile/my | Student | View own cognitive profile summary |
| GET | /api/profile/:userId | Admin | View any student's profile summary |
| GET | /api/analytics/overview | Admin | Class-wide performance overview |
| GET | /api/analytics/students | Admin | Benchmarking report for all students |
| GET | /api/analytics/questions | Admin | Question engagement and difficulty analysis |
| GET | /health | Public | Server health check |

---

## AUTH

### POST /api/auth/register
**Access:** Public  
**Description:** Creates a new user account.  
**Request Body:**
```json
{
  "name": "Jane Doe",
  "email": "jane@example.com",
  "password": "Password123",
  "role": "student" 
}
```
**Success Response:** (201 Created)
```json
{
  "token": "eyJhbGci...",
  "user": { "id": "...", "name": "Jane Doe", "email": "...", "role": "student" }
}
```
**Error Responses:**
- 400: Email already registered
- 400: Validation failed (name too short, invalid email, password < 6 chars)

### POST /api/auth/login
**Access:** Public  
**Description:** Authenticates user and returns a JWT.  
**Request Body:**
```json
{
  "email": "jane@example.com",
  "password": "Password123"
}
```
**Success Response:** (200 OK)
```json
{
  "token": "eyJhbGci...",
  "user": { "id": "...", "name": "Jane Doe", "email": "...", "role": "student" }
}
```
**Error Responses:**
- 401: Invalid credentials
- 400: Validation failed (invalid email format)

---

## QUESTIONS

### GET /api/questions
**Access:** Student (Protected)  
**Description:** Returns a list of all questions. Field `idealExplanation` is hidden.  
**Headers:** `Authorization: Bearer <token>`  
**Success Response:** (200 OK)
```json
{
  "count": 5,
  "questions": [ { "_id": "...", "questionText": "...", "type": "mcq", ... } ]
}
```

### GET /api/questions/:id
**Access:** Student (Protected)  
**Description:** Returns details of a specific question.  
**Headers:** `Authorization: Bearer <token>`  
**Success Response:** (200 OK)
```json
{
  "question": { "_id": "...", "questionText": "...", ... }
}
```

### POST /api/questions
**Access:** Admin (Protected + Authorized)  
**Description:** Creates a new question.  
**Headers:** `Authorization: Bearer <admin_token>`  
**Request Body:**
```json
{
  "questionText": "Minimum 10 chars...",
  "type": "mcq",
  "options": ["Option A", "Option B"],
  "correctAnswer": "Option A",
  "idealExplanation": "Min 20 characters explanation...",
  "difficulty": "medium",
  "subject": "General"
}
```
**Success Response:** (201 Created)
```json
{ "message": "Question created successfully", "question": { ... } }
```

### PUT /api/questions/:id
**Access:** Admin (Protected + Authorized)  
**Description:** Updates an existing question.  
**Headers:** `Authorization: Bearer <admin_token>`  
**Request Body:** Any subset of question fields.  
**Success Response:** (200 OK)
```json
{ "message": "Question updated successfully", "question": { ... } }
```

### DELETE /api/questions/:id
**Access:** Admin (Protected + Authorized)  
**Description:** Deletes a question.  
**Headers:** `Authorization: Bearer <admin_token>`  
**Success Response:** (200 OK)
```json
{ "message": "Question deleted successfully" }
```

---

## ATTEMPTS

### POST /api/attempts
**Access:** Student (Protected)  
**Description:** Submits a student's answer along with behavioral tracking data.  
**Headers:** `Authorization: Bearer <token>`  
**Request Body:**
```json
{
  "questionId": "ObjectId...",
  "finalAnswer": "...",
  "timeToFirstInput": 3500,
  "editCount": 2,
  "totalTime": 45,
  "reasoningText": "Optional explanation"
}
```
**Success Response:** (201 Created)
```json
{ "message": "Attempt saved successfully", "attempt": { "isCorrect": true, ... } }
```

### GET /api/attempts/my
**Access:** Student (Protected)  
**Description:** Lists all attempts by the current user.  
**Headers:** `Authorization: Bearer <token>`  
**Success Response:** (200 OK)
```json
{ "count": 10, "attempts": [ ... ] }
```

### GET /api/attempts/my/:questionId
**Access:** Student (Protected)  
**Description:** Lists attempts for a specific question by the current user.  
**Headers:** `Authorization: Bearer <token>`  
**Success Response:** (200 OK)
```json
{ "count": 2, "attempts": [ ... ] }
```

---

## PROFILE

### GET /api/profile/my
**Access:** Student (Protected)  
**Description:** Aggregates attempt history into cognitive statistics.  
**Headers:** `Authorization: Bearer <token>`  
**Success Response:** (200 OK)
```json
{
  "totalAttempts": 5,
  "accuracyRate": 80,
  "hesitationLevel": "Medium",
  "impulsivityLevel": "Low",
  "confidenceLevel": "High",
  "recentAttempts": [ ... ]
}
```

### GET /api/profile/:userId
**Access:** Admin (Protected + Authorized)  
**Description:** Allows admin to view any student's cognitive summary.  
**Headers:** `Authorization: Bearer <admin_token>`  
**Success Response:** Same as /profile/my.

---

## ANALYTICS

### GET /api/analytics/overview
**Access:** Admin (Protected + Authorized)  
**Description:** High-level class performance metrics.  
**Headers:** `Authorization: Bearer <admin_token>`  
**Success Response:** (200 OK)
```json
{
  "totalStudents": 25,
  "overallAccuracy": 72.5,
  "mostAttemptedQuestion": { "questionText": "...", "attemptCount": 45 },
  "hardestQuestion": { "questionText": "...", "accuracyRate": 15.2 }
}
```

### GET /api/analytics/students
**Access:** Admin (Protected + Authorized)  
**Description:** Benchmarking list of all students.  
**Headers:** `Authorization: Bearer <admin_token>`  
**Success Response:** (200 OK)
```json
{ "count": 25, "students": [ { "name": "...", "accuracyRate": 85, ... } ] }
```

### GET /api/analytics/questions
**Access:** Admin (Protected + Authorized)  
**Description:** Detail stats per question.  
**Headers:** `Authorization: Bearer <admin_token>`  
**Success Response:** (200 OK)
```json
{ "count": 15, "questions": [ { "questionText": "...", "totalAttempts": 40, ... } ] }
```

---

## HEALTH

### GET /health
**Access:** Public  
**Description:** Check if the server is running.  
**Success Response:** (200 OK) `{"status": "ok", "project": "NeuroTrace"}`

---

## Phase 3 Endpoints (Coming Soon)

- **POST /api/analysis/attempt/:id**  
  Triggers AI engine analysis on a specific attempt to generate sentiment and logical scores.
- **GET /api/analysis/profile/:userId**  
  Returns a full-text AI-generated report of a student's cognitive strengths and weaknesses.
