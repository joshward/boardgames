import { neonConfig } from "@neondatabase/serverless";
import ws from "ws";

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error("DATABASE_URL is not set");
}

// Configuring Neon for local development
if (connectionString.includes("db.localtest.me")) {
  neonConfig.fetchEndpoint = () => {
    return `http://db.localtest.me:4444/sql`;
  };
  neonConfig.useSecureWebSocket = false;
  neonConfig.wsProxy = () => {
    return "db.localtest.me:4444/v2";
  };
}
neonConfig.webSocketConstructor = ws;

export default connectionString ?? "";
