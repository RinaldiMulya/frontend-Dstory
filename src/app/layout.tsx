// src/app/layout.tsx
import type { Metadata } from "next";
import { Inter } from 'next/font/google';
import "./globals.css";
import { AppProvider } from "@/utils/StoryContext";


const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: "Next App",
  description: "Story Application",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
        <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js" async />
        <script src="https://unpkg.com/leaflet.offline" async />
      </head>
      <body className={inter.className}>
          <AppProvider>
      
            <a href="#main-content" className="sr-only">Lewati ke konten utama</a>
            {children}
          </AppProvider>
      </body>
    </html>
  );
}
