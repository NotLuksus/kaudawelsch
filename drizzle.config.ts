import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  dialect: 'postgresql',
  schema: './src/server/db/schema',
  out: './drizzle',
  dbCredentials: {
    // biome-ignore lint/style/noNonNullAssertion: Not undefined
    url: process.env.DATABASE_URL!,
  },
});
