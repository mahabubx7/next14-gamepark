"use client";

import { tGameSelectable } from "$/db";
import { Button, Input, Select, SelectItem } from "@nextui-org/react";

interface SearchBoxProps {
  games: tGameSelectable[];
  handleSearch: (e: any) => Promise<void>;
}

export function SearchBox(props: SearchBoxProps) {
  return (
    <div className="bg-gray-600 text-gray-400 mt-4">
      <div className="container mx-auto py-4">
        <form
          className="flex justify-center"
          onSubmit={props.handleSearch}
          aria-label="Search box"
        >
          {/* <input
            type="text"
            className="w-1/2 p-2 rounded-l-md"
            name="search"
            placeholder="Search..."
          /> */}
          <Input
            type="search"
            name="search"
            placeholder="Search..."
            aria-label="Search..."
            className="w-1/2 p-2 rounded-l"
          />
          {/* <select
            className="bg-gray-800 text-white p-2 rounded-none"
            name="game"
          >
            {props.games.map((game) => (
              <option key={game.id} value={game.name.toLowerCase()}>
                {game.name}
              </option>
            ))}
          </select> */}
          <Select
            name="game"
            placeholder="Select a game..."
            className="bg-gray-800 text-white p-2 rounded-none max-w-xs"
            aria-label="Select a game..."
          >
            {props.games.map((game) => (
              <SelectItem
                key={game.name}
                textValue={game.name}
                aria-label={game.name}
              >
                {game.name}
              </SelectItem>
            ))}
          </Select>
          {/* <button
            className="bg-gray-800 text-white p-2 rounded-r-md"
            type="submit"
          >
            Search
          </button> */}
          <Button color="default" type="submit" aria-label="Search Button">
            Search
          </Button>
        </form>
      </div>
    </div>
  );
}
