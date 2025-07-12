import React, { useState } from 'react';
import { Provider } from '../types';
import { Bot, Zap, Sparkles, Globe, Heart, Eye, EyeOff } from 'lucide-react';

interface ProviderGridProps {
  providers: Provider[];
  onUpdateApiKey: (providerId: string, apiKey: string) => void;
  onSetStatus: (providerId: string, status: Provider['status']) => void;
}

const iconMap = { Bot, Zap, Sparkles, Globe, Heart };

export const ProviderGrid: React.FC<ProviderGridProps> = ({ 
  providers, 
  onUpdateApiKey, 
  onSetStatus 
}) => {
  const [editingProvider, setEditingProvider] = useState<string | null>(null);
  const [tempKeys, setTempKeys] = useState<Record<string, string>>({});
  const [showKeys, setShowKeys] = useState<Record<string, boolean>>({});
  const [testing, setTesting] = useState<Record<string, boolean>>({});

  const handleEdit = (providerId: string) => {
    const provider = providers.find(p => p.id === providerId);
    setEditingProvider(providerId);
    setTempKeys(prev => ({ ...prev, [providerId]: provider?.apiKey || '' }));
  };

  const handleSave = async (providerId: string) => {
    const apiKey = tempKeys[providerId] || '';
    setTesting(prev => ({ ...prev, [providerId]: true }));
    
    try {
      const response = await fetch('http://localhost:3001/api/validate-key', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ provider: providerId, apiKey })
      });
      const data = await response.json();
      
      if (data.valid) {
        onUpdateApiKey(providerId, apiKey);
        onSetStatus(providerId, 'connected');
      } else {
        onSetStatus(providerId, 'error');
      }
    } catch (error) {
      onSetStatus(providerId, 'error');
    } finally {
      setTesting(prev => ({ ...prev, [providerId]: false }));
      setEditingProvider(null);
      setShowKeys(prev => ({ ...prev, [providerId]: false }));
    }
  };

  const handleCancel = (providerId: string) => {
    setEditingProvider(null);
    setTempKeys(prev => ({ ...prev, [providerId]: '' }));
    setShowKeys(prev => ({ ...prev, [providerId]: false }));
  };

  const getStatusColor = (status: Provider['status']) => {
    switch (status) {
      case 'connected': return 'bg-green-500';
      case 'error': return 'bg-red-500';
      case 'pending': return 'bg-yellow-500';
      default: return 'bg-gray-400';
    }
  };

  // Filter to main providers only
  const mainProviders = providers.filter(p => 
    ['openai', 'anthropic', 'gemini', 'github'].includes(p.id)
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {mainProviders.map(provider => {
        const Icon = iconMap[provider.icon as keyof typeof iconMap] || Bot;
        const isEditing = editingProvider === provider.id;
        const isTestingProvider = testing[provider.id];

        return (
          <div
            key={provider.id}
            className="bg-white/70 dark:bg-neutral-900 backdrop-blur-sm rounded-xl p-6 border border-gray-200 dark:border-neutral-700 hover:shadow-lg transition-all duration-300"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className={`p-3 rounded-lg bg-gradient-to-br ${provider.color}`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">{provider.name}</h3>
                  <div className="flex items-center space-x-2">
                    <div className={`w-2 h-2 rounded-full ${getStatusColor(provider.status)}`} />
                    <span className="text-sm capitalize text-gray-600 dark:text-gray-300">
                      {provider.status}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {isEditing ? (
              <div className="space-y-3">
                <div className="relative">
                  <input
                    type={showKeys[provider.id] ? 'text' : 'password'}
                    value={tempKeys[provider.id] || ''}
                    onChange={(e) => setTempKeys(prev => ({ ...prev, [provider.id]: e.target.value }))}
                    placeholder="Enter API key"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-800 pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowKeys(prev => ({ ...prev, [provider.id]: !prev[provider.id] }))}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  >
                    {showKeys[provider.id] ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleSave(provider.id)}
                    disabled={isTestingProvider}
                    className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
                  >
                    {isTestingProvider ? 'Testing...' : 'Save'}
                  </button>
                  <button
                    onClick={() => handleCancel(provider.id)}
                    className="flex-1 bg-gray-200 dark:bg-neutral-700 text-gray-800 dark:text-white px-4 py-2 rounded-lg hover:bg-gray-300 dark:hover:bg-neutral-600"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={() => handleEdit(provider.id)}
                className="w-full bg-neutral-800 text-white px-4 py-2 rounded-lg hover:bg-neutral-900 transition-colors"
              >
                {provider.apiKey ? 'Update API Key' : 'Add API Key'}
              </button>
            )}
          </div>
        );
      })}
    </div>
  );
};