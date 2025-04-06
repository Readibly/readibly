import type { Metadata } from 'next';
import { Space_Grotesk } from 'next/font/google';
import './globals.css';
import ThemeProvider from '../components/theme-provider';
import ClientLayout from '../components/ClientLayout';

const spaceGrotesk = Space_Grotesk({ 
  weight: ['300', '400', '500', '600', '700'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-space-grotesk'
});

export const metadata: Metadata = {
  title: 'Readibly - PDF Reader with Eye Tracking',
  description: 'PDF reader with eye tracking',
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon.ico',
    apple: '/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning className={spaceGrotesk.variable}>
      <body className="font-sans" suppressHydrationWarning>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <div className="min-h-screen flex flex-col">
            <ClientLayout>
              {children}
            </ClientLayout>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}