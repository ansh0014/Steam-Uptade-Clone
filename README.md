# Steam – Game Store Application

A full-stack Steam-like game store built with React, Express, and PostgreSQL.

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
- PostgreSQL (Neon or Local)
- Express Session
- Passport.js

## Development

1. Set up environment variables in `.env`:

```
DATABASE_URL=your-neon-db-url-or-local-url
VITE_STRIPE_PUBLIC_KEY=your-stripe-key
```

➡️ If you're using a local PostgreSQL database:

```bash
DATABASE_URL=postgres://postgres:chemistry%4014@localhost:5432/steamdb
```

2. Install dependencies:

```bash
npm install
```

3. Run database migrations and seed data:

```bash
npm run db:push
npm run db:seed
```

4. Start the development server:

```bash
npm run dev
```

The app will be available at: [http://localhost:5000](http://localhost:5000)

---

## 🚀 Deployment on Render

### 1. Create a PostgreSQL Database on Render
- Go to [Render Dashboard](https://dashboard.render.com/)
- Click **"New + > PostgreSQL"**
- Name it `steamdb`
- After it's created, copy the `Internal Database URL`

Example:
```
postgres://username:password@host:port/steamdb
```

### 2. Create a Web Service (Node.js)
- Click **"New + > Web Service"**
- Connect your GitHub repo
- Select your backend folder (where Express code lives)

### 3. Set Build & Start Commands
```bash
Build Command: npm install
Start Command: npm run dev
```

### 4. Add Environment Variables in Render
- `DATABASE_URL` → (Paste your Render DB URL)
- `VITE_STRIPE_PUBLIC_KEY` → (Your Stripe public key)

### 5. Deploy Frontend Separately
You can host the React frontend on:
- Render (as static site)
- Netlify
- Vercel

Build frontend:
```bash
npm run build
```

Then deploy the `dist/` folder to your chosen host.

---

## 📦 Production Tips
- Use `npm run build` for frontend before deployment.
- Ensure CORS is configured for production domains.
- Use HTTPS and secure session/cookie settings.

---

Happy coding! 🎮
