import { seed } from "./scripts/seed.js";

beforeEach(async () => {
  await seed();
});
