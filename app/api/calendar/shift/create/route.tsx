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
        const { location, date, shift_start, shift_end, title, mentorIds, spots } = body;
        const mentorsToAssign = mentorIds.split(", ")
        // Validate input
        if (!location || !date || !shift_start || !shift_end) {
            return new Response(JSON.stringify({ error: 'Invalid input' }), { status: 400 });
        }

        console.log(location, shift_start, shift_end, date, title, spots);
        console.log(mentorsToAssign)


        const pb = new Pocketbase(process.env.NEXT_PUBLIC_POCKETBASE_URL || 'http://localhost:8080');
      await pb.collection(process.env.NEXT_PB_ADMIN_COLLECTION || '').authWithPassword(process.env.NEXT_PB_ADMIN_EMAIL || '', process.env.NEXT_PB_ADMIN_PASSWORD || '');
        const shiftDate = new Date(date);
        shiftDate.setUTCHours(0, 0, 0, 0);

        const targetLocation = await pb.collection('mapapp_location').getFirstListItem(`name ~ '${location}'`);
        console.log(targetLocation)
        const data = {
            "location": targetLocation.id,
            "shift_date": shiftDate,
            "shift_start": shift_start,
            "shift_end": shift_end,
            "spots": spots || 2,
            "title": title || "Session",
            "approved+": mentorsToAssign
        };

        const targetShiftOcc = await pb.collection('mapapp_shiftOccurences').getList(1, 1, {
            filter:
                `shiftDate ~ '${shiftDate.toISOString().split('T')[0]}' && shiftLocation.id ~ '${targetLocation.id}'`,
        }
        );
        console.log(targetShiftOcc)
        if (targetShiftOcc.items.length <= 0) {
            const newShiftOcc = await pb.collection('mapapp_shiftOccurences').create({
                "shiftDate": shiftDate,
                "shiftLocation": targetLocation.id,
                "shifts": []
            });
            const newShift = await pb.collection('mapapp_shift').create(data);
            await pb.collection('mapapp_shiftOccurences').update(newShiftOcc.id, {
                'shifts+': [newShift.id],
            });


            const shiftOcc = await pb.collection('mapapp_shiftOccurences').getList(1, 1, {
                filter: `shifts.id ?~ "${newShift.id}"`,
                expand: 'shiftLocation, shifts.approved, shifts.pending_approval, shifts.notes',
            });
            await pb.collection('mapapp_location').update(targetLocation.id, {
                'shiftOccurences+': [shiftOcc.items[0].id],
            });

            return new NextResponse(JSON.stringify({ shift: newShift, shiftOccurence: shiftOcc }), { status: 200 });

        } else {
            const newShift = await pb.collection('mapapp_shift').create(data);

            await pb.collection('mapapp_shiftOccurences').update(targetShiftOcc.items[0].id, {
                'shifts+': [newShift.id],
            });

            await pb.collection('mapapp_location').update(targetLocation.id, {
                'shiftOccurences+': [targetShiftOcc.items[0].id],
            });
            const shiftOcc = await pb.collection('mapapp_shiftOccurences').getList(1, 1, {
                filter: `shifts.id ?~ "${newShift.id}"`,
                expand: 'shiftLocation, shifts.approved, shifts.pending_approval, shifts.notes',
            });
            console.log(shiftOcc)

            return new NextResponse(JSON.stringify({ shift: newShift, shiftOccurence: shiftOcc }), { status: 200 });
        }

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
     await pb.collection(process.env.NEXT_PB_ADMIN_COLLECTION || '').authWithPassword(process.env.NEXT_PB_ADMIN_EMAIL || '', process.env.NEXT_PB_ADMIN_PASSWORD || '');
        const shiftOccurence = await pb.collection('mapapp_shiftOccurences').getFirstListItem(`shifts.id ?~ "${shiftId}"`,
            {
                expand: 'shiftLocation, shifts.approved, shifts.pending_approval, shifts.notes, shifts.location',
                sort: 'shiftDate',
            });
        await pb.collection('mapapp_shift').delete(shiftId);


        return new NextResponse(JSON.stringify({ message: 'Shift deleted successfully', deletedShiftId: shiftId, shiftOccurence: shiftOccurence }), { status: 200 });
    } catch (error) {
        console.error('Error:', error);
        return new Response(JSON.stringify({ error: 'Internal Server Error' }), { status: 500 });
    }
}
