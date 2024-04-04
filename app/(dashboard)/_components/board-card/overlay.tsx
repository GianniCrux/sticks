export const Overlay = () => {
    return ( //This overlay works becuase of the group-hover attribute that connects with the group attribute of the div inside the index file so everything inside that div that has that className group will reacts to the group 
        <div className="opacity-0 group-hover:opacity-50 transition-opacity h-full w-full bg-black">
 
        </div>
    )
}