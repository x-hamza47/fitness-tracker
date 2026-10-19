import { useState } from "react";
import { Navigate } from "react-router-dom";
import FlipCard from "@/components/ui/FlipCard";
import { useIsAuthenticated } from "@/stores/authStore";
import { useLogin } from "@/features/auth/useLogin";
import { useRegister } from "@/features/auth/useRegister";
import { AFTER_AUTH_PATH } from "@/features/auth/constants";
import AuthArt from "./components/AuthArt";
import LoginForm from "./components/LoginForm";
import RegisterForm from "./components/RegisterForm";

const PANEL_BG = "#0b0b0d";
const PANEL = "flex h-full overflow-hidden rounded-2xl border border-white/10";

export default function AuthPage() {
    const [isRegister, setIsRegister] = useState(false);
    const isAuthenticated = useIsAuthenticated();
    const loginState = useLogin();
    const registerState = useRegister();

    const switchTo = (register: boolean) => {
        loginState.reset();
        registerState.reset();
        setIsRegister(register);
    };

    if (isAuthenticated) return <Navigate to={AFTER_AUTH_PATH} replace />;

    return (
        <section className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#030304] px-4 pt-28 pb-16 sm:px-6">
            <div className="relative z-10 flex w-full justify-center">
                <FlipCard
                    className="lg:[--fc-w:960px]!"
                    interactive
                    flipped={isRegister}
                    onFlipChange={switchTo}
                    draggable
                    flipOnClick={false}
                    axis="y"
                    tilt={false}
                    glare={false}
                    shadow={false}
                    width={420}
                    height={720}
                    radius={16}
                    background={PANEL_BG}
                    color="#f5f5f5"
                    ariaLabel="Sign in or create an account"
                    front={
                        <div className={`${PANEL} ${isRegister ? "pointer-events-none" : ""}`}>
                            <AuthArt variant="login" />
                            <div className="h-full min-w-0 flex-1">
                                <LoginForm
                                    onSubmit={loginState.submit}
                                    onSwitch={() => switchTo(true)}
                                    isPending={loginState.isPending}
                                    serverError={loginState.errorMessage}
                                />
                            </div>
                        </div>
                    }
                    back={
                        <div className={`${PANEL} ${!isRegister ? "pointer-events-none" : ""}`}>
                            <div className="h-full min-w-0 flex-1">
                                <RegisterForm
                                    onSubmit={registerState.submit}
                                    onSwitch={() => switchTo(false)}
                                    isPending={registerState.isPending}
                                    serverError={registerState.errorMessage}
                                />
                            </div>
                            <AuthArt variant="register" />
                        </div>
                    }
                />
            </div>
        </section>
    );
}