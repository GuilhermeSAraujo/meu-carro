import { serve } from "@hono/node-server";

import { api } from "./api";

const server = serve(
  {
    fetch: api.fetch,
    // TODO env variables
    port: 3001,
  },
  (info) => {
    process.stdout.write(`Server listening on ${info.family} ${info.address}:${info.port}\n`);
  }
);
