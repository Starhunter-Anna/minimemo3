import React from 'react';
import { Note } from '../types';
import { format } from 'date-fns';
import { Edit2 } from 'lucide-react';

interface NoteCardProps {
  note: Note;
  onClick: (note: Note) => void;
}

export const NoteCard: React.FC<NoteCardProps> = ({ note, onClick }) => {
  // Find contrasting border for a slightly popped look without heavy shadows
  // We assume the colorClass is like 'bg-yellow-100'
  const baseColor = note.colorClass.split('-')[1] || 'gray'; 
  
  return (
    <div 
      onClick={() => onClick(note)}
      className={`
        relative group
        ${note.colorClass} 
        ${note.fontClass}
        rounded-2xl p-4 
        h-48 flex flex-col justify-between
        transition-all duration-300 ease-out
        hover:scale-[1.02] hover:shadow-lg cursor-pointer
        border border-transparent hover:border-black/5
      `}
    >
      <div className="overflow-hidden">
        <h3 className="text-lg font-semibold mb-1 line-clamp-1 text-gray-900 leading-tight">
          {note.title || "Untitled"}
        </h3>
        <p className="text-sm text-gray-700 line-clamp-4 leading-relaxed opacity-90 whitespace-pre-wrap">
          {note.content || "No content..."}
        </p>
      </div>

      <div className="mt-2 flex items-center justify-between text-[10px] uppercase tracking-wider font-medium text-gray-500">
        <span className="bg-black/5 px-2 py-1 rounded-full">
          {note.category}
        </span>
        <span>
          {format(note.updatedAt, 'MMM d')}
        </span>
      </div>
      
      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
         <div className="bg-white/50 p-1.5 rounded-full backdrop-blur-sm">
            <Edit2 size={12} className="text-gray-700" />
         </div>
      </div>
    </div>
  );
};