"use client";
import { useEffect, useState } from "react";

import { RenameModal } from "@/components/modals/rename-modal";

export const ModalProvider = () => {
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() =>{
        setIsMounted(true);
    }, []) //go to 3:44:00 to the theory of this 

    if (!isMounted) {
        return null;
    }

    return (
        <>
            <RenameModal />
        </>
    )
}