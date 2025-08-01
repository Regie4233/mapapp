// seed_updated_schema.js
import PocketBase from 'pocketbase';
// import 'dotenv/config'; // Optional: for loading environment variables

// --- CONFIGURATION ---
// const pb = new PocketBase(process.env.PB_URL || 'http://127.0.0.1:8090');
const pb = new PocketBase('http://localhost:8080'); // Replace with your PB URL
const ADMIN_EMAIL = process.env.NEXT_PB_ADMIN_EMAIL || 'reggie@simon.us.com'; // Replace
const ADMIN_PASSWORD = process.env.NEXT_PB_ADMIN_PASSWORD || 'weareinthetallgrass'; // Replace

// --- HELPER FUNCTIONS ---
function getRandomElement(arr) {
    if (!arr || arr.length === 0) return null;
    return arr[Math.floor(Math.random() * arr.length)];
}

function getRandomSubset(arr, count) {
    if (!arr || arr.length === 0) return [];
    const shuffled = [...arr].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, Math.min(count, shuffled.length));
}

// --- MAIN SEEDING FUNCTION ---
async function seedDatabase() {
    try {
        console.log('Attempting to authenticate as admin...');
        await pb.admins.authWithPassword(ADMIN_EMAIL, ADMIN_PASSWORD);
        console.log('Admin authentication successful.');

        // --- 1. Seed 'mapapp_users' (Mentors/Users) ---
        // This part remains the same as the previously corrected version
        console.log("\n--- Seeding 'mapapp_users' ---");
        const createdUserIds = []; // Though not directly used for the no-mentor shifts, good to have for general context
        const usersToCreate = [
            { email: 'mentor1@example.com', password: 'password123', passwordConfirm: 'password123', name: 'Alice Mentor', title: 'Senior Mentor', privilage: 'manager', verified: true },
            { email: 'mentor2@example.com', password: 'password123', passwordConfirm: 'password123', name: 'Bob Advisor', title: 'Mentor', privilage: 'limited', verified: true },
            { email: 'user1@example.com', password: 'password123', passwordConfirm: 'password123', name: 'Charlie User', title: 'Mentee', privilage: 'limited', verified: true },
            { email: 'adminuser@example.com', password: 'password123', passwordConfirm: 'password123', name: 'Diana Admin', title: 'Lead Admin', privilage: 'admin', verified: true },
        ];

        for (const userData of usersToCreate) {
            try {
                let existingUser = null;
                try { existingUser = await pb.collection('mapapp_users').getFirstListItem(`email="${userData.email}"`); }
                catch (e) { if (e.status !== 404) { console.error(`Error checking user ${userData.email}:`, e?.data || e); continue;}}

                if (existingUser) {
                    console.log(`User ${userData.email} already exists. ID: ${existingUser.id}.`);
                    createdUserIds.push(existingUser.id);
                } else {
                    const userPayload = { email: userData.email, password: userData.password, passwordConfirm: userData.passwordConfirm, name: userData.name, title: userData.title, privilage: userData.privilage, verified: userData.verified, emailVisibility: true };
                    const record = await pb.collection('mapapp_users').create(userPayload);
                    createdUserIds.push(record.id);
                    console.log(`Created user: ${userData.name} (ID: ${record.id})`);
                }
            } catch (e) { console.error(`Failed to process user ${userData.email}:`, e?.data || e); }
        }
        if (createdUserIds.length === 0) { console.error("No users available. Check logs."); /* Potentially return if users are critical for other parts */ }
        console.log(`Total users available (created or existing): ${createdUserIds.length}`);


        // --- 2. Seed 'mapapp_shift' (Specifically shifts with NO mentors) ---
        console.log("\n--- Seeding 'mapapp_shift' (with empty mentor fields) ---");
        const noMentorShiftIds = []; // Store IDs of shifts created with no mentors
        const shiftTemplates = [
            { start: "07:00", end: "15:00" }, { start: "08:00", end: "16:00" },
            { start: "09:00", end: "17:00" }, { start: "10:00", end: "18:00" },
            { start: "14:00", end: "22:00" }, { start: "15:00", end: "23:00" },
        ];
        // Create enough shifts to pick from for all occurrences.
        // 3 locations * 30 days * 3 shifts/day (max) = 270 shifts. Let's make a bit more.
        const numberOfNoMentorShiftsToCreate = 50; // Reduced for faster seeding, adjust if more variety is needed per day.
                                                    // If you need truly unique shifts for all slots, you'd need closer to 270.
                                                    // For this demo, 50 means shifts will be reused across days/locations.

        for (let i = 0; i < numberOfNoMentorShiftsToCreate; i++) {
            const template = getRandomElement(shiftTemplates);
            // Make shift_date somewhat random, or fixed for this pool
            const dayInJune = Math.floor(Math.random() * 30) + 1;
            const shiftDate = `2024-06-${String(dayInJune).padStart(2, '0')}`; // Or any other relevant date

            const shiftData = {
                "shift_start": template.start,
                "shift_end": template.end,
                "shift_date": shiftDate,
                "approved": [],       // Explicitly empty
                "pending_approval": [], // Explicitly empty
            };
            try {
                const record = await pb.collection('mapapp_shift').create(shiftData);
                noMentorShiftIds.push(record.id);
            } catch (e) {
                console.error(`Failed to create no-mentor shift: ${JSON.stringify(shiftData)}`, e?.data || e);
            }
        }
        if (noMentorShiftIds.length === 0) {
            console.error("No shifts (with empty mentor fields) were created. Cannot proceed with location-specific occurrences. Check 'mapapp_shift' creation.");
            return;
        }
        console.log(`Successfully created ${noMentorShiftIds.length} shifts with empty mentor fields.`);


        // --- 3. Seed 'mapapp_location' and their 'mapapp_shiftOccurences' for June ---
        console.log("\n--- Seeding 'mapapp_location' and their June 'mapapp_shiftOccurences' ---");
        const locationsData = [
            { name: "Main Office", address: "123 Business Rd, Suite 100" },
            { name: "Downtown Branch", address: "456 City Ave" },
            { name: "North Campus", address: "789 University Dr" },
        ];
        const createdLocationIds = [];

        for (const locDefinition of locationsData) {
            const occurrenceIdsForThisLocation = [];
            console.log(`\n  Generating June shift occurrences for location: ${locDefinition.name}`);

            const year = 2024;
            const month = 6; // June

            for (let day = 1; day <= 30; day++) {
                const occurrenceDate = new Date(year, month - 1, day);
                const occurrenceDateString = occurrenceDate.toISOString().split('T')[0];
                const numberOfShiftsInOccurrence = Math.random() > 0.5 ? 3 : 2;

                // Select shifts from the noMentorShiftIds pool
                const shiftsForThisOccurrence = getRandomSubset(noMentorShiftIds, numberOfShiftsInOccurrence);

                if (shiftsForThisOccurrence.length === 0 && noMentorShiftIds.length > 0) {
                    shiftsForThisOccurrence.push(getRandomElement(noMentorShiftIds)); // Ensure at least one if pool exists
                }
                 if (shiftsForThisOccurrence.length === 0) {
                    console.warn(`    Skipping occurrence for ${occurrenceDateString} at ${locDefinition.name} as no shifts are available/selected from no-mentor pool.`);
                    continue;
                }

                const shiftOccurrenceData = {
                    "date": occurrenceDateString,
                    "shifts": shiftsForThisOccurrence, // These shifts have empty mentor fields
                };

                try {
                    const occurrenceRecord = await pb.collection('mapapp_shiftOccurences').create(shiftOccurrenceData);
                    occurrenceIdsForThisLocation.push(occurrenceRecord.id);
                    // console.log(`    Created shift occurrence for ${occurrenceDateString} (ID: ${occurrenceRecord.id})`);
                } catch (e) {
                    console.error(`    Failed to create shift occurrence for ${locDefinition.name} on ${occurrenceDateString}:`, e?.data || e);
                }
            }

            // Now create the location with its collected shift occurrences
            const locationRecordData = {
                ...locDefinition,
                "shiftOccurences": occurrenceIdsForThisLocation,
            };

            try {
                const locationRecord = await pb.collection('mapapp_location').create(locationRecordData);
                createdLocationIds.push(locationRecord.id);
                console.log(`  Created location: ${locDefinition.name} (ID: ${locationRecord.id}) linked to ${occurrenceIdsForThisLocation.length} shift occurrences.`);
            } catch (e) {
                console.error(`  Failed to create location ${locDefinition.name}:`, e?.data || e);
            }
        }
        console.log(`\nSuccessfully created ${createdLocationIds.length} locations with their respective June shift occurrences.`);


        console.log('\n--- Database seeding completed successfully! ---');

    } catch (error) {
        console.error('\n--- FATAL ERROR DURING SEEDING ---');
        if (error.isAbort) { console.error('Request was aborted.'); }
        else if (error.status) { console.error('Status:', error.status, 'Response data:', JSON.stringify(error.data, null, 2));}
        else { console.error('Non-PocketBase error:', error.message, error); }
        process.exitCode = 1;
    }
}

// Run the seeder
seedDatabase();