'use client';

import { MessageThreadFull } from '@/components/tambo/message-thread-full';
import { SchemaDiagram } from '@/components/tambo/schema-diagram';
import { useMcpServers } from '@/components/tambo/mcp-config-modal';
import { components, tools } from '@/lib/tambo';
import { SchemaProvider, useSchema } from '@/lib/schema-context';
import { TamboProvider } from '@tambo-ai/react';
import { TamboMcpProvider } from '@tambo-ai/react/mcp';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';

// Animated loading text component
function AnimatedLoadingText({ variant = 'dark' }: { variant?: 'dark' | 'light' }) {
  const [dotCount, setDotCount] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setDotCount((prev) => (prev + 1) % 4);
    }, 500);

    return () => clearInterval(interval);
  }, []);

  const textColor = variant === 'light' ? 'text-gray-400' : 'text-gray-700';

  return (
    <div className="text-center">
      <p className={`text-lg font-medium ${textColor}`}>
        Designing database{'.'.repeat(dotCount)}
      </p>
    </div>
  );
}

// Empty state component
function EmptySchemaState() {
  return (
    <div className="flex items-center justify-center h-full">
      <div className="text-center max-w-md mx-auto">
        <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
          <svg
            className="w-12 h-12 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M4 7v10c0 2.21 0 3.315.436 4.162a4 4 0 001.748 1.748C7.035 23 8.14 23 10.25 23h3.5c2.21 0 3.315 0 4.162-.436a4 4 0 001.748-1.748C20 19.965 20 18.86 20 16.75V7M4 7l1.545-1.545A2 2 0 017.364 5h9.272a2 2 0 011.819.455L20 7M4 7h16M9 12h6m-3 4h3"
            />
          </svg>
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          No Database Schema Yet
        </h3>
        <p className="text-gray-600 mb-6">
          Start by describing your database requirements in the chat. I&apos;ll help you design a complete schema with tables, relationships, and best practices.
        </p>
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm text-blue-800">
            💡 Try saying: &quot;Create a blog database with users, posts, and comments&quot;
          </p>
        </div>
      </div>
    </div>
  );
}

function ChatContent() {
  const mcpServers = useMcpServers();
  const [isChatOpen, setIsChatOpen] = useState(true);
  const [activeTab, setActiveTab] = useState<'diagram' | 'code'>('diagram');
  const [activeCodeTab, setActiveCodeTab] = useState<
    'sql' | 'prisma' | 'drizzle'
  >('sql');

  const { schemaData, isLoading, updateSchema } = useSchema();

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
          <div className='flex-1 flex flex-col'>
            {/* Fixed Tabs */}
            <div className='p-6 bg-gray-50 border-b border-gray-200 flex-shrink-0'>
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
                    ) : schemaData.length === 0 ? (
                      <EmptySchemaState />
                    ) : (
                      <SchemaDiagram tables={schemaData} />
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
                          <AnimatedLoadingText variant="light" />
                        </div>
                      ) : schemaData.length === 0 ? (
                        <div className='bg-gray-900 rounded-2xl p-6 h-full flex items-center justify-center'>
                          <div className='text-center'>
                            <p className='text-gray-400 text-lg mb-2'>No schema to display</p>
                            <p className='text-gray-500 text-sm'>Generate a database schema first to see the code</p>
                          </div>
                        </div>
                      ) : (
                        <div className='bg-gray-900 rounded-2xl p-6 h-full overflow-auto'>
                          <pre className='text-green-400 text-sm font-mono'>
                            <code>
                            {activeCodeTab === 'sql' &&
                              `-- SQL Schema Definition
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(100) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE posts (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  content TEXT,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  published BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE comments (
  id SERIAL PRIMARY KEY,
  content TEXT NOT NULL,
  post_id INTEGER REFERENCES posts(id) ON DELETE CASCADE,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for better performance
CREATE INDEX idx_posts_user_id ON posts(user_id);
CREATE INDEX idx_comments_post_id ON comments(post_id);
CREATE INDEX idx_comments_user_id ON comments(user_id);`}
                            {activeCodeTab === 'prisma' &&
                              `// Prisma Schema Definition
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id        Int      @id @default(autoincrement())
  email     String   @unique
  name      String
  createdAt DateTime @default(now()) @map("created_at")
  updatedAt DateTime @updatedAt @map("updated_at")
  
  posts     Post[]
  comments  Comment[]
  
  @@map("users")
}

model Post {
  id        Int      @id @default(autoincrement())
  title     String
  content   String?
  userId    Int      @map("user_id")
  published Boolean  @default(false)
  createdAt DateTime @default(now()) @map("created_at")
  updatedAt DateTime @updatedAt @map("updated_at")
  
  user      User      @relation(fields: [userId], references: [id], onDelete: Cascade)
  comments  Comment[]
  
  @@index([userId])
  @@map("posts")
}

model Comment {
  id        Int      @id @default(autoincrement())
  content   String
  postId    Int      @map("post_id")
  userId    Int      @map("user_id")
  createdAt DateTime @default(now()) @map("created_at")
  
  post      Post @relation(fields: [postId], references: [id], onDelete: Cascade)
  user      User @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  @@index([postId])
  @@index([userId])
  @@map("comments")
}`}
                            {activeCodeTab === 'drizzle' &&
                              `// Drizzle Schema Definition
import { pgTable, serial, varchar, text, integer, boolean, timestamp } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  name: varchar('name', { length: 100 }).notNull(),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export const posts = pgTable('posts', {
  id: serial('id').primaryKey(),
  title: varchar('title', { length: 255 }).notNull(),
  content: text('content'),
  userId: integer('user_id').references(() => users.id, { onDelete: 'cascade' }),
  published: boolean('published').default(false),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export const comments = pgTable('comments', {
  id: serial('id').primaryKey(),
  content: text('content').notNull(),
  postId: integer('post_id').references(() => posts.id, { onDelete: 'cascade' }),
  userId: integer('user_id').references(() => users.id, { onDelete: 'cascade' }),
  createdAt: timestamp('created_at').defaultNow(),
});

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  posts: many(posts),
  comments: many(comments),
}));

export const postsRelations = relations(posts, ({ one, many }) => ({
  user: one(users, {
    fields: [posts.userId],
    references: [users.id],
  }),
  comments: many(comments),
}));

export const commentsRelations = relations(comments, ({ one }) => ({
  post: one(posts, {
    fields: [comments.postId],
    references: [posts.id],
  }),
  user: one(users, {
    fields: [comments.userId],
    references: [users.id],
  }),
}));`}
                            </code>
                          </pre>
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </div>
            </div>
          </div>
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
