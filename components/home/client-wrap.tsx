"use client";

import { tGameSelectable, tVenueSelectable } from "$/db";
import { getMatchedVenues } from "$service/venue";
import { useEffect, useState } from "react";
import { SearchBox } from "./search";
import { MatchedVenues } from "./venues";

interface HomePageClientOnlyProps {
  games: tGameSelectable[];
}

export function HomePageClientOnly(props: HomePageClientOnlyProps) {
  const [venues, setVenues] = useState<tVenueSelectable[]>([]);

  // handle search form submission
  const handleSearch = async (e: any) => {
    e.preventDefault();
    const search = e.target.search.value;
    const game = e.target.game.value;
    // console.log("search", search, game);
    await getMatchedVenues(game, search)
      .then((res) => setVenues(res))
      .catch(console.error);
  };

  useEffect(() => {
    async function fetchVenues() {
      return await getMatchedVenues("*");
    }
    fetchVenues().then((res) => setVenues(res));
  }, []);

  return (
    <div>
      <h1>Home</h1>

      <SearchBox games={props.games} handleSearch={handleSearch} />
      <MatchedVenues venues={venues} />
    </div>
  );
}
