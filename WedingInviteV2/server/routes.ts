import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertRsvpSchema, insertTimelineEventSchema, insertTranslationSchema, insertPhotoSchema } from "@shared/schema";
import { fromZodError } from "zod-validation-error";
import { ZodError } from "zod";
import { initializeSpreadsheet, addRsvpToSheet } from "./services/google-sheets";

export async function registerRoutes(app: Express): Promise<Server> {
  // Initialize Google Sheets
  try {
    await initializeSpreadsheet();
    console.log('Google Sheets initialized successfully');
  } catch (error) {
    console.error('Failed to initialize Google Sheets:', error);
  }

  // RSVP Routes
  app.post("/api/rsvp", async (req, res) => {
    try {
      console.log('Received RSVP data:', req.body);
      const rsvpData = insertRsvpSchema.parse(req.body);
      console.log('Validated RSVP data:', rsvpData);
      
      const rsvp = await storage.createRsvp(rsvpData);
      console.log('Created RSVP in database:', rsvp);

      // Sync to Google Sheets
      try {
        await addRsvpToSheet(rsvp);
        console.log('Added RSVP to Google Sheets successfully');
      } catch (sheetError) {
        console.error('Failed to sync RSVP to Google Sheets:', sheetError);
        // Continue with response even if sheets sync fails
      }

      res.json({
        success: "YES",
        message: "RSVP successfully created",
        data: rsvp
      });
    } catch (error) {
      console.error('RSVP creation error:', error);
      if (error instanceof ZodError) {
        res.status(400).json({
          success: "NO",
          message: fromZodError(error).message
        });
      } else {
        res.status(500).json({
          success: "NO",
          message: error instanceof Error ? error.message : "Internal server error"
        });
      }
    }
  });

  app.get("/api/rsvp/:id", async (req, res) => {
    try {
      const rsvp = await storage.getRsvp(parseInt(req.params.id));
      if (!rsvp) {
        return res.status(404).json({
          success: "NO",
          message: "RSVP not found"
        });
      }
      res.json({
        success: "YES",
        data: rsvp
      });
    } catch (error) {
      res.status(500).json({
        success: "NO",
        message: "Internal server error"
      });
    }
  });

  app.get("/api/rsvps", async (_req, res) => {
    try {
      const rsvps = await storage.getAllRsvps();
      res.json({
        success: "YES",
        data: rsvps
      });
    } catch (error) {
      res.status(500).json({
        success: "NO",
        message: "Internal server error"
      });
    }
  });

  // Timeline Routes
  app.post("/api/timeline", async (req, res) => {
    try {
      const eventData = insertTimelineEventSchema.parse(req.body);
      const event = await storage.createTimelineEvent(eventData);
      res.status(201).json({
        success: "YES",
        message: "Timeline event created successfully",
        data: event
      });
    } catch (error) {
      if (error instanceof ZodError) {
        res.status(400).json({
          success: "NO",
          message: fromZodError(error).message
        });
      } else {
        res.status(500).json({
          success: "NO",
          message: "Internal server error"
        });
      }
    }
  });

  app.get("/api/timeline", async (_req, res) => {
    try {
      const events = await storage.getAllTimelineEvents();
      res.json({
        success: "YES",
        data: events
      });
    } catch (error) {
      res.status(500).json({
        success: "NO",
        message: "Internal server error"
      });
    }
  });

  // Translation Routes
  app.post("/api/translations", async (req, res) => {
    try {
      const translationData = insertTranslationSchema.parse(req.body);
      const translation = await storage.createTranslation(translationData);
      res.status(201).json({
        success: "YES",
        message: "Translation created successfully",
        data: translation
      });
    } catch (error) {
      if (error instanceof ZodError) {
        res.status(400).json({
          success: "NO",
          message: fromZodError(error).message
        });
      } else {
        res.status(500).json({
          success: "NO",
          message: "Internal server error"
        });
      }
    }
  });

  app.get("/api/translations", async (_req, res) => {
    try {
      const translations = await storage.getAllTranslations();
      res.json({
        success: "YES",
        data: translations
      });
    } catch (error) {
      res.status(500).json({
        success: "NO",
        message: "Internal server error"
      });
    }
  });

  app.get("/api/translations/:key", async (req, res) => {
    try {
      const translation = await storage.getTranslation(req.params.key);
      if (!translation) {
        return res.status(404).json({
          success: "NO",
          message: "Translation not found"
        });
      }
      res.json({
        success: "YES",
        data: translation
      });
    } catch (error) {
      res.status(500).json({
        success: "NO",
        message: "Internal server error"
      });
    }
  });

  // Photo Gallery Routes
  app.post("/api/photos", async (req, res) => {
    try {
      const photoData = insertPhotoSchema.parse(req.body);
      const photo = await storage.createPhoto(photoData);
      res.status(201).json({
        success: "YES",
        message: "Photo created successfully",
        data: photo
      });
    } catch (error) {
      if (error instanceof ZodError) {
        res.status(400).json({
          success: "NO",
          message: fromZodError(error).message
        });
      } else {
        res.status(500).json({
          success: "NO",
          message: "Internal server error"
        });
      }
    }
  });

  app.get("/api/photos", async (req, res) => {
    try {
      if (req.query.category) {
        const photos = await storage.getPhotosByCategory(req.query.category as string);
        return res.json({
          success: "YES",
          data: photos
        });
      }
      const photos = await storage.getAllPhotos();
      res.json({
        success: "YES",
        data: photos
      });
    } catch (error) {
      res.status(500).json({
        success: "NO",
        message: "Internal server error"
      });
    }
  });

  app.get("/api/photos/:id", async (req, res) => {
    try {
      const photo = await storage.getPhoto(parseInt(req.params.id));
      if (!photo) {
        return res.status(404).json({
          success: "NO",
          message: "Photo not found"
        });
      }
      res.json({
        success: "YES",
        data: photo
      });
    } catch (error) {
      res.status(500).json({
        success: "NO",
        message: "Internal server error"
      });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}