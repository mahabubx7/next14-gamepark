import { gamesSeeder } from "./games";
import { userAndVendorWithVenuesSeeder } from "./users_and_vendors";

async function executeAllSeeders() {
  // Add more seeders here
  try {
    await gamesSeeder(); // <-- Run the games-seeder function
    await userAndVendorWithVenuesSeeder(); // <-- Run the users - vendors - venues seeder function
  } catch (err) {
    throw err;
  }
}

// AT THE END OF ALL
(async function () {
  await executeAllSeeders()
    .then(() => {
      console.log("All seeders executed successfully!");
      process.exit(0);
    })
    .catch((err) => {
      console.error("Error in executing seeders: ", err);
      process.exit(1);
    });
})();
