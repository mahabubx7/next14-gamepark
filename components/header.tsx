import { auth } from "$/auth";
import Link from "next/link";
import { SignOut } from "./auth/sign-out";
import { CartButton } from "./header.client";

export async function Header() {
  const session = await auth();

  return (
    <header className="sticky top-0 left-0 right-0 w-full bg-gray-950/80 backdrop-blur-sm border border-gray-900/60">
      <nav className="py-1 flex items-center container">
        <Link href="/">
          <span className="text-xl text-white">gamepark.</span>
        </Link>

        <div className="flex items-center justify-end gap-1 ml-auto">
          <CartButton />

          <ul className="flex items-center gap-x-1 justify-end mr-2">
            <li>
              <a href="/">Home</a>
            </li>
            <li>
              <Link href="/dashboard">Dashboard</Link>
            </li>
            {session?.user && (
              <>
                {/* <li>
                  <Link href="/dashboard">Dashboard</Link>
                </li> */}

                <li>
                  <span className="inline-flex gap-x-2 justify-end">
                    <span className="text-indigo-500">{session.user.name}</span>
                    <SignOut />
                  </span>
                </li>
              </>
            )}
            {!session?.user && (
              <li>
                <a href="/login">Login</a>
              </li>
            )}
          </ul>
        </div>
      </nav>
    </header>
  );
}
