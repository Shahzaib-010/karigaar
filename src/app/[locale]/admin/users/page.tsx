"use client";

import { useMemo, useState } from "react";
import { toast } from "sonner";
import { RefreshCwIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Users</h1>
          <p className="text-sm text-muted-foreground">
            Assign roles. Promote a registered client to admin here.
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => refetch()}
          disabled={isFetching}
        >
          <RefreshCwIcon
            className={isFetching ? "size-4 animate-spin" : "size-4"}
          />
          <span className="hidden sm:inline">Refresh</span>
        </Button>
      </div>

      <Input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search by name or email"
        className="max-w-sm"
      />

      <Card>
        <CardContent className="p-0">
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
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead className="w-48">Role</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium">{user.name}</TableCell>
                    <TableCell className="text-muted-foreground">
                      {user.email}
                    </TableCell>
                    <TableCell>
                      <UserRoleSelect
                        user={user}
                        roleOptions={roles.map((r) => r.name)}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
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
