import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema, type RegisterValues } from "@/schemas/authSchema";
import FormField from "./FormField";

export type RegisterPayload = Omit<RegisterValues, "confirmPassword">;

interface RegisterFormProps {
    onSubmit: (values: RegisterPayload) => void | Promise<unknown>;
    onSwitch: () => void;
    isPending?: boolean;
    serverError?: string | null;
}

export default function RegisterForm({
    onSubmit,
    onSwitch,
    isPending = false,
    serverError,
}: RegisterFormProps) {
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<RegisterValues>({
        resolver: zodResolver(registerSchema),
        defaultValues: { name: "", email: "", password: "", confirmPassword: "" },
    });

    const busy = isSubmitting || isPending;
// eslint-disable-next-line @typescript-eslint/no-unused-vars
    const submit = handleSubmit(({ confirmPassword: _confirm, ...payload }) =>
        onSubmit(payload)
    );

    return (
        <div className="relative flex h-full flex-col overflow-y-auto p-6 sm:p-8">
            <div
                aria-hidden="true"
                className="absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-(--color-accent-dark)/70 to-transparent"
            />

            <p className="text-[11px] tracking-[0.2em] text-(--color-accent-dark) uppercase">
                Create account
            </p>
            <h1 className="mt-3 text-3xl leading-none font-semibold tracking-tighter text-(--color-text) uppercase">
                Start <span className="text-(--color-accent-dark)">forging.</span>
            </h1>
            <p className="mt-3 text-sm leading-6 text-(--color-text-muted)">
                Free to join. Takes under a minute.
            </p>

            <form
                onSubmit={submit}
                noValidate
                className="mt-6 flex flex-1 flex-col gap-1"
            >
                <FormField
                    label="Name"
                    autoComplete="name"
                    placeholder="Your name"
                    error={errors.name?.message}
                    {...register("name")}
                />

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
                    autoComplete="new-password"
                    placeholder="At least 8 characters"
                    error={errors.password?.message}
                    {...register("password")}
                />

                <FormField
                    label="Confirm password"
                    type="password"
                    autoComplete="new-password"
                    placeholder="Repeat your password"
                    error={errors.confirmPassword?.message}
                    {...register("confirmPassword")}
                />

                {serverError && (
                    <p
                        role="alert"
                        className="rounded-sm border border-red-500/30 bg-red-500/10 px-3 py-2 text-xs text-red-400"
                    >
                        {serverError}
                    </p>
                )}

                <button
                    type="submit"
                    disabled={busy}
                    className="group/btn mt-5 flex cursor-pointer  items-center justify-center rounded-sm bg-(--color-accent-dark) px-5 py-3.5 text-sm sm:text-base font-bold tracking-wide uppercase transition-[filter] hover:brightness-110 focus-visible:ring-2 focus-visible:ring-white focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-60"
                >
                    {busy ? "Creating account..." : "Create account"}
                    {/* <IconArrowUpRight
                        size={18}
                        aria-hidden="true"
                        className="transition-transform group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5"
                    /> */}
                </button>

                <p className="mt-auto pt-6 text-center text-xs text-(--color-text-muted)">
                    Already have an account?{" "}
                    <button
                        type="button"
                        onClick={onSwitch}
                        className="cursor-pointer font-semibold text-(--color-text) underline-offset-4 transition-colors hover:text-(--color-accent-dark) hover:underline focus-visible:underline focus-visible:outline-none"
                    >
                        Sign in
                    </button>
                </p>
            </form>
        </div>
    );
}