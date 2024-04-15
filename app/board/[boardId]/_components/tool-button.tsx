"use client";

import { LucideIcon } from "lucide-react";

import { Hint } from "@/components/hint";
import { Button } from "@/components/ui/button";


interface ToolButtonProps {
    label: string;
    icon: LucideIcon;
    onClick: ()=> void;
    isActive?: boolean;
    isDisabled?: boolean;
};

export const ToolButton = ({
    label,
    icon: Icon, //This props is a type of LucideIcon so it means that we have to render it, and in order to do so we just have to create an alias and capitalize it. So once it is capitalized we can just use it as a Component immediatly
    onClick,
    isActive,
    isDisabled,
}: ToolButtonProps) => {
    return (
        <Hint label={label} side="right" sideOffset={14}>
            <Button
                disabled={isDisabled}
                onClick={onClick}
                size="icon"
                variant={isActive ? "boardActive" : "board"}
            >
                <Icon />
            </Button>

        </Hint>
    )
}