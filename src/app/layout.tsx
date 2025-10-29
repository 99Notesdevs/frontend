
import { AuthProvider } from '@/contexts/AuthContext';
import { AuthModal } from '@/components/ui/AuthModal';
import { cn } from '@/lib/utils';
import { ThemeProvider } from 'next-themes';


export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={cn(
        "min-h-screen bg-background font-sans antialiased",
      )}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <AuthProvider>
            {children}
            <AuthModal />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
