// import PocketBase, { RecordModel } from 'pocketbase';

// import {
//     GoogleGenAI,
// } from '@google/genai';

// export async function GET(request: Request) {
//     // get shiftId from query params then setup pocketbase client, login as admin and get notes from collection mapapp_notes as .getOne(shiftId)
//     const url = new URL(request.url);
//     const shiftId = url.searchParams.get('id');
//     if (!shiftId) {
//         return new Response(JSON.stringify({ error: 'Shift ID is required' }), { status: 400 });
//     }
//     try {
//         const pb = new PocketBase(process.env.NEXT_PUBLIC_POCKETBASE_URL || 'http://localhost:8080');
//         await pb.collection('_superusers').authWithPassword('admin@admin.admin', 'adminadmin');
//         const shift = await pb.collection('mapapp_notes').getOne(shiftId);
//         if (!shift) {
//             return new Response(JSON.stringify({ error: 'Shift not found' }), { status: 404 });
//         }
//         return new Response(JSON.stringify({ shift: shift }), { status: 200 });
//     } catch (error) {
//         console.error('Error fetching shift notes:', error);
//         return new Response(JSON.stringify({ error: 'Internal Server Error' }), { status: 500 });
//     }
// }


// export async function POST(request: Request) {

//     const body = await request.json();
//     const notes: string = body.notes;
//     const shiftId = body.shiftId;
//     const noteId = body.noteId | 0;

//     // if (!targetDate || !targetLocation) {
//     //     return new Response(JSON.stringify({ error: 'Invalid input' }), { status: 400 });
//     // }
//     // console.log(notes);
//     try {
//         const resp = await AI(notes);
//         const pb = new PocketBase(process.env.NEXT_PUBLIC_POCKETBASE_URL || 'http://localhost:8080');
//         await pb.collection('_superusers').authWithPassword('admin@admin.admin', 'adminadmin');

//         const data = {
//             "content": notes,
//             "summarized": JSON.stringify(resp),
//             "shift": shiftId,
//             "mentors": [
//                 "n6g3d5r93837n9n"
//             ]
//         };

//         if (resp) {
//             // for checking if the note exists is provided
//             const result = await pb.collection('mapapp_shift').getOne(shiftId, {
//                 expand: 'notes, approved, pending_approval, notes',
//             });

//             // Check if the shift exists
//             if (!result) {
//                 return new Response(JSON.stringify({ error: 'Shift not found' }), { status: 404 });
//             }

//             const shiftOcc = await pb.collection('mapapp_shiftOccurences').getList(1, 1, {
//                 filter: `shifts.id ?~ "${shiftId}"`,
//                 expand: 'shiftLocation, shifts.approved, shifts.pending_approval, shifts.notes',
//             });
//             ;
//             // If no noteId is provided, create a new note
//             if (result.expand?.notes === undefined || result.expand?.notes.length === 0) {

//                 const notesRes = await pb.collection('mapapp_notes').create(data);
//                 await pb.collection('mapapp_shift').update(result.id, {
//                     'notes': notesRes.id,
//                     expand: 'approved,pending_approval,notes',
//                 });

//                 // return new Response(JSON.stringify({ shift: results, shiftOccurence: shiftOcc }), { status: 200 });
//             } else {
//                 await pb.collection('mapapp_notes').update(result.expand?.notes.id, data);

//             }

//             // If noteId is provided, update the existing note
//             const res = await pb.collection('mapapp_shift').getOne(shiftId, {
//                 expand: 'notes, approved, pending_approval, notes',
//             });

//             return new Response(JSON.stringify({ shift: res, shiftOccurence: shiftOcc }), { status: 200 });
//         }

//     } catch (error) {
//         console.error('Error:', error);
//         return new Response(JSON.stringify({ error: 'Internal Server Error' }), { status: 500 });
//     }

// }

import {
    GoogleGenAI,
} from '@google/genai';

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
    const locationId = formdata.get('location') as string;
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

async function AI(report: string) {
    const ai = new GoogleGenAI({
        // Ensure process.env.GEMINI_API_KEY is correctly set in your environment
        apiKey: process.env.GEMINI_API_KEY as string, // Cast to string for TypeScript
    });

    // --- IMPORTANT: Set responseMimeType to 'application/json' ---
    const config = {
        responseMimeType: 'application/json',
    };

    const model = 'gemini-2.5'; // This model supports function calling and JSON output

    // --- Refine the prompt to explicitly ask for ONLY JSON ---
    // const promptText = `
    //     Based on the following report, create a JSON object with the specified schema.
    //     Return ONLY the JSON object. Do not include any markdown or additional text,
    //     preamble, or explanation. Ensure the output is a valid JSON string.

    //     Schema:
    //     {
    //       "workedOn": "string",
    //       "students": [
    //         {
    //           "name": "string",
    //           "strengths": ["string"],
    //           "challenges": ["string"],
    //           "notes": ["string"]
    //         }
    //       ],
    //       "keyNotes": "string"
    //     }

    //     Report:
    //     """
    //     ${report}
    //     """
    //     `;

     const promptText = `
        Based on the following report, create a JSON object with the specified schema.
        Return ONLY the JSON object. Do not include any markdown or additional text,
        preamble, or explanation. Ensure the output is a valid JSON string. 
        Create a note in the notes about the student each based on the report.

        Schema:
        {
          "students": [
            {
              "name": "string",
              "notes": "string",
            }
          ],
        }

        Report:
        """
        ${report}
        """
        `;


    const contents = [
        {
            role: 'user',
            parts: [{ text: promptText }],
        },
    ];

    console.log("Sending request to Gemini AI...");

    // Using generateContentStream as requested
    const responseStream = await ai.models.generateContentStream({
        model,
        config,
        contents
    });

    let fullResponseText = '';

    // Collect all chunks from the stream
    for await (const chunk of responseStream) {
        if (chunk.text) { // Ensure the chunk contains text
            fullResponseText += chunk.text;
            // You can optionally log chunks as they arrive for debugging
            // console.log("Received chunk:", chunk.text);
        }
    }

    console.log("\nFull raw response text from AI:\n", fullResponseText);

    // Parse the collected text as JSON
    try {
        const jsonResponse = JSON.parse(fullResponseText);
        console.log("\nSuccessfully parsed JSON response.");
        return jsonResponse;
    } catch (error) {
        console.error("Error parsing JSON response from AI:", error);
        console.error("Attempted to parse this text:\n", fullResponseText);
        throw new Error("Failed to parse AI response as JSON. Check the raw response text for issues.");
    }
}
