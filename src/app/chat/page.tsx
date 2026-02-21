'use client';

import { MessageThreadFull } from '@/components/tambo/message-thread-full';
import { SchemaViewer } from '@/components/schema-viewer';
import { useMcpServers } from '@/components/tambo/mcp-config-modal';
import { components, tools } from '@/lib/tambo';
import { SchemaProvider, useSchema } from '@/lib/schema-context';
import { TamboProvider } from '@tambo-ai/react';
import { TamboMcpProvider } from '@tambo-ai/react/mcp';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useState, useEffect, useCallback, useRef } from 'react';

function useUserContextKey() {
  const [contextKey, setContextKey] = useState<string | null>(null);

  useEffect(() => {
    const storageKey = 'db-design-user-id';
    let userId = localStorage.getItem(storageKey);
    if (!userId) {
      userId = crypto.randomUUID();
      localStorage.setItem(storageKey, userId);
    }
    setContextKey(`database-design-${userId}`);
  }, []);

  return contextKey;
}

function ChatContent() {
  const mcpServers = useMcpServers();
  const [isChatOpen, setIsChatOpen] = useState(true);
  const [chatWidth, setChatWidth] = useState(512); // 32rem = 512px
  const [isResizing, setIsResizing] = useState(false);
  const sidebarRef = useRef<HTMLDivElement>(null);
  const contextKey = useUserContextKey();

  const { schemaData, isStreaming } = useSchema();

  // Resize handlers
  const startResizing = useCallback(() => {
    setIsResizing(true);
  }, []);

  const stopResizing = useCallback(() => {
    setIsResizing(false);
  }, []);

  const resize = useCallback(
    (e: MouseEvent) => {
      if (isResizing) {
        const newWidth = e.clientX;
        // Clamp between 320px (20rem) and 800px (50rem)
        setChatWidth(Math.min(800, Math.max(320, newWidth)));
      }
    },
    [isResizing]
  );

  useEffect(() => {
    if (isResizing) {
      window.addEventListener('mousemove', resize);
      window.addEventListener('mouseup', stopResizing);
    }
    return () => {
      window.removeEventListener('mousemove', resize);
      window.removeEventListener('mouseup', stopResizing);
    };
  }, [isResizing, resize, stopResizing]);

  return (
    <TamboProvider
      apiKey={process.env.NEXT_PUBLIC_TAMBO_API_KEY!}
      components={components}
      tools={tools}
      tamboUrl={process.env.NEXT_PUBLIC_TAMBO_URL}
      mcpServers={mcpServers}
      userKey={contextKey ?? "database-design-tool"}
    >
      <TamboMcpProvider>
        <div className={`flex h-screen bg-gray-50 ${isResizing ? 'select-none' : ''}`}>
          {/* Chat Sidebar */}
          <div
            ref={sidebarRef}
            style={{ width: isChatOpen ? chatWidth : 0 }}
            className={`border-r border-gray-200 bg-white flex flex-col relative ${
              isResizing ? '' : 'transition-all duration-300'
            }`}
          >
            {isChatOpen && (
              <>
                <div className='p-4 border-b border-gray-200'>
                  <h2 className='text-gray-900'>Database Design Assistant</h2>
                  <p className='text-xs text-gray-600 mt-1'>
                    Create, analyze, and optimize database schemas with AI
                  </p>
                </div>

                <div className='flex-1 overflow-hidden'>
                  <MessageThreadFull />
                </div>

                {/* Resize Handle */}
                <div
                  onMouseDown={startResizing}
                  className='absolute right-0 top-0 bottom-0 w-1 cursor-col-resize hover:bg-blue-500 hover:opacity-50 transition-colors'
                />
              </>
            )}

            {/* Toggle Button */}
            <button
              onClick={() => setIsChatOpen(!isChatOpen)}
              className='absolute -right-10 top-1/2 -translate-y-1/2 bg-white border border-gray-200 rounded-r-lg p-2 hover:bg-gray-50 z-10'
            >
              {isChatOpen ? (
                <ChevronLeft className='w-4 h-4' />
              ) : (
                <ChevronRight className='w-4 h-4' />
              )}
            </button>
          </div>

          {/* Main Content Area */}
          <SchemaViewer schemaData={schemaData} isStreaming={isStreaming} />
        </div>
      </TamboMcpProvider>
    </TamboProvider>
  );
}

export default function Home() {
  return (
    <SchemaProvider>
      <ChatContent />
    </SchemaProvider>
  );
}
