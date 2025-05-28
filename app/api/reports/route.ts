import PocketBase from 'pocketbase';

import {
    GoogleGenAI,
} from '@google/genai';


export async function POST(request: Request) {

    const body = await request.json();
    const  report  = body.report;
    const shiftId = body.shiftId;

    // if (!targetDate || !targetLocation) {
    //     return new Response(JSON.stringify({ error: 'Invalid input' }), { status: 400 });
    // }
    console.log(report);
    try {
           const resp = await AI(report);
        // const pb = new PocketBase(process.env.NEXT_PUBLIC_POCKETBASE_URL || 'http://localhost:8080');
        // await pb.collection('_superusers').authWithPassword('admin@admin.admin', 'adminadmin');
        // const res = await pb.collection('mapapp_report').getList(1, 50, {
        //     filter: `targetDate = "${targetDate}" && targetLocation = "${targetLocation}"`,
        // })
        return new Response(JSON.stringify(resp), { status: 200 });
    } catch (error) {
        console.error('Error:', error);
        return new Response(JSON.stringify({ error: 'Internal Server Error' }), { status: 500 });
    }

}

// To run this code you need to install the following dependencies:
// npm install @google/genai mime
// npm install -D @types/node

async function AI(report: string) {
    const ai = new GoogleGenAI({
        apiKey: process.env.GEMINI_API_KEY,
    });
    const config = {
        responseMimeType: 'text/plain',
    };
    const model = 'gemini-2.5-flash-preview-05-20';
    const contents = [
        {
            role: 'user',
            parts:
                [
                    {
                        text: `create a JSON format, array of students, object for worked on that day and object for key notes for the day:
Schema:
{
workedOn: "",
students: [{}],
keyNotes: ""
}` + report,
                    },
                ],
        },
    ];

    const response = await ai.models.generateContentStream({
        model,
        config,
        contents,
    });
    let fileIndex = 0;
    for await (const chunk of response) {
        console.log(chunk.text);
    }
    return response; // Assuming the response is in text format
}


export async function GET(request: Request) {
    return new Response(JSON.stringify({ message: 'GET method not implemented' }), { status: 200 });
}