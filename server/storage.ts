import { db } from "@db";
import { 
  categories, 
  games, 
  gameCategories, 
  screenshots, 
  cartItems, 
  userLibrary, 
  transactions, 
  transactionGames, 
  users 
} from "@shared/schema";
import { eq, and, inArray, desc, sql } from "drizzle-orm";

export const storage = {
  // Categories
  async getAllCategories() {
    return await db.query.categories.findMany({
      orderBy: categories.name
    });
  },

  // Games
  async getAllGames(categoryId?: string) {
    if (categoryId) {
      const gameIds = await db.select({ gameId: gameCategories.gameId })
        .from(gameCategories)
        .where(eq(gameCategories.categoryId, parseInt(categoryId)));
      
      if (gameIds.length === 0) return [];
      
      return await db.query.games.findMany({
        where: inArray(games.id, gameIds.map(g => g.gameId))
      });
    }
    
    return await db.query.games.findMany();
  },

  async getGameById(gameId: string) {
    const game = await db.query.games.findFirst({
      where: eq(games.id, parseInt(gameId)),
      with: {
        screenshots: true,
      }
    });

    if (!game) return null;

    // Get categories for the game
    const gameWithCategoriesResult = await db
      .select({
        categoryId: categories.id,
        categoryName: categories.name
      })
      .from(gameCategories)
      .innerJoin(categories, eq(gameCategories.categoryId, categories.id))
      .where(eq(gameCategories.gameId, game.id));

    // Format the categories
    const formattedCategories = gameWithCategoriesResult.map(item => ({
      id: item.categoryId.toString(),
      name: item.categoryName
    }));

    return {
      ...game,
      id: game.id.toString(),
      categories: formattedCategories,
    };
  },

  async getFeaturedGame() {
    const featuredGame = await db.query.games.findFirst({
      where: eq(games.isFeatured, true),
      with: {
        screenshots: true,
      }
    });

    if (!featuredGame) return null;

    // Get categories for the game
    const categoriesResult = await db
      .select({
        categoryId: categories.id,
        categoryName: categories.name
      })
      .from(gameCategories)
      .innerJoin(categories, eq(gameCategories.categoryId, categories.id))
      .where(eq(gameCategories.gameId, featuredGame.id));

    // Format the categories
    const formattedCategories = categoriesResult.map(item => ({
      id: item.categoryId.toString(),
      name: item.categoryName
    }));

    return {
      ...featuredGame,
      id: featuredGame.id.toString(),
      categories: formattedCategories,
    };
  },

  async getSpecialOfferGames(categoryId?: string) {
    let query = db.query.games.findMany({
      where: eq(games.isSpecialOffer, true),
      limit: 4,
    });

    if (categoryId) {
      const gameIds = await db.select({ gameId: gameCategories.gameId })
        .from(gameCategories)
        .where(eq(gameCategories.categoryId, parseInt(categoryId)));
      
      if (gameIds.length === 0) return [];
      
      query = db.query.games.findMany({
        where: and(
          eq(games.isSpecialOffer, true),
          inArray(games.id, gameIds.map(g => g.gameId))
        ),
        limit: 4,
      });
    }

    const specialOffers = await query;
    
    // Format and add categories to each game
    const gamesWithCategories = await Promise.all(
      specialOffers.map(async (game) => {
        const categoriesResult = await db
          .select({
            categoryId: categories.id,
            categoryName: categories.name
          })
          .from(gameCategories)
          .innerJoin(categories, eq(gameCategories.categoryId, categories.id))
          .where(eq(gameCategories.gameId, game.id));

        const formattedCategories = categoriesResult.map(item => ({
          id: item.categoryId.toString(),
          name: item.categoryName
        }));

        return {
          ...game,
          id: game.id.toString(),
          categories: formattedCategories,
        };
      })
    );

    return gamesWithCategories;
  },

  async getNewReleaseGames(categoryId?: string) {
    let query = db.query.games.findMany({
      where: eq(games.isNewRelease, true),
      limit: 4,
    });

    if (categoryId) {
      const gameIds = await db.select({ gameId: gameCategories.gameId })
        .from(gameCategories)
        .where(eq(gameCategories.categoryId, parseInt(categoryId)));
      
      if (gameIds.length === 0) return [];
      
      query = db.query.games.findMany({
        where: and(
          eq(games.isNewRelease, true),
          inArray(games.id, gameIds.map(g => g.gameId))
        ),
        limit: 4,
      });
    }

    const newReleases = await query;
    
    // Format and add categories to each game
    const gamesWithCategories = await Promise.all(
      newReleases.map(async (game) => {
        const categoriesResult = await db
          .select({
            categoryId: categories.id,
            categoryName: categories.name
          })
          .from(gameCategories)
          .innerJoin(categories, eq(gameCategories.categoryId, categories.id))
          .where(eq(gameCategories.gameId, game.id));

        const formattedCategories = categoriesResult.map(item => ({
          id: item.categoryId.toString(),
          name: item.categoryName
        }));

        return {
          ...game,
          id: game.id.toString(),
          categories: formattedCategories,
        };
      })
    );

    return gamesWithCategories;
  },

  async getPopularGames(categoryId?: string) {
    let query = db.query.games.findMany({
      where: eq(games.isPopular, true),
      limit: 4,
    });

    if (categoryId) {
      const gameIds = await db.select({ gameId: gameCategories.gameId })
        .from(gameCategories)
        .where(eq(gameCategories.categoryId, parseInt(categoryId)));
      
      if (gameIds.length === 0) return [];
      
      query = db.query.games.findMany({
        where: and(
          eq(games.isPopular, true),
          inArray(games.id, gameIds.map(g => g.gameId))
        ),
        limit: 4,
      });
    }

    const popularGames = await query;
    
    // Format and add categories to each game
    const gamesWithCategories = await Promise.all(
      popularGames.map(async (game) => {
        const categoriesResult = await db
          .select({
            categoryId: categories.id,
            categoryName: categories.name
          })
          .from(gameCategories)
          .innerJoin(categories, eq(gameCategories.categoryId, categories.id))
          .where(eq(gameCategories.gameId, game.id));

        const formattedCategories = categoriesResult.map(item => ({
          id: item.categoryId.toString(),
          name: item.categoryName
        }));

        return {
          ...game,
          id: game.id.toString(),
          categories: formattedCategories,
        };
      })
    );

    return gamesWithCategories;
  },

  // Cart
  async getCartItems(userId: number) {
    const items = await db
      .select()
      .from(cartItems)
      .innerJoin(games, eq(cartItems.gameId, games.id))
      .where(eq(cartItems.userId, userId));
    
    if (items.length === 0) return [];
    
    // Format and add categories to each game
    const cartItemsWithDetails = await Promise.all(
      items.map(async (item) => {
        const game = item.games;
        
        const categoriesResult = await db
          .select({
            categoryId: categories.id,
            categoryName: categories.name
          })
          .from(gameCategories)
          .innerJoin(categories, eq(gameCategories.categoryId, categories.id))
          .where(eq(gameCategories.gameId, game.id));

        const formattedCategories = categoriesResult.map(item => ({
          id: item.categoryId.toString(),
          name: item.categoryName
        }));

        return {
          ...game,
          id: game.id.toString(),
          categories: formattedCategories,
        };
      })
    );
    
    return cartItemsWithDetails;
  },

  async addToCart(userId: number, gameId: number) {
    // Check if already in cart
    const existingItem = await db.query.cartItems.findFirst({
      where: and(
        eq(cartItems.userId, userId),
        eq(cartItems.gameId, gameId)
      )
    });
    
    if (existingItem) {
      return existingItem;
    }
    
    // Add to cart
    const [newItem] = await db.insert(cartItems)
      .values({ userId, gameId })
      .returning();
    
    return newItem;
  },

  async removeFromCart(userId: number, gameId: number) {
    await db.delete(cartItems)
      .where(
        and(
          eq(cartItems.userId, userId),
          eq(cartItems.gameId, gameId)
        )
      );
  },

  async clearCart(userId: number) {
    await db.delete(cartItems)
      .where(eq(cartItems.userId, userId));
  },

  // Payment & Checkout
  async processPayment(userId: number, amount: number, paymentMethod: string) {
    // Get cart items
    const cartItemsResult = await db
      .select()
      .from(cartItems)
      .where(eq(cartItems.userId, userId));
    
    if (cartItemsResult.length === 0) {
      throw new Error('Cart is empty');
    }
    
    const gameIds = cartItemsResult.map(item => item.gameId);
    
    // Create transaction
    const [transaction] = await db.insert(transactions)
      .values({
        userId,
        amount,
        status: 'completed',
        paymentMethod
      })
      .returning();
    
    // Get game details for transaction
    const gamesData = await db.query.games.findMany({
      where: inArray(games.id, gameIds)
    });
    
    // Add transaction games
    for (const game of gamesData) {
      await db.insert(transactionGames)
        .values({
          transactionId: transaction.id,
          gameId: game.id,
          price: game.price
        });
      
      // Add to user library
      await db.insert(userLibrary)
        .values({
          userId,
          gameId: game.id
        });
    }
    
    // Clear cart
    await this.clearCart(userId);
    
    return transaction;
  },

  // User Library
  async getUserLibrary(userId: number) {
    const libraryItems = await db
      .select()
      .from(userLibrary)
      .innerJoin(games, eq(userLibrary.gameId, games.id))
      .where(eq(userLibrary.userId, userId));
    
    if (libraryItems.length === 0) return [];
    
    // Format and add categories to each game
    const libraryWithDetails = await Promise.all(
      libraryItems.map(async (item) => {
        const game = item.games;
        
        const categoriesResult = await db
          .select({
            categoryId: categories.id,
            categoryName: categories.name
          })
          .from(gameCategories)
          .innerJoin(categories, eq(gameCategories.categoryId, categories.id))
          .where(eq(gameCategories.gameId, game.id));

        const formattedCategories = categoriesResult.map(item => ({
          id: item.categoryId.toString(),
          name: item.categoryName
        }));

        return {
          ...game,
          id: game.id.toString(),
          categories: formattedCategories,
          purchaseDate: item.user_library.purchaseDate
        };
      })
    );
    
    return libraryWithDetails;
  }
};
