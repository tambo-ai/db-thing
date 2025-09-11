'use client';

import { SchemaDiagram } from '@/components/tambo/schema-diagram';
import { generateSqlCode } from '@/lib/generators/sql';
import { generatePrismaSchema } from '@/lib/generators/prisma';
import { generateDrizzleSchema } from '@/lib/generators/drizzle';
import { Table } from '@/lib/types';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { Share2, Copy, Check } from 'lucide-react';
import Link from 'next/link';

function AnimatedLoadingText({
  variant = 'dark',
}: {
  variant?: 'dark' | 'light';
}) {
  const [dotCount, setDotCount] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setDotCount((prev) => (prev + 1) % 4);
    }, 500);

    return () => clearInterval(interval);
  }, []);

  const textColor = variant === 'light' ? 'text-gray-400' : 'text-gray-700';

  return (
    <div className='text-center'>
      <p className={`text-lg font-medium ${textColor}`}>
        Designing database{'.'.repeat(dotCount)}
      </p>
    </div>
  );
}

function EmptySchemaState() {
  return (
    <div className='flex items-center justify-center h-full'>
      <div className='text-center max-w-md mx-auto'>
        <div className='w-24 h-24 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center'>
          <svg
            className='w-12 h-12 text-gray-400'
            fill='none'
            stroke='currentColor'
            viewBox='0 0 24 24'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth={1.5}
              d='M4 7v10c0 2.21 0 3.315.436 4.162a4 4 0 001.748 1.748C7.035 23 8.14 23 10.25 23h3.5c2.21 0 3.315 0 4.162-.436a4 4 0 001.748-1.748C20 19.965 20 18.86 20 16.75V7M4 7l1.545-1.545A2 2 0 017.364 5h9.272a2 2 0 011.819.455L20 7M4 7h16M9 12h6m-3 4h3'
            />
          </svg>
        </div>
        <h3 className='text-xl font-semibold text-gray-900 mb-2'>
          No Database Schema Yet
        </h3>
        <p className='text-gray-600 mb-6'>
          Start by describing your database requirements in the chat. I&apos;ll
          help you design a complete schema with tables, relationships, and best
          practices.
        </p>
        <div className='bg-blue-50 border border-blue-200 rounded-lg p-4'>
          <p className='text-sm text-blue-800'>
            💡 Try saying: &quot;Create a blog database with users, posts, and
            comments&quot;
          </p>
        </div>
      </div>
    </div>
  );
}

