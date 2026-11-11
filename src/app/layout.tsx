import type { Metadata } from 'next';
import { Instrument_Sans } from 'next/font/google';
import './globals.css';
import AuthProvider from '../context/AuthProvider';
import { Toaster } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { MotionProvider } from '@/components/motion-provider';

const instrument = Instrument_Sans({ subsets: ['latin'], variable: '--font-instrument' });

export const metadata: Metadata = {
  title: 'Secret Line',
  description: 'Real feedback from real people.',
};

interface RootLayoutProps {
  children: React.ReactNode;
}

export default async function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en">
      <body className={instrument.variable}>
        <AuthProvider>
          <MotionProvider>
            <TooltipProvider delayDuration={250}>
              {children}
              <Toaster />
            </TooltipProvider>
          </MotionProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
