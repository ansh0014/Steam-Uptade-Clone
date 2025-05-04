import { Link } from "wouter";
import { Game } from "@/lib/types";

type FeaturedGameProps = {
  game: Game;
};

export default function FeaturedGame({ game }: FeaturedGameProps) {
  return (
    <Link href={`/game/${game.id}`}>
      <a className="bg-steam-dark-blue rounded-lg overflow-hidden mb-6 block">
        <div className="relative">
          <img 
            src={game.headerImage} 
            alt={game.title} 
            className="w-full h-64 md:h-80 object-cover"
          />
          <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black to-transparent p-4">
            <h2 className="text-2xl font-bold text-white">{game.title}</h2>
            <p className="text-gray-300 mb-2">{game.shortDescription}</p>
            <div className="flex space-x-2">
              {game.price === 0 && (
                <span className="bg-steam-blue text-white px-2 py-1 rounded text-sm">Free to Play</span>
              )}
              {game.categories.slice(0, 3).map(category => (
                <span key={category.id} className="game-tag">{category.name}</span>
              ))}
            </div>
          </div>
        </div>
      </a>
    </Link>
  );
}
