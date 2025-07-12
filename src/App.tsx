import React, { useEffect, useState } from 'react';
import { Header } from './components/Header';
import { SimpleSettings } from './components/SimpleSettings';
import { CommandList } from './components/CommandList';
import { ChromeGrid } from './components/ui/chrome-grid';
import { useSimpleProviders } from './hooks/useSimpleProviders';
import { ServerLogTicker } from './components/ServerLogTicker';

function App() {
  const { providers, setApiKey, setStatus } = useSimpleProviders();
  const [showSettings, setShowSettings] = useState(false);
  const [showCommands, setShowCommands] = useState(false);
  const [ticker, setTicker] = useState<string>('');

  // Force dark mode
  useEffect(() => {
    document.documentElement.classList.add('dark');
  }, []);

  // Listen for command execution events
  useEffect(() => {
    const handler = (e: any) => setTicker(e.detail as string);
    window.addEventListener('mcp-run', handler);
    return () => window.removeEventListener('mcp-run', handler);
  }, []);

  // Simplified command list
  const mcpCommands = [
    { id: 'chat', name: 'Chat', description: 'Conversational AI', example: 'Chat: What is the MCP protocol?' },
    { id: 'summarize', name: 'Summarize', description: 'Summarize text or files', example: 'Summarize this file' },
    { id: 'generate-code', name: 'Generate Code', description: 'Generate code snippets', example: 'Generate a React component' },
    { id: 'explain', name: 'Explain', description: 'Explain code or text', example: 'Explain this code' },
    { id: 'translate', name: 'Translate', description: 'Translate text', example: 'Translate this to Spanish' },
  ];

  const handleInsertCommand = (_example: string) => {
    setShowCommands(false);
  };

  return (
    <div className="relative min-h-screen w-screen overflow-hidden dark bg-neutral-950 text-neutral-100">
      <div className="absolute inset-0 z-0">
        <ChromeGrid />
      </div>
      
      <div className="relative z-10 pointer-events-none">
        <div className="pointer-events-auto">
          <Header 
            onSettings={() => setShowSettings(true)}
          />
        </div>
        
        <div className="pointer-events-auto">
          <SimpleSettings
            open={showSettings}
            onClose={() => setShowSettings(false)}
            providers={providers}
            onSetApiKey={setApiKey}
            onSetStatus={setStatus}
          />
          
          <CommandList
            open={showCommands}
            commands={mcpCommands}
            onInsert={handleInsertCommand}
            onClose={() => setShowCommands(false)}
          />
        </div>
        
        {ticker && (
          <div className="fixed bottom-5 right-6 z-50 bg-black/80 text-white text-xs px-3 py-1 rounded shadow-lg pointer-events-none select-none">
            {ticker}
          </div>
        )}
        
        <ServerLogTicker />
      </div>
    </div>
  );
}

export default App;