# FocusPulse

A Pomodoro timer with a simple task list. **No AI, no API keys** — works entirely offline.

- **25 min** focus / **5 min** short break / **15 min** long break
- Add tasks, check them off, delete as you go
- Built with Next.js, TypeScript, Tailwind, Prisma, SQLite

## Tech stack

- **Next.js 14** (App Router) + **React**
- **TypeScript**
- **Tailwind CSS**
- **Prisma** + **SQLite**

## Run locally

```bash
cd FocusPulse
npm install
cp .env.example .env
npx prisma generate
npx prisma db push
npm run dev
```

Open http://localhost:3000
