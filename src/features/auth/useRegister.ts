import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@/stores/authStore";
import { getAuthErrorMessage, registerRequest } from "@/services/authService";
import { AFTER_AUTH_PATH } from "./constants.ts";

export function useRegister() {
    const navigate = useNavigate();
    const login = useAuthStore((s) => s.login);

    const mutation = useMutation({
        mutationFn: registerRequest,
        onSuccess: ({ user, token }) => {
            login(user, token, true);
            navigate(AFTER_AUTH_PATH, { replace: true });
        },
    });

    return {
        submit: mutation.mutate,
        isPending: mutation.isPending,
        errorMessage: mutation.isError ? getAuthErrorMessage(mutation.error) : null,
        reset: mutation.reset,
    };
}