"use client";

import { useMemo } from "react";
import { toast } from "sonner";
import {
  KeyRoundIcon,
  LockIcon,
  PlusIcon,
  RefreshCwIcon,
  ShieldCheckIcon,
  SlidersHorizontalIcon,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import ConfirmDeleteButton from "@/src/components/admin/ConfirmDeleteButton";
import {
  RoleFormSheet,
  RolePermissionsSheet,
} from "@/src/components/admin/role-forms";
import {
  PageHeader,
  Panel,
  PanelHead,
  Reveal,
  StatCard,
} from "@/src/components/admin/DashboardKit";
import HBarChart from "@/src/components/admin/charts/HBarChart";
import { PROTECTED_ROLES } from "@/src/lib/api";
import type { AppQueryError } from "@/src/store/baseQuery";
import {
  useDeleteRoleMutation,
  useGetPermissionsQuery,
  useGetRolesQuery,
} from "@/src/store/adminApi";

function isProtected(name: string) {
  return (PROTECTED_ROLES as readonly string[]).includes(name);
}

export default function AdminRolesPage() {
  const { data: roles, isLoading, isFetching, isError, error, refetch } =
    useGetRolesQuery();
  const { data: permissions = [] } = useGetPermissionsQuery();
  const [deleteRole] = useDeleteRoleMutation();

  const stats = useMemo(() => {
    const list = roles ?? [];
    const protectedCount = list.filter((r) => isProtected(r.name)).length;
    const byPermissions = [...list]
      .sort((a, b) => (b.permissions?.length ?? 0) - (a.permissions?.length ?? 0))
      .slice(0, 8);
    return {
      total: list.length,
      protectedCount,
      custom: list.length - protectedCount,
      byPermissions,
    };
  }, [roles]);

  return (
    <div className="w-full space-y-4 px-3 py-4 sm:px-4 lg:px-6 lg:py-5">
      <PageHeader
        title="Roles & Permissions"
        subtitle="Define what each role can do. Client, admin and superadmin are protected."
        actions={
          <>
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
            <RoleFormSheet
              trigger={
                <Button size="sm" className="h-9 rounded-full px-4">
                  <PlusIcon className="size-4" />
                  Create role
                </Button>
              }
            />
          </>
        }
      />

      {/* Stat cards */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {isLoading || !roles ? (
          Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-24 rounded-2xl" />
          ))
        ) : (
          <>
            <Reveal>
              <StatCard
                icon={ShieldCheckIcon}
                label="Total roles"
                value={stats.total.toLocaleString()}
                note="Defined in the system"
              />
            </Reveal>
            <Reveal delay={0.05}>
              <StatCard
                icon={SlidersHorizontalIcon}
                label="Custom roles"
                value={stats.custom.toLocaleString()}
                note="Editable & removable"
                accent="#0EA5E9"
              />
            </Reveal>
            <Reveal delay={0.1}>
              <StatCard
                icon={LockIcon}
                label="Protected roles"
                value={stats.protectedCount.toLocaleString()}
                note="Client, admin, superadmin"
                accent="#8B5CF6"
              />
            </Reveal>
            <Reveal delay={0.15}>
              <StatCard
                icon={KeyRoundIcon}
                label="Permissions"
                value={permissions.length.toLocaleString()}
                note="Grantable capabilities"
                accent="#F59E0B"
              />
            </Reveal>
          </>
        )}
      </div>

      {/* Permissions per role */}
      {isLoading || !roles ? (
        <Skeleton className="h-64 rounded-2xl" />
      ) : stats.byPermissions.length > 0 ? (
        <Reveal delay={0.1}>
          <Panel>
            <PanelHead title="Permissions per role" subtitle="Breadth of access" />
            <div className="pt-4">
              <HBarChart
                labels={stats.byPermissions.map(
                  (r) => r.name.charAt(0).toUpperCase() + r.name.slice(1),
                )}
                values={stats.byPermissions.map((r) => r.permissions?.length ?? 0)}
                formatValue={(n) => `${n} permission${n === 1 ? "" : "s"}`}
                height={Math.max(stats.byPermissions.length * 44, 160)}
              />
            </div>
          </Panel>
        </Reveal>
      ) : null}

      <Panel className="p-0">
          {isError ? (
            <div className="flex flex-col items-center gap-3 py-12 text-center">
              <p className="text-sm font-medium text-destructive">
                {(error as AppQueryError | undefined)?.message ??
                  "Could not load roles."}
              </p>
              <Button variant="outline" size="sm" onClick={() => refetch()}>
                Try again
              </Button>
            </div>
          ) : isLoading || !roles ? (
            <div className="space-y-2 p-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-10 rounded-md" />
              ))}
            </div>
          ) : roles.length === 0 ? (
            <div className="py-12 text-center text-sm text-muted-foreground">
              No roles found.
            </div>
          ) : (
            <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead className="pl-5">Role</TableHead>
                  <TableHead className="text-right">Permissions</TableHead>
                  <TableHead className="pr-5 text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {roles.map((role) => {
                  const protectedRole = isProtected(role.name);
                  return (
                    <TableRow key={role.id}>
                      <TableCell className="pl-5 font-medium">
                        <span className="capitalize">{role.name}</span>
                        {protectedRole ? (
                          <Badge
                            variant="outline"
                            className="ml-2 border-transparent bg-muted text-muted-foreground"
                          >
                            Protected
                          </Badge>
                        ) : null}
                      </TableCell>
                      <TableCell className="text-right tabular-nums">
                        {role.permissions?.length ?? 0}
                      </TableCell>
                      <TableCell className="pr-5 text-right">
                        <div className="flex justify-end gap-1">
                          <RolePermissionsSheet
                            role={role}
                            permissions={permissions}
                            trigger={
                              <Button variant="ghost" size="sm">
                                Permissions
                              </Button>
                            }
                          />
                          {protectedRole ? null : (
                            <>
                              <RoleFormSheet
                                role={role}
                                trigger={
                                  <Button variant="ghost" size="sm">
                                    Rename
                                  </Button>
                                }
                              />
                              <ConfirmDeleteButton
                                title={`Delete role "${role.name}"?`}
                                description="Users with only this role lose it. This can't be undone."
                                onConfirm={async () => {
                                  try {
                                    await deleteRole(role.id).unwrap();
                                    toast.success("Role deleted");
                                  } catch (e) {
                                    const message =
                                      e &&
                                      typeof e === "object" &&
                                      "message" in e
                                        ? String(
                                            (e as { message: unknown }).message,
                                          )
                                        : "Could not delete role.";
                                    toast.error(message);
                                  }
                                }}
                              />
                            </>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
            </div>
          )}
      </Panel>
    </div>
  );
}
