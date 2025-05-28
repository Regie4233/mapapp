import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { AuthUser, Shift, ShiftOccurencesResponse, ShiftOccurrence } from "./type";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


/**

 * @param dateInput The Date object to format.
 * @returns returns 7 days of the week of the input date returns YYYY-MM-DD
 */
export const FindWeek = (initalDate: Date) => {
  // console.log(initalDate.getDate())
  const startdifference = initalDate.getDay() - 1;
  // console.log(startdifference)
  // console.log(initalDate.getDate() - startdifference)
  const weekStart = new Date(initalDate.getFullYear(), initalDate.getMonth(), initalDate.getDate() - startdifference);

  const enddifference = 7 - initalDate.getDay();
  const weekEnd = new Date(initalDate.getFullYear(), initalDate.getMonth(), initalDate.getDate() + enddifference);
  // console.log(weekStart)
  // console.log(weekEnd)
  return ({ weekmonday: weekStart, weeksunday: weekEnd })
}

/**
 *
 * @param dateInput The Date object to format.
 * @param locale Optional. The BCP 47 language tag (e.g., 'en-US', 'de-DE', 'fr-FR')
 *               to use for formatting the month name. Defaults to the runtime's default locale.
 * @returns The formatted date string (e.g., "January 2023"),
 *          or "Invalid Date" if the input is not a valid Date object.
 */
export function formatDateToMonthYear(
  dateInput: Date,
  full: boolean = false,
  locale: string = 'default', // 'default' uses the runtime's default locale
): string {
  // 1. Validate the input
  if (!(dateInput instanceof Date) || isNaN(dateInput.getTime())) {

    return "Invalid Date";
  }

  try {

    const monthName = dateInput.toLocaleString(locale, { month: 'long' });


    const year = dateInput.getFullYear();


    return `${monthName} ${full ? dateInput.getDate() : ''} ${year}`;

  } catch (error) {
    return error + "Invalid Date";
  }
}


export function formatDateToMonthYear_ArrayLookup(dateInput: Date): string {
  if (!(dateInput instanceof Date) || isNaN(dateInput.getTime())) {
    return "Invalid Date";
  }

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const monthIndex = dateInput.getMonth(); // 0-indexed
  const year = dateInput.getFullYear();

  if (monthIndex < 0 || monthIndex > 11) {
    // Should not happen with a valid Date object, but good for robustness
    return "Invalid Date";
  }

  return `${monthNames[monthIndex]} ${year}`;
}

/**
 * Returns a three-letter uppercase abbreviation for a given day number.
 * (0 for Sunday, 1 for Monday, ..., 6 for Saturday)
 *
 * @param dayNumber The day number (0-6).
 * @returns The three-letter day abbreviation (e.g., "SUN", "MON")
 *          or "INV" if the day number is invalid.
 */
export function getDayAbbreviation(dayNumber: number): string {
  // Define the abbreviations, indexed by the day number
  const dayAbbreviations: string[] = [
    "SUN", // 0
    "MON", // 1
    "TUE", // 2
    "WED", // 3
    "THU", // 4
    "FRI", // 5
    "SAT"  // 6
  ];

  // Validate the input
  if (dayNumber >= 0 && dayNumber <= 6) {
    return dayAbbreviations[dayNumber];
  } else {
    // console.warn(`Invalid day number provided: ${dayNumber}`);
    return "INV"; // Or throw an error: throw new Error("Invalid day number");
  }
}

/**
 * Converts a 24-hour time string (HH:MM or HH:MM:SS) to a 12-hour format string (h:MM AM/PM).
 *
 * @param time24 The 24-hour time string (e.g., "13:45", "08:05", "00:30", "23:59:58").
 * @returns The 12-hour formatted time string (e.g., "1:45 PM", "8:05 AM", "12:30 AM", "11:59:58 PM"),
 *          or "Invalid Time" if the input format is incorrect.
 */
