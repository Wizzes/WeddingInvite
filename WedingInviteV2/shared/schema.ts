import { pgTable, text, serial, boolean, timestamp, json } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// RSVP table with meal preferences
export const rsvps = pgTable("rsvps", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  attending: boolean("attending").notNull(),
  guestCount: serial("guest_count").notNull(),
  additionalNames: json("additional_names").default('[]'),
  message: text("message"),
  dietaryRestrictions: text("dietary_restrictions"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Timeline events table
export const timelineEvents = pgTable("timeline_events", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  startTime: timestamp("start_time").notNull(),
  endTime: timestamp("end_time"),
  location: text("location"),
  order: serial("order").notNull(),
});

// Translations table for multi-language support
export const translations = pgTable("translations", {
  id: serial("id").primaryKey(),
  key: text("key").notNull(),
  ro: text("ro").notNull(), // Romanian
  en: text("en").notNull(), // English
  context: text("context"), // Optional context for the translation
});

// Photo gallery table
export const photos = pgTable("photos", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description"),
  imageUrl: text("image_url").notNull(),
  thumbnail: text("thumbnail"),
  uploadedAt: timestamp("uploaded_at").defaultNow(),
  category: text("category"), // e.g., "pre-wedding", "ceremony", "reception"
});

// Schema for RSVP insertion
export const insertRsvpSchema = createInsertSchema(rsvps).pick({
  name: true,
  email: true,
  attending: true,
  guestCount: true,
  message: true,
  dietaryRestrictions: true,
}).extend({
  email: z.string().email(),
  guestCount: z.number().min(1).max(5),
  additionalNames: z.array(z.string().optional()).optional(),
  dietaryRestrictions: z.string().optional(),
});

// Schema for timeline event insertion
export const insertTimelineEventSchema = createInsertSchema(timelineEvents).pick({
  title: true,
  description: true,
  startTime: true,
  endTime: true,
  location: true,
  order: true,
});

// Schema for translation insertion
export const insertTranslationSchema = createInsertSchema(translations).pick({
  key: true,
  ro: true,
  en: true,
  context: true,
});

// Schema for photo insertion
export const insertPhotoSchema = createInsertSchema(photos).pick({
  title: true,
  description: true,
  imageUrl: true,
  thumbnail: true,
  category: true,
});

// Export types
export type InsertRsvp = z.infer<typeof insertRsvpSchema>;
export type Rsvp = typeof rsvps.$inferSelect;

export type InsertTimelineEvent = z.infer<typeof insertTimelineEventSchema>;
export type TimelineEvent = typeof timelineEvents.$inferSelect;

export type InsertTranslation = z.infer<typeof insertTranslationSchema>;
export type Translation = typeof translations.$inferSelect;

export type InsertPhoto = z.infer<typeof insertPhotoSchema>;
export type Photo = typeof photos.$inferSelect;