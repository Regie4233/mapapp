// seed_updated_schema.js
import PocketBase from 'pocketbase';
// import 'dotenv/config'; // Optional: for loading environment variables

// --- CONFIGURATION ---
const pb = new PocketBase(process.env.PB_URL || 'http://localhost:8080'); // Replace with your PB URL
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
async function seedDatabase(monthToSeedParam) { // e.g., 6 for June
    try {
        console.log('Attempting to authenticate as admin...');
        // Use standard admin authentication
        await pb.collection('_superusers').authWithPassword(ADMIN_EMAIL, ADMIN_PASSWORD);
        console.log('Admin authentication successful.');

        const YEAR_TO_SEED = 2025;
        // Default to June (month 6) if no parameter passed; JS months are 0-indexed
        const SEED_MONTH_TARGET = monthToSeedParam || 6; // 1-indexed month (1=Jan, 6=June)
        const SEED_MONTH_JS = SEED_MONTH_TARGET - 1; // 0-indexed for JS Date object
        const SEED_MONTH_STR = String(SEED_MONTH_TARGET).padStart(2, '0'); // "06" for June

        // --- 2. Seed 'mapapp_shift' (Specifically shifts with NO mentors) ---
        console.log("\n--- Seeding 'mapapp_shift' (with empty mentor fields) ---");
        const noMentorShiftIds = [];
        const shiftTemplates = [
            { start: "07:00", end: "15:00" }, { start: "08:00", end: "16:00" },
            { start: "09:00", end: "17:00" }, { start: "10:00", end: "18:00" },
            { start: "14:00", end: "22:00" }, { start: "15:00", end: "23:00" },
        ];
        const numberOfNoMentorShiftsToCreate = 50;

        // Determine days in the month for random shift date generation
        const daysInSeedMonthForShifts = new Date(YEAR_TO_SEED, SEED_MONTH_JS + 1, 0).getDate();

        for (let i = 0; i < numberOfNoMentorShiftsToCreate; i++) {
            const template = getRandomElement(shiftTemplates);
            
            // Each shift gets a random date within the SEED_MONTH
            const randomDayForShift = Math.floor(Math.random() * daysInSeedMonthForShifts) + 1;
            const shiftDateObject = new Date(YEAR_TO_SEED, SEED_MONTH_JS, randomDayForShift, 0, 0, 0);

            const shiftData = {
                "shift_start": template.start,     // Ensure 'shift_start' is API name & Text type in PB
                "shift_end": template.end,         // Ensure 'shift_end' is API name & Text type in PB
                
                // Assuming 'shift_date' is a "Date" type field in mapapp_shift.
                // If it's Text, use: shiftDateObject.toISOString().split('T')[0]
                "shift_date": shiftDateObject.toISOString(), // Ensure 'shift_date' is the API name
                
                "approved": [],
                "pending_approval": [],
            };

            try {
                console.log('Attempting to create mapapp_shift with data:', JSON.stringify(shiftData, null, 2));
                const record = await pb.collection('mapapp_shift').create(shiftData);
                noMentorShiftIds.push(record.id);
            } catch (e) {
                console.error(`Failed to create no-mentor shift: ${JSON.stringify(shiftData)}`, e?.data || e);
            }
        }
        if (noMentorShiftIds.length === 0) {
            console.error("No shifts (with empty mentor fields) were created. Cannot proceed with location-specific occurrences. Check 'mapapp_shift' creation.");
            // return; // Consider if this is a fatal error
        }
        console.log(`Successfully created/available ${noMentorShiftIds.length} shifts with empty mentor fields.`);


        // --- 3. Seed 'mapapp_location' and their 'mapapp_shiftOccurences' for the specified month ---
        console.log(`\n--- Seeding 'mapapp_location' and their 'mapapp_shiftOccurences' for ${SEED_MONTH_STR}/${YEAR_TO_SEED} ---`);
        const locationsData = [
            { name: "Main Office", address: "123 Business Rd, Suite 100" },
            { name: "Downtown Branch", address: "456 City Ave" },
            { name: "North Campus", address: "789 University Dr" },
        ];
        const createdLocationDetails = [];

        for (const locDefinition of locationsData) {
            let locationRecordId;
            const occurrenceIdsForThisLocation = [];
            console.log(`\n  Processing location: ${locDefinition.name}`);

            try {
                // Create or find location
                let existingLocation = null;
                try {
                    existingLocation = await pb.collection('mapapp_location').getFirstListItem(`name="${locDefinition.name.replace(/"/g, '""')}"`);
                } catch (e) { if (e.status !== 404) throw e; }

                if (existingLocation) {
                    locationRecordId = existingLocation.id;
                    console.log(`    Location "${locDefinition.name}" already exists. ID: ${locationRecordId}.`);
                } else {
                    const newLocationData = {
                        name: locDefinition.name,       // Ensure 'name' is API name in PB
                        address: locDefinition.address, // Ensure 'address' is API name in PB
                    };
                    console.log('Attempting to create mapapp_location with data:', JSON.stringify(newLocationData, null, 2));
                    const createdLocation = await pb.collection('mapapp_location').create(newLocationData);
                    locationRecordId = createdLocation.id;
                    console.log(`    Created new location: ${locDefinition.name} (ID: ${locationRecordId})`);
                }
                createdLocationDetails.push({ id: locationRecordId, name: locDefinition.name });
            } catch (e) {
                console.error(`    Failed to create or find location ${locDefinition.name}:`, e?.data || e);
                continue;
            }

            const daysInMonthForOccurrences = new Date(YEAR_TO_SEED, SEED_MONTH_JS + 1, 0).getDate();
            console.log(`    Generating shift occurrences for ${daysInMonthForOccurrences} days in ${SEED_MONTH_STR}/${YEAR_TO_SEED} for location ${locDefinition.name}`);

            for (let day = 1; day <= daysInMonthForOccurrences; day++) {
                const occurrenceDateObject = new Date(YEAR_TO_SEED, SEED_MONTH_JS, day);
                const numberOfShiftsInOccurrence = Math.random() > 0.5 ? 3 : 2;
                const shiftsForThisOccurrence = getRandomSubset(noMentorShiftIds, numberOfShiftsInOccurrence);

                if (shiftsForThisOccurrence.length === 0 && noMentorShiftIds.length > 0) {
                    shiftsForThisOccurrence.push(getRandomElement(noMentorShiftIds));
                }
                if (shiftsForThisOccurrence.length === 0) {
                    console.warn(`      Skipping occurrence for ${occurrenceDateObject.toISOString().split('T')[0]} at ${locDefinition.name} as no shifts selected.`);
                    continue;
                }

                const shiftOccurrenceData = {
                    // Assuming 'date' is a "Date" type field in mapapp_shiftOccurences.
                    // If it's Text, use: occurrenceDateObject.toISOString().split('T')[0]
                    "shiftDate": occurrenceDateObject.toISOString(), // Ensure 'date' is API name
                    "shifts": shiftsForThisOccurrence,        // Ensure 'shifts' is API name (Relation to mapapp_shift)
                    "shiftLocation": locationRecordId,             // Ensure 'location' is API name (Relation to mapapp_location)
                };

                try {
                    console.log(`Attempting to create mapapp_shiftOccurences for ${occurrenceDateObject.toISOString().split('T')[0]} with data:`, JSON.stringify(shiftOccurrenceData, null, 2));
                    const occurrenceRecord = await pb.collection('mapapp_shiftOccurences').create(shiftOccurrenceData);
                    occurrenceIdsForThisLocation.push(occurrenceRecord.id);
                } catch (e) {
                    console.error(`      Failed to create shift occurrence for ${locDefinition.name} on ${occurrenceDateObject.toISOString().split('T')[0]}:`, e?.data || e);
                }
            }

            if (occurrenceIdsForThisLocation.length > 0) {
                try {
                    // Ensure 'shiftOccurences' is the API name of the relation field in mapapp_location
                    await pb.collection('mapapp_location').update(locationRecordId, {
                        "shiftOccurences": occurrenceIdsForThisLocation,
                    });
                    console.log(`    Updated location ${locDefinition.name} (ID: ${locationRecordId}) with ${occurrenceIdsForThisLocation.length} shift occurrences.`);
                } catch (e) {
                    console.error(`    Failed to update location ${locDefinition.name} (ID: ${locationRecordId}) with its shift occurrences:`, e?.data || e);
                }
            } else {
                console.log(`    No new shift occurrences created for location ${locDefinition.name}.`);
            }
        }
        console.log(`\nSuccessfully processed ${createdLocationDetails.length} locations.`);
        console.log('\n--- Database seeding completed successfully! ---');

    } catch (error) {
        console.error('\n--- FATAL ERROR DURING SEEDING ---');
        if (error.isAbort) { console.error('Request was aborted.'); }
        else if (error.status) { console.error('Status:', error.status, 'Response data:', JSON.stringify(error.data, null, 2)); }
        else { console.error('Non-PocketBase error:', error.message, error); }
        process.exitCode = 1;
    }
}

// Run the seeder, optionally pass the month number (e.g., 6 for June)
// If no argument, it will default to June as per logic inside seedDatabase.
seedDatabase(6); // Example: seed for June
// seedDatabase(); // Will also default to June