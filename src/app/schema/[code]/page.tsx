'use client';

import { SchemaViewer } from '@/components/schema-viewer';
import { Table } from '@/lib/types';
import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, AlertTriangle } from 'lucide-react';

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

  // Determine view type
  const viewType = 'shared'; // Always shared for this page

  const [schema, setSchema] = useState<Table[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    const fetchSchema = async () => {
      try {
        const res = await fetch(`/api/schema?code=${code}`);
        if (res.ok) {
          const data = await res.json();
          setSchema(data.data);
        } else if (res.status === 404) {
          setNotFound(true);
        } else {
          setNotFound(true);
        }
      } catch {
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    };
    fetchSchema();
  }, [code]);

  if (loading) {
    return <LoadingState />;
  }

  if (notFound) {
    return <NotFoundState code={code} />;
  }

  return (
    <div className='min-h-screen bg-gray-50'>
      <div className='h-[calc(100vh-65px)]'>
        <SchemaViewer
          schemaData={schema ?? []}
          isLoading={loading}
          viewType={viewType}
        />
      </div>
    </div>
  );
}
