import { pb } from "@/lib/server/pocketbase";
import { atob } from "buffer";
import { cookies } from 'next/headers'

export async function GET() {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get('pb_auth');
    
    if (sessionCookie) {
        try {
            const [header, payload] = sessionCookie.value?.split('.');
         
            const decodedPayload = JSON.parse(atob(payload));
            const user = await pb.collection("mapapp_users").getOne(decodedPayload.id!);
          
            return new Response(JSON.stringify({ userData: user }))
        } catch (error) {
            console.error("Failed to parse cookie payload:", error);
            return new Response(JSON.stringify({ ses: null }))
        }
    }

}