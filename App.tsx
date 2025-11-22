import React, { useState, useMemo, useEffect } from 'react';
import { Plus, Settings } from 'lucide-react';
import { Note, SortOption } from './types';
import { COLORS, FONTS, CATEGORIES as DEFAULT_CATEGORIES } from './constants';
import { NoteCard } from './components/NoteCard';
import { NoteEditor } from './components/NoteEditor';
import { FilterBar } from './components/FilterBar';
import { SettingsModal } from './components/SettingsModal';

// Initial Data
const INITIAL_NOTES: Note[] = [
  {
    id: '1',
    title: 'Project Ideas 🚀',
    content: '1. AI-powered plant waterer\n2. Minimalist habit tracker\n3. Recipe generator based on fridge items',
    category: 'Ideas',
    colorClass: 'bg-blue-100',
    fontClass: FONTS[0].id,
    createdAt: Date.now() - 100000,
    updatedAt: Date.now(),
  },
  {
    id: '2',
    title: 'Grocery List',
    content: '- Milk\n- Eggs\n- Sourdough bread\n- Avocados\n- Coffee beans',
    category: 'Shopping',
    colorClass: 'bg-yellow-100',
    fontClass: FONTS[2].id,
    createdAt: Date.now() - 200000,
    updatedAt: Date.now() - 50000,
  },
  {
    id: '3',
    title: 'Meeting Notes: Q4 Review',
    content: 'Key takeaways:\n- Revenue up by 15%\n- User retention needs focus\n- Launch date set for Dec 15th',
    category: 'Work',
    colorClass: 'bg-gray-100', // White/Gray fallback
    fontClass: FONTS[0].id,
    createdAt: Date.now() - 300000,
    updatedAt: Date.now() - 300000,
  },
   {
    id: '4',
    title: 'Daily Affirmations',
    content: 'I am capable.\nI am calm.\nI focus on what I can control.',
    category: 'Personal',
    colorClass: 'bg-pink-100',
    fontClass: FONTS[1].id,
    createdAt: Date.now() - 400000,
    updatedAt: Date.now() - 400000,
  },
  {
    id: '5',
    title: 'Books to Read',
    content: 'Atomic Habits\nDeep Work\nThe Psychology of Money',
    category: 'Personal',
    colorClass: 'bg-purple-100',
    fontClass: FONTS[1].id,
    createdAt: Date.now() - 500000,
    updatedAt: Date.now() - 500000,
  },
  {
    id: '6',
    title: 'Gym Routine',
    content: 'Mon: Chest/Triceps\nTue: Back/Biceps\nWed: Legs\nThu: Shoulders\nFri: Cardio',
    category: 'Misc',
    colorClass: 'bg-green-100',
    fontClass: FONTS[0].id,
    createdAt: Date.now() - 600000,
    updatedAt: Date.now() - 600000,
  },
];

