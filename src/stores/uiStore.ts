import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { UnitSystem } from "@/types/profile";

interface UiState {
    sidebarCollapsed: boolean;
    toggleSidebar: () => void;
    setSidebarCollapsed: (collapsed: boolean) => void;
    unitSystem: UnitSystem;
    setUnitSystem: (system: UnitSystem) => void;
}

export const useUiStore = create<UiState>()(
    persist(
        (set) => ({
            sidebarCollapsed: false,
            toggleSidebar: () =>
                set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),
            setSidebarCollapsed: (collapsed) => set({ sidebarCollapsed: collapsed }),
            unitSystem: "metric",
            setUnitSystem: (unitSystem) => set({ unitSystem }),
        }),
        { name: "forge-ui" },
    ),
);