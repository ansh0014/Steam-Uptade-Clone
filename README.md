
# Game Store Application

A full-stack game store built with React, Express, and PostgreSQL.

## Tech Stack

### Frontend
- React + TypeScript
- Vite for bundling
- TailwindCSS for styling 
- Radix UI components
- React Query for data fetching
- Wouter for routing
- Stripe.js for payments

### Backend
- Express.js + TypeScript
- Drizzle ORM
- PostgreSQL (Neon)
- Express Session
- Passport.js

## Development

1. Set up environment variables in .env:
```
DATABASE_URL=your-neon-db-url
VITE_STRIPE_PUBLIC_KEY=your-stripe-key
```

2. Install dependencies:
```bash
npm install
```

3. Run database migrations and seed:
```bash
npm run db:push
npm run db:seed
```

4. Start development server:
```bash
npm run dev
```

The app will be available on port 5000.
