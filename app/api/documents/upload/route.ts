import { NextRequest, NextResponse } from "next/server";
import Pocketbase from "pocketbase";
// import { initPocketBase } from "@/lib/server/pocketbase";

export async function POST(request: NextRequest) {
    const pb = new Pocketbase(process.env.NEXT_PUBLIC_POCKETBASE_URL || 'http://localhost:8080');
    // const user = pb.authStore.model;

    // if (!user || (user.privilage !== 'admin' && user.privilage !== 'manager')) {
    //     return new NextResponse("Unauthorized", { status: 401 });
    // }

    const formData = await request.formData();
    const file = formData.get("file") as File;

    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const category = formData.get("category") as string;
    const newCategoryTitle = formData.get("newCateTitle") as string;

    console.log(category)
    console.log(newCategoryTitle)

    if (!file || !category) {
        return new NextResponse("Missing file or category", { status: 400 });
    } else if (file && (!title || title.length <= 0)) {
        return new NextResponse("Missing Title for the file", { status: 400 });
    }
    if (category === 'new' && (newCategoryTitle.length <= 0 || newCategoryTitle === null)) {
        return new NextResponse("Missing category name", { status: 400 });
    }

    try {
        await pb.collection(process.env.NEXT_PB_ADMIN_COLLECTION || '').authWithPassword(process.env.NEXT_PB_ADMIN_EMAIL || '', process.env.NEXT_PB_ADMIN_PASSWORD || '')
        if (category === 'new') {
            const newCate = await pb.collection('mapapp_documents').create({
                categoryName: newCategoryTitle,
            });

            const newDocument = await pb.collection('mapapp_file').create({
                title: title,
                description: description,
                file: file,
            });
            await pb.collection('mapapp_documents').update(newCate.id, {
                "files+": newDocument.id,
            });
        } else {
            const categoryRecord = await pb.collection('mapapp_documents').getFirstListItem(`categoryName ~ "${category}"`);

            if (!categoryRecord || categoryRecord === null) {
                return new NextResponse("Category not found", { status: 400 });
            }

            const newDocument = await pb.collection('mapapp_file').create({
                title: title,
                description: description,
                file: file,
            });

            await pb.collection('mapapp_documents').update(categoryRecord.id, {
                "files+": newDocument.id,
            });
        }




        return new NextResponse("File uploaded successfully", { status: 200 });
    } catch (error) {
        console.error("File upload failed:", error);
        return new NextResponse("File upload failed", { status: 500 });
    }
}


