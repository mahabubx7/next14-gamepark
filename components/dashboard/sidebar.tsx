"use server";

import Link from "next/link";

const ChevronRightIcon = (props: any) => (
  <svg
    aria-hidden="true"
    fill="none"
    focusable="false"
    height="1em"
    role="presentation"
    stroke="currentColor"
    strokeLinecap="round"
    strokeLinejoin="round"
    strokeWidth="1.5"
    viewBox="0 0 24 24"
    width="1em"
    {...props}
  >
    <path d="m9 18 6-6-6-6" />
  </svg>
);

const ItemCounter = ({ num }: { num: number }) => (
  <div className="flex items-center gap-1 text-default-400">
    <span className="text-small">{num}</span>
    <ChevronRightIcon className="text-xl" />
  </div>
);

export async function Sidebar() {
  const classes =
    "p-2 md:p-0 bg-gray-950/80 sticky top-0 left-0 max-w-[300px] w-full h-full";

  return (
    <div className={classes}>
      <h3 className="text-2xl font-bold uppercase text-center py-2.5">
        gamepark.
      </h3>

      <nav className="flex flex-col gap-1 my-2.5">
        <hr className="border-gray-900" />
        <h4 className="text-xl">Navigation</h4>
        <hr className="border-gray-900" />
        <ul className="flex flex-col w-full">
          <li className="w-full block">
            <Link className="w-full block" href="/dashboard">
              Dashboard
            </Link>
          </li>

          <li className="w-full block">
            <Link className="w-full block" href="/dashboard/ticket">
              Your Tickets
            </Link>
          </li>

          <li className="w-full block">
            <Link className="w-full block" href="/dashboard/venue">
              Your venues
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  );
}