export function convertTo12HourFormat(time24: string): string {
  // 1. Validate input format (basic check)
  const timeParts = time24.split(':');
  if (timeParts.length < 2 || timeParts.length > 3) {
    return "Invalid Time";
  }

  let hours = parseInt(timeParts[0], 10);
  const minutes = parseInt(timeParts[1], 10);
  const seconds: number | undefined = timeParts[2] ? parseInt(timeParts[2], 10) : undefined;

  // 2. Validate numeric values and ranges
  if (
    isNaN(hours) || isNaN(minutes) || (seconds !== undefined && isNaN(seconds)) ||
    hours < 0 || hours > 23 ||
    minutes < 0 || minutes > 59 ||
    (seconds !== undefined && (seconds < 0 || seconds > 59))
  ) {
    return "Invalid Time";
  }

  // 3. Determine AM or PM
  const period = hours >= 12 ? "PM" : "AM";

  // 4. Convert hours to 12-hour format
  if (hours === 0) { // Midnight case
    hours = 12;
  } else if (hours > 12) {
    hours -= 12;
  }
  // Hours 1-11 remain as they are for AM
  // Hour 12 (noon) remains 12 for PM

  // 5. Format minutes (and seconds if present) to always be two digits
  const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes.toString();
  let formattedTime = `${hours}:${formattedMinutes}`;

  if (seconds !== undefined) {
    const formattedSeconds = seconds < 10 ? `0${seconds}` : seconds.toString();
    formattedTime += `:${formattedSeconds}`;
  }

  // 6. Combine and return
  return `${formattedTime} ${period}`;
}


export function getLetterColor(letter: string | undefined): string {
  // 1. Validate input: ensure it's a single character string
  if (typeof letter !== 'string' || letter.length !== 1) {
    // console.warn(`Invalid input for getLetterColor: Expected a single character, got "${letter}"`);
    return 'grey'; // Return a default color for invalid input
  }

  // 2. Normalize the letter to uppercase for consistent mapping
  const upperCaseLetter = letter.toUpperCase();

  // 3. Define the letter-to-color mapping
  // You can expand this map with more letters and colors as needed.
  // These could be CSS color names, hex codes, HSL values, etc.
  const colorMap: { [key: string]: string } = {
    'A': '#FF8C66', // Vibrant Orange (Lighter)
    'B': '#66D9FF', // Bright Blue (Lighter)
    'C': '#66FF8C', // Lime Green (Lighter)
    'D': '#FF66B8', // Hot Pink (Lighter)
    'E': '#F5FF66', // Bright Yellow (Lighter)
    'F': '#B866FF', // Purple (Lighter)
    'G': '#FFB866', // Orange (Lighter)
    'H': '#66FFD9', // Turquoise (Lighter)
    'I': '#FF6666', // Red (Lighter)
    'J': '#66BFFF', // Sky Blue (Lighter)
    'K': '#BFFF66', // Light Green (Lighter)
    'L': '#FF66F5', // Magenta (Lighter)
    'M': '#6694FF', // Royal Blue (Lighter)
    'N': '#FFDF66', // Gold (Lighter)
    'O': '#AD66FF', // Indigo (Lighter)
    'P': '#66FFAD', // Sea Green (Lighter)
    'Q': '#FF7F50', // Coral
    'R': '#40E0D0', // Turquoise Blue
    'S': '#DA70D6', // Orchid
    'T': '#FFD700', // Gold (similar to N, but distinct enough)
    'U': '#87CEEB', // Sky Blue (different shade)
    'V': '#BA55D3', // Medium Orchid
    'W': '#32CD32', // Lime Green (different shade)
    'X': '#FF69B4', // Hot Pink (different shade)
    'Y': '#FFFFE0', // Light Yellow
    'Z': '#ADD8E6', // Light Blue
  };

  // 4. Return the color from the map or a default color
  if (colorMap[upperCaseLetter]) {
    return colorMap[upperCaseLetter];
  } else {
    return '#808080'; // Default color (grey) if letter is not in the map
  }
}

export function filterShifts_by_user(shiftOccurences: ShiftOccurencesResponse | null, user: AuthUser | null) {
  if (user === null) return;
  const filteredShifts: Shift[] = shiftOccurences?.items.reduce((acc: Shift[], currOccurence: ShiftOccurrence) => {
    const approvedShiftsInOccurrence = currOccurence.expand.shifts.filter(shift =>
      shift.approved.includes(user.id)
    );
    return acc.concat(approvedShiftsInOccurrence);
  }, [] as Shift[]) || [];
  return filteredShifts;
}

export function formatDateToYYYYMMDD_UTC(date: Date) {
  if (!(date instanceof Date) || isNaN(date.getDate())) {
    return "Invalid Date"; // Or throw an error, or return null
  }
  // toISOString() returns a string in the format "YYYY-MM-DDTHH:mm:ss.sssZ" (Z indicates UTC)
  return date.toISOString().slice(0, 10);
}

export function checkRequestPendingStatus(authId: string, shift: Shift): boolean | null {
  if (shift.pending_approval.includes(authId.toString())) {
    return true;
  } else {
    return false;
  }
}

export function checkUserOwnedShift(user: AuthUser, shift: Shift): boolean {
  if (shift.approved.includes(user.id.toString())) {
    return true;
  } else {
    return false;
  }
}