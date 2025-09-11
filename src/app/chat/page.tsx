'use client';

import { MessageThreadFull } from '@/components/tambo/message-thread-full';
import { SchemaViewer } from '@/components/schema-viewer';
import { useMcpServers } from '@/components/tambo/mcp-config-modal';
import { components, tools } from '@/lib/tambo';
import { SchemaProvider, useSchema } from '@/lib/schema-context';
import { setSchemaUpdateCallback } from '@/lib/schema-tools';
import { TamboProvider } from '@tambo-ai/react';
import { TamboMcpProvider } from '@tambo-ai/react/mcp';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useState, useEffect } from 'react';

function ChatContent() {
  const mcpServers = useMcpServers();
  const [isChatOpen, setIsChatOpen] = useState(true);

  const { schemaData, isLoading, updateSchema, setSchemaData } = useSchema();

  // Set up the callback for tools to update schema context
  useEffect(() => {
    console.log('Setting up schema update callback');
    setSchemaUpdateCallback(setSchemaData);
  }, [setSchemaData]);

  // Debug schemaData changes
  useEffect(() => {
    console.log('Schema data changed:', schemaData);
  }, [schemaData]);

  // Note: No automatic loading - users start with empty state
  // Schema will be generated when user interacts with the chat

  return (
    <TamboProvider
      apiKey={process.env.NEXT_PUBLIC_TAMBO_API_KEY!}
      components={components}
      tools={tools}
      tamboUrl={process.env.NEXT_PUBLIC_TAMBO_URL}
    >
      <TamboMcpProvider mcpServers={mcpServers}>
        <div className='flex h-screen bg-gray-50'>
          {/* Chat Sidebar */}
          <div
            className={`${
              isChatOpen ? 'w-96' : 'w-0'
            } border-r border-gray-200 bg-white transition-all duration-300 flex flex-col relative`}
          >
            {isChatOpen && (
              <>
                <div className='p-4 border-b border-gray-200'>
                  <h2 className='text-lg font-semibold text-gray-900'>
                    Database Design Assistant
                  </h2>
                  <p className='text-sm text-gray-600 mt-1'>
                    Create, analyze, and optimize database schemas with AI
                  </p>
                </div>

                <div className='flex-1 overflow-hidden'>
                  <MessageThreadFull contextKey='database-design-tool' />
                </div>
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
          <SchemaViewer schemaData={schemaData} isLoading={isLoading} />
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
