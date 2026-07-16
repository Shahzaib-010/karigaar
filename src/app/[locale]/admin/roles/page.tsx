"use client";

import { toast } from "sonner";
import { PlusIcon, RefreshCwIcon } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            Roles &amp; Permissions
          </h1>
          <p className="text-sm text-muted-foreground">
            Define what each role can do. Client, admin and superadmin are
            protected.
          </p>
        </div>
        <div className="flex items-center gap-2">
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
          <RoleFormSheet
            trigger={
              <Button size="sm">
                <PlusIcon className="size-4" />
                Create role
              </Button>
            }
          />
        </div>
      </div>

      <Card>
        <CardContent className="p-0">
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
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Role</TableHead>
                  <TableHead className="text-right">Permissions</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {roles.map((role) => {
                  const protectedRole = isProtected(role.name);
                  return (
                    <TableRow key={role.id}>
                      <TableCell className="font-medium">
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
                      <TableCell className="text-right">
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
          )}
        </CardContent>
      </Card>
    </div>
  );
}
