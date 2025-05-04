import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { Game } from "@/lib/types";
import { useQuery } from "@tanstack/react-query";

interface CartContextProps {
  cart: Game[];
  addToCart: (game: Game) => void;
  removeFromCart: (gameId: string) => void;
  clearCart: () => void;
  getTotalPrice: () => number;
  getSubtotal: () => number;
  getDiscount: () => number;
  isInCart: (gameId: string) => boolean;
}

const CartContext = createContext<CartContextProps | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<Game[]>([]);
  
  // Fetch cart from API
  const { data: apiCart, isSuccess } = useQuery<Game[]>({
    queryKey: ['/api/cart'],
  });
  
  // Initialize cart from API when available
  useEffect(() => {
    if (isSuccess && apiCart) {
      setCart(apiCart);
    }
  }, [isSuccess, apiCart]);

  const addToCart = (game: Game) => {
    if (!isInCart(game.id)) {
      setCart(prevCart => [...prevCart, game]);
    }
  };

  const removeFromCart = (gameId: string) => {
    setCart(prevCart => prevCart.filter(item => item.id !== gameId));
  };

  const clearCart = () => {
    setCart([]);
  };

  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + item.price, 0);
  };

  const getSubtotal = () => {
    return cart.reduce((total, item) => total + item.originalPrice, 0);
  };

  const getDiscount = () => {
    return getSubtotal() - getTotalPrice();
  };

  const isInCart = (gameId: string) => {
    return cart.some(item => item.id === gameId);
  };

  return (
    <CartContext.Provider value={{
      cart,
      addToCart,
      removeFromCart,
      clearCart,
      getTotalPrice,
      getSubtotal,
      getDiscount,
      isInCart
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}

// Wrap your application with this provider in your main App component or index
