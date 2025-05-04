import { Link } from "wouter";
import { Game } from "@/lib/types";
import { useCart } from "@/hooks/useCart";
import { apiRequest } from "@/lib/queryClient";

type GameCardProps = {
  game: Game;
  type: "special-offer" | "new-release" | "popular";
};

export default function GameCard({ game, type }: GameCardProps) {
  const { addToCart } = useCart();

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    try {
      await apiRequest("POST", "/api/cart/add", { gameId: game.id });
      addToCart(game);
    } catch (error) {
      console.error("Failed to add game to cart:", error);
    }
  };

  return (
    <Link href={`/game/${game.id}`}>
      <a className="game-card group">
        <img 
          src={game.headerImage} 
          alt={game.title} 
          className="w-full h-40 object-cover"
        />
        <div className="p-4">
          <h3 className="font-medium text-white mb-1">{game.title}</h3>
          <div className="flex justify-between items-center">
            {type === "special-offer" && (
              <>
                <div className="discount-tag">
                  -{game.discount}%
                </div>
                <div className="text-right">
                  <span className="line-through text-gray-400 text-sm">${game.originalPrice.toFixed(2)}</span>
                  <span className="text-white font-bold ml-1">${game.price.toFixed(2)}</span>
                </div>
              </>
            )}
            
            {type === "new-release" && (
              <>
                <div className="new-release-tag">
                  New Release
                </div>
                <div className="text-right">
                  <span className="text-white font-bold">${game.price.toFixed(2)}</span>
                </div>
              </>
            )}
            
            {type === "popular" && (
              <>
                <div className="popular-tag">
                  Popular
                </div>
                <div className="text-right">
                  {game.price === 0 ? (
                    <span className="free-tag">Free to Play</span>
                  ) : (
                    <span className="text-white font-bold">${game.price.toFixed(2)}</span>
                  )}
                </div>
              </>
            )}
          </div>
          
          {/* Quick add button that appears on hover */}
          <div className="mt-3 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={handleAddToCart}
              className="w-full bg-steam-blue hover:bg-opacity-80 text-white py-1 rounded text-sm"
            >
              Add to Cart
            </button>
          </div>
        </div>
      </a>
    </Link>
  );
}
