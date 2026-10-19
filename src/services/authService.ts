import axios from "axios";
import type { LoginPayload, RegisterPayload } from "@/schemas/authSchema";

export type AuthUser = {
    id: string;
    name: string;
    email: string;
};

export type AuthResult = {
    user: AuthUser;
    token: string;
};

export function getAuthErrorMessage(error: unknown): string {
    if (axios.isAxiosError(error)) {
        if (error.code === "ECONNABORTED") return "The request timed out. Please try again.";
        if (!error.response) return "Can't reach the server. Check your connection.";
        const message = (error.response.data as { message?: string } | undefined)?.message;
        if (message) return message;
    }
    return "Something went wrong. Please try again.";
}

const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));

export async function loginRequest(payload: LoginPayload): Promise<AuthResult> {
    // --- REAL API ---
    // const { data } = await api.post("/auth/login", payload);
    // return data.data;

    await wait(700);
    if (payload.password === "wrong") {
        throw {
            isAxiosError: true,
            response: { status: 401, data: { message: "Invalid email or password." } },
        };
    }
    return {
        token: "mock-token",
        user: { id: "1", name: "Forge Athlete", email: payload.email },
    };
}

export async function registerRequest(payload: RegisterPayload): Promise<AuthResult> {
    // --- REAL API ---
    // const { data } = await api.post("/auth/register", payload);
    // return data.data;

    await wait(900);
    return {
        token: "mock-token",
        user: { id: "1", name: payload.name, email: payload.email },
    };
}