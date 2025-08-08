import { DocumentCategory } from "@/lib/type";
import { NextRequest, NextResponse } from "next/server";
import Pocketbase from "pocketbase";

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ categoryName: string }> }) {
    const pb = new Pocketbase(process.env.NEXT_PUBLIC_POCKETBASE_URL || 'http://localhost:8080');
    const context = await params;
    try {
        await pb.collection(process.env.NEXT_PB_ADMIN_COLLECTION || '').authWithPassword(process.env.NEXT_PB_ADMIN_EMAIL || '', process.env.NEXT_PB_ADMIN_PASSWORD || '')
        const docs = await pb.collection('mapapp_documents').getFullList({ filter: `categoryName ~ "${context.categoryName}"` });
        const targetCate = docs[0] as Partial<DocumentCategory>;

        if (docs[0].expand?.files.length > 0) {
            const batch = pb.createBatch()
            targetCate.files?.forEach(element => {
                console.log(element);
                batch.collection('mapapp_file').delete(element);
            });
            await batch.send();
        }
        await pb.collection('mapapp_documents').delete(docs[0].id);
        return new NextResponse("Category deleted successfully", { status: 200 });
    } catch (error) {
        console.error("Category deletion failed:", error);
        return new NextResponse("Category deletion failed", { status: 500 });
    }
}


// export async function DELETE(request: Request) {

//     const body = await request.json();

//     const { collectionName, targetId } = body;

//     const pb = new Pocketbase(process.env.NEXT_PUBLIC_POCKETBASE_URL || 'http://localhost:8080');


//     try {
//        await pb.collection(process.env.NEXT_PB_ADMIN_COLLECTION || '').authWithPassword(process.env.NEXT_PB_ADMIN_EMAIL || '', process.env.NEXT_PB_ADMIN_PASSWORD || '')
//         if(collectionName === 'mapapp_documents'){
//             const docs = pb.collection(collectionName).getFullList();
//             console.log(docs)
//         }
//         //    await pb.collection(collectionName).delete(targetId);
//         // await pb.collection('mapapp_documents').delete(params.documentId);
//         return new NextResponse("Document deleted successfully", { status: 200 });
//     } catch (error) {
//         console.error("Document deletion failed:", error);
//         return new NextResponse("Document deletion failed", { status: 500 });
//     }
// }