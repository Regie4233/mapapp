import { NextRequest, NextResponse } from "next/server";
import Pocketbase, { ClientResponseError } from "pocketbase"

// It's a good practice to use environment variables for credentials
const pbAdminEmail = process.env.POCKETBASE_ADMIN_EMAIL || 'admin@admin.admin';
const pbAdminPassword = process.env.POCKETBASE_ADMIN_PASSWORD || 'adminadmin';

export async function GET() {
    try {
        const pb = new Pocketbase(process.env.NEXT_PUBLIC_POCKETBASE_URL || 'http://localhost:8080');
        await pb.collection('_superusers').authWithPassword(pbAdminEmail, pbAdminPassword);
        const users = await pb.collection('mapapp_users').getList(1, 100);
        return NextResponse.json({ users });
    } catch (error) {
        console.error('Failed to fetch mentors:', error);
        if (error instanceof ClientResponseError) {
            return NextResponse.json({ error: error.message || 'Failed to fetch mentors' }, { status: error.status });
        }
        if (error instanceof Error) {
            return NextResponse.json({ error: error.message || 'Failed to fetch mentors' }, { status: 500 });
        }
        return NextResponse.json(
            { error: 'An unexpected error occurred' },
            { status: 500 }
        );
    }
}

export async function DELETE(request: NextRequest) {
    try {
        const pb = new Pocketbase(process.env.NEXT_PUBLIC_POCKETBASE_URL || 'http://localhost:8080');
        await pb.collection('_superusers').authWithPassword(pbAdminEmail, pbAdminPassword);

        const { id } = await request.json();

        if (!id) {
            return NextResponse.json({ error: 'Mentor ID is required' }, { status: 400 });
        }

        await pb.collection('mapapp_users').delete(id);

        return NextResponse.json({ message: 'Mentor deleted successfully' }, { status: 200 });
    } catch (error) {
        console.error('Failed to delete mentor:', error);
        if (error instanceof ClientResponseError) {
            return NextResponse.json({ error: error.message || 'Failed to delete mentor' }, { status: error.status });
        }
        if (error instanceof Error) {
            return NextResponse.json({ error: error.message || 'Failed to delete mentor' }, { status: 500 });
        }
        return NextResponse.json(
            { error: 'An unexpected error occurred' },
            { status: 500 }
        );
    }
}

export async function PATCH(request: NextRequest) {
    try {
        const pb = new Pocketbase(process.env.NEXT_PUBLIC_POCKETBASE_URL || 'http://localhost:8080');
        await pb.collection('_superusers').authWithPassword(pbAdminEmail, pbAdminPassword);

        const { id, authorized } = await request.json();

        if (!id || typeof authorized !== 'boolean') {
            return NextResponse.json({ error: 'Mentor ID and authorized status are required' }, { status: 400 });
        }

        const updatedMentor = await pb.collection('mapapp_users').update(id, { authorized });

        return NextResponse.json(updatedMentor);
    } catch (error) {
        console.error('Failed to update mentor:', error);
        if (error instanceof ClientResponseError) {
            return NextResponse.json({ error: error.message || 'Failed to update mentor' }, { status: error.status });
        }
        if (error instanceof Error) {
            return NextResponse.json({ error: error.message || 'Failed to update mentor' }, { status: 500 });
        }
        return NextResponse.json(
            { error: 'An unexpected error occurred' },
            { status: 500 }
        );
    }
}
