// seed_updated_schema.js
import PocketBase from 'pocketbase';
// import 'dotenv/config'; // Optional: for loading environment variables

// --- CONFIGURATION ---
// const pb = new PocketBase(process.env.PB_URL || 'http://127.0.0.1:8090');
const pb = new PocketBase('http://localhost:8080'); // Replace with your PB URL
const ADMIN_EMAIL = process.env.PB_ADMIN_EMAIL || 'admin@admin.admin'; // Replace
const ADMIN_PASSWORD = process.env.PB_ADMIN_PASSWORD || 'adminadmin'; // Replace

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
        await pb.collection('_superusers').authWithPassword(ADMIN_EMAIL, ADMIN_PASSWORD);
        console.log('Admin authentication successful.');

        // --- 1. Seed 'mapapp_users' (Mentors/Users) ---
        // console.log("\n--- Seeding 'mapapp_users' ---");
        // const createdUserIds = [];
        // const usersToCreate = [
        //     { email: 'mentor1@example.com', password: 'password123', passwordConfirm: 'password123', name: 'Alice Mentor', title: 'Senior Mentor', privilage: 'manager', verified: true },
        //     { email: 'mentor2@example.com', password: 'password123', passwordConfirm: 'password123', name: 'Bob Advisor', title: 'Mentor', privilage: 'limited', verified: true },
        //     { email: 'user1@example.com', password: 'password123', passwordConfirm: 'password123', name: 'Charlie User', title: 'Mentee', privilage: 'limited', verified: true },
        //     { email: 'adminuser@example.com', password: 'password123', passwordConfirm: 'password123', name: 'Diana Admin', title: 'Lead Admin', privilage: 'admin', verified: true },
        // ];

        // for (const userData of usersToCreate) {
        //     try {
        //         let existingUser = null;
        //         try { existingUser = await pb.collection('mapapp_users').getFirstListItem(`email="${userData.email}"`); }
        //         catch (e) { if (e.status !== 404) { console.error(`Error checking user ${userData.email}:`, e?.data || e); continue;}}

        //         if (existingUser) {
        //             console.log(`User ${userData.email} already exists. ID: ${existingUser.id}.`);
        //             createdUserIds.push(existingUser.id);
        //         } else {
        //             const userPayload = { email: userData.email, password: userData.password, passwordConfirm: userData.passwordConfirm, name: userData.name, title: userData.title, privilage: userData.privilage, verified: userData.verified, emailVisibility: true };
        //             const record = await pb.collection('mapapp_users').create(userPayload);
        //             createdUserIds.push(record.id);
        //             console.log(`Created user: ${userData.name} (ID: ${record.id})`);
        //         }
        //     } catch (e) { console.error(`Failed to process user ${userData.email}:`, e?.data || e); }
        // }
        // if (createdUserIds.length === 0) { console.warn("No users available. Some seeding parts might be affected."); }
        // console.log(`Total users available (created or existing): ${createdUserIds.length}`);


        // --- 2. Seed 'mapapp_shift' (Specifically shifts with NO mentors) ---
        console.log("\n--- Seeding 'mapapp_shift' (with empty mentor fields) ---");
        const noMentorShiftIds = [];
        const shiftTemplates = [
            { start: "07:00", end: "15:00" }, { start: "08:00", end: "16:00" },
            { start: "09:00", end: "17:00" }, { start: "10:00", end: "18:00" },
            { start: "14:00", end: "22:00" }, { start: "15:00", end: "23:00" },
        ];
        const numberOfNoMentorShiftsToCreate = 50;

        for (let i = 0; i < numberOfNoMentorShiftsToCreate; i++) {
            const template = getRandomElement(shiftTemplates);
            const dayInJune = Math.floor(Math.random() * 30) + 1;
            const shiftDate = `2025-06-${String(dayInJune).padStart(2, '0')}`;

            const shiftData = {
                "shift_start": template.start,
                "shift_end": template.end,
                "shift_date": shiftDate,
                "approved": [],
                "pending_approval": [],
            };
            try {
                // Optional: Could add a check here to prevent creating identical shifts if re-run
                const record = await pb.collection('mapapp_shift').create(shiftData);
                noMentorShiftIds.push(record.id);
            } catch (e) {
                console.error(`Failed to create no-mentor shift: ${JSON.stringify(shiftData)}`, e?.data || e);
            }
        }
        if (noMentorShiftIds.length === 0) {
            console.error("No shifts (with empty mentor fields) were created. Cannot proceed with location-specific occurrences. Check 'mapapp_shift' creation.");
            // return; // Consider if this is a fatal error for the rest of the seed
        }
        console.log(`Successfully created/available ${noMentorShiftIds.length} shifts with empty mentor fields.`);


        // --- 3. Seed 'mapapp_location' and their 'mapapp_shiftOccurences' for June ---
        console.log("\n--- Seeding 'mapapp_location' and their June 'mapapp_shiftOccurences' ---");
        const locationsData = [
            { name: "Main Office", address: "123 Business Rd, Suite 100" },
            { name: "Downtown Branch", address: "456 City Ave" },
            { name: "North Campus", address: "789 University Dr" },
        ];
        const createdLocationDetails = []; // To store {id, name} of created/found locations

        for (const locDefinition of locationsData) {
            let locationRecordId;
            const occurrenceIdsForThisLocation = [];

            console.log(`\n  Processing location: ${locDefinition.name}`);

            // Step A: Create or find the mapapp_location record
            try {
                let existingLocation = null;
                try {
                    existingLocation = await pb.collection('mapapp_location').getFirstListItem(`name="${locDefinition.name.replace(/"/g, '""')}"`); // Handle quotes in name if any
                } catch (e) {
                    if (e.status !== 404) throw e; // Re-throw if not a "not found" error
                }

                if (existingLocation) {
                    locationRecordId = existingLocation.id;
                    console.log(`    Location "${locDefinition.name}" already exists. ID: ${locationRecordId}.`);
                } else {
                    const newLocationData = {
                        name: locDefinition.name,
                        address: locDefinition.address,
                        // 'shiftOccurences' field will be populated later by an update
                    };
                    const createdLocation = await pb.collection('mapapp_location').create(newLocationData);
                    locationRecordId = createdLocation.id;
                    console.log(`    Created new location: ${locDefinition.name} (ID: ${locationRecordId})`);
                }
                createdLocationDetails.push({ id: locationRecordId, name: locDefinition.name });

            } catch (e) {
                console.error(`    Failed to create or find location ${locDefinition.name}:`, e?.data || e);
                continue; // Skip to the next location definition if this one fails
            }

            // Step B: Generate and create shift occurrences for this location, linking them back
            console.log(`    Generating June shift occurrences for location ID: ${locationRecordId} (${locDefinition.name})`);
            const year = 2024;
            const month = 6; // June

            for (let day = 1; day <= 30; day++) { // Loop for each day in June
                const occurrenceDate = new Date(year, month - 1, day); // JS month is 0-indexed
                const occurrenceDateString = occurrenceDate.toISOString().split('T')[0]; // YYYY-MM-DD
                const numberOfShiftsInOccurrence = Math.random() > 0.5 ? 3 : 2; // 2 or 3 shifts per day

                const shiftsForThisOccurrence = getRandomSubset(noMentorShiftIds, numberOfShiftsInOccurrence);

                if (shiftsForThisOccurrence.length === 0 && noMentorShiftIds.length > 0) {
                    shiftsForThisOccurrence.push(getRandomElement(noMentorShiftIds)); // Ensure at least one if pool has items
                }
                 if (shiftsForThisOccurrence.length === 0) {
                    console.warn(`      Skipping occurrence for ${occurrenceDateString} at ${locDefinition.name} as no shifts are available/selected from pool.`);
                    continue;
                }

                const shiftOccurrenceData = {
                    "shiftDate": occurrenceDateString,
                    "shifts": shiftsForThisOccurrence, // Relation to 'mapapp_shift'
                    "shiftLocation": locationRecordId,      // **** NEW: Relation to 'mapapp_location' ****
                };

                try {
                    // Optional: Add check here if you want to avoid creating duplicate occurrences for the same location & date on re-runs
                    const occurrenceRecord = await pb.collection('mapapp_shiftOccurences').create(shiftOccurrenceData);
                    occurrenceIdsForThisLocation.push(occurrenceRecord.id);
                    // console.log(`      Created shift occurrence for ${occurrenceDateString} (ID: ${occurrenceRecord.id}), linked to location ${locationRecordId}`);
                } catch (e) {
                    console.error(`      Failed to create shift occurrence for ${locDefinition.name} on ${occurrenceDateString}:`, e?.data || e);
                }
            }

            // Step C: Update the mapapp_location record with the list of its shiftOccurences IDs
            if (occurrenceIdsForThisLocation.length > 0) {
                try {
                    await pb.collection('mapapp_location').update(locationRecordId, {
                        "shiftOccurences": occurrenceIdsForThisLocation, // This is the forward relation
                    });
                    console.log(`    Updated location ${locDefinition.name} (ID: ${locationRecordId}) with ${occurrenceIdsForThisLocation.length} shift occurrences.`);
                } catch (e) {
                    console.error(`    Failed to update location ${locDefinition.name} (ID: ${locationRecordId}) with its shift occurrences:`, e?.data || e);
                }
            } else {
                // If the location previously had occurrences and now has none for June, you might want to clear the field:
                // await pb.collection('mapapp_location').update(locationRecordId, { "shiftOccurences": [] });
                console.log(`    No new shift occurrences created for location ${locDefinition.name} (ID: ${locationRecordId}). 'shiftOccurences' field on location not updated with new June occurrences.`);
            }
        }
        console.log(`\nSuccessfully processed ${createdLocationDetails.length} locations, creating/linking their respective June shift occurrences.`);


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