import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'DB Thing - AI Database Schema Designer',
  description:
    'Create, visualize, and optimize database schemas through natural language conversations.',
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
