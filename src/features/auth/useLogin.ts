import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@/stores/authStore";
import { getAuthErrorMessage, loginRequest } from "@/services/authService";
import type { LoginValues } from "@/schemas/authSchema";
import { AFTER_AUTH_PATH } from "./constants";

export function useLogin() {
    const navigate = useNavigate();
    const login = useAuthStore((s) => s.login);

    const mutation = useMutation({
        mutationFn: ({ email, password }: LoginValues) =>
            loginRequest({ email, password }),
        onSuccess: ({ user, token }, variables) => {
            login(user, token, variables.remember);
            const destination = user.role === "admin" ? "/admin" : AFTER_AUTH_PATH;
            navigate(destination, { replace: true });
        },
    });

    return {
        submit: mutation.mutate,
        isPending: mutation.isPending,
        errorMessage: mutation.isError ? getAuthErrorMessage(mutation.error) : null,
        reset: mutation.reset,
    };
}