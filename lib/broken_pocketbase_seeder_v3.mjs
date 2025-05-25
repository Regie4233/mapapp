// seed_updated_schema.js
import PocketBase from 'pocketbase';
// Corrected import - assuming date-fns-tz exports it directly
import { formatInTimeZone } from 'date-fns-tz';
// If you also use formatInTimeZone directly, it should also come from here:
// import { formatInTimeZone } from 'date-fns-tz';
import { enGB } from 'date-fns/locale/en-GB'

// --- CONFIGURATION ---
const pb = new PocketBase('http://localhost:8080');
const ADMIN_EMAIL = process.env.PB_ADMIN_EMAIL || 'admin@admin.admin';
const ADMIN_PASSWORD = process.env.PB_ADMIN_PASSWORD || 'adminadmin';
const NEW_YORK_TIMEZONE = 'America/New_York';

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

function getNewYorkMidnightAsUTCISO(year, month, day) {
    const monthStr = String(month).padStart(2, '0');
    const dayStr = String(day).padStart(2, '0');
    const dateStringInNY = `${year}-${monthStr}-${dayStr}T04:00:00`;

    // Use the imported zonedTimeToUtc
    const utcDate = formatInTimeZone(dateStringInNY, NEW_YORK_TIMEZONE, 'yyyy-MM-dd HH:mm:ss zzz', { locale: enGB });
    return utcDate.toString();
}

