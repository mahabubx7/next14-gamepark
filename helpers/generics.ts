export const days = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"] as const;

export type Day = (typeof days)[number];

export function polishString(str: string) {
  str = str.trim().replace(/\s+/g, "-");
  return str.toLowerCase();
}

// Number--to--TimeString
export const numToTime = (time: number): string => {
  if (time < 10) return `0${time}`;
  return `${time}`;
};

// TimeString--to--Number
export const timeToNum = (time: string): number => {
  return parseInt(time);
};

// Today's Date
export function getDate(date: Date | number = new Date()) {
  if (typeof date === "number") {
    const num = date;
    date = new Date(Date.now() + num * 24 * 60 * 60 * 1000);

    return `${date.getFullYear()}-${numToTime(date.getMonth() + 1)}-${numToTime(
      date.getDate()
    )}`;
  }

  date = date ? new Date(date) : new Date();

  return `${date.getFullYear()}-${numToTime(date.getMonth() + 1)}-${numToTime(
    date.getDate()
  )}`;
}
