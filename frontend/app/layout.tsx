import type { Metadata } from 'next';
import { Barlow } from 'next/font/google';
import Providers from './providers';
import './globals.css';

const barlow = Barlow({ subsets: ['latin'], weight: ['400', '500', '600', '700'] });

export const metadata: Metadata = {
  title: 'POS System',
  description: 'Restaurant POS with Raw Material Stock Management',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={barlow.className} suppressHydrationWarning>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
