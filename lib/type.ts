import { AuthRecord } from "pocketbase";


export interface Notes {
  id: string;
  students: string;
  worked_on_today: string;
  struggle_with_anything: string;
  any_wins_today: string;
  other_notes: string;
  content: string;
  summarized: NoteSummary;
  shiftId: Shift;
  mentors: UserPool[];
  created: Date;
  updated: Date;
}

export interface NoteSummary {
  workedOn: string;
  students: Student[];
  keyNotes: string;
}



export interface Student {
  id: string;
  created: string;
  name: string;
  expand: StudentExpand;
  location: ShiftLocation
  note: string;
  updated: string;
}

// export interface Shift {
//     booked: boolean;
//     booked_by: number;
//     created_at: Date;
//     id: number;
//     location: string;
//     notes: Notes;
//     pending_boolean: boolean;
//     requested_by: number;
//     shift_date: string;
//     shift_id: number;
//     time_start: string;
//     time_end: string;
//     updated_at: Date;
// }

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
  firstname: string;
  lastname: string;
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
  expand: ShiftExpand; // In your example, it's empty {}, but could contain more
  id: number;
  pending_approval: string[]; // Assuming these are IDs or some string identifiers
  shift_date: string; // ISO 8601 date-time string (date part might be most relevant)
  shift_end: string; // Time string, e.g., "HH:mm"
  shift_start: string; // Time string, e.g., "HH:mm"
  updated: string; // ISO 8601 date-time string
  title: string;
  description: string;
  loading: boolean;
  spots: number
  location: string; 
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
  shiftOccurences: ShiftOccurrence[]; 
  updated: string; // ISO 8601 date-time string

}

export interface StudentExpand {
  location: ShiftLocation;
  notes: Notes[];
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

export interface UserPool {
  about: string;
  collectionId: string;
  collectionName: string;
  created: string;
  email: string;
  emailVisibility: boolean;
  id: string;
  firstname: string;
  lastname: string;
  phone: number;
  privilage: string;
  title: string;
  updated: string;
  verified: boolean;
  authorized: boolean;
}

export interface ShiftExpand {
  approved: UserPool[];
  notes: Notes;
  pending_approval: UserPool[];
  location: ShiftLocation;
}


export interface ListResult<T> {
    page: number;
    perPage: number;
    totalItems: number;
    totalPages: number;
    items: T[];
}