import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "ApplyEase — Find Your Next Role",
  description: "Discover opportunities from top companies and take the next step in your career.",
  metadataBase: new URL("https://applyease.app"),
  openGraph: {
    title: "ApplyEase — Find Your Next Role",
    description: "Discover opportunities from top companies and take the next step in your career.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <head>
        <meta name="theme-color" content="#2563eb" />
      </head>
      <body className="font-sans antialiased">
        {children}
      </body>
    </html>
  );
}
