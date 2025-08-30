import { NextRequest, NextResponse } from "next/server";
import Pocketbase, { ClientResponseError } from "pocketbase";

// Constants
const pb = new Pocketbase(process.env.NEXT_PUBLIC_POCKETBASE_URL || 'http://localhost:8080');
const pbAdminEmail = process.env.NEXT_PB_ADMIN_EMAIL || 'admin@admin.admin';
const pbAdminPassword = process.env.NEXT_PB_ADMIN_PASSWORD || 'adminadmin';
const SITES_COLLECTION = 'mapapp_location';

// Helper to authenticate with PocketBase
async function authenticatePB() {
    // Check if auth is valid to avoid re-authenticating on every request
    if (!pb.authStore.isValid) {
        await pb.collection('_superusers').authWithPassword(pbAdminEmail, pbAdminPassword);
    }
}

// Helper for error handling
function handleError(error: unknown, defaultMessage: string, defaultStatus: number = 500) {
    console.error(defaultMessage, error);
    if (error instanceof ClientResponseError) {
        return NextResponse.json({ error: error.message || defaultMessage }, { status: error.status });
    }
    return NextResponse.json({ error:  error instanceof Error ? error.message : defaultMessage }, { status: defaultStatus });
}

/**
 * GET /api/sites
 * Fetches all sites.
 */
export async function GET() {
    try {
        await authenticatePB();
        const records = await pb.collection(SITES_COLLECTION).getFullList({
            sort: 'name', // Sort alphabetically by name
        });
        return NextResponse.json(records);
    } catch (error) {
        return handleError(error, 'Failed to fetch sites.');
    }
}

/**
 * POST /api/sites
 * Creates a new site.
 * Expects { name: string, address: string }
 */
export async function POST(request: NextRequest) {
    try {
        await authenticatePB();
        const data = await request.json();

        if (!data.name || !data.address) {
            return NextResponse.json({ error: 'Name and address are required' }, { status: 400 });
        }

        const newRecord = await pb.collection(SITES_COLLECTION).create(data);
        return NextResponse.json(newRecord, { status: 201 });
    } catch (error) {
        return handleError(error, 'Failed to create site.');
    }
}

/**
 * PATCH /api/sites
 * Updates an existing site.
 * Expects { id: string, name?: string, address?: string }
 */
export async function PATCH(request: NextRequest) {
    try {
        await authenticatePB();
        const { id, ...data } = await request.json();

        if (!id) {
            return NextResponse.json({ error: 'Site ID is required' }, { status: 400 });
        }
        if (Object.keys(data).length === 0) {
            return NextResponse.json({ error: 'No update data provided' }, { status: 400 });
        }

        const updatedRecord = await pb.collection(SITES_COLLECTION).update(id, data);
        return NextResponse.json(updatedRecord);
    } catch (error) {
        return handleError(error, 'Failed to update site.');
    }
}

/**
 * DELETE /api/sites
 * Deletes a site.
 * Expects { id: string }
 */
export async function DELETE(request: NextRequest) {
    try {
        await authenticatePB(); // Ensure admin is authenticated
        const { id } = await request.json();

        if (!id) {
            return NextResponse.json({ error: 'Site ID is required' }, { status: 400 });
        }

        // --- Start of New Logic ---

        // Step 1: Find all shifts that have a relation to the site being deleted.
        // This assumes the relation field in 'mapapp_shifts' is named 'location'.
        // If your field is named differently (e.g., 'site'), change the filter string accordingly.
        const relatedShifts = await pb.collection('mapapp_shift').getFullList({
            filter: `location = '${id}'`
        });

        // Step 2: Loop through the found shifts and delete them.
        // We use a Promise.all for concurrency, which is faster than a for...of loop for many records.
        const deletePromises = relatedShifts.map(shift => 
            pb.collection('mapapp_shift').delete(shift.id)
        );
        await Promise.all(deletePromises);

        const relatedShiftsOccurence = await pb.collection('mapapp_shiftOccurences').getFullList({
            filter: `shiftLocation = '${id}'`
        });

        // Step 2: Loop through the found shifts and delete them.
        // We use a Promise.all for concurrency, which is faster than a for...of loop for many records.
        const deletePromisesOccurence = relatedShiftsOccurence.map(shift => 
            pb.collection('mapapp_shiftOccurences').delete(shift.id)
        );
        await Promise.all(deletePromisesOccurence);
        
        // --- End of New Logic ---

        // Step 3: After successfully deleting all related shifts, delete the site itself.
        await pb.collection('mapapp_location').delete(id);

        return NextResponse.json({ 
            message: `Site and ${relatedShifts.length} related shift(s) deleted successfully` 
        }, { status: 200 });

    } catch (error) {
        return handleError(error, 'Failed to delete site and its dependencies.');
    }
}