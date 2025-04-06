'use client';

import { usePathname } from 'next/navigation';
import Navbar from './navbar';
import Footer from './footer';

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isTutorialPage = pathname === '/tutorial';
  const isServicePage = ['/reader', '/speech-to-text', '/learn', '/learn-text', '/dashboard', '/learn/read', '/learn/type', '/learn/templates-read', '/learn/templates-type'].includes(pathname);

  return (
    <>
      {!isTutorialPage && !isServicePage && <Navbar />}
      <main className={`flex-grow ${!isTutorialPage && !isServicePage ? 'pt-10' : ''}`}>
        {children}
      </main>
      {!isTutorialPage && !isServicePage && <Footer />}
    </>
  );
} 