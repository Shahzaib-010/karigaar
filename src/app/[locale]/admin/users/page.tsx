"use client";

import { useMemo, useState } from "react";
import { toast } from "sonner";
import {
  RefreshCwIcon,
  ShieldCheckIcon,
  TagsIcon,
  UserCheckIcon,
  UsersIcon,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  PageHeader,
  Panel,
  PanelHead,
  Reveal,
  StatCard,
} from "@/src/components/admin/DashboardKit";
import DonutChart, {
  type DonutDatum,
} from "@/src/components/admin/charts/DonutChart";
import { categoricalColor } from "@/src/components/admin/charts/palette";
import type { AdminUser } from "@/src/lib/api";
import type { AppQueryError } from "@/src/store/baseQuery";
import {
  useGetRolesQuery,
  useGetUsersQuery,
  useUpdateUserRoleMutation,
} from "@/src/store/adminApi";

function roleNames(user: AdminUser): string[] {
  return (user.roles ?? []).map((r) => (typeof r === "string" ? r : r.name));
}

function primaryRole(user: AdminUser): string {
  return roleNames(user)[0] ?? "unassigned";
}

export default function AdminUsersPage() {
  const [search, setSearch] = useState("");

  const { data: users, isLoading, isFetching, isError, error, refetch } =
    useGetUsersQuery();
  const { data: roles = [] } = useGetRolesQuery();

  const filtered = useMemo(() => {
    if (!users) return [];
    const q = search.trim().toLowerCase();
    if (!q) return users;
    return users.filter(
      (u) =>
        u.name.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q),
    );
  }, [users, search]);

  const roleStats = useMemo(() => {
    const map = new Map<string, number>();
    let admins = 0;
    let clients = 0;
    for (const u of users ?? []) {
      const names = roleNames(u);
      const primary = primaryRole(u);
      map.set(primary, (map.get(primary) ?? 0) + 1);
      if (names.some((n) => n === "admin" || n === "superadmin")) admins += 1;
      if (names.includes("client")) clients += 1;
    }
    const donut: DonutDatum[] = [...map.entries()]
      .sort((a, b) => b[1] - a[1])
      .map(([name, value], i) => ({
        key: name,
        label: name.charAt(0).toUpperCase() + name.slice(1),
        value,
        color: categoricalColor(i),
      }));
    return { admins, clients, donut };
  }, [users]);

  return (
    <div className="w-full space-y-4 px-3 py-4 sm:px-4 lg:px-6 lg:py-5">
      <PageHeader
        title="Users"
        subtitle="Assign roles. Promote a registered client to admin here."
        actions={
          <Button
            variant="outline"
            size="sm"
            onClick={() => refetch()}
            disabled={isFetching}
            className="h-9 rounded-full px-3.5"
          >
            <RefreshCwIcon className={isFetching ? "size-3.5 animate-spin" : "size-3.5"} />
            <span className="hidden sm:inline">Refresh</span>
          </Button>
        }
      />

      {/* Stat cards */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {isLoading || !users ? (
          Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-24 rounded-2xl" />
          ))
        ) : (
          <>
            <Reveal>
              <StatCard
                icon={UsersIcon}
                label="Total users"
                value={users.length.toLocaleString()}
                note="Registered accounts"
              />
            </Reveal>
            <Reveal delay={0.05}>
              <StatCard
                icon={ShieldCheckIcon}
                label="Admins"
                value={roleStats.admins.toLocaleString()}
                note="Admin or superadmin"
                accent="#8B5CF6"
              />
            </Reveal>
            <Reveal delay={0.1}>
              <StatCard
                icon={UserCheckIcon}
                label="Clients"
                value={roleStats.clients.toLocaleString()}
                note="Booking customers"
                accent="#0EA5E9"
              />
            </Reveal>
            <Reveal delay={0.15}>
              <StatCard
                icon={TagsIcon}
                label="Roles defined"
                value={roles.length.toLocaleString()}
                note="Assignable roles"
              />
            </Reveal>
          </>
        )}
      </div>

      {/* Role distribution */}
      {isLoading || !users ? (
        <Skeleton className="h-56 rounded-2xl" />
      ) : roleStats.donut.length > 0 ? (
        <Reveal delay={0.1}>
          <Panel>
            <PanelHead title="Users by role" subtitle="Who has access to what" />
            <div className="px-1 pt-4">
              <DonutChart data={roleStats.donut} centerLabel="Users" />
            </div>
          </Panel>
        </Reveal>
      ) : null}

      <Input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search by name or email"
        className="max-w-sm rounded-lg"
      />

      <Panel className="p-0">
          {isError ? (
            <div className="flex flex-col items-center gap-3 py-12 text-center">
              <p className="text-sm font-medium text-destructive">
                {(error as AppQueryError | undefined)?.message ??
                  "Could not load users."}
              </p>
              <Button variant="outline" size="sm" onClick={() => refetch()}>
                Try again
              </Button>
            </div>
          ) : isLoading || !users ? (
            <div className="space-y-2 p-4">
              {Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} className="h-10 rounded-md" />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="py-12 text-center text-sm text-muted-foreground">
              No users found.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent">
                    <TableHead className="pl-5">Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead className="w-48 pr-5">Role</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell className="pl-5 font-medium">{user.name}</TableCell>
                      <TableCell className="text-muted-foreground">
                        {user.email}
                      </TableCell>
                      <TableCell className="pr-5">
                        <UserRoleSelect
                          user={user}
                          roleOptions={roles.map((r) => r.name)}
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
      </Panel>
    </div>
  );
}

function UserRoleSelect({
  user,
  roleOptions,
}: {
  user: AdminUser;
  roleOptions: string[];
}) {
  const current = roleNames(user)[0] ?? "";
  const [updateUserRole, { isLoading }] = useUpdateUserRoleMutation();

  // Ensure the current role is always an option even if not in the roles list.
  const options = roleOptions.includes(current)
    ? roleOptions
    : [current, ...roleOptions].filter(Boolean);

  async function onChange(role: string) {
    if (!role || role === current) return;
    try {
      await updateUserRole({ id: user.id, role }).unwrap();
      toast.success(`${user.name} is now ${role}`);
    } catch (e) {
      const message =
        e && typeof e === "object" && "message" in e
          ? String((e as { message: unknown }).message)
          : "Could not update role.";
      toast.error(message);
    }
  }

  return (
    <select
      value={current}
      disabled={isLoading}
      onChange={(e) => onChange(e.target.value)}
      className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm capitalize outline-none focus:border-ring focus:ring-2 focus:ring-ring/40 disabled:opacity-60"
    >
      {options.map((r) => (
        <option key={r} value={r}>
          {r}
        </option>
      ))}
    </select>
  );
}
