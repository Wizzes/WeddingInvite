import { type Rsvp, type InsertRsvp, type TimelineEvent, type InsertTimelineEvent, 
  type Translation, type InsertTranslation, type Photo, type InsertPhoto,
  rsvps, timelineEvents, translations, photos } from "@shared/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";

export interface IStorage {
  // RSVP operations
  createRsvp(rsvp: InsertRsvp): Promise<Rsvp>;
  getRsvp(id: number): Promise<Rsvp | undefined>;
  getAllRsvps(): Promise<Rsvp[]>;

  // Timeline operations
  createTimelineEvent(event: InsertTimelineEvent): Promise<TimelineEvent>;
  getTimelineEvent(id: number): Promise<TimelineEvent | undefined>;
  getAllTimelineEvents(): Promise<TimelineEvent[]>;

  // Translation operations
  createTranslation(translation: InsertTranslation): Promise<Translation>;
  getTranslation(key: string): Promise<Translation | undefined>;
  getAllTranslations(): Promise<Translation[]>;

  // Photo operations
  createPhoto(photo: InsertPhoto): Promise<Photo>;
  getPhoto(id: number): Promise<Photo | undefined>;
  getAllPhotos(): Promise<Photo[]>;
  getPhotosByCategory(category: string): Promise<Photo[]>;
}

export class DatabaseStorage implements IStorage {
  // RSVP Implementation
  async createRsvp(insertRsvp: InsertRsvp): Promise<Rsvp> {
    const rsvpData = {
      ...insertRsvp,
      additionalNames: insertRsvp.additionalNames ? insertRsvp.additionalNames.filter(name => name && name.trim()) : []
    };
    const [rsvp] = await db.insert(rsvps).values(rsvpData).returning();
    return rsvp;
  }

  async getRsvp(id: number): Promise<Rsvp | undefined> {
    const [rsvp] = await db.select().from(rsvps).where(eq(rsvps.id, id));
    return rsvp;
  }

  async getAllRsvps(): Promise<Rsvp[]> {
    return await db.select().from(rsvps);
  }

  // Timeline Implementation
  async createTimelineEvent(event: InsertTimelineEvent): Promise<TimelineEvent> {
    const [timelineEvent] = await db.insert(timelineEvents).values(event).returning();
    return timelineEvent;
  }

  async getTimelineEvent(id: number): Promise<TimelineEvent | undefined> {
    const [event] = await db.select().from(timelineEvents).where(eq(timelineEvents.id, id));
    return event;
  }

  async getAllTimelineEvents(): Promise<TimelineEvent[]> {
    return await db.select().from(timelineEvents).orderBy(timelineEvents.order);
  }

  // Translation Implementation
  async createTranslation(translation: InsertTranslation): Promise<Translation> {
    const [newTranslation] = await db.insert(translations).values(translation).returning();
    return newTranslation;
  }

  async getTranslation(key: string): Promise<Translation | undefined> {
    const [translation] = await db.select().from(translations).where(eq(translations.key, key));
    return translation;
  }

  async getAllTranslations(): Promise<Translation[]> {
    return await db.select().from(translations);
  }

  // Photo Implementation
  async createPhoto(photo: InsertPhoto): Promise<Photo> {
    const [newPhoto] = await db.insert(photos).values(photo).returning();
    return newPhoto;
  }

  async getPhoto(id: number): Promise<Photo | undefined> {
    const [photo] = await db.select().from(photos).where(eq(photos.id, id));
    return photo;
  }

  async getAllPhotos(): Promise<Photo[]> {
    return await db.select().from(photos);
  }

  async getPhotosByCategory(category: string): Promise<Photo[]> {
    return await db.select().from(photos).where(eq(photos.category, category));
  }
}

export const storage = new DatabaseStorage();