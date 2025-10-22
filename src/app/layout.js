import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

// Import components
import { UserProvider } from '../context/UserContext';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "BucketList - Organize Your Tasks",
  description: "A simple todo application to help you organize your tasks",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gray-50 min-h-screen flex flex-col`}>
        <UserProvider>
          <Header />
          <main className="grow container mx-auto px-4 py-8">
            {children}
          </main>
          <Footer />
        </UserProvider>
      </body>
    </html>
  );
}