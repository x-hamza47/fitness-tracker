
import { createContext, useContext } from "react";
import type { Dispatch, SetStateAction } from "react";

type MouseEnterContextValue = [
    boolean,
    Dispatch<SetStateAction<boolean>>
];

export const MouseEnterContext =
    createContext<MouseEnterContextValue | undefined>(undefined);

export const useMouseEnter = () => {
    const context = useContext(MouseEnterContext);

    if (context === undefined) {
        throw new Error(
            "useMouseEnter must be used within a MouseEnterProvider"
        );
    }

    return context;
};
