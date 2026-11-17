import { useState } from "react";
import {
    IconEdit,
    IconEye,
    IconPlus,
    IconSearch,
    IconTrash,
    IconUserCheck,
    IconUserX,
    IconBarbell,
    IconToolsKitchen2,
    IconLifebuoy,
} from "@tabler/icons-react";
import Avatar from "@/components/ui/Avatar";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import Drawer from "@/components/ui/Drawer";
import {
    useAdminUsers,
    useAdminUserDetails,
    useCreateAdminUser,
    useDeleteUser,
    useToggleUserStatus,
    useUpdateAdminUser,
} from "@/features/admin/useAdmin";
import { useAuthStore } from "@/stores/authStore";
import type { AdminUserItem } from "@/services/adminService";
import { cn } from "@/lib/utils";

type FormState = {
    open: boolean;
    mode: "create" | "edit";
    user?: AdminUserItem | null;
};

export default function AdminUsers() {
    const currentAdmin = useAuthStore((s) => s.user);

    const [search, setSearch] = useState("");
    const [role, setRole] = useState("all");
    const [status, setStatus] = useState("all");
    const [page, setPage] = useState(1);

    const { data, isLoading, isError } = useAdminUsers({
        search: search || undefined,
        role: role !== "all" ? role : undefined,
        status: status !== "all" ? status : undefined,
        page,
        limit: 12,
    });

    const toggleStatus = useToggleUserStatus();
    const deleteUser = useDeleteUser();
    const createUser = useCreateAdminUser();
    const updateUser = useUpdateAdminUser();

    // Dialog & Drawer States
    const [deletingUser, setDeletingUser] = useState<AdminUserItem | null>(null);
    const [viewingUserId, setViewingUserId] = useState<string | null>(null);
    const [formState, setFormState] = useState<FormState>({
        open: false,
        mode: "create",
        user: null,
    });

    // Form inputs
    const [formName, setFormName] = useState("");
    const [formUsername, setFormUsername] = useState("");
    const [formEmail, setFormEmail] = useState("");
    const [formPassword, setFormPassword] = useState("");
    const [formRole, setFormRole] = useState<"user" | "admin">("user");
    const [formIsActive, setFormIsActive] = useState(true);

    const { data: userDetails, isLoading: isDetailsLoading } = useAdminUserDetails(viewingUserId);

    const openCreateDrawer = () => {
        setFormName("");
        setFormUsername("");
        setFormEmail("");
        setFormPassword("");
        setFormRole("user");
        setFormIsActive(true);
        setFormState({ open: true, mode: "create", user: null });
    };

    const openEditDrawer = (u: AdminUserItem) => {
        setFormName(u.name);
        setFormUsername(u.username);
        setFormEmail(u.email);
        setFormPassword("");
        setFormRole(u.role);
        setFormIsActive(u.isActive);
        setFormState({ open: true, mode: "edit", user: u });
    };

    const handleFormSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (formState.mode === "create") {
            await createUser.mutateAsync({
                name: formName,
                username: formUsername,
                email: formEmail,
                password: formPassword,
                role: formRole,
                isActive: formIsActive,
            });
            setFormState({ open: false, mode: "create", user: null });
        } else if (formState.mode === "edit" && formState.user) {
            await updateUser.mutateAsync({
                id: formState.user.id,
                payload: {
                    name: formName,
                    username: formUsername,
                    email: formEmail,
                    role: formRole,
                    isActive: formIsActive,
                    ...(formPassword.trim() ? { password: formPassword.trim() } : {}),
                },
            });
            setFormState({ open: false, mode: "edit", user: null });
        }
    };

    const handleDelete = async () => {
        if (!deletingUser) return;
        await deleteUser.mutateAsync(deletingUser.id);
        setDeletingUser(null);
    };

    return (
        <div className="mx-auto max-w-5xl space-y-6">
            <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                <div>
                    <p className="text-[10px] tracking-[0.25em] text-white/40 uppercase">Administration</p>
                    <h1 className="mt-1 text-2xl font-semibold text-white sm:text-3xl">Manage Users</h1>
                    <p className="mt-1 text-sm text-(--color-text-muted)">
                        Search accounts, create and edit athletes or administrators, toggle status, and delete accounts.
                    </p>
                </div>

                <div>
                    <button
                        type="button"
                        onClick={openCreateDrawer}
                        className="flex cursor-pointer items-center gap-1.5 rounded-sm bg-(--color-accent) px-4 py-2 text-xs font-semibold tracking-wider text-black uppercase hover:opacity-90"
                    >
                        <IconPlus size={16} />
                        New User
                    </button>
                </div>
            </header>

            {/* Filters */}
            <div className="flex flex-wrap items-center gap-3 rounded-xl border border-white/10 bg-white/3 p-4 backdrop-blur-md shadow-lg">
                <div className="relative flex-1 min-w-[220px]">
                    <IconSearch size={16} className="absolute left-3 top-2.5 text-white/40" />
                    <input
                        type="text"
                        placeholder="Search by name, username, or email..."
                        value={search}
                        onChange={(e) => {
                            setSearch(e.target.value);
                            setPage(1);
                        }}
                        className="w-full rounded-sm border border-white/15 bg-white/5 py-1.5 pl-9 pr-3 text-xs text-white focus:border-white/40 focus:outline-none"
                    />
                </div>

                <div className="flex items-center gap-2">
                    <select
                        value={role}
                        onChange={(e) => {
                            setRole(e.target.value);
                            setPage(1);
                        }}
                        className="rounded-sm border border-white/15 bg-white/5 px-2.5 py-1.5 text-xs text-white focus:outline-none scheme-dark"
                    >
                        <option value="all">All Roles</option>
                        <option value="user">Athletes (Users)</option>
                        <option value="admin">Administrators</option>
                    </select>

                    <select
                        value={status}
                        onChange={(e) => {
                            setStatus(e.target.value);
                            setPage(1);
                        }}
                        className="rounded-sm border border-white/15 bg-white/5 px-2.5 py-1.5 text-xs text-white focus:outline-none scheme-dark"
                    >
                        <option value="all">All Status</option>
                        <option value="active">Active</option>
                        <option value="inactive">Deactivated</option>
                    </select>
                </div>
            </div>

            {/* Users Table */}
            <div className="overflow-x-auto rounded-xl border border-white/10 bg-white/3 backdrop-blur-md shadow-xl">
                <table className="w-full text-left text-xs text-white/80">
                    <thead className="border-b border-white/10 bg-white/5 text-[10px] font-semibold tracking-wider text-white/50 uppercase">
                        <tr>
                            <th className="px-4 py-3">User</th>
                            <th className="px-4 py-3">Email</th>
                            <th className="px-4 py-3">Role</th>
                            <th className="px-4 py-3">Status</th>
                            <th className="px-4 py-3">Joined</th>
                            <th className="px-4 py-3 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {isLoading ? (
                            <tr>
                                <td colSpan={6} className="p-8 text-center text-white/50">
                                    Loading accounts...
                                </td>
                            </tr>
                        ) : isError ? (
                            <tr>
                                <td colSpan={6} className="p-8 text-center text-red-400">
                                    Failed to load accounts.
                                </td>
                            </tr>
                        ) : data?.users.length === 0 ? (
                            <tr>
                                <td colSpan={6} className="p-8 text-center text-(--color-text-muted)">
                                    No users found matching your filters.
                                </td>
                            </tr>
                        ) : (
                            data?.users.map((u) => {
                                const isSelf = u.id === currentAdmin?.id;

                                return (
                                    <tr key={u.id} className="transition-colors hover:bg-white/2">
                                        <td className="px-4 py-3.5">
                                            <div className="flex items-center gap-3">
                                                <Avatar name={u.name} src={u.profilePicture} size="sm" />
                                                <div className="min-w-0">
                                                    <p className="truncate font-semibold text-white">
                                                        {u.name}
                                                        {isSelf && (
                                                            <span className="ml-1.5 text-[9px] text-(--color-accent) font-normal">
                                                                (You)
                                                            </span>
                                                        )}
                                                    </p>
                                                    <p className="truncate text-[11px] text-(--color-text-muted)">
                                                        @{u.username}
                                                    </p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3.5 font-mono text-white/70">{u.email}</td>
                                        <td className="px-4 py-3.5">
                                            <span
                                                className={cn(
                                                    "rounded-sm px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider",
                                                    u.role === "admin"
                                                        ? "bg-(--color-accent)/10 text-(--color-accent) border border-(--color-accent)/30"
                                                        : "bg-white/5 text-white/60",
                                                )}
                                            >
                                                {u.role}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3.5">
                                            <span
                                                className={cn(
                                                    "rounded-sm px-2 py-0.5 text-[10px] font-semibold uppercase",
                                                    u.isActive
                                                        ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30"
                                                        : "bg-red-500/10 text-red-400 border border-red-500/30",
                                                )}
                                            >
                                                {u.isActive ? "Active" : "Deactivated"}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3.5 text-(--color-text-muted)">
                                            {new Date(u.createdAt).toLocaleDateString()}
                                        </td>
                                        <td className="px-4 py-3.5 text-right">
                                            <div className="flex items-center justify-end gap-1">
                                                <button
                                                    type="button"
                                                    onClick={() => setViewingUserId(u.id)}
                                                    title="View user profile & stats"
                                                    className="cursor-pointer rounded-sm p-1.5 text-white/50 hover:bg-white/10 hover:text-white transition-colors"
                                                >
                                                    <IconEye size={16} />
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => openEditDrawer(u)}
                                                    title="Edit user details"
                                                    className="cursor-pointer rounded-sm p-1.5 text-white/50 hover:bg-white/10 hover:text-white transition-colors"
                                                >
                                                    <IconEdit size={16} />
                                                </button>
                                                <button
                                                    type="button"
                                                    disabled={isSelf || toggleStatus.isPending}
                                                    onClick={() => toggleStatus.mutate(u.id)}
                                                    title={u.isActive ? "Deactivate user" : "Activate user"}
                                                    className={cn(
                                                        "cursor-pointer rounded-sm p-1.5 transition-colors disabled:opacity-30 disabled:cursor-not-allowed",
                                                        u.isActive
                                                            ? "text-amber-400 hover:bg-amber-400/10"
                                                            : "text-emerald-400 hover:bg-emerald-400/10",
                                                    )}
                                                >
                                                    {u.isActive ? <IconUserX size={16} /> : <IconUserCheck size={16} />}
                                                </button>
                                                <button
                                                    type="button"
                                                    disabled={isSelf}
                                                    onClick={() => setDeletingUser(u)}
                                                    title="Permanently delete user"
                                                    className="cursor-pointer rounded-sm p-1.5 text-white/40 hover:bg-red-500/10 hover:text-red-400 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                                                >
                                                    <IconTrash size={16} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            {data && data.pages > 1 && (
                <div className="flex items-center justify-between text-xs text-(--color-text-muted)">
                    <span>
                        Page {data.page} of {data.pages} ({data.total} total accounts)
                    </span>
                    <div className="flex gap-2">
                        <button
                            type="button"
                            disabled={page <= 1}
                            onClick={() => setPage((p) => p - 1)}
                            className="cursor-pointer rounded-sm border border-white/10 px-3 py-1 hover:bg-white/5 disabled:opacity-40 disabled:cursor-not-allowed"
                        >
                            Previous
                        </button>
                        <button
                            type="button"
                            disabled={page >= data.pages}
                            onClick={() => setPage((p) => p + 1)}
                            className="cursor-pointer rounded-sm border border-white/10 px-3 py-1 hover:bg-white/5 disabled:opacity-40 disabled:cursor-not-allowed"
                        >
                            Next
                        </button>
                    </div>
                </div>
            )}

            {/* User Form Drawer (Create / Edit) */}
            <Drawer
                open={formState.open}
                onClose={() => setFormState((s) => ({ ...s, open: false }))}
                title={formState.mode === "create" ? "Create New User" : `Edit User: ${formState.user?.name}`}
                description={
                    formState.mode === "create"
                        ? "Register a new athlete or administrator account."
                        : "Modify user account credentials, roles, and status."
                }
                footer={
                    <div className="flex items-center justify-end gap-2">
                        <button
                            type="button"
                            onClick={() => setFormState((s) => ({ ...s, open: false }))}
                            className="rounded-sm border border-white/10 px-4 py-2 text-xs font-semibold tracking-wider text-white uppercase hover:bg-white/5"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            form="admin-user-form"
                            disabled={createUser.isPending || updateUser.isPending}
                            className="rounded-sm bg-(--color-accent) px-5 py-2 text-xs font-semibold tracking-wider text-black uppercase hover:opacity-90 disabled:opacity-50"
                        >
                            {createUser.isPending || updateUser.isPending
                                ? "Saving..."
                                : formState.mode === "create"
                                  ? "Create User"
                                  : "Save Changes"}
                        </button>
                    </div>
                }
            >
                <form id="admin-user-form" onSubmit={handleFormSubmit} className="space-y-4">
                    <div>
                        <label className="block text-[10px] tracking-[0.2em] text-white/50 uppercase">
                            Full Name
                        </label>
                        <input
                            type="text"
                            required
                            placeholder="John Doe"
                            value={formName}
                            onChange={(e) => setFormName(e.target.value)}
                            className="mt-1.5 w-full rounded-sm border border-white/10 bg-white/[0.02] px-3 py-2 text-xs text-white focus:border-white/40 focus:outline-none"
                        />
                    </div>

                    <div>
                        <label className="block text-[10px] tracking-[0.2em] text-white/50 uppercase">
                            Username
                        </label>
                        <input
                            type="text"
                            required
                            placeholder="johndoe"
                            value={formUsername}
                            onChange={(e) => setFormUsername(e.target.value)}
                            className="mt-1.5 w-full rounded-sm border border-white/10 bg-white/[0.02] px-3 py-2 text-xs text-white focus:border-white/40 focus:outline-none"
                        />
                    </div>

                    <div>
                        <label className="block text-[10px] tracking-[0.2em] text-white/50 uppercase">
                            Email Address
                        </label>
                        <input
                            type="email"
                            required
                            placeholder="john@example.com"
                            value={formEmail}
                            onChange={(e) => setFormEmail(e.target.value)}
                            className="mt-1.5 w-full rounded-sm border border-white/10 bg-white/[0.02] px-3 py-2 text-xs text-white focus:border-white/40 focus:outline-none"
                        />
                    </div>

                    <div>
                        <label className="block text-[10px] tracking-[0.2em] text-white/50 uppercase">
                            {formState.mode === "create" ? "Password" : "New Password (leave blank to keep current)"}
                        </label>
                        <input
                            type="password"
                            required={formState.mode === "create"}
                            minLength={8}
                            placeholder={formState.mode === "create" ? "At least 8 characters" : "••••••••"}
                            value={formPassword}
                            onChange={(e) => setFormPassword(e.target.value)}
                            className="mt-1.5 w-full rounded-sm border border-white/10 bg-white/[0.02] px-3 py-2 text-xs text-white focus:border-white/40 focus:outline-none"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-3 pt-1">
                        <div>
                            <label className="block text-[10px] tracking-[0.2em] text-white/50 uppercase">
                                System Role
                            </label>
                            <select
                                value={formRole}
                                onChange={(e) => setFormRole(e.target.value as "user" | "admin")}
                                className="mt-1.5 w-full rounded-sm border border-white/10 bg-white/[0.02] px-3 py-2 text-xs text-white focus:outline-none scheme-dark"
                            >
                                <option value="user">Athlete (User)</option>
                                <option value="admin">Administrator</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-[10px] tracking-[0.2em] text-white/50 uppercase">
                                Account Status
                            </label>
                            <select
                                value={formIsActive ? "active" : "inactive"}
                                onChange={(e) => setFormIsActive(e.target.value === "active")}
                                className="mt-1.5 w-full rounded-sm border border-white/10 bg-white/[0.02] px-3 py-2 text-xs text-white focus:outline-none scheme-dark"
                            >
                                <option value="active">Active</option>
                                <option value="inactive">Deactivated</option>
                            </select>
                        </div>
                    </div>
                </form>
            </Drawer>

            {/* User Details Drawer */}
            <Drawer
                open={!!viewingUserId}
                onClose={() => setViewingUserId(null)}
                title="User Profile & Telemetry"
                description="Comprehensive athlete profile and platform usage overview."
            >
                {isDetailsLoading ? (
                    <div className="p-8 text-center text-xs text-white/50">Loading profile data...</div>
                ) : userDetails ? (
                    <div className="space-y-6">
                        <div className="flex items-center gap-4 rounded-sm border border-white/10 bg-white/3 p-4">
                            <Avatar name={userDetails.name} src={userDetails.profilePicture} size="lg" ring />
                            <div>
                                <h3 className="text-base font-semibold text-white">{userDetails.name}</h3>
                                <p className="text-xs text-(--color-text-muted)">@{userDetails.username}</p>
                                <div className="mt-1.5 flex items-center gap-2">
                                    <span
                                        className={cn(
                                            "rounded-xs px-2 py-0.5 text-[9px] font-semibold uppercase tracking-wider",
                                            userDetails.role === "admin"
                                                ? "bg-(--color-accent)/10 text-(--color-accent) border border-(--color-accent)/30"
                                                : "bg-white/10 text-white/70",
                                        )}
                                    >
                                        {userDetails.role}
                                    </span>
                                    <span
                                        className={cn(
                                            "rounded-xs px-2 py-0.5 text-[9px] font-semibold uppercase",
                                            userDetails.isActive
                                                ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30"
                                                : "bg-red-500/10 text-red-400 border border-red-500/30",
                                        )}
                                    >
                                        {userDetails.isActive ? "Active" : "Deactivated"}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Telemetry Stats */}
                        <div>
                            <h4 className="text-[10px] tracking-[0.2em] text-white/50 uppercase mb-3">
                                Platform Activity
                            </h4>
                            <div className="grid grid-cols-3 gap-2">
                                <div className="rounded-sm border border-white/10 bg-white/2 p-3 text-center">
                                    <IconBarbell size={18} className="mx-auto text-(--color-accent)" />
                                    <p className="mt-1 text-lg font-bold text-white tabular-nums">
                                        {userDetails.stats.workoutsCount}
                                    </p>
                                    <p className="text-[10px] text-white/50 uppercase">Workouts</p>
                                </div>
                                <div className="rounded-sm border border-white/10 bg-white/2 p-3 text-center">
                                    <IconToolsKitchen2 size={18} className="mx-auto text-amber-400" />
                                    <p className="mt-1 text-lg font-bold text-white tabular-nums">
                                        {userDetails.stats.mealsCount}
                                    </p>
                                    <p className="text-[10px] text-white/50 uppercase">Meals</p>
                                </div>
                                <div className="rounded-sm border border-white/10 bg-white/2 p-3 text-center">
                                    <IconLifebuoy size={18} className="mx-auto text-cyan-400" />
                                    <p className="mt-1 text-lg font-bold text-white tabular-nums">
                                        {userDetails.stats.ticketsCount}
                                    </p>
                                    <p className="text-[10px] text-white/50 uppercase">Tickets</p>
                                </div>
                            </div>
                        </div>

                        {/* Profile Info */}
                        <div className="space-y-3 rounded-sm border border-white/10 bg-white/2 p-4 text-xs">
                            <div className="flex justify-between border-b border-white/5 pb-2">
                                <span className="text-white/50">Email</span>
                                <span className="font-mono text-white/90">{userDetails.email}</span>
                            </div>
                            <div className="flex justify-between border-b border-white/5 pb-2">
                                <span className="text-white/50">Joined Date</span>
                                <span className="text-white/90">
                                    {new Date(userDetails.createdAt).toLocaleDateString()}
                                </span>
                            </div>
                            {userDetails.bio && (
                                <div className="border-b border-white/5 pb-2">
                                    <span className="text-white/50 block mb-1">Bio</span>
                                    <p className="text-white/80">{userDetails.bio}</p>
                                </div>
                            )}
                            {userDetails.goal && (
                                <div className="flex justify-between border-b border-white/5 pb-2">
                                    <span className="text-white/50">Fitness Goal</span>
                                    <span className="capitalize text-white/90">{userDetails.goal.replace("_", " ")}</span>
                                </div>
                            )}
                            {userDetails.activityLevel && (
                                <div className="flex justify-between">
                                    <span className="text-white/50">Activity Level</span>
                                    <span className="capitalize text-white/90">{userDetails.activityLevel.replace("_", " ")}</span>
                                </div>
                            )}
                        </div>
                    </div>
                ) : null}
            </Drawer>

            {/* Confirm Delete Dialog */}
            <ConfirmDialog
                open={!!deletingUser}
                title="Delete User Account?"
                message={`Are you sure you want to permanently delete "${deletingUser?.name}" (@${deletingUser?.username})? All their workouts, nutrition logs, check-ins, and data will be permanently wiped.`}
                isPending={deleteUser.isPending}
                onConfirm={handleDelete}
                onCancel={() => setDeletingUser(null)}
            />
        </div>
    );
}
