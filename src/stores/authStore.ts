import { create } from "zustand";
import { persist, createJSONStorage, type StateStorage } from "zustand/middleware";
import type { AuthUser } from "@/services/authService";

let remember = true;

const authStorage: StateStorage = {
    getItem: (name) => {
        const local = localStorage.getItem(name);
        if (local !== null) {
            remember = true;
            return local;
        }
        const session = sessionStorage.getItem(name);
        if (session !== null) remember = false;
        return session;
    },
    setItem: (name, value) => {
        const keep = remember ? localStorage : sessionStorage;
        const drop = remember ? sessionStorage : localStorage;
        keep.setItem(name, value);
        drop.removeItem(name);
    },
    removeItem: (name) => {
        localStorage.removeItem(name);
        sessionStorage.removeItem(name);
    },
};

interface AuthState {
    user: AuthUser | null;
    token: string | null;
    login: (user: AuthUser, token: string, remember: boolean) => void;
    logout: () => void;
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            user: null,
            token: null,
            login: (user, token, shouldRemember) => {
                remember = shouldRemember; 
                set({ user, token }); 
            },
            logout: () => set({ user: null, token: null }),
        }),
        { name: "forge-auth", storage: createJSONStorage(() => authStorage) }
    )
);

export const useIsAuthenticated = () => useAuthStore((s) => !!s.token);