import './globals.css';
import { AppContextProvider } from '@/context/AppContext';

export const metadata = {
  title: 'Breads & CakeStory - Luxury Artisanal Patisserie & Custom Cakes',
  description: 'Indulge in premium, handcrafted eggless cakes and bespoke dessert designs by Breads & CakeStory. Order online via WhatsApp for fast delivery in Pune.',
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: '#FAF7F2',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className="antialiased min-h-screen flex flex-col bg-[#FAF7F2]" suppressHydrationWarning>
        <AppContextProvider>
          {children}
        </AppContextProvider>
      </body>
    </html>
  );
}
