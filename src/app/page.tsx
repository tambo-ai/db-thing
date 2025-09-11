import { ApiKeyCheck } from '@/components/ApiKeyCheck';
import Image from 'next/image';

const KeyFilesSection = () => (
  <div className='bg-white px-8 py-4'>
    <h2 className='text-xl font-semibold mb-4'>How it works:</h2>
    <ul className='space-y-4 text-gray-600'>
      <li className='flex items-start gap-2'>
        <span>🏗️</span>
        <span>
          <code className='font-medium'>src/app/layout.tsx</code> - Main layout
          with TamboProvider for database design
        </span>
      </li>
      <li className='flex items-start gap-2'>
        <span>�</span>
        <span>
          <code className='font-medium font-mono'>src/app/chat/page.tsx</code> -
          Database design chat interface with AI assistance
        </span>
      </li>
      <li className='flex items-start gap-2'>
        <span>🎛️</span>
        <span>
          <code className='font-medium font-mono'>
            src/app/interactables/page.tsx
          </code>{' '}
          - Interactive database design components demo
        </span>
      </li>
      <li className='flex items-start gap-2'>
        <span>�</span>
        <span>
          <code className='font-medium font-mono'>
            src/components/tambo/message-thread-full.tsx
          </code>{' '}
          - Chat UI for database conversations
        </span>
      </li>
      <li className='flex items-start gap-2'>
        <span>�</span>
        <span>
          <code className='font-medium font-mono'>
            src/components/tambo/graph.tsx
          </code>{' '}
          - Data visualization component for schema metrics
        </span>
      </li>
      <li className='flex items-start gap-2'>
        <span>�️</span>
        <span>
          <code className='font-medium font-mono'>
            src/services/population-stats.ts
          </code>{' '}
          - Example database analysis tools (replace with schema tools)
        </span>
      </li>
      <li className='flex items-start gap-2'>
        <span className='text-blue-500'>⚙️</span>
        <span>
          <code className='font-medium font-mono'>src/lib/tambo.ts</code> -
          Database component and tool registration
        </span>
      </li>
      <li className='flex items-start gap-2'>
        <span className='text-blue-500'>�</span>
        <span>
          <code className='font-medium font-mono'>README.md</code> - Database
          design tool documentation
        </span>
      </li>
    </ul>
    <div className='flex gap-4 flex-wrap mt-4'>
      <a
        href='https://docs.tambo.co'
        target='_blank'
        rel='noopener noreferrer'
        className='px-6 py-3 rounded-md font-medium transition-colors text-lg mt-4 border border-gray-300 hover:bg-gray-50'
      >
        View Docs
      </a>
      <a
        href='https://tambo.co/dashboard'
        target='_blank'
        rel='noopener noreferrer'
        className='px-6 py-3 rounded-md font-medium transition-colors text-lg mt-4 border border-gray-300 hover:bg-gray-50'
      >
        Dashboard
      </a>
    </div>
  </div>
);

export default function Home() {
  return (
    <div className='min-h-screen p-8 flex flex-col items-center justify-center font-[family-name:var(--font-geist-sans)]'>
      <main className='max-w-2xl w-full space-y-8'>
        <div className='flex flex-col items-center'>
          <a href='https://tambo.co' target='_blank' rel='noopener noreferrer'>
            <Image
              src='/Octo-Icon.svg'
              alt='Tambo AI Logo'
              width={80}
              height={80}
              className='mb-4'
            />
          </a>
          <h1 className='text-4xl text-center'>Database Design Tool</h1>
        </div>

        <div className='w-full space-y-8'>
          <div className='bg-white px-8 py-4'>
            <h2 className='text-xl font-semibold mb-4'>Setup Checklist</h2>
            <ApiKeyCheck>
              <div className='flex gap-4 flex-wrap'>
                <a
                  href='/chat'
                  className='px-6 py-3 rounded-md font-medium shadow-sm transition-colors text-lg mt-4 bg-[#7FFFC3] hover:bg-[#72e6b0] text-gray-800'
                >
                  Start Designing →
                </a>
                <a
                  href='/interactables'
                  className='px-6 py-3 rounded-md font-medium shadow-sm transition-colors text-lg mt-4 bg-[#FFE17F] hover:bg-[#f5d570] text-gray-800'
                >
                  Component Demo →
                </a>
              </div>
            </ApiKeyCheck>
          </div>

          <KeyFilesSection />
        </div>
      </main>
    </div>
  );
}
