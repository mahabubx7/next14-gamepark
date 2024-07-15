import { auth } from "$/auth";
import { NotifyForbidden } from "$component/auth/notify/forbidden";
import { DHeader } from "$component/dashboard/header";
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
      <main className="w-full p-0 mx-auto flex-1 relative flex gap-0 h-screen">
        <Sidebar />

        <div className="w-full min-h-[80vh] dark text-foreground bg-background p-2 md:p-0">
          <DHeader />
          <div className="w-full py-2.5 px-2">
            <WithAuth>{children}</WithAuth>
          </div>
        </div>
      </main>
    </>
  );
}
