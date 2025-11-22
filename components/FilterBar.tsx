import React from 'react';
import { Search, SlidersHorizontal, X } from 'lucide-react';
import { SortOption } from '../types';
import { SORT_LABELS } from '../constants';

interface FilterBarProps {
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  selectedCategory: string | null;
  setSelectedCategory: (c: string | null) => void;
  sortBy: SortOption;
  setSortBy: (s: SortOption) => void;
  isSortMenuOpen: boolean;
  setIsSortMenuOpen: (o: boolean) => void;
  categories: string[];
}

export const FilterBar: React.FC<FilterBarProps> = ({
  searchQuery,
  setSearchQuery,
  selectedCategory,
  setSelectedCategory,
  sortBy,
  setSortBy,
  isSortMenuOpen,
  setIsSortMenuOpen,
  categories,
}) => {
  return (
    <div className="sticky top-0 z-20 bg-white/90 backdrop-blur-md border-b border-gray-100 pb-2 pt-2 px-4">
      {/* Search & Sort Toggle */}
      <div className="flex gap-3 mb-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
          <input
            type="text"
            placeholder="Search notes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-gray-100 text-gray-800 text-sm rounded-xl pl-9 pr-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
          />
          {searchQuery && (
             <button 
               onClick={() => setSearchQuery('')}
               className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
             >
               <X size={14} />
             </button>
          )}
        </div>
        <button
          onClick={() => setIsSortMenuOpen(!isSortMenuOpen)}
          className={`p-2.5 rounded-xl transition-colors ${isSortMenuOpen ? 'bg-black text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
        >
          <SlidersHorizontal size={18} />
        </button>
      </div>

      {/* Sort Options Drawer */}
      {isSortMenuOpen && (
        <div className="mb-3 grid grid-cols-2 gap-2 animate-in slide-in-from-top-2 fade-in duration-200">
          {(Object.keys(SORT_LABELS) as SortOption[]).map((option) => (
            <button
              key={option}
              onClick={() => {
                setSortBy(option);
                setIsSortMenuOpen(false);
              }}
              className={`text-xs font-medium py-2 px-3 rounded-lg border text-left transition-all ${
                sortBy === option
                  ? 'bg-black text-white border-black'
                  : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300'
              }`}
            >
              {SORT_LABELS[option]}
            </button>
          ))}
        </div>
      )}

      {/* Horizontal Category Scroll */}
      <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
        <button
          onClick={() => setSelectedCategory(null)}
          className={`whitespace-nowrap px-4 py-1.5 rounded-full text-xs font-semibold transition-colors border ${
            selectedCategory === null
              ? 'bg-black text-white border-black'
              : 'bg-white text-gray-500 border-gray-200 hover:border-gray-300'
          }`}
        >
          All
        </button>
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(selectedCategory === cat ? null : cat)}
            className={`whitespace-nowrap px-4 py-1.5 rounded-full text-xs font-semibold transition-colors border ${
              selectedCategory === cat
                ? 'bg-black text-white border-black'
                : 'bg-white text-gray-500 border-gray-200 hover:border-gray-300'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>
    </div>
  );
};