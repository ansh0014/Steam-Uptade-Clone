import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth } from "./auth";

export async function registerRoutes(app: Express): Promise<Server> {
  // Setup authentication
  setupAuth(app);
  
  const httpServer = createServer(app);

  // API prefix
  const apiPrefix = '/api';

  // Categories
  app.get(`${apiPrefix}/categories`, async (req, res) => {
    try {
      const categories = await storage.getAllCategories();
      res.json(categories);
    } catch (error) {
      console.error('Error fetching categories:', error);
      res.status(500).json({ message: 'Failed to fetch categories' });
    }
  });

  // Games endpoints
  app.get(`${apiPrefix}/games`, async (req, res) => {
    try {
      const categoryId = req.query.categoryId as string | undefined;
      const games = await storage.getAllGames(categoryId);
      res.json(games);
    } catch (error) {
      console.error('Error fetching games:', error);
      res.status(500).json({ message: 'Failed to fetch games' });
    }
  });

  app.get(`${apiPrefix}/games/featured`, async (req, res) => {
    try {
      const featuredGame = await storage.getFeaturedGame();
      res.json(featuredGame);
    } catch (error) {
      console.error('Error fetching featured game:', error);
      res.status(500).json({ message: 'Failed to fetch featured game' });
    }
  });

  app.get(`${apiPrefix}/games/special-offers`, async (req, res) => {
    try {
      const categoryId = req.query.categoryId as string | undefined;
      const specialOffers = await storage.getSpecialOfferGames(categoryId);
      res.json(specialOffers);
    } catch (error) {
      console.error('Error fetching special offers:', error);
      res.status(500).json({ message: 'Failed to fetch special offers' });
    }
  });

  app.get(`${apiPrefix}/games/new-releases`, async (req, res) => {
    try {
      const categoryId = req.query.categoryId as string | undefined;
      const newReleases = await storage.getNewReleaseGames(categoryId);
      res.json(newReleases);
    } catch (error) {
      console.error('Error fetching new releases:', error);
      res.status(500).json({ message: 'Failed to fetch new releases' });
    }
  });

  app.get(`${apiPrefix}/games/popular`, async (req, res) => {
    try {
      const categoryId = req.query.categoryId as string | undefined;
      const popularGames = await storage.getPopularGames(categoryId);
      res.json(popularGames);
    } catch (error) {
      console.error('Error fetching popular games:', error);
      res.status(500).json({ message: 'Failed to fetch popular games' });
    }
  });

  app.get(`${apiPrefix}/games/:id`, async (req, res) => {
    try {
      const gameId = req.params.id;
      const game = await storage.getGameById(gameId);
      
      if (!game) {
        return res.status(404).json({ message: 'Game not found' });
      }
      
      res.json(game);
    } catch (error) {
      console.error('Error fetching game:', error);
      res.status(500).json({ message: 'Failed to fetch game details' });
    }
  });

  // Cart endpoints
  app.get(`${apiPrefix}/cart`, async (req, res) => {
    try {
      if (!req.isAuthenticated()) {
        return res.status(401).json({ message: 'Authentication required' });
      }
      
      const userId = req.user.id;
      const cartItems = await storage.getCartItems(userId);
      res.json(cartItems);
    } catch (error) {
      console.error('Error fetching cart:', error);
      res.status(500).json({ message: 'Failed to fetch cart items' });
    }
  });

  app.post(`${apiPrefix}/cart/add`, async (req, res) => {
    try {
      if (!req.isAuthenticated()) {
        return res.status(401).json({ message: 'Authentication required' });
      }
      
      const { gameId } = req.body;
      
      if (!gameId) {
        return res.status(400).json({ message: 'Game ID is required' });
      }
      
      const userId = req.user.id;
      
      await storage.addToCart(userId, parseInt(gameId));
      res.status(201).json({ message: 'Game added to cart' });
    } catch (error) {
      console.error('Error adding to cart:', error);
      res.status(500).json({ message: 'Failed to add game to cart' });
    }
  });

  app.delete(`${apiPrefix}/cart/:gameId`, async (req, res) => {
    try {
      if (!req.isAuthenticated()) {
        return res.status(401).json({ message: 'Authentication required' });
      }
      
      const gameId = parseInt(req.params.gameId);
      const userId = req.user.id;
      
      await storage.removeFromCart(userId, gameId);
      res.json({ message: 'Game removed from cart' });
    } catch (error) {
      console.error('Error removing from cart:', error);
      res.status(500).json({ message: 'Failed to remove game from cart' });
    }
  });

  app.delete(`${apiPrefix}/cart`, async (req, res) => {
    try {
      if (!req.isAuthenticated()) {
        return res.status(401).json({ message: 'Authentication required' });
      }
      
      const userId = req.user.id;
      
      await storage.clearCart(userId);
      res.json({ message: 'Cart cleared' });
    } catch (error) {
      console.error('Error clearing cart:', error);
      res.status(500).json({ message: 'Failed to clear cart' });
    }
  });

  // Payment processing
  app.post(`${apiPrefix}/payment/process`, async (req, res) => {
    try {
      if (!req.isAuthenticated()) {
        return res.status(401).json({ message: 'Authentication required' });
      }
      
      const { amount, method } = req.body;
      
      if (!amount || !method) {
        return res.status(400).json({ message: 'Amount and payment method are required' });
      }
      
      const userId = req.user.id;
      
      // Simulate processing time
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Process the payment and add games to user's library
      const transaction = await storage.processPayment(userId, amount, method);
      
      res.status(201).json({ 
        message: 'Payment successful',
        transactionId: transaction.id
      });
    } catch (error) {
      console.error('Error processing payment:', error);
      res.status(500).json({ message: 'Payment processing failed' });
    }
  });

  // User Library
  app.get(`${apiPrefix}/library`, async (req, res) => {
    try {
      if (!req.isAuthenticated()) {
        return res.status(401).json({ message: 'Authentication required' });
      }
      
      const userId = req.user.id;
      
      const libraryGames = await storage.getUserLibrary(userId);
      res.json(libraryGames);
    } catch (error) {
      console.error('Error fetching library:', error);
      res.status(500).json({ message: 'Failed to fetch user library' });
    }
  });

  return httpServer;
}
