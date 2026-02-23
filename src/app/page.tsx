import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'DB Thing - AI Database Schema Designer',
  description:
    'Create, visualize, and optimize database schemas through natural language conversations. Build better databases faster with intelligent AI assistance.',
  keywords: [
    'database',
    'schema design',
    'AI',
    'database visualization',
    'ERD',
    'SQL',
    'Prisma',
    'Drizzle',
  ],
  openGraph: {
    title: 'DB Thing - AI Database Schema Designer',
    description:
      'Create, visualize, and optimize database schemas through natural language conversations.',
    type: 'website',
    url: 'https://db-thing.tambo.co',
    siteName: 'DB Thing',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'DB Thing - AI Database Schema Designer',
    description:
      'Create, visualize, and optimize database schemas through natural language conversations.',
  },
};

export default function Home() {
  return (
    <div className='min-h-screen bg-[#0c0c11] text-white relative overflow-hidden'>
      {/* Subtle grid background */}
      <div
        className='absolute inset-0 opacity-[0.03]'
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)',
          backgroundSize: '48px 48px',
        }}
      />

      {/* Hero */}
      <main className='relative z-10 flex flex-col items-center pt-36 pb-24 px-6'>
        <p className='mb-6 text-sm text-zinc-500 tracking-wide'>
          AI-Powered Schema Design
        </p>

        <h1 className='text-6xl md:text-8xl font-light tracking-tight text-center mb-6 text-zinc-100'>
          DB Thing
        </h1>

        <p className='text-lg text-zinc-500 max-w-xl text-center mb-14 leading-relaxed'>
          Create, visualize, and optimize database schemas through natural
          language. Build better databases faster with AI.
        </p>

        <div className='flex items-center gap-4 mb-24'>
          <Link
            href='/chat'
            className='group px-7 py-3.5 bg-zinc-100 hover:bg-white text-zinc-900 text-sm font-medium rounded-lg transition-colors duration-200'
          >
            Start Designing
            <span className='inline-block ml-2 transition-transform duration-200 group-hover:translate-x-0.5'>
              &rarr;
            </span>
          </Link>
          <a
            href='https://github.com/tambo-ai/db-thing'
            target='_blank'
            rel='noopener noreferrer'
            className='px-7 py-3.5 border border-zinc-800 hover:border-zinc-600 text-zinc-400 hover:text-zinc-200 text-sm rounded-lg transition-colors duration-200'
          >
            GitHub
          </a>
        </div>

        {/* Demo video */}
        <div className='w-full max-w-3xl mx-auto rounded-xl border border-zinc-800/80 overflow-hidden bg-black'>
          <video
            className='w-full h-full'
            autoPlay
            loop
            muted
            playsInline
            preload='metadata'
            aria-label='DB Thing database schema design demo'
          >
            <source src='/videos/demo.mp4' type='video/mp4' />
          </video>
        </div>

        {/* Schema preview */}
        <div className='w-full max-w-2xl mx-auto mt-16 rounded-xl border border-zinc-800/80 bg-zinc-900/40 p-5'>
          <div className='flex items-center gap-1.5 mb-4'>
            <div className='w-2.5 h-2.5 rounded-full bg-zinc-700' />
            <div className='w-2.5 h-2.5 rounded-full bg-zinc-700' />
            <div className='w-2.5 h-2.5 rounded-full bg-zinc-700' />
            <span className='ml-3 text-[11px] text-zinc-600 font-mono'>
              schema.prisma
            </span>
          </div>
          <pre className='text-[13px] leading-7 font-mono overflow-x-auto'>
            <code>
              <span className='text-zinc-500'>model</span>{' '}
              <span className='text-zinc-300'>User</span>{' '}
              <span className='text-zinc-600'>{'{'}</span>
              {'\n'}
              {'  '}
              <span className='text-zinc-400'>id</span>
              {'        '}
              <span className='text-zinc-500'>Int</span>
              {'      '}
              <span className='text-zinc-600'>@id @default</span>
              <span className='text-zinc-700'>(</span>
              <span className='text-zinc-500'>autoincrement()</span>
              <span className='text-zinc-700'>)</span>
              {'\n'}
              {'  '}
              <span className='text-zinc-400'>email</span>
              {'     '}
              <span className='text-zinc-500'>String</span>
              {'   '}
              <span className='text-zinc-600'>@unique</span>
              {'\n'}
              {'  '}
              <span className='text-zinc-400'>name</span>
              {'      '}
              <span className='text-zinc-500'>String?</span>
              {'\n'}
              {'  '}
              <span className='text-zinc-400'>posts</span>
              {'     '}
              <span className='text-zinc-300'>Post</span>
              <span className='text-zinc-600'>[]</span>
              {'\n'}
              <span className='text-zinc-600'>{'}'}</span>
              {'\n\n'}
              <span className='text-zinc-500'>model</span>{' '}
              <span className='text-zinc-300'>Post</span>{' '}
              <span className='text-zinc-600'>{'{'}</span>
              {'\n'}
              {'  '}
              <span className='text-zinc-400'>id</span>
              {'        '}
              <span className='text-zinc-500'>Int</span>
              {'      '}
              <span className='text-zinc-600'>@id @default</span>
              <span className='text-zinc-700'>(</span>
              <span className='text-zinc-500'>autoincrement()</span>
              <span className='text-zinc-700'>)</span>
              {'\n'}
              {'  '}
              <span className='text-zinc-400'>title</span>
              {'     '}
              <span className='text-zinc-500'>String</span>
              {'\n'}
              {'  '}
              <span className='text-zinc-400'>author</span>
              {'    '}
              <span className='text-zinc-300'>User</span>
              {'     '}
              <span className='text-zinc-600'>@relation</span>
              <span className='text-zinc-700'>(</span>
              <span className='text-zinc-500'>fields: </span>
              <span className='text-zinc-600'>[</span>
              <span className='text-zinc-400'>authorId</span>
              <span className='text-zinc-600'>]</span>
              <span className='text-zinc-700'>)</span>
              {'\n'}
              {'  '}
              <span className='text-zinc-400'>authorId</span>
              {'  '}
              <span className='text-zinc-500'>Int</span>
              {'\n'}
              <span className='text-zinc-600'>{'}'}</span>
            </code>
          </pre>
        </div>
      </main>

      {/* Features */}
      <section className='relative z-10 px-6 py-24'>
        <div className='max-w-4xl mx-auto'>
          <div className='grid md:grid-cols-3 gap-5'>
            <FeatureCard
              title='Natural Language'
              description='Describe your schema in plain English. The AI translates your intent into proper database models.'
            />
            <FeatureCard
              title='Visual Diagrams'
              description='See your schema as entity-relationship diagrams. Understand connections at a glance.'
            />
            <FeatureCard
              title='Export Anywhere'
              description='Generate SQL, Prisma, or Drizzle schemas. Copy and paste directly into your project.'
            />
          </div>
        </div>
      </section>

      {/* Export formats */}
      <section className='relative z-10 px-6 py-12'>
        <div className='max-w-3xl mx-auto text-center'>
          <p className='text-[11px] uppercase tracking-[0.2em] text-zinc-600 mb-8'>
            Export to
          </p>
          <div className='flex items-center justify-center gap-14'>
            <div className='flex flex-col items-center gap-2.5'>
              <img src='/sql.svg' alt='SQL' className='w-6 h-6 brightness-0 invert opacity-40' />
              <span className='text-[11px] text-zinc-600'>SQL</span>
            </div>
            <div className='flex flex-col items-center gap-2.5'>
              <img src='/prisma.svg' alt='Prisma' className='w-6 h-6 brightness-0 invert opacity-40' />
              <span className='text-[11px] text-zinc-600'>Prisma</span>
            </div>
            <div className='flex flex-col items-center gap-2.5'>
              <img src='/drizzle.svg' alt='Drizzle' className='w-6 h-6 brightness-0 invert opacity-40' />
              <span className='text-[11px] text-zinc-600'>Drizzle</span>
            </div>
          </div>
        </div>
      </section>

      {/* Built with Tambo */}
      <section className='relative z-10 px-6 py-20 mt-8 border-t border-zinc-800/50'>
        <div className='max-w-lg mx-auto text-center'>
          <a
            href='https://tambo.co'
            target='_blank'
            rel='noopener noreferrer'
            className='inline-block group'
          >
            <img
              src='/Tambo-Vertical-Lockup-DM.svg'
              alt='Tambo'
              className='h-40 mx-auto mb-8 opacity-60 group-hover:opacity-80 transition-opacity duration-300'
            />
          </a>
          <p className='text-sm text-zinc-400 mb-2'>Built by the Tambo team</p>
          <p className='text-sm text-zinc-600 mb-7'>
            Interested in building AI-powered apps like DB Thing? Check out
            Tambo.
          </p>
          <a
            href='https://docs.tambo.co'
            target='_blank'
            rel='noopener noreferrer'
            className='inline-flex items-center gap-2 px-5 py-2.5 border border-zinc-800 rounded-lg text-sm text-zinc-400 hover:text-zinc-200 hover:border-zinc-600 transition-colors duration-200'
          >
            Go to Tambo Docs
            <svg
              className='w-3.5 h-3.5'
              fill='none'
              stroke='currentColor'
              viewBox='0 0 24 24'
              aria-hidden='true'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14'
              />
            </svg>
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className='relative z-10 px-6 py-8 border-t border-zinc-800/50'>
        <div className='max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-zinc-600'>
          <p>
            Created by{' '}
            <a
              href='https://akinkunmi.dev/'
              target='_blank'
              rel='noopener noreferrer'
              className='text-zinc-400 hover:text-zinc-200 transition-colors'
            >
              Akinkunmi
            </a>
            {' '}&middot;{' '}
            Built with{' '}
            <a
              href='https://tambo.co'
              target='_blank'
              rel='noopener noreferrer'
              className='text-zinc-400 hover:text-zinc-200 transition-colors'
            >
              Tambo
            </a>
          </p>
          <div className='flex items-center gap-4'>
            <a
              href='https://github.com/tambo-ai/db-thing'
              target='_blank'
              rel='noopener noreferrer'
              className='hover:text-zinc-400 transition-colors'
            >
              GitHub
            </a>
            <Link
              href='/chat'
              className='hover:text-zinc-400 transition-colors'
            >
              Go to App
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className='rounded-xl border border-zinc-800/80 bg-zinc-900/30 p-5'>
      <h3 className='text-sm font-medium text-zinc-300 mb-2'>{title}</h3>
      <p className='text-sm text-zinc-600 leading-relaxed'>{description}</p>
    </div>
  );
}
