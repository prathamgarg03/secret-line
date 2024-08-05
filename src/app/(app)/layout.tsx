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
      <footer className="w-full text-center py-4 bg-gray-100 mt-16">
        <p className="text-sm text-gray-500">© 2024 Secret Line. All rights reserved.</p>
      </footer>
    </div>
  );
}
