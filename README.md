# AURELUX Sovereign

Enterprise-grade global celebrity management and private booking ecosystem.

## Website-First Stack
- Website UI: Static HTML + JavaScript in `static/`
- API: Node.js + Express + JWT auth + RBAC
- Optional app layer: Next.js (kept for expansion, not required for website mode)
- Database schema: PostgreSQL Prisma schema in `backend/prisma/schema.prisma`

## Run (Professional Website Mode)
1. `cd aurelux-sovereign`
2. `npm install`
3. `npm run dev`

- Website: http://localhost:5500
- Backend API: http://localhost:4000/api

## Professional Run Modes
- `npm run dev` or `npm run website` → Backend API + Static website together
- `npm run static` → Static website only on http://localhost:5500
- `npm run smoke` → Automated E2E smoke validation (health, featured, availability, auth, messaging, booking)
- `npm run app:dev` → Optional Next.js app mode (legacy/expansion)

## Static HTML + JS Edition
- Location: `static/`
- Main entry: `static/index.html`
- Pages included: Dashboard, Explorer, Booking Engine, Client Portal, Admin, Access
- Static pages call the same backend API (`http://localhost:4000/api` by default)

## Seed Access
- `client@aurelux.com / Client@123`
- `manager@aurelux.com / Manager@123`
- `admin@aurelux.com / Admin@123`

## Included Modules
- Cinematic global landing dashboard with rotating featured profiles
- Elite celebrity intelligence explorer with real filtering across 100 profiles
- Sovereign booking engine with dynamic pricing + escrow + status flow
- Client portal with contract vault and concierge insight
- God-mode admin analytics control center with Recharts visualizations
