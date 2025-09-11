import Link from 'next/link';

export default function Home() {
  return (
    <div className='min-h-screen p-8 flex flex-col items-center justify-center font-[family-name:var(--font-geist-sans)] relative overflow-hidden'>
      {/* Subtle bleed gradient background */}
      <div className='absolute inset-0 bg-gradient-to-br from-blue-50/20 via-transparent to-purple-50/20'></div>

      {/* Subtle dotted background */}
      <div
        className='absolute inset-0 opacity-[0.08]'
        style={{
          backgroundImage: `radial-gradient(circle, #000 1px, transparent 1px)`,
          backgroundSize: '24px 24px',
        }}
      ></div>

      <main className='max-w-4xl w-full space-y-8 relative z-10'>
        <div className='flex flex-col items-center text-center'>
          <h1 className='text-7xl font-light mb-4'>DB Thing</h1>
          <p className='text-xl text-gray-600 max-w-2xl'>
            Create, visualize, and optimize database schemas through natural
            language conversations. Build better databases faster with
            intelligent AI assistance.
          </p>
        </div>

        <div className='w-full space-y-8'>
          <div className='flex flex-col items-center'>
            <Link
              href='/chat'
              className='px-8 py-4 bg-black hover:bg-gray-800 text-white text-lg rounded-3xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105'
            >
              Get Started →
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
