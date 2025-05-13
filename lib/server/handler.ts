import { Shift } from '@/lib/type';
type QueryShiftRange = {
    dateFrom: Date,
    dateTo: Date,
    reportTimeStart: string
    reportTimeEnd: string
}

/**     
 * This function fetches all shifts from the server based on a given date range and location.
   * @param {QueryShiftRange} shiftRange - The date range and report time for the shifts to be fetched.
      * QueryShiftRange is an object that contains the following properties:
      * - dateFrom: The start date of the range (Date object).
      * - dateTo: The end date of the range (Date object).
      * - reportTimeStart: The start time of the report (string).
      * - reportTimeEnd: The end time of the report (string).
   * @param {string} location - Used to filter all the fetched shifts based on what location ( this is in string ).
   * @returns something..
   */
export const getAllShifts_By_Date_Range = async ({ shiftRange, location }: { shiftRange: QueryShiftRange, location: string }) => {
    try {
        const resp = await fetch('http://3.148.108.186:5000/api/calendar/getSpecificShifts', {
            method: 'POST',
            body: JSON.stringify({dateFrom: shiftRange.dateFrom, dateTo: shiftRange.dateTo, reportTimeStart: shiftRange.reportTimeStart, reportTimeEnd: shiftRange.reportTimeEnd, location}),
            headers: { 'Content-Type': 'application/json' }
        });
        
        console.log(resp + ' ' + location);
        return resp;
    } catch (error) {
        console.error('Error fetching shifts:', error);
        if (location === null || location === undefined) console.log('Location is null or undefined ');

    }
}



export const getAllShifts_AllTime = async () => {
    try {
        const resp = await fetch('http://3.148.108.186:5000/api/calendar/shifts-for-month');
        const data = await resp.json();
        const listShiftsAllTime: Shift[] = Object.values(data.data.byId);
       return listShiftsAllTime;
    } catch (error) {
        console.error('Error fetching shifts:', error);
        if (location === null || location === undefined) console.log('Location is null or undefined ');

    }
}
