import { NextRequest, NextResponse } from "next/server";
import Pocketbase, { ClientResponseError } from "pocketbase";

// It's a good practice to use environment variables for credentials
const pbAdminEmail = process.env.NEXT_PB_ADMIN_EMAIL || 'admin@admin.admin';
const pbAdminPassword = process.env.NEXT_PB_ADMIN_PASSWORD || 'adminadmin';
const STUDENTS_COLLECTION = 'mapapp_students';

/**
 * Handles GET requests to fetch all students.
 */
export async function GET() {
    try {
        const pb = new Pocketbase(process.env.NEXT_PUBLIC_POCKETBASE_URL || 'http://localhost:8080');
        await pb.collection('_superusers').authWithPassword(pbAdminEmail, pbAdminPassword);
        
        const records = await pb.collection(STUDENTS_COLLECTION).getFullList({
            expand: 'location',
            sort: '-created',
        });

        return NextResponse.json(records);
    } catch (error) {
        console.error('Failed to fetch students:', error);
        if (error instanceof ClientResponseError) {
            return NextResponse.json({ error: error.message || 'Failed to fetch students' }, { status: error.status });
        }
        if (error instanceof Error) {
            return NextResponse.json({ error: error.message || 'Failed to fetch students' }, { status: 500 });
        }
        return NextResponse.json(
            { error: 'An unexpected error occurred while fetching students' },
            { status: 500 }
        );
    }
}

/**
 * Handles POST requests to create a new student.
 * Expects a JSON body with student data (e.g., { firstname: 'John', email: 'john@example.com' }).
 */
export async function POST(request: NextRequest) {
    try {
        const pb = new Pocketbase(process.env.NEXT_PUBLIC_POCKETBASE_URL || 'http://localhost:8080');
        await pb.collection('_superusers').authWithPassword(pbAdminEmail, pbAdminPassword);
        
        const data = await request.json();

        // Basic validation: ensure required fields are present
        if (!data.firstname || !data.email) {
            return NextResponse.json({ error: 'Missing required fields (e.g., firstname, email)' }, { status: 400 });
        }

        const newRecord = await pb.collection(STUDENTS_COLLECTION).create(data);
        return NextResponse.json(newRecord, { status: 201 });
    } catch (error) {
        console.error('Failed to create student:', error);
        if (error instanceof ClientResponseError) {
            return NextResponse.json({ error: error.message || 'Failed to create student' }, { status: error.status });
        }
        if (error instanceof Error) {
            return NextResponse.json({ error: error.message || 'Failed to create student' }, { status: 500 });
        }
        return NextResponse.json(
            { error: 'An unexpected error occurred while creating the student' },
            { status: 500 }
        );
    }
}

/**
 * Handles DELETE requests to remove a student.
 * Expects a JSON body with the student's ID (e.g., { "id": "RECORD_ID" }).
 */
export async function DELETE(request: NextRequest) {
    try {
        const pb = new Pocketbase(process.env.NEXT_PUBLIC_POCKETBASE_URL || 'http://localhost:8080');
        await pb.collection('_superusers').authWithPassword(pbAdminEmail, pbAdminPassword);

        const { id } = await request.json();

        if (!id) {
            return NextResponse.json({ error: 'Student ID is required' }, { status: 400 });
        }

        await pb.collection(STUDENTS_COLLECTION).delete(id);

        return NextResponse.json({ message: 'Student deleted successfully' }, { status: 200 });
    } catch (error) {
        console.error('Failed to delete student:', error);
        if (error instanceof ClientResponseError) {
            return NextResponse.json({ error: error.message || 'Failed to delete student' }, { status: error.status });
        }
        if (error instanceof Error) {
            return NextResponse.json({ error: error.message || 'Failed to delete student' }, { status: 500 });
        }
        return NextResponse.json(
            { error: 'An unexpected error occurred while deleting the student' },
            { status: 500 }
        );
    }
}