'use server';

import PocketBase, { type AuthModel, type RecordAuthResponse } from 'pocketbase';

// Initialize PocketBase.
const pb = new PocketBase(process.env.NEXT_PUBLIC_POCKETBASE_URL || 'http://127.0.0.1:8090');

export async function userLogin({ email, password }: { email: string, password: string }) {
    console.log('Logging in user...');
    const authData = await pb.collection("mapapp_users").authWithPassword(email, password);

    // after the above you can also access the auth data from the authStore
    console.log(pb.authStore.isValid);
    console.log(pb.authStore.token);
    // console.log(pb.authStore.record.id);
    return authData;
}

export interface TokenAuthActionState {
    success: boolean;
    message?: string;
    authData?: RecordAuthResponse<AuthModel> | null;
    errors?: {
        email?: string[];
        password?: string[];
        form?: string[];
    };
}

export async function getTokenViaAction(
    prevState: TokenAuthActionState | undefined,
    formData: FormData
): Promise<TokenAuthActionState> {
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    if (!email || !password) {
        return {
            success: false,
            message: 'Email and password are required.',
        };
    }

    try {
        const authData = await pb.collection('mapapp_users').authWithPassword(email, password);
        console.log('Authenticated successfully (Server Action - returning token):', authData.record.email);

        return {
            success: true,
            message: 'Authentication successful. Token obtained.',
            authData: authData,
        };

    } catch (error: Error | unknown) {
        console.error('Authentication failed (Server Action - returning token):', error);
        const errorMessage = 'Authentication failed. Please check your credentials.';

        return {
            success: false,
            message: errorMessage,
            errors: { form: [errorMessage] },
        };
    }
}

export async function LogoffUser() {
    console.log('Logging off user...');
    try {
        await pb.authStore.clear();
        console.log('User logged off successfully.');
    } catch (error) {
        console.error('Error logging off user:', error);
    }
}