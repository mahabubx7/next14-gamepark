"use client";

import { AvailableGames, tVenueSelectable } from "$/db";
import { ITimeTable } from "$app/api/venue/[uuid]/[game]/route";
import { getDate } from "$helpers/generics";
import { useCart } from "$helpers/store/cart.store";
import { getSpaceTimeSlots, makeBookings } from "$service/booking";
import { parseDate } from "@internationalized/date";
import {
  Button,
  DatePicker,
  Input,
  Select,
  SelectItem,
} from "@nextui-org/react";
import { Session } from "next-auth";
import Link from "next/link";
import { useState } from "react";

interface IVenueBookingProps {
  venue: tVenueSelectable | null;
  auth: Session | null;
}

export interface ISelectedState {
  current: AvailableGames;
  type: AvailableGames["types"][number];
  space: AvailableGames["spaces"][number];
  slots: string[];
  date: string;
  passes: number;
}

export function VenueBooking({ venue, auth }: IVenueBookingProps) {
  const days = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"] as const;
  const today = days[new Date().getDay()];

  const cart = useCart();

  const [selected, setSelected] = useState<ISelectedState | null>(
    venue
      ? {
          current: venue.games![0],
          space: venue.games![0].spaces[0],
          type: venue.games![0].types[0],
          slots: [],
          date: getDate(),
          passes: 1,
        }
      : null
  );

  const [table, setTable] = useState<ITimeTable[]>([]);

  const loadTable = async () => {
    setTable([]); // reset (if any  previous data)
    try {
      const res = await getSpaceTimeSlots(
        venue!.id!,
        selected!.current.name.toLowerCase(),
        selected!.space.name.toLowerCase(),
        selected!.date
      );
      setTable(res.space.table || []);
    } catch (err: any) {
      console.error(err);
    }
  };

  const onSelectGameCard = (game: AvailableGames) => {
    setSelected({
      current: game,
      space: game.spaces[0], // default
      type: game.types[0], // default
      slots: [],
      date: getDate(),
      passes: 1,
    });

    setTable([]); // reset
  };

  const handleBooking = async () => {
    const payload = {
      slots: selected!.slots, // start & end []
      passes: selected!.passes,
      type: selected!.type,
    };

    // console.log("post-body :=> ", payload);
    await makeBookings({
      uuid: venue!.id!,
      game: selected!.current.name.toLowerCase(),
      space: selected!.space.name.toLowerCase(),
      date: selected!.date,
      ...payload,
    }).then((res) => {
      // console.log("booking-response :=> ", res.ticket);
      ///  USE CART IN HERE ...
      cart.getState().addToCart({
        name: res.ticket.game as string,
        type: res.ticket.gameType as string,
        space: res.ticket.space as string,
        date: res.ticket.bookedFor as string,
        price: res.ticket.price as number,
        time: res.ticket.time as string,
        ticketId: res.ticket.id as string,
      });

      setTable([]); // reset
    });
  };

  return (
    <div className="">
      <h3 className="text-2xl font-semibold text-gray-300 my-6 uppercase">
        book your slot
      </h3>
      <div className="flex gap-1 items-center flex-wrap justify-start">
        {venue?.games?.map((v) => (
          <div
            key={v.name}
            onClick={() => onSelectGameCard(v)}
            className={`${
              selected?.current.name === v.name && v.openDays.includes(today)
                ? "border-green-600/60 bg-green-700/60"
                : "border-gray-800 bg-dark/80"
            }

            ${
              v.openDays.includes(today)
                ? "opacity-100"
                : "opacity-30 cursor-not-allowed z-[-1]"
            }

              p-2 text-gray-400 rounded border-2
              `}
          >
            <h4>{v.name}</h4>
          </div>
        ))}
      </div>
      <div className="flex flex-col gap-1">
        {selected && (
          <div>
            <div className="my-2">
              <Select
                placeholder="Select Space"
                className="max-w-sm"
                label="Choose Space"
                onChange={(e) => {
                  // console.log("selected-space :=> ", e.target.value);
                  setSelected({
                    ...selected!,
                    space: selected.current.spaces.find(
                      (sp) => sp.name.toLowerCase() === e.target.value
                    )!,
                  });
                }}
              >
                {selected.current.spaces.map((sp) => (
                  <SelectItem
                    key={sp.name.toLowerCase()}
                    // value={sp.name}
                    textValue={sp.name}
                    className="bg-gray-700 text-gray-400"
                  >
                    {sp.name} - {sp.type} (Tk. {sp.rate}/hr)
                  </SelectItem>
                ))}
              </Select>
            </div>

            <div className="my-2">
              <Select
                placeholder="Select Game Mode"
                className="max-w-sm"
                label="Choose Game Type"
                onChange={(e) => {
                  setSelected({
                    ...selected!,
                    type: e.target.value as AvailableGames["types"][number],
                  });
                }}
              >
                {selected.current.types.map((t) => (
                  <SelectItem
                    key={t}
                    // value={t}
                    textValue={t}
                    className="bg-gray-700 text-gray-400"
                  >
                    {t}
                  </SelectItem>
                ))}
              </Select>
            </div>

            <div className="my-2">
              <DatePicker
                label="Select Date"
                onChange={(e) => {
                  setSelected({
                    ...selected!,
                    date: `${e.year}-${e.month}-${e.day}`,
                  });
                }}
                className="max-w-sm"
                name="date"
                defaultValue={parseDate(getDate())}
                isDateUnavailable={(date) => {
                  return !selected.current.openDays.includes(
                    days[
                      new Date(
                        `${date.year}-${date.month}-${date.day}`
                      ).getDay()
                    ]
                  );
                }}
                minValue={parseDate(getDate())}
                maxValue={parseDate(getDate(14))}
              />
            </div>

            <div className="my-4 flex flex-col sm:flex-row gap-2">
              <Button
                color="default"
                isDisabled={!selected}
                onClick={loadTable}
                className="mr-2"
              >
                Check Availability
              </Button>

              {table.length > 0 && (
                <Select
                  label="Choose Time Slots"
                  placeholder="Select one or muliple time-slots"
                  selectionMode="multiple"
                  className="max-w-sm"
                  onChange={(e) => {
                    setSelected({
                      ...selected!,
                      slots: e.target.value.split(",").map((t) => t.trim()),
                    });
                  }}
                >
                  {table.map((t) => (
                    <SelectItem
                      key={t.label.toLowerCase()}
                      // value={t.label}
                      textValue={t.label}
                      className={`${
                        t.status === "booked" &&
                        "text-red-600/80 bg-red-500/10 z-[-1] cursor-not-allowed"
                      }`}
                    >
                      {t.label} {t.status === "booked" && "(Booked)"}
                    </SelectItem>
                  ))}
                </Select>
              )}
            </div>

            <div className="my-2 flex items-start gap-x-2">
              <Input
                type="number"
                label="Number of gate-passes."
                defaultValue={selected!.passes.toString()}
                labelPlacement="inside"
                onChange={(e) => {
                  setSelected({
                    ...selected!,
                    passes: parseInt(e.target.value),
                  });
                }}
                max={36}
                min={1}
                className="max-w-xs"
                startContent={
                  <div className="pointer-events-none flex items-center">
                    <span className="text-default-400 text-small">tokens</span>
                  </div>
                }
              />
            </div>

            {auth?.user && (
              <Button color="primary" onClick={handleBooking}>
                Request for Booking!
              </Button>
            )}

            {!auth && (
              <div>
                <p className="bg-red-900/30 text-red-800 px-4 py-1.5 my-2 rounded w-full">
                  You must login to make a booking!
                </p>
                <Link
                  className="p-1.5 px-4 text-gray-200 bg-indigo-600 rounded my-2"
                  href="/login"
                >
                  Login Now!
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
