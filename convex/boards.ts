import { v } from "convex/values";
import { query } from "./_generated/server";

import { getAllOrThrow } from "convex-helpers/server/relationships";

export const get = query({
    args: { //accept the arguments of orgId which is gonna be the required argument
        orgId: v.string(), // we have to allow arguments other then orgId, that's gonna be search ->
        search: v.optional(v.string()),
        favorites: v.optional(v.string()),
    },
    handler: async(ctx, args) => { 
        const identity = await ctx.auth.getUserIdentity();
        
        if(!identity) {
            throw new Error("Unauthorized");
        }

        if (args.favorites) { 
            const favoritedBoards = await ctx.db
                .query("userFavorites")
                .withIndex("by_user_org", (q) => 
                    q
                        .eq("userId", identity.subject)
                        .eq("orgId", args.orgId)
                    )
                    .order("desc")
                    .collect();
                    
                    const ids = favoritedBoards.map((b) => b.boardId);

                    const boards = await getAllOrThrow(ctx.db, ids);

                    return boards.map((board) => ({
                        ...board,
                        isFavorite: true,
                    }));
        }

        const title = args.search as string; 
        let boards = []; 

        if (title) {
            boards = await ctx.db
                .query("boards")
                .withSearchIndex("search_title", (q) => 
                    q
                        .search("title", title)
                        .eq("orgId", args.orgId)
                    )
                    .collect();    
        } else { 
        boards = await ctx.db
        .query("boards") //querying the "boards" collection
        .withIndex("by_org", (q) => q.eq("orgId", args.orgId)) //Filter by index, eq stands for equal to. 
        .order("desc") //Order results in descending order
        .collect(); //Fetch the query results. 
//(q)=> q.eq("orgId", args.orgId)) this provides the filtering criteria in which q reprents the query builder and the rest of the expression means find documents where the orgId field exactly matches the value in args.orgId
        }


        const boardsWithFavoriteRelation = boards.map((board) => {
            return ctx.db
            .query("userFavorites")
            .withIndex("by_user_board", (q) => 
                q
                    .eq("userId", identity.subject)
                    .eq("boardId", board._id)
            )
            .unique()
            .then((favorite) => {
                return {
                    ...board,
                    isFavorite: !!favorite,
                };
            });
        });

        const boardsWithFavoriteBoolean = Promise.all(boardsWithFavoriteRelation);

        return boardsWithFavoriteBoolean; //return the fetched boards.
    },
})