// --- MAIN SEEDING FUNCTION ---
async function seedDatabase(monthNum) {
    try {
        console.log('Attempting to authenticate as admin...');
        await pb.collection('_superusers').authWithPassword(ADMIN_EMAIL, ADMIN_PASSWORD);
        console.log('Admin authentication successful.');

        // --- 2. Seed 'mapapp_shift' ---
        console.log("\n--- Seeding 'mapapp_shift' (with empty mentor fields) ---");
        const noMentorShiftIds = [];
        const shiftTemplates = [
            { start: "07:00", end: "15:00" }, { start: "08:00", end: "16:00" },
            { start: "09:00", end: "17:00" }, { start: "10:00", end: "18:00" },
            { start: "14:00", end: "22:00" }, { start: "15:00", end: "23:00" },
        ];
        const numberOfNoMentorShiftsToCreate = 50;
        const yearForShifts = 2025;

        for (let i = 0; i < numberOfNoMentorShiftsToCreate; i++) {
            const template = getRandomElement(shiftTemplates);
            // Calculate actual days in month for random selection
            const daysInGivenMonthForShift = new Date(yearForShifts, monthNum, 0).getDate();
            const dayInMonth = Math.floor(Math.random() * daysInGivenMonthForShift) + 1;

            const shiftDateString = `${yearForShifts}-${String(monthNum).padStart(2, '0')}-${String(dayInMonth).padStart(2, '0')}`;
            // If 'shift_date' in 'mapapp_shift' is datetime and needs NY midnight UTC:
            // const shiftDateString = getNewYorkMidnightAsUTCISO(yearForShifts, monthNum, dayInMonth);

            const shiftData = {
                "shift_start": template.start,
                "shift_end": template.end,
                "shift_date": shiftDateString,
                "approved": [],
                "pending_approval": [],
            };
            try {
                const record = await pb.collection('mapapp_shift').create(shiftData);
                noMentorShiftIds.push(record.id);
            } catch (e) {
                console.error(`Failed to create no-mentor shift: ${JSON.stringify(shiftData)}`, e?.data || e);
            }
        }
        if (noMentorShiftIds.length === 0) {
            console.error("No shifts (with empty mentor fields) were created. Cannot proceed.");
            // return;
        }
        console.log(`Successfully created/available ${noMentorShiftIds.length} shifts with empty mentor fields.`);


        // --- 3. Seed 'mapapp_location' and their 'mapapp_shiftOccurences' ---
        console.log(`\n--- Seeding 'mapapp_location' and their month ${monthNum} 'mapapp_shiftOccurences' ---`);
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
                let existingLocation = null;
                try {
                    existingLocation = await pb.collection('mapapp_location').getFirstListItem(`name="${locDefinition.name.replace(/"/g, '""')}"`);
                } catch (e) {
                    if (e.status !== 404) throw e;
                }

                if (existingLocation) {
                    locationRecordId = existingLocation.id;
                    console.log(`    Location "${locDefinition.name}" already exists. ID: ${locationRecordId}.`);
                } else {
                    const newLocationData = { name: locDefinition.name, address: locDefinition.address };
                    const createdLocation = await pb.collection('mapapp_location').create(newLocationData);
                    locationRecordId = createdLocation.id;
                    console.log(`    Created new location: ${locDefinition.name} (ID: ${locationRecordId})`);
                }
                createdLocationDetails.push({ id: locationRecordId, name: locDefinition.name });
            } catch (e) {
                console.error(`    Failed to create or find location ${locDefinition.name}:`, e?.data || e);
                continue;
            }

            console.log(`    Generating month ${monthNum} shift occurrences for location ID: ${locationRecordId} (${locDefinition.name})`);
            const year = 2025;
            const daysInMonth = new Date(year, monthNum, 0).getDate();

            for (let day = 1; day <= daysInMonth; day++) {
                const occurrenceDateString = getNewYorkMidnightAsUTCISO(year, monthNum, day);
                const numberOfShiftsInOccurrence = Math.random() > 0.5 ? 3 : 2;
                const shiftsForThisOccurrence = getRandomSubset(noMentorShiftIds, numberOfShiftsInOccurrence);

                if (shiftsForThisOccurrence.length === 0 && noMentorShiftIds.length > 0) {
                    shiftsForThisOccurrence.push(getRandomElement(noMentorShiftIds));
                }
                 if (shiftsForThisOccurrence.length === 0) {
                    console.warn(`      Skipping occurrence for ${year}-${String(monthNum).padStart(2,'0')}-${String(day).padStart(2,'0')} (NY Time) at ${locDefinition.name} as no shifts are available/selected from pool.`);
                    continue;
                }

                const shiftOccurrenceData = {
                    "shiftDate": occurrenceDateString,
                    "shifts": shiftsForThisOccurrence,
                    "shiftLocation": locationRecordId,
                };

                try {
                    const occurrenceRecord = await pb.collection('mapapp_shiftOccurences').create(shiftOccurrenceData);
                    occurrenceIdsForThisLocation.push(occurrenceRecord.id);
                } catch (e) {
                    console.error(`      Failed to create shift occurrence for ${locDefinition.name} on ${year}-${String(monthNum).padStart(2,'0')}-${String(day).padStart(2,'0')} (NY Time):`, e?.data || e);
                }
            }

            if (occurrenceIdsForThisLocation.length > 0) {
                try {
                    await pb.collection('mapapp_location').update(locationRecordId, {
                        "shiftOccurences": occurrenceIdsForThisLocation,
                    });
                    console.log(`    Updated location ${locDefinition.name} (ID: ${locationRecordId}) with ${occurrenceIdsForThisLocation.length} shift occurrences.`);
                } catch (e) {
                    console.error(`    Failed to update location ${locDefinition.name} (ID: ${locationRecordId}) with its shift occurrences:`, e?.data || e);
                }
            } else {
                console.log(`    No new shift occurrences created for location ${locDefinition.name} (ID: ${locationRecordId}).`);
            }
        }
        console.log(`\nSuccessfully processed ${createdLocationDetails.length} locations, creating/linking their respective month ${monthNum} shift occurrences.`);
        console.log('\n--- Database seeding completed successfully! ---');

    } catch (error) {
        console.error('\n--- FATAL ERROR DURING SEEDING ---');
        if (error.isAbort) { console.error('Request was aborted.'); }
        else if (error.status) { console.error('Status:', error.status, 'Response data:', JSON.stringify(error.data, null, 2));}
        else { console.error('Non-PocketBase error:', error.message, error); }
        process.exitCode = 1;
    }
}

seedDatabase(5); // Example: June