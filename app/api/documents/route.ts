import PocketBase from "pocketbase";
import { NextResponse } from "next/server";

export async function GET() {
     const pb = new PocketBase(process.env.NEXT_PUBLIC_POCKETBASE_URL || 'http://localhost:8080');
     await pb.collection(process.env.NEXT_PB_ADMIN_COLLECTION || '').authWithPassword(process.env.NEXT_PB_ADMIN_EMAIL || '', process.env.NEXT_PB_ADMIN_PASSWORD || '');
    const records = await pb.collection('mapapp_documents').getList(1, 100, {
        expand: 'files'
    });
    
console.log(records)
    return new NextResponse(JSON.stringify(records), { status: 200 });
}