// import { pb } from "@/lib/server/pocketbase";
import { NextRequest, NextResponse } from "next/server";
import Pocketbase from "pocketbase";

export async function GET(request: NextRequest) {
    // Get pagination parameters from the query string
    const pageParam = request.nextUrl.searchParams.get("page");
    const perPageParam = request.nextUrl.searchParams.get("perPage");
    const notesOnly = request.nextUrl.searchParams.get("notesOnly") === "true";
    const location = request.nextUrl.searchParams.get("location");
    const sort = request.nextUrl.searchParams.get("sort");

    // Parse parameters to numbers, with defaults
    const page = pageParam ? parseInt(pageParam, 10) : 1;
    const perPage = perPageParam ? parseInt(perPageParam, 10) : 15; // A common default for pagination

    // Validate that parsed values are numbers
    if (isNaN(page) || isNaN(perPage)) {
        return new NextResponse(JSON.stringify({ error: "Invalid pagination parameters" }), { status: 400 });
    }

    try {
        const pb = new Pocketbase(process.env.NEXT_PUBLIC_POCKETBASE_URL || 'http://localhost:8080');
        // It's recommended to use an admin API key instead of authenticating with email/password on each request.
        await pb.collection(process.env.NEXT_PB_ADMIN_COLLECTION || '').authWithPassword(process.env.NEXT_PB_ADMIN_EMAIL || '', process.env.NEXT_PB_ADMIN_PASSWORD || '');
        
        const filterParts: string[] = [];
        if (notesOnly) {
            filterParts.push('notes != ""');
        }
        if (location) {
            // Assumes 'location' is the field name for the relation in your 'mapapp_shift' collection
            filterParts.push(`location = "${location}"`);
        }
        const filter = filterParts.join(' && ');

        // Fetch all shifts with pagination
        const shifts = await pb.collection('mapapp_shift').getList(page, perPage, {
            filter: filter,
            expand: 'approved, notes, pending_approval, location',
            sort: `${sort === 'newest' ? '-shift_date' : '+shift_date'}`
        });

        return new NextResponse(JSON.stringify({ shifts }), { status: 200 });
    } catch (error) {
        console.error('Error fetching shifts:', error);
        return new NextResponse(JSON.stringify({ error: "Failed to fetch shifts", details: error }), { status: 500 });
    }
}
