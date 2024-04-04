import { v } from "convex/values";
import { query } from "./_generated/server";

export const get = query({
    args: { //accept the arguments of orgId which is gonna be the required argument
        orgId: v.string(),
    },
    handler: async(ctx, args) => { 
        const identity = await ctx.auth.getUserIdentity();
        
        if(!identity) {
            throw new Error("Unauthorized");
        }

        const boards = await ctx.db
        .query("boards") //querying the "boards" collection
        .withIndex("by_org", (q) => q.eq("orgId", args.orgId)) //Filter by index, eq stands for equal to. 
        .order("desc") //Order results in descending order
        .collect(); //Fetch the query results. 
//(q)=> q.eq("orgId", args.orgId)) this provides the filtering criteria in which q reprents the query builder and the rest of the expression means find documents where the orgId field exactly matches the value in args.orgId
       
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