const App: React.FC = () => {
  // State
  const [notes, setNotes] = useState<Note[]>(() => {
      const saved = localStorage.getItem('minimemo-notes');
      return saved ? JSON.parse(saved) : INITIAL_NOTES;
  });

  const [categories, setCategories] = useState<string[]>(() => {
      const saved = localStorage.getItem('minimemo-categories');
      return saved ? JSON.parse(saved) : DEFAULT_CATEGORIES;
  });
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<SortOption>(SortOption.CREATED_DESC);
  const [isSortMenuOpen, setIsSortMenuOpen] = useState(false);
  
  // Editor & Modal State
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // PWA Install Prompt State
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

  // Persistence
  useEffect(() => {
    localStorage.setItem('minimemo-notes', JSON.stringify(notes));
  }, [notes]);

  useEffect(() => {
    localStorage.setItem('minimemo-categories', JSON.stringify(categories));
  }, [categories]);

  // Listen for install prompt
  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      // Prevent Chrome 67 and earlier from automatically showing the prompt
      e.preventDefault();
      // Stash the event so it can be triggered later.
      setDeferredPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallApp = async () => {
    if (!deferredPrompt) return;
    
    // Show the install prompt
    deferredPrompt.prompt();
    
    // Wait for the user to respond to the prompt
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === 'accepted') {
      setDeferredPrompt(null);
    }
  };

  // Derived Data
  const filteredAndSortedNotes = useMemo(() => {
    let result = [...notes];

    // 1. Search
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (n) =>
          n.title.toLowerCase().includes(query) ||
          n.content.toLowerCase().includes(query) ||
          n.category.toLowerCase().includes(query)
      );
    }

    // 2. Category
    if (selectedCategory) {
      result = result.filter((n) => n.category === selectedCategory);
    }

    // 3. Sort
    result.sort((a, b) => {
      switch (sortBy) {
        case SortOption.CREATED_DESC:
          return b.createdAt - a.createdAt;
        case SortOption.CREATED_ASC:
          return a.createdAt - b.createdAt;
        case SortOption.UPDATED_DESC:
          return b.updatedAt - a.updatedAt;
        case SortOption.ALPHA_ASC:
          return a.title.localeCompare(b.title);
        default:
          return 0;
      }
    });

    return result;
  }, [notes, searchQuery, selectedCategory, sortBy]);

  // Handlers
  const handleCreateNote = () => {
    setEditingNote(null);
    setIsEditorOpen(true);
  };

  const handleEditNote = (note: Note) => {
    setEditingNote(note);
    setIsEditorOpen(true);
  };

  const handleSaveNote = (data: Omit<Note, 'id' | 'createdAt' | 'updatedAt'> & { id?: string, createdAt?: number }) => {
    if (data.id) {
      // Update existing
      setNotes((prev) =>
        prev.map((n) =>
          n.id === data.id
            ? { ...n, ...data, updatedAt: Date.now() } as Note
            : n
        )
      );
    } else {
      // Create new
      const newNote: Note = {
        ...data,
        id: Date.now().toString(), // Simple ID
        createdAt: Date.now(),
        updatedAt: Date.now(),
      } as Note;
      setNotes((prev) => [newNote, ...prev]);
    }
  };

  const handleDeleteNote = (id: string) => {
    setNotes((prev) => prev.filter((n) => n.id !== id));
  };

  const handleAddCategory = (newCat: string) => {
    if (!categories.includes(newCat)) {
      setCategories(prev => [...prev, newCat]);
    }
  };

  const handleImportData = (importedNotes: any[], importedCategories: string[]) => {
      setNotes(importedNotes);
      setCategories(importedCategories);
  };

  return (
    <div className="min-h-screen w-full flex justify-center bg-gray-200 sm:py-8 font-sans text-gray-900">
      
      {/* Mobile Simulation Container (iPhone 13 dimensions approx max-width) */}
      <div className="w-full sm:max-w-[390px] h-dvh sm:h-[844px] bg-[#fdfbf7] sm:rounded-[3rem] sm:shadow-2xl sm:border-[8px] sm:border-gray-800 overflow-hidden flex flex-col relative">
        
        {/* Status Bar Simulation (Visual only) */}
        <div className="hidden sm:flex justify-between items-center px-8 pt-4 pb-2 text-xs font-semibold text-gray-900 select-none">
            <span>9:41</span>
            <div className="flex gap-1.5">
                <div className="w-4 h-2.5 bg-gray-900 rounded-[1px]"></div>
                <div className="w-4 h-2.5 bg-gray-900 rounded-[1px]"></div>
                <div className="w-5 h-2.5 border border-gray-900 rounded-[2px] relative">
                    <div className="absolute inset-0.5 bg-gray-900"></div>
                </div>
            </div>
        </div>
        
        {/* App Header */}
        <header className="px-6 pt-6 pb-2 flex justify-between items-end">
          <div>
            <p className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-1">Good Morning</p>
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight">My Notes</h1>
          </div>
          <div className="flex items-center gap-2">
             <button 
                onClick={() => setIsSettingsOpen(true)}
                className="p-2 rounded-full bg-white border border-gray-200 text-gray-500 hover:bg-gray-50 hover:text-gray-800 transition-colors"
             >
                <Settings size={20} />
             </button>
          </div>
        </header>

        {/* Filters */}
        <FilterBar 
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            sortBy={sortBy}
            setSortBy={setSortBy}
            isSortMenuOpen={isSortMenuOpen}
            setIsSortMenuOpen={setIsSortMenuOpen}
            categories={categories}
        />

        {/* Note Grid */}
        <div className="flex-1 overflow-y-auto p-4 no-scrollbar" onClick={() => setIsSortMenuOpen(false)}>
            {filteredAndSortedNotes.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-64 text-gray-400">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                        <Plus className="text-gray-300" size={32} />
                    </div>
                    <p>No notes found</p>
                </div>
            ) : (
                <div className="grid grid-cols-2 gap-3 pb-24">
                    {filteredAndSortedNotes.map(note => (
                        <NoteCard key={note.id} note={note} onClick={handleEditNote} />
                    ))}
                </div>
            )}
        </div>

        {/* Floating Action Button */}
        <div className="absolute bottom-6 right-6 z-10">
          <button
            onClick={handleCreateNote}
            className="bg-black text-white p-4 rounded-full shadow-xl hover:scale-105 active:scale-95 transition-all flex items-center justify-center group"
          >
            <Plus size={28} className="group-hover:rotate-90 transition-transform duration-300" />
          </button>
        </div>

        {/* Editor Modal */}
        <NoteEditor 
            isOpen={isEditorOpen}
            note={editingNote}
            onClose={() => setIsEditorOpen(false)}
            onSave={handleSaveNote}
            onDelete={handleDeleteNote}
            categories={categories}
            onAddCategory={handleAddCategory}
        />

        {/* Settings Modal */}
        <SettingsModal
            isOpen={isSettingsOpen}
            onClose={() => setIsSettingsOpen(false)}
            notes={notes}
            categories={categories}
            onImport={handleImportData}
            showInstallButton={!!deferredPrompt}
            onInstallApp={handleInstallApp}
        />

        {/* Bottom Bar Simulation (Visual only for home indicator) */}
        <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-32 h-1 bg-gray-300 rounded-full sm:block hidden pointer-events-none"></div>
      </div>
    </div>
  );
};

export default App;