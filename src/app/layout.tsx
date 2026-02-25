import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL('https://dbthing.tambo.co'),
  title: {
    default: 'DB Thing - AI Database Schema Designer',
    template: '%s | DB Thing',
  },
  description:
    'Create, visualize, and optimize database schemas through natural language conversations.',
  openGraph: {
    title: 'DB Thing - AI Database Schema Designer',
    description:
      'Create, visualize, and optimize database schemas through natural language conversations.',
    url: 'https://dbthing.tambo.co',
    siteName: 'DB Thing',
    type: 'website',
    images: [
      {
        url: '/opengraph-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Tambo logo',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'DB Thing - AI Database Schema Designer',
    description:
      'Create, visualize, and optimize database schemas through natural language conversations.',
    images: ['/opengraph-image.jpg'],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en'>
      <body>{children}</body>
    </html>
  );
}
