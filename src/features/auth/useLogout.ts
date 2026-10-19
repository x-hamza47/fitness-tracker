import { useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@/stores/authStore";

export function useLogout() {
    const queryClient = useQueryClient();
    const navigate = useNavigate();
    const logout = useAuthStore((s) => s.logout);

    return () => {
        logout();
        queryClient.clear();
        navigate("/", { replace: true });
    };
}