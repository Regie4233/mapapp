import { NextResponse } from "next/server";
import Pocketbase from "pocketbase";


export async function GET(request: Request, { params }: { params: Promise<{ documentId: string }> }) {
    const contex = await params;
    const pb = new Pocketbase(process.env.NEXT_PUBLIC_POCKETBASE_URL || 'http://localhost:8080');
      await pb.collection(process.env.NEXT_PB_ADMIN_COLLECTION || '').authWithPassword(process.env.NEXT_PB_ADMIN_EMAIL || '', process.env.NEXT_PB_ADMIN_PASSWORD || '');
    console.log(contex.documentId)
      const record = await pb.collection("mapapp_file").getOne(contex.documentId);
    const fileUrl = pb.files.getURL(record, record.file);
    console.log('fileUrl',fileUrl)
    return NextResponse.json({ fileUrl });
}