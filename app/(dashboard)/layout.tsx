import { auth } from "$/auth";
import { Header } from "$/components/header";
import { NotifyForbidden } from "$component/auth/notify/forbidden";
import { Sidebar } from "$component/dashboard/sidebar";
import type { Metadata } from "next";
import "../globals.css";

export const metadata: Metadata = {
  title: "Gamepark",
  description:
    "An online platform to book your slot and time to play your favorite games.",
};

const WithAuth = async ({
  children,
}: Readonly<{ children: React.ReactNode }>) => {
  const session = await auth();
  if (!session) {
    return (
      <>
        <NotifyForbidden bypass={{ type: "redirect" }} />
      </>
    );
  }

  return <>{children}</>;
};

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Header />

      <Sidebar />

      <main className="min-h-[80vh] dark text-foreground bg-background p-2 md:p-0">
        <WithAuth>{children}</WithAuth>
      </main>
    </>
  );
}
