# ArtGallery

Premium digital art gallery — React + Spring Boot modular monolith (Phase A).

**Discover. Collect. Experience Art.**

## Stack

| Layer | Tech |
|-------|------|
| Frontend | Vite, React 19, TypeScript, Tailwind CSS 4, TanStack Query, Zustand, Framer Motion |
| Backend | Java 21, Spring Boot 3.4, Spring Security JWT, JPA, Flyway, Bean Validation |
| Database | H2 (dev default) · PostgreSQL (optional profile) |

## Phase A features

- JWT auth + refresh tokens
- RBAC: `ROLE_USER`, `ROLE_ARTIST`, `ROLE_OWNER`
- Object-level authorization on artworks
- Artist application → owner approve/reject (transactional role grant)
- Artwork lifecycle: draft → pending review → published
- Categories, search/filter, wishlist
- Local media uploads (S3-ready path later)
- Luxury public site + Artist Studio + Owner Console

## Quick start

### Backend

```bash
cd backend
# with Maven on PATH, or use the local tool under .tools/
mvn spring-boot:run
```

API: http://localhost:8081  
Health: http://localhost:8081/actuator/health

### Frontend

```bash
cd frontend
npm install
npm run dev
```

App: http://localhost:5173

### Demo accounts

| Role | Email | Password |
|------|-------|----------|
| Owner | owner@artgallery.com | Owner@12345 |
| Artist | artist@artgallery.com | Artist@12345 |
| Collector | collector@artgallery.com | Collector@12345 |

## PostgreSQL (optional)

```bash
docker compose up -d
cd backend
mvn spring-boot:run -Dspring-boot.run.profiles=postgres
```

## API base

`http://localhost:8081/api/v1`

## Roadmap (later phases)

- Commerce: cart, orders, payments, discounts, reviews  
- Real-time auctions (WebSockets)  
- Redis / Kafka / CDN / OpenSearch  
- Differentiating features: provenance, offers, exhibitions, AI discovery  
