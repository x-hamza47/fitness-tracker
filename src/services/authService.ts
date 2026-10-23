import axios from "axios";
import { api } from "@/lib/api";
import type { LoginPayload, RegisterPayload } from "@/schemas/authSchema";

export type AuthUser = {
    id: string;
    name: string;
    username: string;
    email: string;
    role: "user" | "admin";
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

export async function loginRequest(payload: LoginPayload): Promise<AuthResult> {
    const { data } = await api.post("/auth/login", payload);
    return data.data;
}

export async function registerRequest(payload: RegisterPayload): Promise<AuthResult> {
    const { data } = await api.post("/auth/register", payload);
    return data.data;
}

export async function getMeRequest(): Promise<AuthUser> {
    const { data } = await api.get("/auth/me");
    return data.data.user;
}