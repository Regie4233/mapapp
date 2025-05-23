import { AuthRecord } from "pocketbase";

export interface Shift {
    booked: boolean;
    booked_by: number;
    created_at: Date;
    id: number;
    location: string;
    notes: [];
    pending_boolean: boolean;
    requested_by: number;
    shift_date: string;
    shift_id: number;
    time_start: string;
    time_end: string;
    updated_at: Date;
}

export interface WorkingDays {
    work_day: Date;
    shifts: Array<Shift>;
    location: string;
}

export interface PocketBaseUser {
    id: string;
    email: string;
    name: string;
    verified: boolean;
    privilage: string;
    phone: string;
}

export interface AuthData {
    token: string;
    record: AuthRecord;
}

export interface AuthUser {
    id: string;
    email: string;
    name: string;   
    verified: boolean;
    privilage: string;
    phone: string;
    created: Date;
    updated: Date;
    title: string;
    about: string;
}

export interface TargetWeekQuery {
    targetDate: string;
    targetLocation: string
}




// 
/**
 * Represents an individual shift detail, often found within an 'expand' block.
 */
export interface Shift {
  approved: string[]; // Assuming these are IDs or some string identifiers
  collectionId: string;
  collectionName: string;
  created: string; // ISO 8601 date-time string
  expand: Record<string, ShiftLocation>; // In your example, it's empty {}, but could contain more
  id: number;
  pending_approval: string[]; // Assuming these are IDs or some string identifiers
  shift_date: string; // ISO 8601 date-time string (date part might be most relevant)
  shift_end: string; // Time string, e.g., "HH:mm"
  shift_start: string; // Time string, e.g., "HH:mm"
  updated: string; // ISO 8601 date-time string
}

/**
 * Represents a location, often found within an 'expand' block.
 */
export interface ShiftLocation {
  address: string;
  collectionId: string;
  collectionName: string;
  created: string; // ISO 8601 date-time string
  id: string;
  name: string;
  shiftOccurences: string[]; // Array of ShiftOccurrence IDs
  updated: string; // ISO 8601 date-time string
    title: string;
  description: string;
}

/**
 * Represents the 'expand' object within a ShiftOccurrence.
 * This contains the fully resolved related records.
 */
export interface ShiftOccurrenceExpand {
  shiftLocation: ShiftLocation;
  shifts: Shift[];
}

/**
 * Represents the main ShiftOccurrence record.
 */
export interface ShiftOccurrence {
  collectionId: string;
  collectionName: string;
  created: string; // ISO 8601 date-time string
  expand: ShiftOccurrenceExpand;
  id: string;
  shiftDate: string; // ISO 8601 date-time string (date part might be most relevant)
  shiftLocation: string; // ID of the related ShiftLocation record
  shifts: string[]; // Array of Shift IDs
  updated: string; // ISO 8601 date-time string
}
export interface ShiftOccurencesResponse {
  items: ShiftOccurrence[];
  page: number;
  perPage: number;
  totalItems: number;
  totalPages: number;
}

// --- Example Usage (how you might type a variable holding this data) ---
// const myShiftOccurrence: ShiftOccurrence = { ... your JSON data ... };

// If you have an array of these:
// const myShiftOccurrences: ShiftOccurrence[] = [ ... array of your JSON data ... ];