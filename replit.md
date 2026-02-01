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
- **PostgreSQL**: Primary database, connection via `DATABASE_URL` environment variable
- **connect-pg-simple**: PostgreSQL session store (available but not currently used)

### Third-Party Services
- **Substack RSS Feed**: Auto-imports posts from `https://colehume1.substack.com/feed` via server-side `/api/posts` endpoint with 10-minute caching
- Build includes optional support for: Stripe, OpenAI, Google Generative AI, Nodemailer (dependencies present but not implemented)

### Key Runtime Dependencies
- `express`: HTTP server framework
- `drizzle-orm` + `pg`: Database ORM and PostgreSQL driver
- `zod`: Runtime schema validation (shared between client/server)
- `@tanstack/react-query`: Client-side data fetching and caching
- `framer-motion`: Animation library
- `react-hook-form`: Form state management
- `rss-parser`: RSS feed parsing for Substack integration