import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import Script from 'next/script';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Falak Runner - Adventures of Baby Aladdin & Moana',
  description:
    'A magical 2D side-scrolling adventure game featuring baby Aladdin and Moana',
  keywords:
    'game, aladdin, moana, side-scroller, adventure, phaser, typescript',
  authors: [{ name: 'Falak Runner Team' }],
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <Script
          src="https://cdn.jsdelivr.net/npm/phaser@3.70.0/dist/phaser.min.js"
          strategy="beforeInteractive"
        />
      </head>
      <body className={inter.className}>
        <main>{children}</main>
      </body>
    </html>
  );
}
