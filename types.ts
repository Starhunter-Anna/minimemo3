export enum SortOption {
  CREATED_DESC = 'CREATED_DESC',
  CREATED_ASC = 'CREATED_ASC',
  UPDATED_DESC = 'UPDATED_DESC',
  ALPHA_ASC = 'ALPHA_ASC',
}

export enum FontFamily {
  SANS = 'font-sans',
  SERIF = 'font-serif',
  MONO = 'font-mono',
}

export interface Note {
  id: string;
  title: string;
  content: string;
  category: string;
  colorClass: string; // Tailwind bg color class
  fontClass: FontFamily;
  createdAt: number;
  updatedAt: number;
}

export interface ColorPalette {
  id: string;
  bgClass: string;
  borderClass: string;
  textClass: string;
}
