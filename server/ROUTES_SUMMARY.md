# NeuroTrace — Quick Route Reference

This file provides a quick guide to endpoint categorization and access requirements.

## Public Routes (no token needed)
- **POST /api/auth/register**: User signup
- **POST /api/auth/login**: User authentication
- **GET  /health**: System status

## Student Routes (Bearer token required)
- **GET    /api/questions**: Browse available questions
- **GET    /api/questions/:id**: View question details
- **POST   /api/attempts**: Submit an answer and tracker data
- **GET    /api/attempts/my**: View personal answer history
- **GET    /api/attempts/my/:questionId**: View history for a specific question
- **GET    /api/profile/my**: View personal cognitive analytics

## Admin Routes (Admin token required)
- **POST   /api/questions**: Create a new technical question
- **PUT    /api/questions/:id**: Edit an existing question
- **DELETE /api/questions/:id**: Remove a question
- **GET    /api/profile/:userId**: Audit a specific student's profile
- **GET    /api/analytics/overview**: View class performance dashboard
- **GET    /api/analytics/students**: Compare performance across all students
- **GET    /api/analytics/questions**: Identify most/least difficult questions
