import { useState, useEffect } from 'react';
import { Provider } from '../types';

const coreProviders: Provider[] = [
  {
    id: 'openai',
    name: 'OpenAI',
    status: 'disconnected',
    color: 'from-green-500 to-emerald-600',
    icon: 'Bot',
    requestCount: 0
  },
  {
    id: 'anthropic',
    name: 'Anthropic',
    status: 'disconnected',
    color: 'from-orange-500 to-red-500',
    icon: 'Zap',
    requestCount: 0
  },
  {
    id: 'gemini',
    name: 'Gemini',
    status: 'disconnected',
    color: 'from-blue-500 to-purple-600',
    icon: 'Sparkles',
    requestCount: 0
  },
  {
    id: 'github',
    name: 'GitHub',
    status: 'disconnected',
    color: 'from-gray-700 to-black',
    icon: 'Bot',
    requestCount: 0
  }
];

export const useSimpleProviders = () => {
  const [providers, setProviders] = useState<Provider[]>(coreProviders);

  const updateProvider = (id: string, updates: Partial<Provider>) => {
    setProviders(prev => 
      prev.map(p => p.id === id ? { ...p, ...updates } : p)
    );
  };

  const setApiKey = async (providerId: string, apiKey: string) => {
    updateProvider(providerId, { 
      apiKey, 
      status: apiKey ? 'pending' : 'disconnected' 
    });

    try {
      // Save to backend
      if (apiKey) {
        await fetch(`/api/credentials/${providerId}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ credentials: { apiKey } })
        });
      } else {
        await fetch(`/api/credentials/${providerId}`, {
          method: 'DELETE'
        });
      }
    } catch (err) {
      console.error('Failed to save credentials', err);
      updateProvider(providerId, { status: 'error' });
    }
  };

  const setStatus = (providerId: string, status: Provider['status']) => {
    updateProvider(providerId, { status });
  };

  // Load saved credentials on mount
  useEffect(() => {
    const loadCredentials = async () => {
      for (const provider of coreProviders) {
        try {
          const res = await fetch(`/api/credentials/${provider.id}`);
          if (res.ok) {
            const data = await res.json();
            if (data.credentials?.apiKey) {
              updateProvider(provider.id, {
                apiKey: data.credentials.apiKey,
                status: 'connected'
              });
            }
          }
        } catch (err) {
          console.warn(`Failed to load credentials for ${provider.id}`);
        }
      }
    };

    loadCredentials();
  }, []);

  return {
    providers,
    setApiKey,
    setStatus
  };
};