async function seedDatabase() {
    try {
        console.log('Attempting to authenticate as admin...');
        await pb.collection('_superusers').authWithPassword(ADMIN_EMAIL, ADMIN_PASSWORD);
        console.log('Admin authentication successful.');

        // --- 1. Seed 'mapapp_users' (Mentors/Users) ---
        console.log("\n--- Seeding 'mapapp_users' ---");
        const createdUserIds = [];
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
                catch (e) { if (e.status !== 404) { console.error(`Error checking user ${userData.email}:`, e?.data || e); continue; } }

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
        if (createdUserIds.length === 0) { console.warn("No users available. Some seeding parts might be affected."); }
        console.log(`Total users available (created or existing): ${createdUserIds.length}`);
    } catch (e) {
        console.error(e)
    }
}
seedDatabase() 