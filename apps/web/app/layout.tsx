import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import './globals.css';

export const metadata: Metadata = {
  title: 'Sawdagar Dokanpat',
  description: 'A non-commercial marketplace demonstration inspired by Bangladesh.',
};

interface RootLayoutProps {
  children: ReactNode;
}

/** Supplies the document structure for the marketplace demo. */
export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
