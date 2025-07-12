import React from 'react';
import { Provider } from '../types';
import { ProviderGrid } from './ProviderGrid';

interface SimpleSettingsProps {
  open: boolean;
  onClose: () => void;
  providers: Provider[];
  onSetApiKey: (id: string, key: string) => void;
  onSetStatus: (id: string, status: Provider['status']) => void;
}

export const SimpleSettings: React.FC<SimpleSettingsProps> = ({
  open,
  onClose,
  providers,
  onSetApiKey,
  onSetStatus
}) => {
  if (!open) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-white dark:bg-neutral-900 rounded-2xl shadow-2xl w-full max-w-4xl max-h-[85vh] overflow-y-auto">
        <header className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-neutral-800 sticky top-0 bg-inherit z-10">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Provider Settings</h2>
          <button 
            onClick={onClose} 
            className="text-2xl text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
          >
            ✕
          </button>
        </header>
        
        <div className="p-6">
          <ProviderGrid
            providers={providers}
            onUpdateApiKey={onSetApiKey}
            onSetStatus={onSetStatus}
          />
        </div>
      </div>
    </div>
  );
};