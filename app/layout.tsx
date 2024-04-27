import { cn } from "@nextui-org/react";
import "./globals.css";
import { Providers } from "./providers";
import { Inter } from "next/font/google";

const defaultUrl = process.env.AUTH_URL
  ? `${process.env.AUTH_URL}`
  : "http://localhost:3000";

export const metadata = {
  metadataBase: new URL(defaultUrl),
  title: "Saha Kitchen",
  description: "Logistic Management App",
};

const inter = Inter({
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.className} suppressHydrationWarning>
      <body>
        <Providers>
          <main className="min-h-screen flex flex-col">{children}</main>
        </Providers>
      </body>
    </html>
  );
}
