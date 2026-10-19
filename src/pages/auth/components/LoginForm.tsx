import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, type LoginValues } from "@/schemas/authSchema";
import FormField from "./FormField";

interface LoginFormProps {
    onSubmit: (values: LoginValues) => void | Promise<unknown>;
    onSwitch: () => void;
    isPending?: boolean;
    serverError?: string | null;
}

export default function LoginForm({
    onSubmit,
    onSwitch,
    isPending = false,
    serverError,
}: LoginFormProps) {
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<LoginValues>({
        resolver: zodResolver(loginSchema),
        defaultValues: { email: "", password: "", remember: false },
    });

    const busy = isSubmitting || isPending;

    return (
        <div className="relative flex h-full flex-col overflow-y-auto p-6 sm:p-8">
            <div
                aria-hidden="true"
                className="absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-(--color-accent-dark)/70 to-transparent "
            />

            <p className="text-[11px] tracking-[0.2em] text-(--color-accent-dark) uppercase">
               Sign in
            </p>
            <h1 className="mt-3 text-3xl leading-none font-semibold tracking-tighter text-(--color-text) uppercase">
                Welcome <span className="text-(--color-accent-dark)">back.</span>
            </h1>
            <p className="mt-3 text-sm leading-6 text-(--color-text-muted)">
                Pick up where you left off.
            </p>

            <form
                onSubmit={handleSubmit(onSubmit)}
                noValidate
                className="mt-6 flex flex-1 flex-col gap-1"
            >
                <FormField
                    label="Email"
                    type="email"
                    autoComplete="email"
                    placeholder="you@example.com"
                    error={errors.email?.message}
                    {...register("email")}
                />

                <FormField
                    label="Password"
                    type="password"
                    autoComplete="current-password"
                    placeholder="Your password"
                    error={errors.password?.message}
                    {...register("password")}
                />

                <label className="flex w-fit cursor-pointer items-center gap-2.5 text-xs text-(--color-text-muted)">
                    <input
                        type="checkbox"
                        className="size-4 cursor-pointer accent-(--color-accent-dark)"
                        {...register("remember")}
                    />
                    Remember me
                </label>

                {serverError && (
                    <p
                        role="alert"
                        className="mt-3 rounded-sm border border-red-500/30 bg-red-500/10 px-3 py-2 text-xs text-red-400"
                    >
                        {serverError}
                    </p>
                )}

                <button
                    type="submit"
                    disabled={busy}
                    className="group/btn mt-5 flex cursor-pointer  items-center justify-center rounded-sm bg-(--color-accent-dark) px-5 py-3.5 text-sm sm:text-base font-bold tracking-wide uppercase transition-[filter] hover:brightness-110 focus-visible:ring-2 focus-visible:ring-white focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-60"
                >
                    {busy ? "Signing in..." : "Sign in"}
                    {/* <IconArrowUpRight
                        size={18}
                        aria-hidden="true"
                        className="transition-transform group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5"
                    /> */}
                </button>

                <p className="mt-auto pt-6 text-center text-xs text-(--color-text-muted)">
                    New to Forge?{" "}
                    <button
                        type="button"
                        onClick={onSwitch}
                        className="cursor-pointer font-semibold text-(--color-text) underline-offset-4 transition-colors hover:text-(--color-accent-dark) hover:underline focus-visible:underline focus-visible:outline-none"
                    >
                        Create an account
                    </button>
                </p>
            </form>
        </div>
    );
}