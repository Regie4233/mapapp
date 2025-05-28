import { NextRequest, NextResponse } from "next/server";
import Pocketbase from "pocketbase";

// This function handles the Request of a shift by a user for approval.
// It adds the user to the pending approval list for the shift.
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { shiftId, authUser } = body;
        console.log('Received data:', body);
        // // Validate input
        if (!shiftId || !authUser) {
            return new Response(JSON.stringify({ error: 'Invalid input' }), { status: 400 });
        }
        console.log('Shift ID:', shiftId);
        const pb = new Pocketbase(process.env.NEXT_PUBLIC_POCKETBASE_URL || 'http://localhost:8080');
        await pb.collection('_superusers').authWithPassword('admin@admin.admin', 'adminadmin');

        const shift = await pb.collection('mapapp_shift').update(shiftId, {
            'pending_approval+': [authUser],
        });

        const shiftOcc = await pb.collection('mapapp_shiftOccurences').getList(1, 1, {
            filter: `shifts.id ?~ "${shiftId}"`,
            expand: 'shiftLocation, shifts.approved, shifts.pending_approval',
        });


        return new NextResponse(JSON.stringify({shift: shift, shiftOccurence: shiftOcc}), { status: 200 });
        // return new NextResponse(JSON.stringify(shift), { status: 200 });
    } catch (error) {
        console.error('Error in POST /api/calendar/shift:', error);
        return new NextResponse(JSON.stringify({ error: 'Internal Server Error' }), { status: 500 });
    }
}


// This route handles the addition of a user to a shift's pending approval list.
// It allows a user to remove request for a shift.
export async function PATCH(request: NextRequest) {
    try {
        const body = await request.json();
        const { shiftId, authUser } = body;
        console.log('Received data:', body);
        // // Validate input
        if (!shiftId || !authUser) {
            return new Response(JSON.stringify({ error: 'Invalid input' }), { status: 400 });
        }

        const pb = new Pocketbase(process.env.NEXT_PUBLIC_POCKETBASE_URL || 'http://localhost:8080');
        await pb.collection('_superusers').authWithPassword('admin@admin.admin', 'adminadmin');

        const res = await pb.collection('mapapp_shift').update(shiftId, {
            'pending_approval-': [authUser],
        });
         const shiftOcc = await pb.collection('mapapp_shiftOccurences').getList(1, 1, {
            filter: `shifts.id ?~ "${shiftId}"`,
            expand: 'shiftLocation, shifts.approved, shifts.pending_approval',
        });

        return new NextResponse(JSON.stringify({shift: res, shiftOccurence: shiftOcc}), { status: 200 });
    } catch (error) {
        console.error('Error in DELETE /api/calendar/shift:', error);
        return new NextResponse(JSON.stringify({ error: 'Internal Server Error' }), { status: 500 });
    }
}

// an async function GET to check if user is already in pending approval
export async function GET(request: NextRequest) {
    try {
        const shiftId = request.nextUrl.searchParams.get("shiftId");
        const authUser = request.nextUrl.searchParams.get("authUser");

        if (!shiftId || !authUser) {
            return new NextResponse(JSON.stringify({ error: 'Invalid input' }), { status: 400 });
        }

        const pb = new Pocketbase(process.env.NEXT_PUBLIC_POCKETBASE_URL || 'http://localhost:8080');
        await pb.collection('_superusers').authWithPassword('admin@admin.admin', 'adminadmin');

        const shift = await pb.collection('mapapp_shift').getOne(shiftId);
        const isPending = shift.pending_approval.includes(authUser);
        return new NextResponse(JSON.stringify({ isPending }), { status: 200 });
    } catch (error) {
        console.error('Error in GET /api/calendar/shift:', error);
        return new NextResponse(JSON.stringify({ error: 'Internal Server Error' }), { status: 500 });
    }
}