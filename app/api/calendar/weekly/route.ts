import { pb } from "@/lib/server/pocketbase";
import { FindWeek } from "@/lib/utils";
import { ISOStringFormat } from "date-fns";
import { NextRequest } from "next/server";

// ** Add query param date=YYYY-MM-DD and location=*target location*

// Example: /api/calendar/weekly?date=2025-05-22&&location=New York

// returns shift Occurences for the selected week (7days) showing all shifts 
// and showing all infomation of the approved and pending users related to it

export async function GET(request: NextRequest) {
    const resLocation = request.nextUrl.searchParams.get('location');
    const resDate = request.nextUrl.searchParams.get('date') as ISOStringFormat;
    const targetDate = new Date(resDate);
     console.log(targetDate)
    const weekMinMax = FindWeek(targetDate);
   
    const monday =  weekMinMax.weekmonday.toISOString().replace('T', ' ');
    const sunday = weekMinMax.weeksunday.toISOString().replace('T', ' ');
    console.log(monday, sunday);

    await pb.collection('_superusers').authWithPassword('admin@admin.admin', 'adminadmin')

    const locationRecord = await pb.collection('mapapp_shiftOccurences').getList(1, 60, {
        filter: `shiftDate >= "${monday}" && shiftDate <= "${sunday}" && shiftLocation.name ?~ "${resLocation}"`,
        expand: 'shiftLocation, shifts.approved, shifts.pending_approval',
        sort: 'shiftDate',
    });

    return new Response(JSON.stringify(locationRecord));
}