import { Category } from "@/lib/types";

type CategoryGridProps = {
  categories: Category[];
  selectedCategory: string | null;
  onSelectCategory: (categoryId: string | null) => void;
};

export default function CategoryGrid({ 
  categories, 
  selectedCategory, 
  onSelectCategory 
}: CategoryGridProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-2 text-sm">
      <button
        className={`bg-steam-dark-blue hover:bg-steam-dark-gray rounded p-2 text-center transition-colors duration-200 ${
          selectedCategory === null ? 'bg-steam-dark-gray' : ''
        }`}
        onClick={() => onSelectCategory(null)}
      >
        All Games
      </button>
      
      {categories.map((category) => (
        <button
          key={category.id}
          className={`bg-steam-dark-blue hover:bg-steam-dark-gray rounded p-2 text-center transition-colors duration-200 ${
            selectedCategory === category.id ? 'bg-steam-dark-gray' : ''
          }`}
          onClick={() => onSelectCategory(category.id)}
        >
          {category.name}
        </button>
      ))}
    </div>
  );
}
