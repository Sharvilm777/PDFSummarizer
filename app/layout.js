import { Inter,Montserrat,Ubuntu } from 'next/font/google'
import "./globals.css";

const inter = Inter({ subsets: ['latin'] })
const montserrat = Montserrat({ subsets: ['latin'] })
const ubuntu = Ubuntu({ subsets: ['latin'],display: 'swap',weight:['300','400','500','700'] })

export const metadata = {
  title: 'PDF Summarizer',
  description: 'AI-powered PDF analysis and summarization tool',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body className={ubuntu.className} suppressHydrationWarning>
        <div id="root">
          {children}
        </div>
      </body>
    </html>
  );
}
