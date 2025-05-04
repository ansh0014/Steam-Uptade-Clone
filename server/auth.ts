import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { Express } from "express";
import session from "express-session";
import { scrypt, randomBytes, timingSafeEqual } from "crypto";
import { promisify } from "util";
import { db } from "../db";
import { eq } from "drizzle-orm";
import { users, selectUserSchema } from "@shared/schema";

// Define the UserData type explicitly
interface UserData {
  id: number;
  username: string;
  email: string;
  password: string;
  createdAt: Date;
}

declare global {
  namespace Express {
    // Extend the Express User interface with our custom User type
    interface User extends UserData {}
  }
}

const scryptAsync = promisify(scrypt);

async function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex");
  const buf = (await scryptAsync(password, salt, 64)) as Buffer;
  return `${buf.toString("hex")}.${salt}`;
}

async function comparePasswords(supplied: string, stored: string) {
  const [hashed, salt] = stored.split(".");
  const hashedBuf = Buffer.from(hashed, "hex");
  const suppliedBuf = (await scryptAsync(supplied, salt, 64)) as Buffer;
  return timingSafeEqual(hashedBuf, suppliedBuf);
}

// User management functions
async function getUserByUsername(username: string) {
  const result = await db.select().from(users).where(eq(users.username, username)).limit(1);
  return result[0];
}

async function getUserById(id: number) {
  const result = await db.select().from(users).where(eq(users.id, id)).limit(1);
  return result[0];
}

async function createUser(userData: { username: string; password: string; email: string }) {
  const [user] = await db.insert(users).values({
    ...userData,
    password: await hashPassword(userData.password),
  }).returning();
  return user;
}

export function setupAuth(app: Express) {
  // Session setup
  const sessionSettings: session.SessionOptions = {
    secret: "steam-clone-secret", // In production, use a proper env var
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === "production",
      maxAge: 24 * 60 * 60 * 1000, // 1 day
    },
  };

  app.use(session(sessionSettings));
  app.use(passport.initialize());
  app.use(passport.session());

  // Configure passport with local strategy
  passport.use(
    new LocalStrategy(async (username, password, done) => {
      try {
        const user = await getUserByUsername(username);
        if (!user || !(await comparePasswords(password, user.password))) {
          return done(null, false, { message: "Invalid username or password" });
        }
        return done(null, user);
      } catch (err) {
        return done(err);
      }
    }),
  );

  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser(async (id: number, done) => {
    try {
      const user = await getUserById(id);
      done(null, user || null);
    } catch (err) {
      done(err);
    }
  });

  // Authentication routes
  app.post("/api/register", async (req, res, next) => {
    try {
      const { username, password, email } = req.body;

      // Check if username already exists
      const existingUser = await getUserByUsername(username);
      if (existingUser) {
        return res.status(400).json({ message: "Username already exists" });
      }

      // Create new user
      const user = await createUser({ username, password, email });

      // Log the user in automatically
      req.login(user, (err) => {
        if (err) return next(err);
        return res.status(201).json(user);
      });
    } catch (error) {
      console.error("Error during registration:", error);
      res.status(500).json({ message: "Registration failed" });
    }
  });

  app.post("/api/login", (req, res, next) => {
    passport.authenticate("local", (err: Error, user: Express.User) => {
      if (err) {
        return next(err);
      }
      if (!user) {
        return res.status(401).json({ message: "Invalid username or password" });
      }
      req.login(user, (err) => {
        if (err) {
          return next(err);
        }
        return res.status(200).json(user);
      });
    })(req, res, next);
  });

  app.post("/api/logout", (req, res) => {
    req.logout((err) => {
      if (err) {
        return res.status(500).json({ message: "Logout failed" });
      }
      res.status(200).json({ message: "Logged out successfully" });
    });
  });

  app.get("/api/user", (req, res) => {
    if (req.isAuthenticated()) {
      return res.status(200).json(req.user);
    }
    return res.status(401).json({ message: "Not authenticated" });
  });
}