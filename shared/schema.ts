import { pgTable, text, serial, integer, boolean, timestamp, jsonb, doublePrecision } from 'drizzle-orm/pg-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { relations } from 'drizzle-orm';
import { z } from 'zod';

// Categories table
export const categories = pgTable('categories', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  description: text('description'),
  createdAt: timestamp('created_at').defaultNow().notNull()
});

// Games table
export const games = pgTable('games', {
  id: serial('id').primaryKey(),
  title: text('title').notNull(),
  shortDescription: text('short_description').notNull(),
  description: text('description').notNull(),
  headerImage: text('header_image').notNull(),
  price: doublePrecision('price').notNull().default(0),
  originalPrice: doublePrecision('original_price').notNull().default(0),
  discount: integer('discount').notNull().default(0),
  releaseDate: timestamp('release_date').notNull(),
  developer: text('developer').notNull(),
  publisher: text('publisher').notNull(),
  languages: text('languages').notNull(),
  isFeatured: boolean('is_featured').notNull().default(false),
  isSpecialOffer: boolean('is_special_offer').notNull().default(false),
  isNewRelease: boolean('is_new_release').notNull().default(false),
  isPopular: boolean('is_popular').notNull().default(false),
  systemRequirements: jsonb('system_requirements'),
  createdAt: timestamp('created_at').defaultNow().notNull()
});

// Game categories relation table
export const gameCategories = pgTable('game_categories', {
  id: serial('id').primaryKey(),
  gameId: integer('game_id').notNull().references(() => games.id, { onDelete: 'cascade' }),
  categoryId: integer('category_id').notNull().references(() => categories.id, { onDelete: 'cascade' }),
});

// Screenshots table
export const screenshots = pgTable('screenshots', {
  id: serial('id').primaryKey(),
  gameId: integer('game_id').notNull().references(() => games.id, { onDelete: 'cascade' }),
  url: text('url').notNull(),
});

// Users table
export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  username: text('username').notNull().unique(),
  password: text('password').notNull(),
  email: text('email').notNull().unique(),
  createdAt: timestamp('created_at').defaultNow().notNull()
});

// Cart items table
export const cartItems = pgTable('cart_items', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  gameId: integer('game_id').notNull().references(() => games.id, { onDelete: 'cascade' }),
  createdAt: timestamp('created_at').defaultNow().notNull()
});

// User library (purchased games)
export const userLibrary = pgTable('user_library', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  gameId: integer('game_id').notNull().references(() => games.id, { onDelete: 'cascade' }),
  purchaseDate: timestamp('purchase_date').defaultNow().notNull()
});

// Transactions
export const transactions = pgTable('transactions', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  amount: doublePrecision('amount').notNull(),
  status: text('status').notNull().default('pending'),
  paymentMethod: text('payment_method').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull()
});

// Transaction games (which games were in the transaction)
export const transactionGames = pgTable('transaction_games', {
  id: serial('id').primaryKey(),
  transactionId: integer('transaction_id').notNull().references(() => transactions.id, { onDelete: 'cascade' }),
  gameId: integer('game_id').notNull().references(() => games.id),
  price: doublePrecision('price').notNull(),
});

// Define relations
export const categoriesRelations = relations(categories, ({ many }) => ({
  gameCategories: many(gameCategories)
}));

export const gamesRelations = relations(games, ({ many }) => ({
  gameCategories: many(gameCategories),
  screenshots: many(screenshots),
  cartItems: many(cartItems),
  libraryEntries: many(userLibrary),
  transactionGames: many(transactionGames)
}));

export const gameCategoriesRelations = relations(gameCategories, ({ one }) => ({
  game: one(games, { fields: [gameCategories.gameId], references: [games.id] }),
  category: one(categories, { fields: [gameCategories.categoryId], references: [categories.id] })
}));

export const screenshotsRelations = relations(screenshots, ({ one }) => ({
  game: one(games, { fields: [screenshots.gameId], references: [games.id] })
}));

export const usersRelations = relations(users, ({ many }) => ({
  cartItems: many(cartItems),
  libraryEntries: many(userLibrary),
  transactions: many(transactions)
}));

export const cartItemsRelations = relations(cartItems, ({ one }) => ({
  user: one(users, { fields: [cartItems.userId], references: [users.id] }),
  game: one(games, { fields: [cartItems.gameId], references: [games.id] })
}));

export const userLibraryRelations = relations(userLibrary, ({ one }) => ({
  user: one(users, { fields: [userLibrary.userId], references: [users.id] }),
  game: one(games, { fields: [userLibrary.gameId], references: [games.id] })
}));

export const transactionsRelations = relations(transactions, ({ one, many }) => ({
  user: one(users, { fields: [transactions.userId], references: [users.id] }),
  transactionGames: many(transactionGames)
}));

export const transactionGamesRelations = relations(transactionGames, ({ one }) => ({
  transaction: one(transactions, { fields: [transactionGames.transactionId], references: [transactions.id] }),
  game: one(games, { fields: [transactionGames.gameId], references: [games.id] })
}));

// Schemas for validation
export const insertCategorySchema = createInsertSchema(categories);
export type CategoryInsert = z.infer<typeof insertCategorySchema>;

export const insertGameSchema = createInsertSchema(games);
export type GameInsert = z.infer<typeof insertGameSchema>;

export const insertScreenshotSchema = createInsertSchema(screenshots);
export type ScreenshotInsert = z.infer<typeof insertScreenshotSchema>;

export const insertUserSchema = createInsertSchema(users);
export type UserInsert = z.infer<typeof insertUserSchema>;

export const insertCartItemSchema = createInsertSchema(cartItems);
export type CartItemInsert = z.infer<typeof insertCartItemSchema>;

export const insertUserLibrarySchema = createInsertSchema(userLibrary);
export type UserLibraryInsert = z.infer<typeof insertUserLibrarySchema>;

export const insertTransactionSchema = createInsertSchema(transactions);
export type TransactionInsert = z.infer<typeof insertTransactionSchema>;

export const insertTransactionGameSchema = createInsertSchema(transactionGames);
export type TransactionGameInsert = z.infer<typeof insertTransactionGameSchema>;

// Select schemas
export const selectUserSchema = createSelectSchema(users);
export type User = z.infer<typeof selectUserSchema>;

export const selectGameSchema = createSelectSchema(games);
export type Game = z.infer<typeof selectGameSchema>;

export const selectCategorySchema = createSelectSchema(categories);
export type Category = z.infer<typeof selectCategorySchema>;
