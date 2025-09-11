'use client';

import { SchemaViewer } from '@/components/schema-viewer';
import { Table } from '@/lib/types';
import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, AlertTriangle } from 'lucide-react';

interface SharedSchema {
  code: string;
  data: Table[];
  createdAt: string;
}

function NotFoundState({ code }: { code: string }) {
  return (
    <div className='flex items-center justify-center min-h-screen bg-gray-50'>
      <div className='text-center max-w-md mx-auto px-4'>
        <div className='w-24 h-24 mx-auto mb-6 bg-red-100 rounded-full flex items-center justify-center'>
          <AlertTriangle className='w-12 h-12 text-red-500' />
        </div>
        <h1 className='text-2xl font-bold text-gray-900 mb-4'>
          Schema Not Found
        </h1>
        <p className='text-gray-600 mb-6'>
          The schema with code{' '}
          <code className='bg-gray-100 px-2 py-1 rounded text-sm'>{code}</code>{' '}
          could not be found. It may have been removed or the link might be
          incorrect.
        </p>
        <Link
          href='/chat'
          className='inline-flex items-center gap-2 px-6 py-3 bg-gray-900 text-white rounded-2xl hover:bg-gray-800 transition-all duration-200 shadow-sm hover:shadow-md group text-sm font-medium'
        >
          <ArrowLeft className='w-4 h-4 transition-transform group-hover:-translate-x-0.5' />
          <span>Create New Schema</span>
        </Link>
      </div>
    </div>
  );
}

function LoadingState() {
  return (
    <div className='flex items-center justify-center min-h-screen bg-gray-50'>
      <div className='text-center'>
        <div className='w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4'></div>
        <p className='text-gray-600'>Loading schema...</p>
      </div>
    </div>
  );
}

export default function SharedSchemaPage() {
  const params = useParams();
  const code = params.code as string;

  const [schema, setSchema] = useState<Table[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!code) {
      setNotFound(true);
      setLoading(false);
      return;
    }

    try {
      const storedSchema = localStorage.getItem(`schema_${code}`);
      if (storedSchema) {
        const parsedSchema: SharedSchema = JSON.parse(storedSchema);
        setSchema(parsedSchema.data);
      } else {
        setNotFound(true);
      }
    } catch (error) {
      console.error('Error loading schema:', error);
      setNotFound(true);
    } finally {
      setLoading(false);
    }
  }, [code]);

  if (loading) {
    return <LoadingState />;
  }

  if (notFound || !schema) {
    return <NotFoundState code={code} />;
  }

  return (
    <div className='min-h-screen bg-gray-50'>
      {/* Header */}
      <div className='bg-white border-b border-gray-200'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='flex items-center justify-between h-16'>
            <div className='flex items-center gap-4'>
              <Link
                href='/chat'
                className='text-gray-600 hover:text-gray-900 transition-all duration-200 p-2 rounded-xl hover:bg-gray-100 group'
              >
                <ArrowLeft className='w-5 h-5 transition-transform group-hover:-translate-x-0.5' />
              </Link>
              <div>
                <h1 className='text-lg font-semibold text-gray-900'>
                  Shared Database Schema
                </h1>
                <p className='text-sm text-gray-600'>
                  Code:{' '}
                  <code className='bg-gray-100 px-2 py-1 rounded text-xs'>
                    {code}
                  </code>
                </p>
              </div>
            </div>

            <Link
              href='/chat'
              className='px-6 py-3 bg-gray-900 text-white rounded-2xl hover:bg-gray-800 transition-all duration-200 text-sm font-medium shadow-sm hover:shadow-md'
            >
              Create Your Own
            </Link>
          </div>
        </div>
      </div>

      {/* Schema Viewer */}
      <div className='h-[calc(100vh-65px)]'>
        <SchemaViewer schemaData={schema} isLoading={false} />
      </div>
    </div>
  );
}
