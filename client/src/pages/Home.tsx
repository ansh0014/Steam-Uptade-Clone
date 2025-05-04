import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import FeaturedGame from "@/components/FeaturedGame";
import CategoryGrid from "@/components/CategoryGrid";
import GameGrid from "@/components/GameGrid";
import { Category, Game } from "@/lib/types";

export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const { data: featuredGame, isLoading: featuredLoading } = useQuery<Game>({
    queryKey: ['/api/games/featured'],
  });

  const { data: categories, isLoading: categoriesLoading } = useQuery<Category[]>({
    queryKey: ['/api/categories'],
  });

  const { data: specialOffers, isLoading: specialOffersLoading } = useQuery<Game[]>({
    queryKey: ['/api/games/special-offers', selectedCategory],
  });

  const { data: newReleases, isLoading: newReleasesLoading } = useQuery<Game[]>({
    queryKey: ['/api/games/new-releases', selectedCategory],
  });

  const { data: popularGames, isLoading: popularGamesLoading } = useQuery<Game[]>({
    queryKey: ['/api/games/popular', selectedCategory],
  });

  const handleCategorySelect = (categoryId: string | null) => {
    setSelectedCategory(categoryId);
  };

  return (
    <div id="store-home">
      {/* Featured Game */}
      {featuredLoading ? (
        <div className="bg-steam-dark-blue rounded-lg h-64 md:h-80 animate-pulse mb-6" />
      ) : (
        featuredGame && <FeaturedGame game={featuredGame} />
      )}

      {/* Categories */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold mb-4">Browse Categories</h2>
        {categoriesLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-2">
            {Array(8).fill(0).map((_, i) => (
              <div key={i} className="bg-steam-dark-blue rounded p-2 h-10 animate-pulse" />
            ))}
          </div>
        ) : (
          <CategoryGrid 
            categories={categories || []} 
            selectedCategory={selectedCategory}
            onSelectCategory={handleCategorySelect}
          />
        )}
      </div>

      {/* Special Offers */}
      <GameGrid 
        title="Special Offers" 
        games={specialOffers || []} 
        isLoading={specialOffersLoading} 
        viewAllLink="#"
        type="special-offer"
      />

      {/* New Releases */}
      <GameGrid 
        title="New Releases" 
        games={newReleases || []} 
        isLoading={newReleasesLoading} 
        viewAllLink="#"
        type="new-release"
      />

      {/* Most Popular */}
      <GameGrid 
        title="Most Popular" 
        games={popularGames || []} 
        isLoading={popularGamesLoading} 
        viewAllLink="#"
        type="popular"
      />
    </div>
  );
}
