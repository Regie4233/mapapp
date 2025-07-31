import { pb } from "@/lib/server/pocketbase";
import { atob } from "buffer";
import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get('pb_auth');
    
    if (sessionCookie) {
        try {
            const [header, payload] = sessionCookie.value?.split('.');
         
            const decodedPayload = JSON.parse(atob(payload));
            const user = await pb.collection("mapapp_users").getOne(decodedPayload.id!);
          
            return new Response(JSON.stringify({ userData: user }))
        } catch (error) {
            console.error("Failed to parse cookie payload:", error);
            return new Response(JSON.stringify({ ses: null }))
        }
    }

}

export async function PATCH(request: NextRequest, { params }: { params: { userId: string } }) {
    try {
        const { userId } = params;
        const cookieStore = await cookies();
        const pb_auth = cookieStore.get('pb_auth');

        // Load the auth store from the cookie
        pb.authStore.loadFromCookie(pb_auth?.value || '');

        try {
            // get an up-to-date auth store state by verifying and refreshing the loaded auth model (if any)
            if(!pb.authStore.isValid) return new NextResponse(JSON.stringify({ message: 'Unauthorized' }), { status: 401 });
            await pb.collection('mapapp_users').authRefresh();
        } catch (_) {
            // clear the auth store on failed refresh
            pb.authStore.clear();
            console.log("Auth store cleared due to failed refresh", _);
            
            return new NextResponse(JSON.stringify({ message: 'Unauthorized' }), { status: 401 });
        }

        if (!pb.authStore.model) {
            return new NextResponse(JSON.stringify({ message: 'Unauthorized' }), { status: 401 });
        }

        const isAdmin = pb.authStore.model.privilage === 'admin' || pb.authStore.model.privilage === 'manager';
        if (pb.authStore.model.id !== userId && !isAdmin) {
             return new NextResponse(JSON.stringify({ message: 'Forbidden' }), { status: 403 });
        }

        const formData = await request.formData();

        const updatedRecord = await pb.collection('mapapp_users').update(userId, formData);

        if (updatedRecord.avatar) {
            updatedRecord.avatar = pb.files.getURL(updatedRecord, updatedRecord.avatar);
        }

        return NextResponse.json(updatedRecord, { status: 200 });
    } catch (error: any) {
        console.error('Error updating user:', error);
        const response = error.response || {};
        const message = response.message || 'Failed to update user profile.';
        const status = response.status || 500;
        return NextResponse.json({ message }, { status });
    }
}

