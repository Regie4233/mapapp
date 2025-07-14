import { NextRequest, NextResponse } from "next/server";
import Pocketbase from "pocketbase";

/**
 * Handles POST requests to create a new shift.
 * This endpoint creates a new shift record, finds the corresponding location,
 * and associates the new shift with a shift occurrence.
 * @param {NextRequest} request The incoming request object. The body should be a JSON object containing the shift details.
 * @param {string} request.body.location The name of the location for the shift.
 * @param {string} request.body.shift_date The date of the shift in a string format (e.g., 'YYYY-MM-DD').
 * @param {string} request.body.shift_start The start time of the shift.
 * @param {string} request.body.shift_end The end time of the shift.
 * @param {string} [request.body.title] An optional title for the shift. Defaults to "Session".
 * @param {string} request.body.mentorId The ID of the mentor to be automatically approved for this new shift.
 * @param {number} request.body.spots Number of available spots for this shift
 * @returns {NextResponse} A response containing the newly created shift object with a 201 status code, or an error response.
 */
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { location, shift_date, shift_start, shift_end, title, mentorId, spots } = body;

        // Validate input
        if (!location || !shift_date || !shift_start || !shift_end) {
            return new Response(JSON.stringify({ error: 'Invalid input' }), { status: 400 });
        }

        const pb = new Pocketbase(process.env.NEXT_PUBLIC_POCKETBASE_URL || 'http://localhost:8080');
        await pb.collection('_superusers').authWithPassword('admin@admin.admin', 'adminadmin');
        const shiftDate = new Date(shift_date);
        // shiftDate.setHours(4, 0, 0, 0);

        const targetLocation = await pb.collection('mapapp_location').getFirstListItem(`name ~ '${location}'`);
       
        const data = {
            "location": targetLocation.id,
            "shift_date": shiftDate,
            "shift_start": shift_start,
            "shift_end": shift_end,
            "spots": spots || 2,
            "title": title || "Session",
            "approved+": [mentorId]
        };
 

        const newShift = await pb.collection('mapapp_shift').create(data);

        const targetShiftOcc = await pb.collection('mapapp_shiftOccurences').getFirstListItem(
            `shiftDate ~ '2025-07-30' && shiftLocation.name ~ 'Main Office'`,
        );
     
        const updatedShiftOcc = await pb.collection('mapapp_shiftOccurences').update(targetShiftOcc.id, {
            'shifts+': [newShift.id],
        });

   
        return new NextResponse(JSON.stringify(updatedShiftOcc), { status: 201 }); // 201 Created
    } catch (error) {
        console.error('Error:', error);
        return new Response(JSON.stringify({ error: 'Internal Server Error' }), { status: 500 });
    }
}

// This route handles deleting a shift
export async function DELETE(request: NextRequest) {
    try {
        const body = await request.json();
        const { shiftId } = body;

        // Validate input
        if (!shiftId) {
            return new Response(JSON.stringify({ error: 'Invalid input' }), { status: 400 });
        }

        const pb = new Pocketbase(process.env.NEXT_PUBLIC_POCKETBASE_URL || 'http://localhost:8080');
        await pb.collection('_superusers').authWithPassword('admin@admin.admin', 'adminadmin');

        await pb.collection('mapapp_shift').delete(shiftId);

        return new NextResponse(JSON.stringify({ message: 'Shift deleted successfully' }), { status: 200 });
    } catch (error) {
        console.error('Error:', error);
        return new Response(JSON.stringify({ error: 'Internal Server Error' }), { status: 500 });
    }
}
