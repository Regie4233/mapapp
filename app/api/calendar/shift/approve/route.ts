import { NextRequest } from "next/server";
import Pocketbase from "pocketbase";

// This function handles the approval of a shift by a user
// It checks if the user is approved for the shift and updates the shift accordingly
// If the user is not approved, it returns an error response
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { shiftId, authUser } = body;
        console.log('Received data:', body);

        // Validate input
        if (!shiftId || !authUser) {
            return new Response(JSON.stringify({ error: 'Invalid input' }), { status: 400 });
        }

        const pb = new Pocketbase(process.env.NEXT_PUBLIC_POCKETBASE_URL || 'http://localhost:8080');
        await pb.collection('_superusers').authWithPassword('admin@admin.admin', 'adminadmin');


        const shift = await pb.collection('mapapp_shift').getOne(shiftId, { expand: 'spots' });
        const availableSpots = shift.spots;

        if (availableSpots <= 0) {
            return new Response(JSON.stringify("No more Available spots to approve " + authUser), { status: 401 });
        }
        const res = await pb.collection('mapapp_shift').update(shiftId, {
            'approved+': [authUser],
            'pending_approval-': [authUser],
            'spots-': 1,
        });

        return new Response(JSON.stringify(res), { status: 200 });
    } catch (error) {
        console.error('Error:', error);
        return new Response(JSON.stringify({ error: 'Internal Server Error' }), { status: 500 });
    }
}

// This route handles the approval of a shift by removing the user from pending approval and adding them to approved.
// It also increments the approved count and decrements the available spots.
export async function DELETE(request: NextRequest) {
    try {
        const body = await request.json();
        const { shiftId, authUser } = body;
        console.log('Received data:', body);

        // Validate input
        if (!shiftId || !authUser) {
            return new Response(JSON.stringify({ error: 'Invalid input' }), { status: 400 });
        }

        const pb = new Pocketbase(process.env.NEXT_PUBLIC_POCKETBASE_URL || 'http://localhost:8080');
       await pb.collection('_superusers').authWithPassword('admin@admin.admin', 'adminadmin');

        const valUser = await pb.collection('mapapp_shift').getOne(shiftId, { expand: 'approved' });
        if(!valUser.approved.includes(authUser)) {
            return new Response(JSON.stringify(`User ${authUser} is not approved for this shift`), { status: 401 });
        }


        const res = await pb.collection('mapapp_shift').update(shiftId, {
            'approved-': [authUser],
            'spots+': 1,
        });

        return new Response(JSON.stringify(res), { status: 200 });
    } catch (error) {
        console.error('Error:', error);
        return new Response(JSON.stringify({ error: 'Internal Server Error' }), { status: 500 });
    }
}