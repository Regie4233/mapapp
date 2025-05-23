import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


/**

 * @param dateInput The Date object to format.
 * @returns returns 7 days of the week of the input date returns YYYY-MM-DD
 */
export const FindWeek = (initalDate: Date) => {
  const startdifference = initalDate.getDay() - 1;
  const weekStart = new Date(initalDate.getFullYear(), initalDate.getMonth(), initalDate.getDate() - startdifference, -4);

  const enddifference = 7 - initalDate.getDay();
  const weekEnd = new Date(initalDate.getFullYear(), initalDate.getMonth(), initalDate.getDate() + enddifference, -4);
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
  locale: string = 'default' // 'default' uses the runtime's default locale
): string {
  // 1. Validate the input
  if (!(dateInput instanceof Date) || isNaN(dateInput.getTime())) {
   
    return "Invalid Date";
  }

  try {
  
    const monthName = dateInput.toLocaleString(locale, { month: 'long' });

 
    const year = dateInput.getFullYear();


    return `${monthName} ${year}`;

  } catch (error) {
    return error+"Invalid Date";
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