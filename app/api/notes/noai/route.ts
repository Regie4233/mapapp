import { NextRequest, NextResponse } from 'next/server';
import PocketBase, { ClientResponseError } from 'pocketbase';

const NOTES_COLLECTION = 'mapapp_notes';
const SHIFTS_COLLECTION = 'mapapp_shift';

// Helper for setting up and authenticating with PocketBase
async function getAuthenticatedPbClient() {
    const pb = new PocketBase(process.env.NEXT_PUBLIC_POCKETBASE_URL || 'http://localhost:8080');
    // It's a good practice to check if auth is still valid before re-authenticating
    if (!pb.authStore.isValid) {
        await pb.collection('_superusers').authWithPassword('admin@admin.admin', 'adminadmin');
    }
    return pb;
}

// --- Existing GET Function ---
export async function GET(request: Request) {
    const url = new URL(request.url);
    const shiftId = url.searchParams.get('id');
    if (!shiftId) {
        return NextResponse.json({ error: 'Shift ID is required' }, { status: 400 });
    }
    try {
        const pb = await getAuthenticatedPbClient();
        // Assuming you're fetching the note *record* directly, not the shift
        const note = await pb.collection(NOTES_COLLECTION).getOne(shiftId); // Assuming shiftId is the note's ID here
        if (!note) {
            return NextResponse.json({ error: 'Note not found' }, { status: 404 });
        }
        return NextResponse.json({ note: note }, { status: 200 });
    } catch (error) {
        console.error('Error fetching shift notes:', error);
        if (error instanceof ClientResponseError) {
            return NextResponse.json({ error: error.message }, { status: error.status });
        }
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

// --- Existing POST Function ---
export async function POST(request: NextRequest) {
    const formdata = await request.formData();
    const students = formdata.get('students') as string;
    const workedOnToday = formdata.get('worked_on_today') as string;
    const struggleWithAnything = formdata.get('struggle_with_anything') as string;
    const anyWinsToday = formdata.get('any_wins_today') as string;
    const shiftId = formdata.get('shiftId') as string;
    const mentors = formdata.getAll('mentors') as string[];

    try {
        const pb = await getAuthenticatedPbClient();

        const data = {
            "students": students,
            "worked_on_today": workedOnToday,
            "struggle_with_anything": struggleWithAnything,
            "any_wins_today": anyWinsToday,
            "shift": shiftId,
            "mentors": mentors
        };

        const result = await pb.collection(SHIFTS_COLLECTION).getOne(shiftId, {
            expand: 'notes',
        });

        if (!result) {
            return NextResponse.json({ error: 'Shift not found' }, { status: 404 });
        }

        // If the shift has no notes, create a new one and link it
        if (!result.expand?.notes) {
            const notesRes = await pb.collection(NOTES_COLLECTION).create(data);
            await pb.collection(SHIFTS_COLLECTION).update(result.id, {
                'notes': notesRes.id,
            });
        } else {
            // Otherwise, update the existing note
            await pb.collection(NOTES_COLLECTION).update(result.expand.notes.id, data);
        }

        const updatedShift = await pb.collection(SHIFTS_COLLECTION).getOne(shiftId, {
            expand: 'notes, approved, pending_approval, location',
        });

        return NextResponse.json({ shift: updatedShift }, { status: 200 });
    } catch (error) {
        console.error('Error in POST /api/notes:', error);
        if (error instanceof ClientResponseError) {
            return NextResponse.json({ error: error.message }, { status: error.status });
        }
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

// --- New DELETE Function ---
/**
 * Handles DELETE requests to remove a note.
 * Expects a JSON body with the note's ID and its parent shift's ID.
 * e.g., { "noteId": "NOTE_RECORD_ID", "shiftId": "SHIFT_RECORD_ID" }
 */
export async function DELETE(request: NextRequest) {
    try {
        const { noteId, shiftId } = await request.json();

        // 1. Validate input
        if (!noteId || !shiftId) {
            return NextResponse.json(
                { error: 'Both noteId and shiftId are required in the request body.' },
                { status: 400 }
            );
        }

        // 2. Authenticate
        const pb = await getAuthenticatedPbClient();

        // 3. Unlink the note from the parent shift.
        // This is a crucial step to avoid dangling references in your database.
        // We set the 'notes' relation field on the shift record to null.
        // await pb.collection(SHIFTS_COLLECTION).update(shiftId, {
        //     'notes': null,
        // });

        // 4. Delete the note record from the 'mapapp_notes' collection.
        await pb.collection(NOTES_COLLECTION).delete(noteId);

        // 5. Respond with success
        return NextResponse.json(
            { message: 'Note deleted and unlinked from shift successfully.' },
            { status: 200 }
        );
        
    } catch (error) {
        console.error('Failed to delete note:', error);
        
        if (error instanceof ClientResponseError) {
            return NextResponse.json({ error: error.message }, { status: error.status });
        }
        
        return NextResponse.json(
            { error: 'An unexpected error occurred while deleting the note.' },
            { status: 500 }
        );
    }
}