import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Sidebar } from '@/components/Sidebar';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export const metadata: Metadata = {
  title: 'ResponSys — Crisis Coordination',
  description: 'Operations platform for NGO dispatchers',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.variable} font-sans bg-bg text-text-primary min-h-screen flex`}>
        <Sidebar />
        <main className="flex-1 w-full min-h-screen md:pl-[64px] lg:pl-[220px] transition-all duration-300">
          {children}
        </main>
      </body>
    </html>
  );
}
