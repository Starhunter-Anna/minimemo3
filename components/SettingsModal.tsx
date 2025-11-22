import React, { useRef, useState } from 'react';
import { X, Download, Upload, AlertTriangle, FileJson, Smartphone } from 'lucide-react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  notes: any[];
  categories: string[];
  onImport: (notes: any[], categories: string[]) => void;
  showInstallButton?: boolean;
  onInstallApp?: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  notes,
  categories,
  onImport,
  showInstallButton = false,
  onInstallApp
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [importError, setImportError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleExport = () => {
    const data = {
      version: 1,
      exportedAt: Date.now(),
      notes,
      categories
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `minimemo-backup-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const result = event.target?.result as string;
        const data = JSON.parse(result);
        
        if (Array.isArray(data.notes) && Array.isArray(data.categories)) {
          if (window.confirm('This will replace your current notes with the backup file. Are you sure?')) {
            onImport(data.notes, data.categories);
            onClose();
          }
        } else {
            setImportError("Invalid backup file format.");
        }
      } catch (err) {
        setImportError("Could not parse JSON file.");
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity" onClick={onClose} />
      
      <div className="relative w-full max-w-sm bg-[#fdfbf7] rounded-3xl shadow-2xl overflow-hidden flex flex-col animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-black/5 flex items-center justify-between">
            <h2 className="text-lg font-bold text-gray-900">Data & Settings</h2>
            <button onClick={onClose} className="p-2 hover:bg-black/5 rounded-full">
                <X size={20} className="text-gray-500" />
            </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
            
            {/* Install App Prompt */}
            {showInstallButton && onInstallApp && (
                <div className="bg-black p-4 rounded-2xl shadow-lg">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-white/20 text-white rounded-full">
                            <Smartphone size={20} />
                        </div>
                        <div>
                            <h3 className="font-bold text-white">Install App</h3>
                            <p className="text-xs text-gray-300">Add to home screen for better experience</p>
                        </div>
                    </div>
                    <button 
                        onClick={onInstallApp}
                        className="w-full mt-2 py-2 bg-white text-black text-sm font-bold rounded-xl hover:bg-gray-100 transition-colors"
                    >
                        Install Now
                    </button>
                </div>
            )}

            {/* Export Section */}
            <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
                <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 bg-blue-50 text-blue-600 rounded-full">
                        <Download size={20} />
                    </div>
                    <div>
                        <h3 className="font-semibold text-gray-900">Backup Data</h3>
                        <p className="text-xs text-gray-500">Save all notes to a local file</p>
                    </div>
                </div>
                <button 
                    onClick={handleExport}
                    className="w-full mt-2 py-2 bg-gray-100 text-gray-800 text-sm font-bold rounded-xl hover:bg-gray-200 transition-colors flex items-center justify-center gap-2"
                >
                    <FileJson size={16} /> Export JSON
                </button>
            </div>

            {/* Import Section */}
            <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
                <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 bg-green-50 text-green-600 rounded-full">
                        <Upload size={20} />
                    </div>
                    <div>
                        <h3 className="font-semibold text-gray-900">Restore Data</h3>
                        <p className="text-xs text-gray-500">Import notes from a backup file</p>
                    </div>
                </div>
                
                {importError && (
                    <div className="mb-3 p-2 bg-red-50 text-red-600 text-xs rounded-lg flex items-center gap-2">
                        <AlertTriangle size={12} /> {importError}
                    </div>
                )}

                <input 
                    type="file" 
                    ref={fileInputRef} 
                    onChange={handleFileChange} 
                    accept=".json" 
                    className="hidden" 
                />
                <button 
                    onClick={handleImportClick}
                    className="w-full mt-2 py-2 bg-white border border-gray-200 text-gray-700 text-sm font-bold rounded-xl hover:bg-gray-50 transition-colors"
                >
                    Select Backup File
                </button>
            </div>

            {/* Info */}
            <div className="text-center pt-2">
                <p className="text-[10px] text-gray-400 uppercase tracking-widest">
                    MiniMemo v1.1 • PWA Ready
                </p>
            </div>
        </div>
      </div>
    </div>
  );
};