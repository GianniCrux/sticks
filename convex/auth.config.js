export default {
    providers: [
        { //all the docs are here https://docs.convex.dev/auth/clerk
            domain:"https://good-aardvark-9.clerk.accounts.dev", //This is taken from tehe jwt templates created with clerk
            applicationID: "convex", //This is set according to the jwt templates' aud, check clerk/jwt templates. 
        },
    ]
};