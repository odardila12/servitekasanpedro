import type { Metadata, Viewport } from "next";
import { Inter, Geist_Mono } from "next/font/google";
import "./globals.css";

const _inter = Inter({ subsets: ["latin"], display: "swap" });
const _geistMono = Geist_Mono({ subsets: ["latin"], display: "swap" });

export const metadata: Metadata = {
  title: "Serviteka San Pedro | Premium Auto Parts & Service Center",
  description:
    "Premium automotive parts, tires, batteries, lubricants and professional installation services. Find the right part for your vehicle at Serviteka San Pedro.",
  keywords: [
    "auto parts",
    "tires",
    "batteries",
    "lubricants",
    "car service",
    "San Pedro",
    "Serviteka",
  ],
};

export const viewport: Viewport = {
  themeColor: "#1a1f3a",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}
