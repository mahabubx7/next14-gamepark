import { Header } from "$/components/header";
import type { Metadata } from "next";
import Link from "next/link";
import "../globals.css";

export const metadata: Metadata = {
  title: "Gamepark",
  description:
    "An online platform to book your slot and time to play your favorite games.",
};

export default function DefaultLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Header />

      <main className="min-h-[80vh] dark text-foreground bg-background p-2 md:p-0">
        {children}
      </main>

      <footer className="container text-center text-gray-500">
        <p>&copy; 2024; Next.js - Gamepark</p>
        <p className="text-gray-700">
          <Link href="/apply/vendor" className="underline">
            Apply for Vendorship!
          </Link>
        </p>
      </footer>
    </>
  );
}
