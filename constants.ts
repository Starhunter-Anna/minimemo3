import { ColorPalette, FontFamily, SortOption } from './types';

export const CATEGORIES = ["Personal", "Work", "Ideas", "To-Do", "Shopping", "Misc"];

export const COLORS: ColorPalette[] = [
  { id: 'white', bgClass: 'bg-white', borderClass: 'border-gray-200', textClass: 'text-gray-800' },
  { id: 'yellow', bgClass: 'bg-yellow-100', borderClass: 'border-yellow-200', textClass: 'text-yellow-900' },
  { id: 'green', bgClass: 'bg-green-100', borderClass: 'border-green-200', textClass: 'text-green-900' },
  { id: 'blue', bgClass: 'bg-blue-100', borderClass: 'border-blue-200', textClass: 'text-blue-900' },
  { id: 'purple', bgClass: 'bg-purple-100', borderClass: 'border-purple-200', textClass: 'text-purple-900' },
  { id: 'pink', bgClass: 'bg-pink-100', borderClass: 'border-pink-200', textClass: 'text-pink-900' },
  { id: 'orange', bgClass: 'bg-orange-100', borderClass: 'border-orange-200', textClass: 'text-orange-900' },
];

export const FONTS = [
  { id: FontFamily.SANS, label: 'Aa', name: 'Clean' },
  { id: FontFamily.SERIF, label: 'Aa', name: 'Elegant' },
  { id: FontFamily.MONO, label: 'Aa', name: 'Code' },
];

export const SORT_LABELS: Record<SortOption, string> = {
  [SortOption.CREATED_DESC]: 'Newest First',
  [SortOption.CREATED_ASC]: 'Oldest First',
  [SortOption.UPDATED_DESC]: 'Recently Updated',
  [SortOption.ALPHA_ASC]: 'A-Z',
};

export const DEFAULT_NOTE = {
  title: '',
  content: '',
  category: 'Personal',
  colorClass: 'bg-white',
  fontClass: FontFamily.SANS,
};
