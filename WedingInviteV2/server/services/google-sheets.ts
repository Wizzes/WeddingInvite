import { GoogleSpreadsheet } from 'google-spreadsheet';
import { JWT } from 'google-auth-library';
import type { Rsvp } from '@shared/schema';

if (!process.env.GOOGLE_SHEETS_PRIVATE_KEY || 
    !process.env.GOOGLE_SHEETS_CLIENT_EMAIL || 
    !process.env.GOOGLE_SHEETS_SPREADSHEET_ID) {
  console.error('Environment variables missing:', {
    hasPrivateKey: !!process.env.GOOGLE_SHEETS_PRIVATE_KEY,
    hasClientEmail: !!process.env.GOOGLE_SHEETS_CLIENT_EMAIL,
    hasSpreadsheetId: !!process.env.GOOGLE_SHEETS_SPREADSHEET_ID
  });
  throw new Error('Missing required Google Sheets credentials - check environment variables');
}

const SCOPES = [
  'https://www.googleapis.com/auth/spreadsheets',
];

// Format private key correctly
const privateKey = process.env.GOOGLE_SHEETS_PRIVATE_KEY
  .replace(/\\n/g, '\n')
  .replace(/^"|"$/g, ''); // Remove any wrapping quotes

console.log('Initializing Google Sheets with client email:', process.env.GOOGLE_SHEETS_CLIENT_EMAIL);
console.log('Private key length:', privateKey.length);

const jwt = new JWT({
  email: process.env.GOOGLE_SHEETS_CLIENT_EMAIL,
  key: privateKey,
  scopes: SCOPES,
});

const doc = new GoogleSpreadsheet(process.env.GOOGLE_SHEETS_SPREADSHEET_ID, jwt);

export async function initializeSpreadsheet() {
  try {
    console.log('Attempting to load spreadsheet info...');
    await doc.loadInfo();
    console.log('Successfully loaded spreadsheet:', doc.title);

    const sheet = doc.sheetsByIndex[0] || await doc.addSheet({ title: 'RSVPs' });
    console.log('Using sheet:', sheet.title);

    // Explicitly set headers for the sheet
    console.log('Setting up headers...');
    await sheet.loadHeaderRow();

    // If no headers exist, set them up
    const headers = [
      'ID',
      'Nume',
      'Invitați Adiționali',
      'Email',
      'Particip',
      'Număr invitați',
      'Mesaj',
      'Restricții alimentare',
      'Data'
    ];

    try {
      // Clear the sheet first
      console.log('Clearing sheet...');
      await sheet.clear();

      // Set headers
      console.log('Setting up headers...');
      await sheet.setHeaderRow(headers);
      console.log('Headers set successfully');
    } catch (error) {
      console.error('Error setting headers:', error);
      throw error;
    }

  } catch (error: any) {
    console.error('Detailed initialization error:', {
      message: error.message,
      code: error.code,
      stack: error.stack
    });
    throw error;
  }
}

export async function addRsvpToSheet(rsvp: Rsvp) {
  try {
    console.log('Loading spreadsheet for RSVP addition...');
    await doc.loadInfo();
    const sheet = doc.sheetsByIndex[0];

    if (!sheet) {
      throw new Error('RSVP sheet not found');
    }

    // Ensure headers are loaded before adding a row
    await sheet.loadHeaderRow();

    console.log('Adding RSVP for:', rsvp.name);
    await sheet.addRow({
      'ID': rsvp.id,
      'Nume': rsvp.name,
      'Invitați Adiționali': Array.isArray(rsvp.additionalNames) ? rsvp.additionalNames.filter(Boolean).join(', ') : '',
      'Email': rsvp.email,
      'Particip': rsvp.attending ? 'Da' : 'Nu',
      'Număr invitați': rsvp.guestCount,
      'Mesaj': rsvp.message || '',
      'Restricții alimentare': rsvp.dietaryRestrictions || '',
      'Data': rsvp.createdAt ? new Date(rsvp.createdAt).toLocaleString() : new Date().toLocaleString()
    });
    console.log('RSVP added successfully');
  } catch (error: any) {
    console.error('Error adding RSVP to sheet:', {
      message: error.message,
      code: error.code,
      name: error.name
    });
    throw error;
  }
}