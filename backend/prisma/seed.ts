import "dotenv/config";
import { ejecutarSeed } from "../src/infrastructure/seed/ejecutarSeed";

ejecutarSeed().catch((error) => {
  console.error(error);
  process.exit(1);
});