function ShareModal({
  isOpen,
  onClose,
  shareUrl,
}: {
  isOpen: boolean;
  onClose: () => void;
  shareUrl: string;
}) {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  };

  if (!isOpen) return null;

  return (
    <div className='fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50'>
      <div className='bg-white/95 backdrop-blur-md rounded-3xl p-8 w-full max-w-xl mx-4 shadow-2xl border border-white/20'>
        <div className='flex items-center justify-between mb-6'>
          <h2 className='text-2xl font-medium text-gray-900'>Share Schema</h2>
          <button
            onClick={onClose}
            className='text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-xl hover:bg-gray-100'
          >
            <svg
              className='w-6 h-6'
              fill='none'
              stroke='currentColor'
              viewBox='0 0 24 24'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M6 18L18 6M6 6l12 12'
              />
            </svg>
          </button>
        </div>

        <p className='text-gray-600 mb-6 text-base leading-relaxed'>
          Your schema has been saved! Share this URL to let others view your
          database design.
        </p>

        <div className='flex gap-3'>
          <div className='flex-1 bg-gray-50/80 backdrop-blur-sm rounded-2xl px-4 py-4 text-sm text-gray-700 border border-gray-200/50 font-mono'>
            {shareUrl}
          </div>
          <button
            onClick={copyToClipboard}
            className='px-6 py-4 bg-gray-900 text-white rounded-2xl hover:bg-gray-800 transition-all duration-200 flex items-center gap-2 shadow-lg hover:shadow-xl group'
          >
            {copied ? (
              <Check className='w-4 h-4 transition-transform group-hover:scale-110' />
            ) : (
              <Copy className='w-4 h-4 transition-transform group-hover:scale-110' />
            )}
            <span className='font-medium'>{copied ? 'Copied!' : 'Copy'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}

function generateShareCode(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < 6; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

interface SchemaViewerProps {
  schemaData: Table[];
  isLoading: boolean;
  viewType?: 'normal' | 'shared';
}

export function SchemaViewer({
  schemaData,
  isLoading,
  viewType = 'normal',
}: SchemaViewerProps) {
  const safeSchemaData = schemaData ?? [];
  const [activeTab, setActiveTab] = useState<'diagram' | 'code'>('diagram');
  const [activeCodeTab, setActiveCodeTab] = useState<
    'sql' | 'prisma' | 'drizzle'
  >('sql');
  const [showShareModal, setShowShareModal] = useState(false);
  const [shareUrl, setShareUrl] = useState('');
  const [shareLoading, setShareLoading] = useState(false);
  const [codeCopied, setCodeCopied] = useState(false);

  console.log('SchemaViewer received:', {
    schemaDataLength: schemaData?.length || 0,
    isLoading,
    schemaData,
  });

  const handleShare = async () => {
    if (safeSchemaData.length === 0) return;
    if (viewType === 'shared') {
      setShareUrl(window.location.href);
      setShowShareModal(true);
      return;
    }
    setShareLoading(true);
    const code = generateShareCode();
    try {
      const res = await fetch('/api/schema', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, data: safeSchemaData }),
      });
      if (!res.ok) throw new Error('Failed to save schema');
      const url = `${window.location.origin}/schema/${code}`;
      setShareUrl(url);
      setShowShareModal(true);
    } catch {
      alert('Failed to save schema. Please try again.');
    } finally {
      setShareLoading(false);
    }
  };

  const handleCopyCode = async () => {
    let codeToCopy = '';
    if (activeCodeTab === 'sql') {
      codeToCopy = generateSqlCode(safeSchemaData);
    } else if (activeCodeTab === 'prisma') {
      codeToCopy = generatePrismaSchema(safeSchemaData);
    } else if (activeCodeTab === 'drizzle') {
      codeToCopy = generateDrizzleSchema(safeSchemaData);
    }

    try {
      await navigator.clipboard.writeText(codeToCopy);
      setCodeCopied(true);
      setTimeout(() => setCodeCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy code: ', err);
    }
  };

  return (
    <div className='flex-1 flex flex-col'>
      {/* Fixed Tabs */}
      <div className='p-2.5 bg-gray-50 border-b border-gray-200 flex-shrink-0'>
        <div className='flex items-center justify-between'>
          <div className='relative bg-gray-200 rounded-2xl p-1.5 inline-flex'>
            <button
              onClick={() => setActiveTab('diagram')}
              className={`relative z-10 px-8 py-3 text-sm font-medium rounded-xl transition-colors duration-200 ${
                activeTab === 'diagram'
                  ? 'text-gray-900'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              {activeTab === 'diagram' && (
                <motion.div
                  className='absolute inset-0 bg-white rounded-xl'
                  layoutId='mainTabIndicator'
                  transition={{
                    type: 'spring',
                    stiffness: 300,
                    damping: 30,
                  }}
                />
              )}
              <span className='relative z-10'>Diagram</span>
            </button>
            <button
              onClick={() => setActiveTab('code')}
              className={`relative z-10 px-8 py-3 text-sm font-medium rounded-xl transition-colors duration-200 ${
                activeTab === 'code'
                  ? 'text-gray-900'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              {activeTab === 'code' && (
                <motion.div
                  className='absolute inset-0 bg-white rounded-xl'
                  layoutId='mainTabIndicator'
                  transition={{
                    type: 'spring',
                    stiffness: 300,
                    damping: 30,
                  }}
                />
              )}
              <span className='relative z-10'>Code</span>
            </button>
          </div>

          {/* Action Buttons */}
          {safeSchemaData.length > 0 && !isLoading && (
            <div className='flex items-center gap-3'>
              {viewType === 'shared' && (
                <Link
                  href='/chat'
                  className='px-6 py-3 bg-blue-600 text-white rounded-2xl hover:bg-blue-700 transition-all duration-200 text-sm font-medium shadow-sm hover:shadow-md flex items-center gap-2 group'
                >
                  <span>Create Your Own</span>
                </Link>
              )}
              <button
                onClick={handleShare}
                className='relative px-6 py-3 bg-gray-900 text-white rounded-2xl hover:bg-gray-800 transition-all duration-200 text-sm font-medium shadow-sm hover:shadow-md flex items-center gap-2 group'
              >
                <Share2 className='w-4 h-4 transition-transform group-hover:scale-110' />
                <span>Share</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Scrollable Tab Content */}
      <div className='flex-1 overflow-auto'>
        <div className='p-4 h-full'>
          {activeTab === 'diagram' ? (
            <motion.div
              key='diagram'
              className='h-[calc(100vh-120px)]'
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
            >
              {isLoading ? (
                <div className='flex items-center justify-center h-full'>
                  <AnimatedLoadingText />
                </div>
              ) : safeSchemaData.length === 0 ? (
                <EmptySchemaState />
              ) : (
                <SchemaDiagram tables={safeSchemaData} />
              )}
            </motion.div>
          ) : (
            <motion.div
              key='code'
              className='h-[calc(100vh-120px)] flex flex-col'
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
            >
              {/* Code Sub-tabs */}
              <div className='mb-6'>
                <div className='relative bg-gray-200 rounded-2xl p-1.5 inline-flex'>
                  <button
                    onClick={() => setActiveCodeTab('sql')}
                    className={`relative z-10 px-5 py-2.5 text-sm font-medium rounded-xl transition-colors duration-200 flex items-center gap-2 ${
                      activeCodeTab === 'sql'
                        ? 'text-gray-900'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    {activeCodeTab === 'sql' && (
                      <motion.div
                        className='absolute inset-0 bg-white rounded-xl'
                        layoutId='codeTabIndicator'
                        transition={{
                          type: 'spring',
                          stiffness: 300,
                          damping: 30,
                        }}
                      />
                    )}
                    <Image
                      src='/sql.svg'
                      alt='SQL'
                      width={16}
                      height={16}
                      className='relative z-10'
                    />
                    <span className='relative z-10'>SQL</span>
                  </button>
                  <button
                    onClick={() => setActiveCodeTab('prisma')}
                    className={`relative z-10 px-5 py-2.5 text-sm font-medium rounded-xl transition-colors duration-200 flex items-center gap-2 ${
                      activeCodeTab === 'prisma'
                        ? 'text-gray-900'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    {activeCodeTab === 'prisma' && (
                      <motion.div
                        className='absolute inset-0 bg-white rounded-xl'
                        layoutId='codeTabIndicator'
                        transition={{
                          type: 'spring',
                          stiffness: 300,
                          damping: 30,
                        }}
                      />
                    )}
                    <Image
                      src='/prisma.svg'
                      alt='Prisma'
                      width={16}
                      height={16}
                      className='relative z-10'
                    />
                    <span className='relative z-10'>Prisma</span>
                  </button>
                  <button
                    onClick={() => setActiveCodeTab('drizzle')}
                    className={`relative z-10 px-5 py-2.5 text-sm font-medium rounded-xl transition-colors duration-200 flex items-center gap-2 ${
                      activeCodeTab === 'drizzle'
                        ? 'text-gray-900'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    {activeCodeTab === 'drizzle' && (
                      <motion.div
                        className='absolute inset-0 bg-white rounded-xl'
                        layoutId='codeTabIndicator'
                        transition={{
                          type: 'spring',
                          stiffness: 300,
                          damping: 30,
                        }}
                      />
                    )}
                    <Image
                      src='/drizzle.svg'
                      alt='Drizzle'
                      width={16}
                      height={16}
                      className='relative z-10'
                    />
                    <span className='relative z-10'>Drizzle</span>
                  </button>
                </div>
              </div>

              {/* Code Content */}
              <div className='flex-1'>
                {isLoading ? (
                  <div className='bg-gray-900 rounded-2xl p-6 h-full flex items-center justify-center'>
                    <AnimatedLoadingText variant='light' />
                  </div>
                ) : safeSchemaData.length === 0 ? (
                  <div className='bg-gray-900 rounded-2xl p-6 h-full flex items-center justify-center'>
                    <div className='text-center'>
                      <p className='text-gray-400 text-lg mb-2'>
                        No schema to display
                      </p>
                      <p className='text-gray-500 text-sm'>
                        Generate a database schema first to see the code
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className='bg-gray-900 rounded-2xl p-6 h-full overflow-auto relative'>
                    <button
                      onClick={handleCopyCode}
                      className='absolute top-4 right-4 px-3 py-2 bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white rounded-lg transition-all duration-200 flex items-center gap-2 text-sm font-medium shadow-sm hover:shadow-md group'
                    >
                      {codeCopied ? (
                        <Check className='w-4 h-4 transition-transform group-hover:scale-110' />
                      ) : (
                        <Copy className='w-4 h-4 transition-transform group-hover:scale-110' />
                      )}
                      <span>{codeCopied ? 'Copied!' : 'Copy'}</span>
                    </button>
                    <pre className='text-green-400 text-sm font-mono'>
                      <code>
                        {activeCodeTab === 'sql' &&
                          generateSqlCode(safeSchemaData)}
                        {activeCodeTab === 'prisma' &&
                          generatePrismaSchema(safeSchemaData)}
                        {activeCodeTab === 'drizzle' &&
                          generateDrizzleSchema(safeSchemaData)}
                      </code>
                    </pre>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </div>
      </div>

      {/* Share Loading Modal */}
      {shareLoading && (
        <div className='fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50'>
          <div className='bg-white/95 backdrop-blur-md rounded-3xl p-8 w-full max-w-xs mx-4 shadow-2xl border border-white/20 flex flex-col items-center'>
            <div className='w-10 h-10 border-4 border-gray-900 border-t-transparent rounded-full animate-spin mb-4'></div>
            <p className='text-gray-900 text-lg font-medium'>
              Saving schema...
            </p>
          </div>
        </div>
      )}

      {/* Share Modal */}
      <ShareModal
        isOpen={showShareModal}
        onClose={() => setShowShareModal(false)}
        shareUrl={shareUrl}
      />
    </div>
  );
}
