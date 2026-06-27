import { sql } from "drizzle-orm";
import { pgTable, varchar, text, boolean, timestamp, unique } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { users } from "./auth";

export const aiCredentials = pgTable(
  "ai_credentials",
  {
    id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
    userId: varchar("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    provider: text("provider").notNull(),
    apiKey: text("api_key").notNull(),
    model: text("model"),
    isActive: boolean("is_active").notNull().default(false),
    createdAt: timestamp("created_at").defaultNow(),
  },
  (t) => [unique("ai_credentials_user_provider_unique").on(t.userId, t.provider)]
);

export const insertAiCredentialSchema = createInsertSchema(aiCredentials).omit({
  id: true,
  userId: true,
  apiKey: true,
  isActive: true,
  createdAt: true,
});

export type AiCredential = typeof aiCredentials.$inferSelect;
export type InsertAiCredential = z.infer<typeof insertAiCredentialSchema>;
