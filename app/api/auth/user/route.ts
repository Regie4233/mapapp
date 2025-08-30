import { pb } from "@/lib/server/pocketbase";
import { atob } from "buffer";
import { ClientResponseError } from "pocketbase";
import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get('pb_auth');

    if (sessionCookie) {
        try {
            const [header, payload] = sessionCookie.value?.split('.');
            console.log(header)
            const decodedPayload = JSON.parse(atob(payload));
            const user = await pb.collection("mapapp_users").getOne(decodedPayload.id!);

            return new Response(JSON.stringify({ userData: user }))
        } catch (error) {
            console.error("Failed to parse cookie payload:", error);
            return new Response(JSON.stringify({ ses: null }))
        }
    }

}

export async function POST(request: NextRequest) {
    try {
        const formData = await request.formData();

        // Basic validation
        formData.get('firstname');
        formData.get('lastname');
        formData.get('phone');
        const email = formData.get('email');
        const password = formData.get('password');
        const passwordConfirm = formData.get('passwordConfirm');

        if (!email || !password || !passwordConfirm) {
            return NextResponse.json({ message: 'Email, password, and password confirmation are required.' }, { status: 400 });
        }

        if (password !== passwordConfirm) {
            return NextResponse.json({ message: 'Passwords do not match.' }, { status: 400 });
        }

        // Add default privilege if not provided
        if (!formData.has('privilage')) {
            formData.set('privilage', 'limited');
        }

        const newRecord = await pb.collection('mapapp_users').create(formData);

        return NextResponse.json(newRecord, { status: 201 });
    } catch (error) {
        console.error('Error creating user:', error);
        if (error instanceof ClientResponseError) {
            // Provide more specific error messages from PocketBase
            return NextResponse.json(
                { message: error.response.message, data: error.response.data },
                { status: error.status }
            );
        }

        return NextResponse.json({ message: 'Failed to create user account.' }, { status: 500 });
    }
}

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ userId: string }> }) {
    try {
        const { userId } = await params;
        const cookieStore = await cookies();
        const pb_auth = cookieStore.get('pb_auth');

        // Load the auth store from the cookie
        pb.authStore.loadFromCookie(pb_auth?.value || '');

        try {
            // get an up-to-date auth store state by verifying and refreshing the loaded auth model (if any)
            if (!pb.authStore.isValid) return new NextResponse(JSON.stringify({ message: 'Unauthorized' }), { status: 401 });
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
    } catch (error) {
        console.error('Error updating user:', error);
        if (error instanceof ClientResponseError) {
            // Provide more specific error messages from PocketBase
            return NextResponse.json({ message: error.response.message }, { status: error.status });
        }

        return NextResponse.json({ message: 'Failed to update user profile.' }, { status: 500 });
    }
}
