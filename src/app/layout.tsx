import type { Metadata } from "next";
import { Geist, Geist_Mono, Roboto, Bacasime_Antique  } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const roboto = Roboto({
  variable: "--font-roboto",
  subsets: ["latin"],
});

const bacasime = Bacasime_Antique({
  variable: "--font-bacasime-antique",
  weight: "400"
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Circle PV",
  description: "circle pv",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${bacasime.variable} ${roboto.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
