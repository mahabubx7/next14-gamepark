import db from "..";
import { hashPassword } from "../../helpers/password";
import { users, vendors } from "../tables";
import { tUserInsertable, tVendorInsertable } from "../types";
import { venuesSeeder } from "./venues";

const tables = ["users", "vendors"];

async function getSampleUsers() {
  const sampleUsers: tUserInsertable[] = [
    {
      name: "John Doe",
      email: "john@demo.com",
      password: await hashPassword("123456"),
      role: "user", // normal sample customer
    }, // <-- User
    {
      name: "Jane Doe",
      email: "jane@demo.com",
      password: await hashPassword("123456"),
      role: "vendor", // vendor
    }, // <-- Vendor
    {
      name: "Admin",
      email: "admin@demo.com",
      password: await hashPassword("admin123"),
      role: "admin", // admin
    }, // <-- Admin
  ];

  return sampleUsers;
}

function composeVendors(vendorUserId: string) {
  const data: tVendorInsertable[] = [
    {
      userId: vendorUserId,
      phone: "+8801300000000",
      address: { line_1: "Road 102, Gulshan 2" },
      city: "Dhaka",
      country: "Bangladesh",
      games: ["cricket", "football", "badminton"],
    },
    {
      userId: vendorUserId,
      phone: "+8801300000000",
      address: { line_1: "Cantonment Road, Mirpur 10" },
      city: "Dhaka",
      country: "Bangladesh",
      games: ["cricket", "football", "badminton"],
    },
  ];

  return data;
}

export const userAndVendorWithVenuesSeeder = async () => {
  console.log(`Seed starts for: ${tables[0]} ...`);
  const usrArr = await getSampleUsers();
  const usrs = await db.insert(users).values(usrArr).returning();
  console.log(`=> Seed done for: ${tables[0]}!`);

  console.log(`Seed starts for: ${tables[1]} ...`);
  const owners = await db
    .insert(vendors)
    .values(composeVendors(usrs[1].id))
    .returning();
  console.log(`=> Seed done for: ${tables[1]}!`);

  // now insert demo/sample venues as well
  await venuesSeeder(owners.map((o) => o.id));
};
