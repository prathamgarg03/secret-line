import Navbar from '@/components/Navbar';

interface AppLayoutProps {
  children: React.ReactNode;
}

export default function AppLayout({ children }: AppLayoutProps) {
  return (
    <div className="flex min-h-dvh flex-col">
      <Navbar />
      <main className="flex-1">{children}</main>
      <footer className="container flex flex-col items-center justify-between gap-2 py-8 text-[13px] text-muted-foreground sm:flex-row">
        <span>© {new Date().getFullYear()} Secret Line</span>
        <span>Every note stays anonymous.</span>
      </footer>
    </div>
  );
}
