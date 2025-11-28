Wajibu Backend (server)
cd server
npm install
copy .env from provided content and adjust MONGO_URI and MODERATOR_API_KEY
npm run dev # uses nodemon
Server listens on PORT (default 4000)
Endpoints:

POST /api/auth/anonymous -> { uid } (cookie set)
GET /api/reports -> list reports
POST /api/reports -> create report
PUT /api/reports/:id/status -> moderator update (x-api-key header)
GET /api/stream -> SSE real-time stream
