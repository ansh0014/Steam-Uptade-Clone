import { useQuery } from "@tanstack/react-query";
import { useRoute, useLocation } from "wouter";
import { useEffect, useState } from "react";
import { Link } from "wouter";
import { Game } from "@/lib/types";
import { useCart } from "@/hooks/useCart";
import { useAuth } from "@/hooks/use-auth";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

export default function GameDetail() {
  const [, params] = useRoute("/game/:id");
  const gameId = params?.id;
  const [selectedScreenshot, setSelectedScreenshot] = useState<string | null>(null);
  const { addToCart } = useCart();
  const { user } = useAuth();
  const [location, setLocation] = useLocation();
  const { toast } = useToast();

  const { data: game, isLoading } = useQuery<Game>({
    queryKey: [`/api/games/${gameId}`],
    enabled: !!gameId,
  });

  useEffect(() => {
    if (game?.screenshots?.length) {
      setSelectedScreenshot(game.screenshots[0].url);
    }
  }, [game]);

  if (isLoading) {
    return (
      <div className="animate-pulse space-y-6">
        <div className="h-80 bg-steam-dark-blue rounded-lg"></div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            <div className="h-80 bg-steam-dark-blue rounded-lg"></div>
            <div className="h-40 bg-steam-dark-blue rounded-lg"></div>
            <div className="h-40 bg-steam-dark-blue rounded-lg"></div>
          </div>
          <div>
            <div className="h-[500px] bg-steam-dark-blue rounded-lg"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!game) {
    return (
      <div className="py-10 text-center">
        <h1 className="text-2xl">Game not found</h1>
        <a href="/" className="text-steam-blue hover:underline mt-4 inline-block">Back to Store</a>
      </div>
    );
  }
  
  const handleAddToCart = async () => {
    if (!user) {
      toast({
        title: "Login Required",
        description: "Please log in to add items to your cart",
        variant: "destructive",
      });
      setLocation("/auth");
      return;
    }
    
    try {
      await apiRequest("POST", "/api/cart/add", { gameId: game.id });
      addToCart(game);
      toast({
        title: "Added to Cart",
        description: `${game.title} has been added to your cart`,
      });
    } catch (error) {
      console.error("Failed to add game to cart:", error);
      toast({
        title: "Error",
        description: "Failed to add game to cart",
        variant: "destructive",
      });
    }
  };

  const handleBuyNow = async () => {
    if (!user) {
      toast({
        title: "Login Required",
        description: "Please log in to purchase games",
        variant: "destructive",
      });
      setLocation("/auth");
      return;
    }
    
    try {
      // First add to cart
      await apiRequest("POST", "/api/cart/add", { gameId: game.id });
      addToCart(game);
      
      // Then proceed to payment
      setLocation("/checkout");
    } catch (error) {
      console.error("Failed to buy now:", error);
      toast({
        title: "Error",
        description: "Failed to complete purchase",
        variant: "destructive",
      });
    }
  };

  return (
    <div>
      <div className="mb-4">
        <a href="/" className="text-steam-blue hover:underline flex items-center">
          <i className="fas fa-arrow-left mr-1"></i> Back to Store
        </a>
      </div>

      <div className="bg-steam-dark-blue rounded-lg overflow-hidden mb-6">
        <div className="relative">
          <img src={game.headerImage} alt={game.title} className="w-full h-64 md:h-80 object-cover" />
          <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black to-transparent p-4">
            <h1 className="text-3xl font-bold text-white mb-2">{game.title}</h1>
            <div className="flex flex-wrap gap-2">
              {game.categories.map((category) => (
                <span key={category.id} className="game-tag">{category.name}</span>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Game Media and Description */}
        <div className="lg:col-span-2">
          {/* Screenshots Gallery */}
          <div className="mb-6">
            <div className="grid grid-cols-4 gap-2">
              <div className="col-span-4">
                <img 
                  src={selectedScreenshot || game.headerImage} 
                  alt={game.title} 
                  className="w-full h-80 object-cover rounded"
                />
              </div>
              {game.screenshots && game.screenshots.map((screenshot, index) => (
                <div key={index}>
                  <img
                    src={screenshot.url}
                    alt={`${game.title} Gameplay ${index + 1}`}
                    className="w-full h-20 object-cover rounded cursor-pointer"
                    onClick={() => setSelectedScreenshot(screenshot.url)}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Description */}
          <div className="bg-steam-dark-blue rounded-lg p-4 mb-6">
            <h2 className="text-xl font-semibold mb-3">About This Game</h2>
            <p className="mb-4">{game.description}</p>
          </div>

          {/* System Requirements */}
          <div className="bg-steam-dark-blue rounded-lg p-4">
            <h2 className="text-xl font-semibold mb-3">System Requirements</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 className="font-semibold mb-2">Minimum:</h3>
                <ul className="text-sm space-y-1">
                  {game.systemRequirements?.minimum && Object.entries(game.systemRequirements.minimum).map(([key, value]) => (
                    <li key={key}><span className="text-gray-400">{key}:</span> {value}</li>
                  ))}
                </ul>
              </div>
              
              <div>
                <h3 className="font-semibold mb-2">Recommended:</h3>
                <ul className="text-sm space-y-1">
                  {game.systemRequirements?.recommended && Object.entries(game.systemRequirements.recommended).map(([key, value]) => (
                    <li key={key}><span className="text-gray-400">{key}:</span> {value}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Purchase Information */}
        <div>
          <div className="bg-steam-dark-blue rounded-lg p-4 sticky top-4">
            <h2 className="text-xl font-semibold mb-4">Buy {game.title}</h2>
            
            <div className="mb-4">
              <img src={game.headerImage} alt={game.title} className="w-full h-40 object-cover rounded" />
            </div>
            
            <div className="mb-6">
              <div className="flex justify-between items-center mb-2">
                <span className="text-gray-300">Base Game</span>
                <div>
                  {game.discount > 0 && (
                    <span className="line-through text-gray-400 text-sm">${game.originalPrice.toFixed(2)}</span>
                  )}
                  <span className="text-white font-bold ml-1">${game.price.toFixed(2)}</span>
                </div>
              </div>
              
              {game.discount > 0 && (
                <div className="bg-green-800 text-white text-center py-1 px-2 rounded text-sm mb-3">
                  -{game.discount}% SPECIAL OFFER! Offer ends in 48:13:22
                </div>
              )}
              
              <button 
                className="w-full bg-steam-blue hover:bg-opacity-80 text-white py-2 rounded font-medium mb-2"
                onClick={handleAddToCart}
              >
                Add to Cart
              </button>
              
              <button 
                className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded font-medium"
                onClick={handleBuyNow}
              >
                Buy Now
              </button>
            </div>
            
            <div className="border-t border-gray-700 pt-4 text-sm">
              <h3 className="font-semibold mb-2">Game Details</h3>
              <ul className="space-y-1">
                <li><span className="text-gray-400">Developer:</span> {game.developer}</li>
                <li><span className="text-gray-400">Publisher:</span> {game.publisher}</li>
                <li><span className="text-gray-400">Release Date:</span> {new Date(game.releaseDate).toLocaleDateString()}</li>
                <li><span className="text-gray-400">Languages:</span> {game.languages}</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
