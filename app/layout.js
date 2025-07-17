import { Geist, Geist_Mono } from "next/font/google";
import { Inter } from "next/font/google";
import "./globals.css";
import  Provider from "./provider";
import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "@/components/ui/sonner";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "NoteGenius - Your AI-Powered Study Partner",
  description: "Transform scattered thoughts into organized knowledge. Ask questions, get intelligent responses, and instantly create beautiful, editable notes with NoteGenius.",
  keywords: "AI study assistant, note taking, learning, education, productivity, AI notes",
  authors: [{ name: "NoteGenius Team" }],
  openGraph: {
    title: "NoteGenius - Your AI-Powered Study Partner",
    description: "Transform scattered thoughts into organized knowledge. Ask questions, get intelligent responses, and instantly create beautiful, editable notes.",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "NoteGenius - Your AI-Powered Study Partner",
    description: "Transform scattered thoughts into organized knowledge with AI-powered note taking.",
  },
};

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
    <html lang="en" className="scroll-smooth" suppressHydrationWarning="true" data-qb-installed="true">
      <body
        className={`${inter.variable} ${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Provider>
        {children}
        </Provider>
        <Toaster/>
        
      </body>
    </html>
    </ClerkProvider>
  );
}
