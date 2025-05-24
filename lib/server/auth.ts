'use server';
import { pb } from "@/lib/server/pocketbase";
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { useDispatch } from "react-redux";
import { clearAuthUser } from "../store/states/sessionsSlice";

export async function signIn(formData: FormData) {

    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
    const email = formData.get("email")?.toString() || "";
    const password = formData.get("password")?.toString() || "";
    await pb.collection("mapapp_users").authWithPassword(email, password);
    const authCookie = pb.authStore.exportToCookie();
    // console.log(authCookie)
    const cookieStore = await cookies()

    cookieStore.set('pb_auth', authCookie, {
        httpOnly: true,
        secure: true,
        expires: expiresAt,
        sameSite: 'lax',
        path: '/',
    })
    redirect('/dashboard');
}

// make signout function that also remove the jwt cookie
export async function signOut() {
    await pb.authStore.clear();
    const cookieStore = await cookies()
    cookieStore.delete('pb_auth')
    redirect('/login');
}
