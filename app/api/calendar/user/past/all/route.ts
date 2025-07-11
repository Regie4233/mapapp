// import { pb } from "@/lib/server/pocketbase";
import { NextRequest, NextResponse } from "next/server";
import Pocketbase from "pocketbase"
export async function GET(request: NextRequest) {
   
    const id = request.nextUrl.searchParams.get("id");
 
    const pb = new Pocketbase(process.env.NEXT_PUBLIC_POCKETBASE_URL || 'http://localhost:8080');
    await pb.collection('_superusers').authWithPassword('admin@admin.admin', 'adminadmin');
    // const date = formatDateToYYYYMMDD_UTC(new Date());
    const date = new Date().toISOString().split('T')[0];
    const shiftp = await pb.collection('mapapp_shift').getList(1, 60, {
        filter: `shift_date < "${date}"`,
        expand: 'approved, notes',
        sort: '-created'
    });

    return new NextResponse(JSON.stringify({ id, shiftp }), { status: 200 });
}

