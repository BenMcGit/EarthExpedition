import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { ToastRender } from '@/components/Toast';
import ModalRender from '@/components/Modal';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Earth Exploration',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ToastRender />
        <ModalRender />
        {children}
      </body>
    </html>
  );
}
