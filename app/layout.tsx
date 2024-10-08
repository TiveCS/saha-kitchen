import { ORIGIN_URL } from "@/constants";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";

export const metadata = {
  metadataBase: new URL(ORIGIN_URL),
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
