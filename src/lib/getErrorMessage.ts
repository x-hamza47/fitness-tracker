import axios from "axios";

export function getErrorMessage(err: unknown, fallback = "Something went wrong"): string {
    if (axios.isAxiosError(err)) {
        return (err.response?.data as { message?: string } | undefined)?.message ?? err.message ?? fallback;
    }
    if (err instanceof Error) return err.message;
    return fallback;
}