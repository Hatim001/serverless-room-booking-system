import cn from '@/utils/class-names';
import '@/styles/global.css';
import { ThemeProvider } from '@/components/theme-provider';
import { AuthProvider } from '@/hooks/use-auth';
import { inter } from './fonts';

export const metadata = {
  title: 'Dal Vacation Home',
  description: 'Generated by create next app',
};

export default function RootLayout({ children, params }) {
  return (
    <html suppressHydrationWarning>
      <body
        suppressHydrationWarning
        className={cn(
          'min-h-screen bg-background font-sans antialiased',
          inter.variable,
        )}
      >
        <ThemeProvider>
          <AuthProvider>{children}</AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
