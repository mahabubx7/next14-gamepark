import { auth } from "$/auth";

export default async function Dashboard() {
  const session = await auth();

  return (
    <div className="container mx-auto">
      <h1 className="text-3xl font-bold">Welcome to Dashboard!</h1>
      <p className="text-lg">
        Hello! You are logged in as <strong>{session?.user?.name}</strong>.
      </p>
    </div>
  );
}
