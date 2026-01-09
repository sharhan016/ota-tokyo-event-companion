import { CategoryType } from '../types';

interface CategoryChipsProps {
  selectedCategory: CategoryType;
  onSelectCategory: (category: CategoryType) => void;
}

const categories = [
  { id: 'all' as CategoryType, label: 'All', emoji: '🗺️' },
  { id: 'food' as CategoryType, label: 'Food', emoji: '🍜' },
  { id: 'event' as CategoryType, label: 'Stage', emoji: '🎤' },
  { id: 'shop' as CategoryType, label: 'Merch', emoji: '🛍️' },
  { id: 'booth' as CategoryType, label: 'Sponsors', emoji: '🏢' },
  { id: 'workshop' as CategoryType, label: 'Workshop', emoji: '🎨' },
  { id: 'cafe' as CategoryType, label: 'Cafe', emoji: '☕' },
];

export function CategoryChips({ selectedCategory, onSelectCategory }: CategoryChipsProps) {
  return (
    <div className="w-full overflow-x-auto scrollbar-hide">
      <div className="flex gap-2 px-4 py-3 min-w-max">
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => onSelectCategory(category.id)}
            className={`
              px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap
              transition-all duration-200 transform active:scale-95
              ${
                selectedCategory === category.id
                  ? 'bg-blue-600 text-white shadow-lg scale-105'
                  : 'bg-white/80 backdrop-blur-md text-gray-700 hover:bg-white shadow-md'
              }
            `}
          >
            <span className="mr-1.5">{category.emoji}</span>
            {category.label}
          </button>
        ))}
      </div>
    </div>
  );
}
