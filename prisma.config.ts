import { defineConfig } from "prisma/config";
import "dotenv/config"; // <--- Add this line right here!

export default defineConfig({
  schema: "prisma/schema.prisma",
  datasource: {
    url: process.env.DATABASE_URL, // <--- Tell it to read from your .env file natively
  },
});