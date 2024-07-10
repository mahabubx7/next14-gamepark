import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Toaster } from "react-hot-toast";
import "./globals.css";
import { Providers } from "./providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Gamepark",
  description:
    "An online platform to book your slot and time to play your favorite games.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={inter.className}>
        {/* <SessionProvider>
          
        </SessionProvider> */}

        <Providers>{children}</Providers>

        <Toaster />
      </body>
    </html>
  );
}
