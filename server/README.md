# Wajibu Backend (server)

1. cd server
2. npm install
3. copy .env from provided content and adjust MONGO_URI and MODERATOR_API_KEY
4. npm run dev   # uses nodemon
5. Server listens on PORT (default 4000)

Endpoints:
- POST /api/auth/anonymous  -> { uid } (cookie set)
- GET  /api/reports         -> list reports
- POST /api/reports        -> create report
- PUT  /api/reports/:id/status  -> moderator update (x-api-key header)
- GET  /api/stream         -> SSE real-time stream



