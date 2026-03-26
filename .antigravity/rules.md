- This is a MERN stack project (MongoDB, Express, React, Node.js)
- Backend lives in /server, frontend lives in /client
- Always use Node.js with Express for backend tasks
- Never touch or commit the .env file — secrets live there
- MongoDB is the database — connection string is in server/.env as MONGO_URI
- JWT is used for authentication — secret is JWT_SECRET in .env
- Always install npm packages inside /server (not root) for backend
- Always install npm packages inside /client for frontend

Folder purposes:
  server/config      → MongoDB connection and config files
  server/models      → Mongoose schemas (User, Question, Attempt)
  server/routes      → Express route files (auth, questions, attempts)
  server/middleware  → JWT auth middleware and error handlers
  client/src         → React pages, components, API calls

Core feature reminder:
  NeuroTrace captures: timeToFirstInput, editCount, totalTime, 
  reasoningText per question attempt — this is the cognitive data.
  Every schema and API should preserve these fields.
