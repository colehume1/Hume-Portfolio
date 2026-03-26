# replit.md

## Overview

This is a personal portfolio website for Cole Hume, a content creator and entrepreneur based in San Diego. The site showcases his professional background, content creation work (YouTube, Substack, podcast), and provides a contact form for visitors to reach out. The application follows a single-page design with section-based navigation (Home, About, Content, Contact) and features smooth animations and a minimalist, professional aesthetic.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter (lightweight React router) with hash-based anchor navigation for single-page sections
- **Styling**: Tailwind CSS with custom CSS variables for theming (light mode focused, professional/warm color palette)
- **UI Components**: shadcn/ui component library built on Radix UI primitives
- **Animations**: Framer Motion for page transitions and scroll-triggered animations
- **Form Handling**: React Hook Form with Zod validation via @hookform/resolvers
- **State Management**: TanStack React Query for server state and API interactions

### Backend Architecture
- **Runtime**: Node.js with Express.js
- **Language**: TypeScript (ESM modules)
- **API Design**: RESTful endpoints defined in `shared/routes.ts` with Zod schema validation
- **Development**: Vite dev server with HMR proxied through Express
- **Production**: Static file serving from built Vite output

### Data Storage
- **Database**: PostgreSQL via `pg` driver
- **ORM**: Drizzle ORM with Zod schema generation (drizzle-zod)
- **Schema Location**: `shared/schema.ts` contains table definitions shared between client and server
- **Migrations**: Drizzle Kit for schema management (`npm run db:push`)

### Build System
- **Client Build**: Vite with React plugin, outputs to `dist/public`
- **Server Build**: esbuild bundling with selective dependency bundling for optimized cold starts
- **Path Aliases**: `@/` maps to client source, `@shared/` maps to shared code

### Project Structure
```
├── client/          # React frontend application
│   └── src/
│       ├── components/  # UI components (shadcn + custom)
│       ├── pages/       # Route components
│       ├── hooks/       # Custom React hooks
│       └── lib/         # Utilities and query client
├── server/          # Express backend
│   ├── index.ts     # Entry point
│   ├── routes.ts    # API route handlers
│   ├── storage.ts   # Database operations
│   └── db.ts        # Database connection
├── shared/          # Shared between client/server
│   ├── schema.ts    # Drizzle table definitions
│   └── routes.ts    # API contract definitions
└── migrations/      # Drizzle migration files
```

## External Dependencies

### Database
- **PostgreSQL**: External Neon (neon.tech) database for cross-platform accessibility
- **Connection**: Uses `NEON_DATABASE_URL` env var (preferred) with fallback to `DATABASE_URL`
- **Note for external deployments (e.g., Vercel)**: Set `DATABASE_URL` to the Neon connection string directly
- **connect-pg-simple**: PostgreSQL session store (available but not currently used)

### Third-Party Services
- **Substack RSS Feed**: Auto-imports posts from `https://colehume1.substack.com/feed` via server-side `/api/posts` endpoint
  - **Feed cache**: 10 minutes (for RSS feed data)
  - **OG image cache**: 24 hours (per-post og:image extraction)
  - **Image fallbacks**: og:image → RSS image → YouTube thumbnail → placeholder
  - **To change feed URL**: Edit `SUBSTACK_FEED_URL` constant in `server/routes.ts`
- Build includes optional support for: Stripe, OpenAI, Google Generative AI, Nodemailer (dependencies present but not implemented)

### Key Runtime Dependencies
- `express`: HTTP server framework
- `drizzle-orm` + `pg`: Database ORM and PostgreSQL driver
- `zod`: Runtime schema validation (shared between client/server)
- `@tanstack/react-query`: Client-side data fetching and caching
- `framer-motion`: Animation library
- `react-hook-form`: Form state management
- `rss-parser`: RSS feed parsing for Substack integration

### Turtle Jump Game (`client/src/pages/TurtleJump.tsx`)
- **Route**: `/turtle-jump`
- **Canvas**: 640x280, ground at y=240
- **Scoring**: SCORE_PER_SECOND=5, float accumulator, Math.floor display. +100 bonus for successful shell-blocks (bird/fish only, once per obstacle). "+100" popup near turtle for 400ms with fade-out.
- **Physics**: GRAVITY=0.35, JUMP_VELOCITY=-9.5, WATER_GRAVITY=0.25, GAME_SPEED=1.6
- **Speed scaling**: `speedMultiplier = 1 + 0.1 * Math.floor(score / 1000)`. Applied to base GAME_SPEED. At 1000: 1.1x, 2000: 1.2x, etc.
- **Mode cycling**: Alternates LAND/WATER every MODE_INTERVAL=200 score. Formula: `(Math.floor(score/200) % 2 === 0) ? "land" : "water"`. Bidirectional waterTransition lerp at 0.012/frame.
- **Log obstacles**: Width 24-44px (LOG_WIDTH_MIN/MAX), height 22-30px, spacing 240-460px. Capped for guaranteed jumpability.
- **Bird obstacles** (LAND only): 30x22px, y range 70-155, spawn chance 28%, move 15% faster
- **Fish obstacles** (WATER only): 32x20px, y range 75-160, spawn chance 30%, move 15% faster
- **Shell-block (B key)**: BLOCK_DURATION=500ms, BLOCK_COOLDOWN=1300ms. Negates bird/fish collisions, NOT log collisions. Awards +100 score. Visual: green shell sprite + shield ring. Canvas indicator: "[B] Block" / progress bar / "SHELL!"
- **Controls hint**: Updates per mode. LAND: "Space/Tap to jump · B to shell-block birds". WATER: "Space/Tap to swim-jump · B to shell-block fish"
- **Game-over quotes**: 12 philosophical quotes with no-repeat logic, contextual funny messages per obstacle type
- **Turtle cursor**: Custom animated cursor (desktop-only) with idle/moving states in TurtleCursor.tsx