import * as Contacts from 'expo-contacts';
import { Platform } from 'react-native';

export interface Contact {
  id: string;
  name: string;
  phoneNumbers: string[];
  emails: string[];
}

// Function to normalize Indian phone numbers (always remove 91)
export const normalizeIndianPhoneNumber = (phoneNumber: string): string => {
  // Remove all spaces and non-digit characters
  let normalized = phoneNumber.replace(/\D/g, '');

  // Always remove 91 prefix if present
  if (normalized.startsWith('91') && normalized.length === 12) {
    return normalized.substring(2);
  }

  // If it's an 11-digit number starting with 0, remove the 0
  if (normalized.startsWith('0') && normalized.length === 11) {
    return normalized.substring(1);
  }

  // If it's already a 10-digit number, return as is
  if (normalized.length === 10) {
    return normalized;
  }

  // Return as is if none of the above patterns match
  return normalized;
};

// Function to check if two Indian phone numbers match (always remove 91)
export const phoneNumbersMatch = (phone1: string, phone2: string): boolean => {
  const normalized1 = normalizeIndianPhoneNumber(phone1);
  const normalized2 = normalizeIndianPhoneNumber(phone2);

  // Direct match (both without 91)
  return normalized1 === normalized2;
};

export const contactsService = {
  // Request contacts permission
  async requestPermission(): Promise<boolean> {
    const { status } = await Contacts.requestPermissionsAsync();
    return status === 'granted';
  },

  // Check if contacts permission is granted
  async hasPermission(): Promise<boolean> {
    const { status } = await Contacts.getPermissionsAsync();
    return status === 'granted';
  },

  // Get all contacts with phone numbers
  async getContactsWithPhoneNumbers(): Promise<Contact[]> {
    const hasPermission = await this.hasPermission();
    if (!hasPermission) {
      const granted = await this.requestPermission();
      if (!granted) {
        throw new Error('Contacts permission not granted');
      }
    }

    const { data } = await Contacts.getContactsAsync({
      fields: [Contacts.Fields.PhoneNumbers, Contacts.Fields.Emails],
    });

    // Filter contacts that have phone numbers and format them
    const contacts: Contact[] = data
      .filter(
        contact =>
          contact.phoneNumbers &&
          contact.phoneNumbers.length > 0 &&
          contact.name // Only include contacts with names
      )
      .map(contact => ({
        id: contact.id,
        name: contact.name || 'Unknown',
        phoneNumbers: contact.phoneNumbers
          ? contact.phoneNumbers.map(p => p.number || '').filter(n => n)
          : [],
        emails: contact.emails
          ? contact.emails.map(e => e.email || '').filter(e => e)
          : [],
      }));

    return contacts;
  },

  // Search contacts by name or phone number
  async searchContacts(query: string): Promise<Contact[]> {
    const contacts = await this.getContactsWithPhoneNumbers();

    // Normalize query for comparison
    const normalizedQuery = query.toLowerCase().trim();

    // Filter contacts that match the query
    return contacts.filter(contact => {
      // Match by name
      if (contact.name.toLowerCase().includes(normalizedQuery)) {
        return true;
      }

      // Match by phone number
      if (contact.phoneNumbers.some(phone => phone.includes(normalizedQuery))) {
        return true;
      }

      // Match by email
      if (
        contact.emails.some(email =>
          email.toLowerCase().includes(normalizedQuery)
        )
      ) {
        return true;
      }

      return false;
    });
  },

  // Format phone number for display (Indian format)
  formatPhoneNumber(phoneNumber: string): string {
    // Remove all non-digit characters
    const cleaned = phoneNumber.replace(/\D/g, '');

    // Format Indian numbers as XXXXX XXXXX
    if (cleaned.length === 10) {
      return `${cleaned.substring(0, 5)} ${cleaned.substring(5)}`;
    }

    // If it's 12 digits and starts with 91, format without 91
    if (cleaned.length === 12 && cleaned.startsWith('91')) {
      const number = cleaned.substring(2);
      return `${number.substring(0, 5)} ${number.substring(5)}`;
    }

    // If it's 11 digits and starts with 0, format without 0
    if (cleaned.length === 11 && cleaned.startsWith('0')) {
      const number = cleaned.substring(1);
      return `${number.substring(0, 5)} ${number.substring(5)}`;
    }

    // For other formats, just remove non-digits
    return cleaned;
  },

  // Check if a contact phone number matches a database phone number
  phoneNumbersMatch,
  normalizeIndianPhoneNumber,
};

export default contactsService;
