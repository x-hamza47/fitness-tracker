import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useUpdateProfile } from "@/features/profile/useProfile";
import { cn } from "@/lib/utils";
import { accountSchema, type AccountValues } from "@/schemas/profileSchema";
import type { UserProfile } from "@/types/profile";
import { Field, INPUT } from "@/pages/dashboard/Progress/components/Field";

const PRIMARY_BUTTON =
    "flex cursor-pointer items-center justify-center rounded-sm bg-(--color-accent) px-4 py-2.5 text-[10px] font-semibold tracking-[0.15em] text-black uppercase transition-opacity hover:opacity-90 focus-visible:ring-2 focus-visible:ring-white focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50";

export default function AccountForm({ profile }: { profile: UserProfile }) {
    const { submitAsync, isPending, errorMessage } = useUpdateProfile();
    const [saved, setSaved] = useState(false);

    const {
        register,
        handleSubmit,
        watch,
        reset: resetForm,
        formState: { errors, isDirty },
    } = useForm<AccountValues>({
        resolver: zodResolver(accountSchema),
        defaultValues: {
            name: profile.name,
            username: profile.username,
            bio: profile.bio ?? "",
        },
    });

    const bioLength = watch("bio")?.length ?? 0;

    const onSubmit = handleSubmit(async (values) => {
        try {
            await submitAsync(values);
            resetForm(values);
            setSaved(true);
            setTimeout(() => setSaved(false), 2000);
        } catch {
            // The error is shown below through errorMessage
        }
    });

    return (
        <section
            aria-label="Account"
            className="rounded-sm border border-white/10 bg-white/2 p-5 backdrop-blur-sm"
        >
            <h2 className="text-xs font-semibold tracking-[0.2em] text-white uppercase">Account</h2>
            <p className="mt-1 text-xs text-(--color-text-muted)">
                Your public name, username and bio.
            </p>

            <form onSubmit={onSubmit} noValidate className="mt-5 space-y-4">
                <div className="grid gap-3 sm:grid-cols-2">
                    <Field label="Name" error={errors.name?.message}>
                        <input autoComplete="name" {...register("name")} className={INPUT} />
                    </Field>
                    <Field label="Username" error={errors.username?.message}>
                        <input autoComplete="username" {...register("username")} className={INPUT} />
                    </Field>
                </div>

                <Field label={`Bio (${bioLength}/200)`} error={errors.bio?.message}>
                    <textarea
                        rows={3}
                        placeholder="Tell people about your training"
                        {...register("bio")}
                        className={cn(INPUT, "resize-none")}
                    />
                </Field>

                {errorMessage && (
                    <p role="alert" className="rounded-sm border border-red-500/30 bg-red-500/10 px-3 py-2 text-xs text-red-300">
                        {errorMessage}
                    </p>
                )}

                <div className="flex justify-end">
                    <button
                        type="submit"
                        disabled={isPending || (!isDirty && !saved)}
                        className={cn(PRIMARY_BUTTON, saved && "bg-emerald-500 disabled:opacity-100")}
                    >
                        {isPending ? "Saving..." : saved ? "Saved ✓" : "Save changes"}
                    </button>
                </div>
            </form>
        </section>
    );
}