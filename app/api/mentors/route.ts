import { NextResponse } from "next/server";
import Pocketbase from "pocketbase"
export async function GET() {
    const pb = new Pocketbase(process.env.NEXT_PUBLIC_POCKETBASE_URL || 'http://localhost:8080');
    await pb.collection('_superusers').authWithPassword('admin@admin.admin', 'adminadmin');
    const users = await pb.collection('mapapp_users').getList(1, 100);
    return new NextResponse(JSON.stringify({ users }), { status: 200 });
}