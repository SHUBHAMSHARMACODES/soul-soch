import React from 'react';
import {
  Atom,
  BookOpen,
  Brain,
  History,
  Landmark,
  Sprout,
} from 'lucide-react';
import { BookCategory } from '../types';

interface CategoryStripProps {
  selectedCategory: BookCategory | 'All';
  onSelectCategory: (category: BookCategory | 'All') => void;
}

const LotusIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.6"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    aria-hidden="true"
  >
    <path d="M12 4c2.2 3 3.2 5.6 3.2 8.2A3.2 3.2 0 0 1 12 15.4a3.2 3.2 0 0 1-3.2-3.2C8.8 9.6 9.8 7 12 4Z" />
    <path d="M8.8 12.2C6.4 11.4 4.5 9.8 3.5 7.5c-.3 3.2.8 6.4 3.6 8.3" />
    <path d="M15.2 12.2c2.4-.8 4.3-2.4 5.3-4.7.3 3.2-.8 6.4-3.6 8.3" />
    <path d="M4 17.5c2.4 1.6 5.2 2.5 8 2.5s5.6-.9 8-2.5" />
  </svg>
);

const CATEGORIES: Array<{
  label: BookCategory;
  line1: string;
  line2?: string;
  icon: React.ReactNode;
}> = [
  {
    label: 'Books & Literature',
    line1: 'Books',
    line2: '& Literature',
    icon: <BookOpen className="w-6 h-6 text-[#5B4834]" strokeWidth={1.6} />,
  },
  {
    label: 'Spirituality & Gita',
    line1: 'Spirituality',
    line2: '& Gita',
    icon: <LotusIcon className="w-6 h-6 text-[#5B4834]" />,
  },
  {
    label: 'Psychology & Mind',
    line1: 'Psychology',
    line2: '& Mind',
    icon: <Brain className="w-6 h-6 text-[#5B4834]" strokeWidth={1.6} />,
  },
  {
    label: 'Philosophy',
    line1: 'Philosophy',
    icon: <Landmark className="w-6 h-6 text-[#5B4834]" strokeWidth={1.6} />,
  },
  {
    label: 'Science & Knowledge',
    line1: 'Science',
    line2: '& Knowledge',
    icon: <Atom className="w-6 h-6 text-[#5B4834]" strokeWidth={1.6} />,
  },
  {
    label: 'Self-Improvement',
    line1: 'Self-Improvement',
    icon: <Sprout className="w-6 h-6 text-[#5B4834]" strokeWidth={1.6} />,
  },
  {
    label: 'History & Culture',
    line1: 'History',
    line2: '& Culture',
    icon: <History className="w-6 h-6 text-[#5B4834]" strokeWidth={1.6} />,
  },
];

export const CategoryStrip: React.FC<CategoryStripProps> = ({
  selectedCategory,
  onSelectCategory,
}) => {
  return (
    <div className="relative z-20 max-w-[1340px] mx-auto px-4 sm:px-8 -mt-9">
      <div className="bg-[#FAF7F0] rounded-xl border border-[#E6DFD1] shadow-[0_10px_28px_rgba(29,27,24,0.08)] px-3 py-3 sm:px-5 sm:py-3.5">
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2 sm:gap-1 lg:divide-x lg:divide-[#EAE2D3]">
          {CATEGORIES.map((cat) => {
            const isActive = selectedCategory === cat.label;
            return (
              <button
                key={cat.label}
                type="button"
                onClick={() =>
                  onSelectCategory(isActive ? 'All' : cat.label)
                }
                className={`flex items-center justify-start lg:justify-center gap-2.5 px-3 py-2 rounded-lg text-left transition-all duration-150 cursor-pointer ${
                  isActive
                    ? 'bg-[#EFE7D6] text-[#1D1B18] ring-1 ring-[#D49D45]'
                    : 'hover:bg-[#F3EDE0] text-[#35302A]'
                }`}
              >
                <span className="shrink-0">{cat.icon}</span>
                <span className="text-[12.5px] leading-[1.22] font-medium">
                  <span className="block">{cat.line1}</span>
                  {cat.line2 && <span className="block">{cat.line2}</span>}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
