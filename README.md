# MyDocs — Document Dashboard

React + MUI frontend · Spring Boot 3 backend · H2 (dev) → MySQL (prod)

## Quick start

### Backend
```bash
cd backend
mvn spring-boot:run
# Runs on http://localhost:8080
# H2 console: http://localhost:8080/h2-console
```

### Frontend
```bash
cd frontend
npm install
npm run dev
# Runs on http://localhost:5173
```

## Stack
| Layer | Tech |
|---|---|
| Frontend | React 18 + Vite |
| UI | Material UI (MUI) v5 |
| HTTP client | Axios |
| Toasts | notistack |
| Font | Livvic |
| Backend | Spring Boot 3.2 |
| ORM | Spring Data JPA |
| DB (dev) | H2 in-memory |
| DB (prod) | MySQL |
| Real-time | Spring SseEmitter |

## Switch to MySQL
Edit `backend/src/main/resources/application.properties` — see the comment block at the bottom.
