import { auth, currentUser} from "@clerk/nextjs";
import { Liveblocks } from "@liveblocks/node";
import { ConvexHttpClient } from "convex/browser";

import { api } from "@/convex/_generated/api";

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

//The same convention method as creating route side pages but this time we're creating a route.ts instead of page.tsx  
const liveblocks = new Liveblocks({
    secret: "sk_dev_uHvStC_Rq_foZylIBqLPXUkKzvu_gVt149u_DX4gk5CZed1akoijAqiqliIKGJKH",
});

export async function POST(request: Request) { 
    const authorization = await auth(); 
    const user = await currentUser();


    if (!authorization || !user) {
        return new Response("Unauthorized", { status: 403 });
    }

    const { room } = await request.json(); //this is were liveblocks is gonna send the room information in, modifying the liveblocks config
    const board = await convex.query(api.board.get, { id: room });


    if(board?.orgId !== authorization.orgId) {
        return new Response("Unauthorized", { status: 403 });
    }

    const userInfo = {
        name: user.firstName || "Team mate", 
        picture: user.imageUrl,
    };


    const session = liveblocks.prepareSession(
        user.id, 
        { userInfo }
    ); 

    if (room) {
        session.allow(room, session.FULL_ACCESS);
    }


    const { status, body } = await session.authorize();
    return new Response(body, { status });
}