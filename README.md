# Loggd — Life Tracker PWA

A full-stack life tracking app to build habits, set goals and manage tasks. Inspired by [loggd.life](https://loggd.life).

🔗 **Live demo:** https://loggd-web.vercel.app

---

## Features

- **Habits** — Daily check-ins, streak tracking, yearly contribution graph (GitHub-style)
- **Goals** — Long-term goals with progress tracking and visual progress bar
- **Tasks** — Task manager with priorities, tags, due dates and recurring tasks
- **Auth** — Google OAuth login, JWT authentication
- **PWA** — Installable as a mobile app, works offline

## Tech Stack

| Layer | Tech |
|---|---|
| Frontend | Angular 21 (Standalone + Signals) |
| Styling | SCSS, custom dark theme |
| Auth | Google Identity Services + JWT |
| HTTP | Angular HttpClient + interceptors |
| PWA | Angular Service Worker |
| Deploy | Vercel |

## Architecture

src/
├── app/
│   ├── components/
│   │   ├── layout/          # Shared sidebar layout
│   │   └── contribution-graph/  # GitHub-style activity grid
│   ├── pages/
│   │   ├── login/
│   │   ├── habits/
│   │   ├── goals/
│   │   └── tasks/
│   ├── services/
│   │   ├── auth.service.ts
│   │   ├── habits.service.ts
│   │   ├── goals.service.ts
│   │   └── tasks.service.ts
│   ├── guards/
│   │   └── auth.guard.ts
│   └── interceptors/
│       └── auth.interceptor.ts

## Run locally

```bash
# Install dependencies
npm install

# Start dev server
ng serve

# Build for production
ng build
```

## Backend

The API is built with .NET 9 + PostgreSQL. See [loggd-backend](https://github.com/ivanrdz/loggd-backend) for the backend repo.

---

Built by [Ivan Rodriguez](https://github.com/ivanrdz) — WAIA.MX
