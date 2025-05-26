import { pb } from "@/lib/server/pocketbase";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
    // logic for grabbing the reponse nextjs url params called "id"
    const id = request.nextUrl.searchParams.get("id");
    // const location = request.nextUrl.searchParams.get("location");

    await pb.collection('_superusers').authWithPassword('admin@admin.admin', 'adminadmin');

 const shiftp = await pb.collection('mapapp_shift').getList(1, 60,{
        // filter: `approved.id ?~ "${id}"`,
        filter: `approved ?~ "${id}"`,
        expand: 'approved',
        sort: '-created'
    });
    // console.log(shiftp)

    // const locationRecord = await pb.collection('mapapp_shiftOccurences').getList(1, 60,{
    //     // filter: `approved.id ?~ "${id}"`,
    //     filter: `shifts ~ "ssmfi28db41613j"`,
    //     expand: 'shifts',
    //     sort: '-created'
    // });

    // const filteredShifts = filterShifts_by_user(shiftOccurences, authData);
    return new NextResponse(JSON.stringify({ id, shiftp }))
}