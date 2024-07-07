import Navbar from '@/components/Navbar';

interface RootLayoutProps {
  children: React.ReactNode;
}

export default async function RootLayout({ children }: RootLayoutProps) {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className='flex-1 mt-32 sm:mt-16 overflow-hidden'>
      {children}
      </main>
    </div>
  );
}