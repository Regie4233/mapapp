import { NextResponse } from "next/server";
import { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
    console.log("Middleware running...");
    const cookie = request.cookies.get("pb_auth");
    
    if(cookie){
        //  const [header, payload] = cookie.value?.split('.');

        // // 2. Decode the header and payload
        // const decodedHeader = JSON.parse(atob(header));
        // const decodedPayload = JSON.parse(atob(payload));
        // console.log("Decoded Header:", decodedHeader);
        // console.log("Decoded Payload:", decodedPayload);
        return NextResponse.next();
    }
    return NextResponse.redirect(new URL('/login', request.url));


}

export const config = {
    matcher: ['/dashboard','/dashboard/:path*']
}