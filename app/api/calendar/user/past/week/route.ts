import { FindWeek, formatDateToYYYYMMDD_UTC } from "@/lib/utils";
import { NextRequest, NextResponse } from "next/server";
import Pocketbase from "pocketbase"
export async function GET(request: NextRequest) {
   
    const id = request.nextUrl.searchParams.get("id");
    const dateParam = request.nextUrl.searchParams.get("date");
    // console.log(id, dateParam)
    if (!id) {
        return new NextResponse(JSON.stringify({ error: "User ID is required" }), { status: 400 });
    }

    // Use the provided date, or default to today's date
    const targetDate = dateParam ? new Date(dateParam) : new Date();
    // console.log(targetDate)
    if (isNaN(targetDate.getTime())) {
        return new NextResponse(JSON.stringify({ error: "Invalid date provided" }), { status: 400 });
    }
    const todayDate = formatDateToYYYYMMDD_UTC(new Date());

    // Find the Monday and Sunday for the week of the target date
    const { weekmonday, weeksunday } = FindWeek(targetDate);
    const startDate = formatDateToYYYYMMDD_UTC(weekmonday);
    const endDate = formatDateToYYYYMMDD_UTC(weeksunday);
    // console.log(startDate, endDate)
    const pb = new Pocketbase(process.env.NEXT_PUBLIC_POCKETBASE_URL || 'http://localhost:8080');
    console.log(process.env.NEXT_PB_ADMIN_COLLECTION, process.env.NEXT_PB_ADMIN_EMAIL, process.env.NEXT_PB_ADMIN_PASSWORD);
   await pb.collection(process.env.NEXT_PB_ADMIN_COLLECTION || '').authWithPassword(process.env.NEXT_PB_ADMIN_EMAIL || '', process.env.NEXT_PB_ADMIN_PASSWORD || '');
    const shiftp = await pb.collection('mapapp_shift').getList(1, 60, {
        filter: `approved ?~ "${id}" && shift_date >= "${startDate}" && shift_date <= "${endDate}" && (shift_date <= "${todayDate}" || shift_date ~ "${todayDate}")`,
        expand: 'pending_approval, approved, notes, location',
        sort: '-created'
    });

    return new NextResponse(JSON.stringify({ id, shiftp }), { status: 200 });
}
