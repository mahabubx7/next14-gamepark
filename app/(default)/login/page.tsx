import { auth } from "$/auth";
import { SignIn } from "$/components/auth/sign-in";
import { SignOut } from "$/components/auth/sign-out";
import Image from "next/image";

export default async function LoginPage() {
  const session = await auth();

  if (!session?.user) {
    return (
      <div>
        <h1>Sign in</h1>
        <SignIn />
      </div>
    );
  }

  return (
    <div>
      <div>
        <h1>Welcome, {session.user.email}</h1>
        <Image
          width={64}
          height={64}
          src={session.user!.image!}
          alt={session.user!.name!}
        />
      </div>
      <SignOut />
      <div>
        <pre>{JSON.stringify(session, null, 2)}</pre>
      </div>
    </div>
  );
}
