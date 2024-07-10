import db, { bookings } from "$/db";
import { eq } from "drizzle-orm";
import { Day, days, numToTime, polishString, timeToNum } from "./generics";

// constants
const fractionInAnHour = [0, 30]; // ignoring 15, 45

// Time String to Time Cor. Array
const strToTimeString = (str: string) => {
  return str.split(":").map((t) => timeToNum(t));
};

// TimeString to AM/PM
export const convertTimeStr = (str: string) => {
  let pr: "AM" | "PM" = "AM";
  const parts = str.split(":");
  const hr = timeToNum(parts[0]);
  if (hr === 0 || hr === 24) {
    return `12:${numToTime(Number(parts[1]))} ${pr}`;
  } else if (hr === 12) {
    pr = "PM";
    return `12:${numToTime(Number(parts[1]))} ${pr}`;
  } else if (hr >= 13) {
    pr = "PM";
    return `${numToTime(Number(parts[0]) - 12)}:${parts[1]} ${pr}`;
  }

  return `${numToTime(hr)}:${parts[1]} ${pr}`;
};

// AM/PM to TimeString
export const convertTimeTo24 = (str: string) => {
  const parts = str
    .replace(/\s+/g, "")
    .replace(/[a-zA-Z]/g, "")
    .split(":");
  const hr = timeToNum(parts[0]);
  if (str.includes("AM")) {
    if (hr === 12) {
      return `00:${parts[1]}:00`;
    }
    return `${numToTime(hr)}:${parts[1]}:00`;
  } else {
    if (hr === 12) {
      return `12:${parts[1]}:00`;
    }
    return `${numToTime(hr + 12)}:${parts[1]}:00`;
  }
};

// TIME TABLE
export const generateTimeTable = (start: string, end: string) => {
  const table: string[] = [];
  const startTime = strToTimeString(start);
  const endTime = strToTimeString(end);
  for (let hr = startTime[0]; hr <= endTime[0]; hr++) {
    for (let i = 0; i < fractionInAnHour.length; i++) {
      if (hr === startTime[0] && fractionInAnHour[i] < (startTime[1] || 0)) {
        continue;
      }
      if (hr === endTime[0] && fractionInAnHour[i] > (endTime[1] || 0)) {
        continue;
      }
      const time = `${numToTime(hr)}:${numToTime(fractionInAnHour[i])}:00`;
      table.push(time);
    }
  }

  // compose time-table
  const timeTable: {
    start: string;
    end: string;
    label: string;
  }[] = [];
  for (let i = 0; i < table.length - 1; i++) {
    timeTable.push({
      start: table[i],
      end: table[i + 1],
      label: `${convertTimeStr(table[i])} - ${convertTimeStr(table[i + 1])}`,
    });
  }

  return timeTable;
};

// Key generate
export const generateKey = (
  slot: string,
  venue_id: string,
  game: string,
  space: string,
  date: string
): string => {
  return polishString(`${slot}:${venue_id}:${game}:${space}:${date}`);
};

// Pass Key generate
export function generatePassKey(
  options: {
    len?: number;
    prefix?: string;
    type?: "alphanumeric" | "alpha" | "hex";
  } = {
    len: 8,
    type: "alphanumeric",
    prefix: "",
  }
) {
  let charset = "abcdefghijklmnopqrstuvwxyz0123456789";
  if (options.type === "alpha") {
    charset = "abcdefghijklmnopqrstuvwxyz";
  } else if (options.type === "hex") {
    const code = crypto
      .randomUUID()
      .replace(/-/g, "")
      .split("")
      .slice(0, options.len || 8)
      .join("");
    if (options.prefix)
      return options.prefix.toUpperCase() + code.toUpperCase();
    return code.toUpperCase();
  }

  let pass = options.prefix || "";
  for (let i = 0; i < (options.len || 8); i++) {
    pass += charset.charAt(Math.floor(Math.random() * charset.length));
  }

  return pass.toUpperCase();
}

// BEFORE_INSERT: Booking Record
export async function checkTimeSlotOverlapps(
  key: string // venue_id:game:space:space_type
): Promise<boolean> {
  // check if the slot is already booked
  const slotAvailability = await db
    .select()
    .from(bookings)
    .where(eq(bookings.key, key));

  // console.log(slotAvailability.length, slotAvailability);

  if (slotAvailability.length > 0) {
    // console.log("Slot already booked", key);
    return true; // slot already booked
  }

  // console.log("Slot available!", key);
  return false; // slot available
}

// CHECK: openDay have target day or not
export const checkOpenDay = (openDays: Day[], targetDate: string) => {
  const current = new Date(targetDate).getDay();
  return openDays.includes(days[current]);
};
