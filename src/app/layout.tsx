
import { AuthProvider } from '@/contexts/AuthContext';
import { AuthModal } from '@/components/ui/AuthModal';
import { cn } from '@/lib/utils';
import { Inter } from "next/font/google";
import '@/styles/globals.css';

const inter = Inter({
  subsets: ["latin"]
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={cn(
        "min-h-screen bg-background font-sans antialiased",
        inter.className
      )} suppressHydrationWarning>
        <AuthProvider>
          {children}
          <AuthModal />
        </AuthProvider>
      </body>
    </html>
  );
}
