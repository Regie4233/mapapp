import { NextRequest, NextResponse } from "next/server";
import Pocketbase from "pocketbase";

// This route handles creating a new shift
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { location, date, startTime, endTime } = body;

        // Validate input
        if (!location || !date || !startTime || !endTime) {
            return new Response(JSON.stringify({ error: 'Invalid input' }), { status: 400 });
        }

        const pb = new Pocketbase(process.env.NEXT_PUBLIC_POCKETBASE_URL || 'http://localhost:8080');
        await pb.collection('_superusers').authWithPassword('admin@admin.admin', 'adminadmin');

        const newShift = await pb.collection('mapapp_shift').create({
            location: location,
            date: date,
            startTime: startTime,
            endTime: endTime,
            spots: 5, // Default number of spots, adjust as needed
            approved: [],
            pending_approval: [],
        });

        const targetShiftOcc = await pb.collection('mapapp_shiftOccurences').getList(1,1, {
            filter: 'shiftDate == `"${date}"`',
        });

        const shiftOcc = await pb.collection('mapapp_shiftOccurences').update(targetShiftOcc.id, {
            shifts+: [newShift],
        });
            
        //     .getList(1, 1, {
        //     filter: `shifts.id ?~ "${shiftId}"`,
        //     expand: 'shiftLocation, shifts.approved, shifts.pending_approval',
        // });

        return new NextResponse(JSON.stringify(newShift), { status: 201 }); // 201 Created
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

        const res = await pb.collection('mapapp_shift').delete(shiftId);

        return new NextResponse(JSON.stringify({ message: 'Shift deleted successfully' }), { status: 200 });
    } catch (error) {
        console.error('Error:', error);
        return new Response(JSON.stringify({ error: 'Internal Server Error' }), { status: 500 });
    }
}
