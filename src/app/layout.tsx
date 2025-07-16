import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { MUIThemeProvider } from "@/components/theme-provider";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Pre-Consultation Chat",
  description: "A pre-consultation chatbot for medical appointments",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <body className={inter.className}>
        <MUIThemeProvider>{children}</MUIThemeProvider>
      </body>
    </html>
  );
}
