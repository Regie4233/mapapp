'use server';
import { pb } from "@/lib/server/pocketbase";
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export async function signIn(formData: FormData) {
    try{
 const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
    const email = formData.get("email")?.toString() || "";
    const password = formData.get("password")?.toString() || "";
    await pb.collection("mapapp_users").authWithPassword(email, password);
    const authCookie = pb.authStore.exportToCookie();
    // console.log(authCookie)
    const cookieStore = await cookies()

    cookieStore.set('pb_auth', authCookie, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        expires: expiresAt,
        sameSite: 'lax',
        path: '/',
    })
   
    }catch (error) {
        console.error('Sign-in error:', error);
        const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
        redirect(`/login?error=${encodeURIComponent(errorMessage)}`);
    }
    redirect('/dashboard');
}

// make signout function that also remove the jwt cookie
export async function signOut() {
    await pb.authStore.clear();
    const cookieStore = await cookies()
    cookieStore.delete('pb_auth')
    redirect('/login');
}