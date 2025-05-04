import { Game } from "@/lib/types";
import GameCard from "@/components/GameCard";

type GameGridProps = {
  title: string;
  games: Game[];
  isLoading: boolean;
  viewAllLink: string;
  type: "special-offer" | "new-release" | "popular";
};

export default function GameGrid({ 
  title, 
  games, 
  isLoading, 
  viewAllLink,
  type 
}: GameGridProps) {
  return (
    <div className="mb-8">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">{title}</h2>
        <a href={viewAllLink} className="text-steam-blue hover:underline text-sm">View all</a>
      </div>
      
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {Array(4).fill(0).map((_, i) => (
            <div key={i} className="bg-steam-dark-blue rounded-lg overflow-hidden">
              <div className="w-full h-40 bg-steam-dark-gray animate-pulse"></div>
              <div className="p-4">
                <div className="h-5 bg-steam-dark-gray animate-pulse mb-2 w-3/4"></div>
                <div className="flex justify-between">
                  <div className="h-5 bg-steam-dark-gray animate-pulse w-1/4"></div>
                  <div className="h-5 bg-steam-dark-gray animate-pulse w-1/4"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {games.length > 0 ? (
            games.map((game) => (
              <GameCard key={game.id} game={game} type={type} />
            ))
          ) : (
            <div className="col-span-4 text-center py-8">
              <p>No games found.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
