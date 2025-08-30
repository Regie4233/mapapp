import { NextResponse } from "next/server";
import Pocketbase from "pocketbase";


export async function GET(request: Request, { params }: { params: Promise<{ documentId: string }> }) {
  console.log(request)
    const contex = await params;
    const pb = new Pocketbase(process.env.NEXT_PUBLIC_POCKETBASE_URL || 'http://localhost:8080');
      await pb.collection(process.env.NEXT_PB_ADMIN_COLLECTION || '').authWithPassword(process.env.NEXT_PB_ADMIN_EMAIL || '', process.env.NEXT_PB_ADMIN_PASSWORD || '');
    console.log(contex.documentId)
      const record = await pb.collection("mapapp_file").getOne(contex.documentId);
    const fileUrl = pb.files.getURL(record, record.file);
    console.log('fileUrl',fileUrl)
    // return NextResponse.json({ fileUrl });
    return new NextResponse(fileUrl)
}

export async function DELETE(request: Request, { params }: { params: Promise<{ documentId: string }> }) {
    console.log(request)
    const { documentId } = await params;
    const pb = new Pocketbase(process.env.NEXT_PUBLIC_POCKETBASE_URL || 'http://localhost:8080');
    await pb.collection(process.env.NEXT_PB_ADMIN_COLLECTION || '').authWithPassword(process.env.NEXT_PB_ADMIN_EMAIL || '', process.env.NEXT_PB_ADMIN_PASSWORD || '');

    try {
        // Find the category that contains the document
        const category = await pb.collection('mapapp_documents').getFirstListItem(`files ~ "${documentId}"`);

        // Remove the document from the category's files array
        const newFiles = category.files.filter((id: string) => id !== documentId);
        await pb.collection('mapapp_documents').update(category.id, { files: newFiles });

        // Delete the document itself
        await pb.collection('mapapp_file').delete(documentId);

        return new NextResponse("Document deleted successfully", { status: 200 });
    } catch (error) {
        console.error("Document deletion failed:", error);
        return new NextResponse("Document deletion failed", { status: 500 });
    }
}