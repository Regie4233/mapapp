
import {
    GoogleGenAI,
} from '@google/genai';

import { NextRequest, NextResponse } from 'next/server';
import PocketBase, { ClientResponseError } from 'pocketbase';

const NOTES_COLLECTION = 'mapapp_notes';
// const SHIFTS_COLLECTION = 'mapapp_shift';

type NoteResponse = {
    students: StudentNote[];
}

type StudentNote = {
    name: string;
    notes: string;
}

// Helper for setting up and authenticating with PocketBase
async function getAuthenticatedPbClient() {
    const pb = new PocketBase(process.env.NEXT_PUBLIC_POCKETBASE_URL || 'http://localhost:8080');
    // It's a good practice to check if auth is still valid before re-authenticating
    if (!pb.authStore.isValid) {
 await pb.collection(process.env.NEXT_PB_ADMIN_COLLECTION || '').authWithPassword(process.env.NEXT_PB_ADMIN_EMAIL || '', process.env.NEXT_PB_ADMIN_PASSWORD || '');
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
    const otherNotes = formdata.get('otherNotes') as string;
    const noteDate = formdata.get('noteDate') as string;
    try {
        const pb = await getAuthenticatedPbClient();
        console.log(locationId, "Location ID for AI processing");
        const data = {
            "students": students,
            "worked_on_today": workedOnToday,
            "struggle_with_anything": struggleWithAnything,
            "any_wins_today": anyWinsToday,
            "shift": shiftId,
            "mentors": mentors,
            "otherNotes": otherNotes,
        };

        console.log(data)

        const notesData = `[Date: ${noteDate}] ${students}. ${workedOnToday}. ${struggleWithAnything}. ${anyWinsToday}`;

        const summarizedNotes: NoteResponse = await AI(notesData, 'notes');
        if (summarizedNotes.students.length > 0) {
            const studentFilter = summarizedNotes.students
                .map(student => `name ?~ "${student.name.replace(/"/g, '""')}"`)
                .join(' || ');
            console.log("Student Filter for AI:", studentFilter);
            const filter = `${studentFilter} && location.id ~ "${locationId}"`;
            const studentsList = await pb.collection('mapapp_students').getFullList({ filter });
            console.log("Found students:", studentsList);
            // const batch = pb.createBatch();

            const updatePayloads = await Promise.all(
                studentsList.map(async (element) => {
                    const student = summarizedNotes.students.find((s) => s.name === element.name);
                    const index = summarizedNotes.students.findIndex((s) => s.name === element.name);
                    if (index !== -1) summarizedNotes.students.splice(index, 1)
                    if (student) {
                        console.log(`Processing AI for: ${element.name}`);
                        const studentOverview = await AI(`${element.note}. [Post Date:${noteDate}] ${student.notes}`, 'overview');
                        console.log({ name: element.name, note: studentOverview.summary });

                        return { id: element.id, notes: studentOverview.summary };
                    }
                    console.log(`No AI summary found for student: ${element.name}`);

                    return null;
                })
            );
            const batch = pb.createBatch();
            if (summarizedNotes.students.length > 0) {
                console.log("Some students were not found in the database:", summarizedNotes.students);
                summarizedNotes.students.forEach(student => {
                    batch.collection('mapapp_students').create({
                        name: student.name,
                        note: student.notes,
                        location: locationId,
                    });
                });
            }
            // 2. Create a batch request for all database updates

            updatePayloads
                .forEach(payload => {
                    if (!payload) return; // Skip null payloads
                    console.log(`Updating student ${payload.id} with notes: ${payload.notes}`);
                    batch.collection('mapapp_students').update(payload.id, {
                        "note": payload.notes,
                    });
                });

            // 3. Send the single batch request
            if (batch.collection.length > 0) {
                console.log(`Sending batch update for ${batch.collection.length} students...`);
                const result = await batch.send();
                console.log("Batch update result:", result);
            }



            // studentsList.forEach(async (element) => {
            //     const student = summarizedNotes.students.find((student) => student.name === element.name);
            //     if (student) {
            //         console.log(`${element.note}. [Post Date:${noteDate}]${student.notes}`);
            //         const studentOverview = await AI(`${element.note}. [Post Date:${noteDate}] ${student.notes}`, 'overview');
            //         console.log("Student Overview:", studentOverview);
            //         // batch.collection('mapapp_students').update(element.id, {
            //         //     "notes": studentOverview,
            //         // });
            //        const yyy = await pb.collection('mapapp_students').update(element.id, {
            //              "notes": studentOverview,
            //         });
            //         console.log("Updated student notes:", yyy);
            //     }
            // });

            // const result = await batch.send();
            // console.log(result)
        }


        // -------------------------------
        // const result = await pb.collection(SHIFTS_COLLECTION).getOne(shiftId, {
        //     expand: 'notes',
        // });

        // if (!result) {
        //     return NextResponse.json({ error: 'Shift not found' }, { status: 404 });
        // }

        // // If the shift has no notes, create a new one and link it
        // if (!result.expand?.notes) {
        //     const notesRes = await pb.collection(NOTES_COLLECTION).create(data);
        //     await pb.collection(SHIFTS_COLLECTION).update(result.id, {
        //         'notes': notesRes.id,
        //     });
        // } else {
        //     // Otherwise, update the existing note
        //     await pb.collection(NOTES_COLLECTION).update(result.expand.notes.id, data);
        // }

        // const updatedShift = await pb.collection(SHIFTS_COLLECTION).getOne(shiftId, {
        //     expand: 'notes, approved, pending_approval, location',
        // });


        // return NextResponse.json({ shift: updatedShift }, { status: 200 });
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

async function AI(report: string, typePrompt: string = 'notes') {
    const ai = new GoogleGenAI({
        // Ensure process.env.GEMINI_API_KEY is correctly set in your environment
        apiKey: process.env.GEMINI_API_KEY as string, // Cast to string for TypeScript
    });

    // --- IMPORTANT: Set responseMimeType to 'application/json' ---
    const config = {
        responseMimeType: 'application/json',
    };

    // const model = 'gemini-2.5-pro';
    const model = 'gemini-2.5-flash-lite'
   


    let promptText;
    switch (typePrompt) {
        case 'notes':
            promptText = `
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
            break;
        case 'overview':
            promptText = `
            Based on the following report, write a paragraph summaryzing the report.
            Return ONLY the summary text that makes it others to read about the student. 
            There are old report about the student, the most recent report is the more accurate one. 
            Check the dates of the reports to see which one is the most recent.
            Combine the old report and the most recent report to create a summary.
            Return a single string. Do not include any markdown or additional text.
            Include the date of the report in the summary, example [Post Date: YYYY-MM-DD Time: HH:MM].

            schema:
            {
            "summary": "string",
            }

            Report:
            """
            ${report}
            """
            `;
            break;
        default:
            throw new Error(`Unknown typePrompt: ${typePrompt}`);
    }

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
    console.log(typePrompt === 'notes' ? "\nExtracting Notes:\n" : "\nCreating summary response text from AI:\n");
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
