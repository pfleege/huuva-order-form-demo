import type { Metadata } from "next";
import { Raleway, Geist, Geist_Mono, Playwrite_RO } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";

const raleway = Raleway({
  variable: "--font-raleway",
  subsets: ["latin"],
});

const playwrite = Playwrite_RO({
  variable: "--font-playwrite",
});

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Huuva",
  description: "Huuva - Food Orders",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${raleway.variable} ${geistSans.variable} ${geistMono.variable} ${playwrite.variable} antialiased`}
      >
        <Navbar />
        {children}
      </body>
    </html>
  );
}
