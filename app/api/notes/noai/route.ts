
import { NextRequest } from 'next/server';
import PocketBase from 'pocketbase';
export async function GET(request: Request) {
    // get shiftId from query params then setup pocketbase client, login as admin and get notes from collection mapapp_notes as .getOne(shiftId)
    const url = new URL(request.url);
    const shiftId = url.searchParams.get('id');
    if (!shiftId) {
        return new Response(JSON.stringify({ error: 'Shift ID is required' }), { status: 400 });
    }
    try {
        const pb = new PocketBase(process.env.NEXT_PUBLIC_POCKETBASE_URL || 'http://localhost:8080');
        await pb.collection('_superusers').authWithPassword('admin@admin.admin', 'adminadmin');
        const shift = await pb.collection('mapapp_notes').getOne(shiftId);
        if (!shift) {
            return new Response(JSON.stringify({ error: 'Shift not found' }), { status: 404 });
        }
        return new Response(JSON.stringify({ shift: shift }), { status: 200 });
    } catch (error) {
        console.error('Error fetching shift notes:', error);
        return new Response(JSON.stringify({ error: 'Internal Server Error' }), { status: 500 });
    }
}


export async function POST(request: NextRequest) {

    const formdata = await request.formData();
    const students = formdata.get('students') as string;
    const workedOnToday = formdata.get('worked_on_today') as string;
    const struggleWithAnything = formdata.get('struggle_with_anything') as string;
    const anyWinsToday = formdata.get('any_wins_today') as string;
    const shiftId = formdata.get('shiftId') as string;
    const mentors = formdata.getAll('mentors') as string[];
    const nodeId = formdata.get('noteId') as string;
    console.log(mentors);
    // return new Response(JSON.stringify({ students, workedOnToday, struggleWithAnything, anyWinsToday, shiftId }), { status: 200 });

    // const shiftId = body.shiftId;
    const noteId = nodeId || 0;

    // if (!targetDate || !targetLocation) {
    //     return new Response(JSON.stringify({ error: 'Invalid input' }), { status: 400 });
    // }
    // console.log(notes);
    try {
        const pb = new PocketBase(process.env.NEXT_PUBLIC_POCKETBASE_URL || 'http://localhost:8080');
        await pb.collection('_superusers').authWithPassword('admin@admin.admin', 'adminadmin');

        const data = {
            // "content": notes,
            "students": students,
            "worked_on_today": workedOnToday,
            "struggle_with_anything": struggleWithAnything,
            "any_wins_today": anyWinsToday,
            "shift": shiftId,
            "mentors": mentors
        };

        const result = await pb.collection('mapapp_shift').getOne(shiftId, {
            expand: 'notes, approved, pending_approval',
        });

        // Check if the shift exists
        if (!result) {
            return new Response(JSON.stringify({ error: 'Shift not found' }), { status: 404 });
        }

        const shiftOcc = await pb.collection('mapapp_shiftOccurences').getList(1, 1, {
            filter: `shifts.id ?~ "${shiftId}"`,
            expand: 'shiftLocation, shifts.approved, shifts.pending_approval, shifts.notes',
        });
        ;
        // If no noteId is provided, create a new note
        if (result.expand?.notes === undefined || result.expand?.notes.length === 0) {

            const notesRes = await pb.collection('mapapp_notes').create(data);
            await pb.collection('mapapp_shift').update(result.id, {
                'notes': notesRes.id,
                expand: 'approved,pending_approval,notes',
            });

            // return new Response(JSON.stringify({ shift: results, shiftOccurence: shiftOcc }), { status: 200 });
        } else {
            await pb.collection('mapapp_notes').update(result.expand?.notes.id, data);

        }

        // If noteId is provided, update the existing note
        const res = await pb.collection('mapapp_shift').getOne(shiftId, {
            expand: 'notes, approved, pending_approval, location',
        });
        console.log(res);
        return new Response(JSON.stringify({ shift: res, shiftOccurence: shiftOcc }), { status: 200 });

    } catch (error) {
        console.error('Error:', error);
        return new Response(JSON.stringify({ error: 'Internal Server Error' }), { status: 500 });
    }

}