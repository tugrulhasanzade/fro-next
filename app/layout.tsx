import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'turkwise. | E-Ticaret Yönetim Paneli',
  description: 'Modern ve kullanıcı dostu e-ticaret yönetim platformu',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="tr" suppressHydrationWarning>
      <body className="font-sans">
        {children}
      </body>
    </html>
  );
}
