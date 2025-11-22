import React, { useEffect, useState } from 'react';
import { X, Trash2, Check, ChevronDown, Plus } from 'lucide-react';
import { Note, FontFamily } from '../types';
import { COLORS, FONTS, DEFAULT_NOTE } from '../constants';

interface NoteEditorProps {
  note: Note | null; // null means new note
  isOpen: boolean;
  onClose: () => void;
  onSave: (note: Omit<Note, 'id' | 'createdAt' | 'updatedAt'> & { id?: string, createdAt?: number }) => void;
  onDelete: (id: string) => void;
  categories: string[];
  onAddCategory: (cat: string) => void;
}

export const NoteEditor: React.FC<NoteEditorProps> = ({
  note,
  isOpen,
  onClose,
  onSave,
  onDelete,
  categories,
  onAddCategory,
}) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState(categories[0] || 'Personal');
  const [colorClass, setColorClass] = useState(COLORS[0].bgClass);
  const [fontClass, setFontClass] = useState<FontFamily>(FontFamily.SANS);
  const [showSettings, setShowSettings] = useState(false);
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);
  
  const [isAddingCategory, setIsAddingCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');

  // Reset or populate form when opening
  useEffect(() => {
    if (isOpen) {
      if (note) {
        setTitle(note.title);
        setContent(note.content);
        setCategory(note.category);
        setColorClass(note.colorClass);
        setFontClass(note.fontClass);
      } else {
        setTitle(DEFAULT_NOTE.title);
        setContent(DEFAULT_NOTE.content);
        setCategory(DEFAULT_NOTE.category);
        setColorClass(DEFAULT_NOTE.colorClass);
        setFontClass(DEFAULT_NOTE.fontClass);
      }
      setShowSettings(false);
      setIsConfirmingDelete(false);
      setIsAddingCategory(false);
      setNewCategoryName('');
    }
  }, [isOpen, note]);

  if (!isOpen) return null;

  const handleSave = () => {
    if (!title.trim() && !content.trim()) {
        onClose();
        return;
    }
    onSave({
      id: note?.id,
      title,
      content,
      category,
      colorClass,
      fontClass,
      createdAt: note?.createdAt,
    });
    onClose();
  };

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsConfirmingDelete(true);
  };

  const handleConfirmDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (note) {
        onDelete(note.id);
        onClose();
    }
  };

  const handleCancelDelete = (e: React.MouseEvent) => {
      e.stopPropagation();
      setIsConfirmingDelete(false);
  }

  const handleAddNewCategory = () => {
    if (newCategoryName.trim()) {
        const formattedName = newCategoryName.trim();
        onAddCategory(formattedName);
        setCategory(formattedName);
        setNewCategoryName('');
        setIsAddingCategory(false);
    } else {
        setIsAddingCategory(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center sm:py-8 px-0 sm:px-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity" onClick={handleSave} />
      
      <div 
        className={`
          relative w-full max-w-md h-full sm:h-auto sm:max-h-[90vh] 
          ${colorClass} 
          flex flex-col sm:rounded-3xl shadow-2xl overflow-hidden transition-all transform
        `}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-4 border-b border-black/5">
          <button 
            onClick={handleSave}
            className="p-2 rounded-full hover:bg-black/5 transition-colors text-gray-600"
          >
            <X size={20} />
          </button>
          
          <div className="flex items-center gap-2">
             <button
                onClick={() => setShowSettings(!showSettings)}
                className={`flex items-center gap-1 text-xs font-bold uppercase tracking-wide px-3 py-1.5 rounded-full transition-colors ${showSettings ? 'bg-black text-white' : 'bg-black/5 text-gray-600 hover:bg-black/10'}`}
             >
                Options
                <ChevronDown size={12} className={`transition-transform ${showSettings ? 'rotate-180' : ''}`} />
             </button>
             <button 
                onClick={handleSave}
                className="p-2 rounded-full bg-black text-white shadow-lg hover:scale-105 transition-transform"
             >
                <Check size={18} />
            </button>
          </div>
        </div>

        {/* Settings Drawer */}
        <div className={`bg-black/5 overflow-hidden transition-all duration-300 ease-in-out ${showSettings ? 'max-h-96 opacity-100 border-b border-black/5' : 'max-h-0 opacity-0'}`}>
            <div className="p-5 space-y-5">
                {/* Colors */}
                <div>
                    <label className="text-xs font-bold text-gray-500 uppercase mb-2 block">Color</label>
                    <div className="flex gap-3 overflow-x-auto pb-1 no-scrollbar">
                        {COLORS.map((c) => (
                            <button
                                key={c.id}
                                onClick={() => setColorClass(c.bgClass)}
                                className={`
                                    w-8 h-8 rounded-full border-2 flex-shrink-0 transition-all
                                    ${c.bgClass} ${c.borderClass}
                                    ${colorClass === c.bgClass ? 'ring-2 ring-black ring-offset-2 scale-110' : 'hover:scale-110'}
                                `}
                            />
                        ))}
                    </div>
                </div>

                {/* Fonts */}
                <div>
                    <label className="text-xs font-bold text-gray-500 uppercase mb-2 block">Font</label>
                    <div className="flex gap-2">
                        {FONTS.map((f) => (
                            <button
                                key={f.id}
                                onClick={() => setFontClass(f.id)}
                                className={`
                                    flex-1 py-2 px-3 rounded-lg text-sm border transition-all
                                    ${f.id}
                                    ${fontClass === f.id ? 'bg-black text-white border-black' : 'bg-white text-gray-700 border-gray-200 hover:border-gray-300'}
                                `}
                            >
                                <span className="text-lg leading-none mr-1">{f.label}</span>
                                <span className="text-xs opacity-70">{f.name}</span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Category */}
                <div>
                    <label className="text-xs font-bold text-gray-500 uppercase mb-2 block">Category</label>
                    <div className="flex flex-wrap gap-2">
                        {categories.map((cat) => (
                            <button
                                key={cat}
                                onClick={() => setCategory(cat)}
                                className={`
                                    px-3 py-1 rounded-full text-xs font-medium transition-all border
                                    ${category === cat ? 'bg-black text-white border-black' : 'bg-white/50 text-gray-600 border-transparent hover:bg-white'}
                                `}
                            >
                                {cat}
                            </button>
                        ))}
                        {isAddingCategory ? (
                            <input 
                                type="text"
                                autoFocus
                                value={newCategoryName}
                                onChange={(e) => setNewCategoryName(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') handleAddNewCategory();
                                    if (e.key === 'Escape') setIsAddingCategory(false);
                                }}
                                onBlur={handleAddNewCategory}
                                placeholder="New..."
                                className="w-24 px-3 py-1 rounded-full text-xs font-medium border border-black bg-white focus:outline-none"
                            />
                        ) : (
                             <button
                                onClick={() => setIsAddingCategory(true)}
                                className="px-3 py-1 rounded-full text-xs font-medium transition-all border border-dashed border-gray-400 text-gray-500 hover:border-gray-600 hover:text-gray-700 flex items-center gap-1 bg-white/30"
                            >
                                <Plus size={12} /> New
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>

        {/* Editor Content */}
        <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-4">
          <input
            type="text"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className={`
                w-full bg-transparent text-2xl font-bold text-gray-900 placeholder-gray-400 
                focus:outline-none ${fontClass}
            `}
          />
          <textarea
            placeholder="Start typing..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className={`
                w-full flex-1 bg-transparent resize-none text-base text-gray-800 placeholder-gray-400 
                focus:outline-none leading-relaxed ${fontClass}
            `}
          />
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-black/5 flex justify-between items-center bg-white/10 h-[72px]">
           {isConfirmingDelete ? (
             <div className="flex items-center gap-3 w-full justify-end animate-in slide-in-from-right-5 duration-200">
                <span className="text-xs font-semibold text-red-600/80">Delete note?</span>
                <button 
                    onClick={handleCancelDelete}
                    className="px-4 py-2 rounded-xl bg-black/5 text-gray-600 text-xs font-bold hover:bg-black/10 transition-colors"
                >
                    Cancel
                </button>
                <button 
                    onClick={handleConfirmDelete}
                    className="px-4 py-2 rounded-xl bg-red-500 text-white text-xs font-bold hover:bg-red-600 transition-colors shadow-sm"
                >
                    Delete
                </button>
             </div>
           ) : (
             <>
               <span className="text-xs text-gray-400 font-medium">
                    {note ? 'Edited ' + new Date(note.updatedAt).toLocaleDateString() : 'New Note'}
               </span>
               {note && (
                 <button 
                   onClick={handleDeleteClick}
                   className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                 >
                   <Trash2 size={18} />
                 </button>
               )}
             </>
           )}
        </div>
      </div>
    </div>
  );
};