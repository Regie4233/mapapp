import Pocketbase from 'pocketbase';

const pb = new Pocketbase('http://localhost:8080'); // Replace with your PB URL
const ADMIN_EMAIL = process.env.PB_ADMIN_EMAIL || 'admin@admin.admin'; // Replace
const ADMIN_PASSWORD = process.env.PB_ADMIN_PASSWORD || 'adminadmin'; // Replace

function getRandomElement(arr) {
    if (!arr || arr.length === 0) return null;
    return arr[Math.floor(Math.random() * arr.length)];
}

function getRandomSubset(arr, count) {
    if (!arr || arr.length === 0) return [];
    const shuffled = [...arr].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, Math.min(count, shuffled.length));
}

function createShift(monthInt, occDate) {
    const shiftTemplates = [
        { start: "07:00", end: "15:00" }, { start: "08:00", end: "16:00" },
        { start: "09:00", end: "17:00" }, { start: "10:00", end: "18:00" },
        { start: "14:00", end: "22:00" }, { start: "15:00", end: "23:00" },
    ];
    const titleTemplates = [
        "Arts & Crafts", "Outdoor Games", "Reading Hour", "Science Experiments", "Cooking Class", "Music Session", "Yoga & Meditation",
    "Gardening", "Storytelling", "Dance Workshop", "Photography Walk", "Nature Exploration", "Puzzle Time", "Board Games", "Creative Writing"


    ]
    const template = getRandomElement(shiftTemplates);
    const title = getRandomElement(titleTemplates);
    // const dayInMonth = Math.floor(Math.random() * 30) + 1;
    // const shiftDate = `2025-0${monthInt}-${String(dayInMonth).padStart(2, '0')}T04:00:00`;
    const shiftDate = occDate;
    const shiftData = {
        "shift_start": template.start,
        "shift_end": template.end,
        "shift_date": shiftDate,
        "spots": Math.random() > 0.5 ? 2 : 1,
        "approved": [],
        "pending_approval": [],
        "title": title
    };
    try {
        // Optional: Could add a check here to prevent creating identical shifts if re-run
        // const record = await pb.collection('mapapp_shift').create(shiftData);
        // noMentorShiftIds.push(record.id);
        return shiftData;
    } catch (e) {
        console.error(`Failed to create no-mentor shift: ${JSON.stringify(shiftData)}`, e?.data || e);
    }
}


async function seedDatabase(monthNum) {

    try {
        console.log('Attempting to authenticate as admin...');
        await pb.collection('_superusers').authWithPassword(ADMIN_EMAIL, ADMIN_PASSWORD);
        console.log('Admin authentication successful.');


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
            const year = 2025;
            const month = monthNum; // June

            for (let day = 1; day <= 30; day++) { // Loop for each day in June
                const occurrenceDate = new Date(year, month - 1, day); // JS month is 0-indexed
                const occurrenceDateString = occurrenceDate.toISOString().split('T')[0]; // YYYY-MM-DD
                // console.log(occurrenceDateString)
                const numberOfShiftsInOccurrence = Math.random() > 0.5 ? 3 : 2; // 2 or 3 shifts per day

                // const shiftsForThisOccurrence = getRandomSubset(noMentorShiftIds, numberOfShiftsInOccurrence);



                // if (shiftsForThisOccurrence.length === 0 && noMentorShiftIds.length > 0) {
                //     shiftsForThisOccurrence.push(getRandomElement(noMentorShiftIds)); // Ensure at least one if pool has items
                // }
               

                let shiftsForThisOccurrence = [];
                for (let i = 0; i < numberOfShiftsInOccurrence; i++) {
                    const shiftData = createShift(month, occurrenceDate);
                    if (shiftData) {
                        const createdShift = await pb.collection('mapapp_shift').create(shiftData);
                        shiftsForThisOccurrence.push(createdShift.id);
                        console.log("---- Creating Shift Data for Shift Occurence")
                    } else {
                        console.log("XXXXXXXXXX  NO Shift Data XXXXXXXXX")
                    }
                }

                 if (shiftsForThisOccurrence.length === 0) {
                    console.warn(` Skipping occurrence for ${occurrenceDateString} at ${locDefinition.name} as no shifts are available/selected from pool.`);
                    continue;
                }

                const shiftOccurrenceData = {
                    "shiftDate": occurrenceDate,
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
        else if (error.status) { console.error('Status:', error.status, 'Response data:', JSON.stringify(error.data, null, 2)); }
        else { console.error('Non-PocketBase error:', error.message, error); }
        process.exitCode = 1;
    }
}

seedDatabase(5)