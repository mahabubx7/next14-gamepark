import { HomePageClientOnly } from "$/components/home/client-wrap";
import { getGamesOptions } from "$service/games";
import Link from "next/link";

export default async function Home() {
  const games = await getGamesOptions();

  return (
    <section className="container pt-4">
      <h1>Home</h1>
      <Link href="/login">Go to Login!</Link>

      <HomePageClientOnly games={games} />
    </section>
  );
}
