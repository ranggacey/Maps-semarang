import { Inter } from 'next/font/google';
import { SessionProvider } from '@/components/SessionProvider';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import './globals.css';

// Import Inter font with all weights
const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900']
});

export const metadata = {
  title: 'Spotitiy - Modern Music Experience',
  description: 'A modern music streaming experience with a beautiful interface',
  icons: {
    icon: '/favicon.ico',
  },
  metadataBase: new URL('https://maps-semarang.vercel.app'),
  openGraph: {
    title: 'Spotitiy - Modern Music Experience',
    description: 'A modern music streaming experience with a beautiful interface',
    url: 'https://maps-semarang.vercel.app',
    siteName: 'Spotitiy',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Spotitiy - Modern Music Experience',
      },
    ],
    locale: 'en-US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Spotitiy - Modern Music Experience',
    description: 'A modern music streaming experience with a beautiful interface',
    images: ['/og-image.jpg'],
    creator: '@ranggacey',
  },
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  themeColor: '#8a7cff',
};

export default async function RootLayout({ children }) {
  const session = await getServerSession(authOptions);

  return (
    <html lang="en" className={inter.variable}>
      <head>
        <style>{`
          :root {
            /* Modern soft blue and purple theme */
            --primary: #8a7cff;
            --primary-hover: #a397ff;
            --secondary: #94a3b8;
            --accent: #334155;
            
            /* Background colors */
            --background: #0f172a;
            --background-gradient: linear-gradient(to bottom, #1e293b, #0f172a);
            --card: #1e293b;
            --card-hover: #2c3e50;
            
            /* Text colors */
            --text: #f8fafc;
            --text-muted: #94a3b8;
            
            /* Player colors */
            --player-bg: rgba(15, 23, 42, 0.9);
            --progress-bg: #475569;
            --progress-fg: #8a7cff;
            
            /* Hover states */
            --hover-light: rgba(255, 255, 255, 0.1);
            --hover-primary: rgba(138, 124, 255, 0.2);
            
            /* Sidebar */
            --sidebar-bg: #1e293b;
            --sidebar-hover: #334155;
            
            /* Gradients */
            --gradient-purple-blue: linear-gradient(135deg, #8a7cff 0%, #4f46e5 100%);
            --gradient-blue-purple: linear-gradient(135deg, #38bdf8 0%, #8a7cff 100%);
            
            /* Shadows */
            --shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.1);
            --shadow-md: 0 4px 6px rgba(0, 0, 0, 0.1);
            --shadow-lg: 0 10px 15px rgba(0, 0, 0, 0.1);
          }
          
          body {
            background: var(--background-gradient);
            color: var(--text);
            font-family: 'Inter', sans-serif;
          }
        `}</style>
      </head>
      <body className={inter.className}>
        <SessionProvider session={session}>
          {children}
        </SessionProvider>
      </body>
    </html>
  );
}
