import { migrate } from "./utils/migrate";

import dotenv from "dotenv";
import path from "node:path";

dotenv.config({ path: path.resolve(__dirname, "../.env") });

migrate().catch((error) => {
  console.error(error);
  process.exit(1);
});
