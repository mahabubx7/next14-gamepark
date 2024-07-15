import { SignOut } from "$component/auth/sign-out";
import Link from "next/link";

export async function DHeader() {
  return (
    <nav className="w-full py-4 border-b border-gray-800 px-4 flex items-center">
      <ul className="flex items-center gap-x-2 ml-auto">
        <li>
          <Link href="/">Home</Link>
        </li>
        <li>
          <Link href="/dashboard">Dashboard</Link>
        </li>
        <li>
          <SignOut raw={false} />
        </li>
      </ul>
    </nav>
  );
}
