"use client";

import { useMemo, useState, type ReactNode } from "react";
import { toast } from "sonner";
import { Loader2Icon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import type { Permission, Role } from "@/src/lib/api";
import {
  useCreateRoleMutation,
  useSyncRolePermissionsMutation,
  useUpdateRoleMutation,
} from "@/src/store/adminApi";

function errMessage(e: unknown): string {
  if (
    e &&
    typeof e === "object" &&
    "message" in e &&
    typeof (e as { message: unknown }).message === "string"
  ) {
    return (e as { message: string }).message;
  }
  return "Something went wrong.";
}

/* ── Create / rename role ────────────────────────────────────────────── */

export function RoleFormSheet({
  role,
  trigger,
}: {
  role?: Role;
  trigger: ReactNode;
}) {
  const isEdit = Boolean(role);
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");

  const [createRole, { isLoading: creating }] = useCreateRoleMutation();
  const [updateRole, { isLoading: updating }] = useUpdateRoleMutation();
  const busy = creating || updating;

  function handleOpenChange(next: boolean) {
    if (next) setName(role?.name ?? "");
    setOpen(next);
  }

  const canSubmit = Boolean(name.trim()) && !busy;

  async function onSubmit() {
    if (!canSubmit) return;
    try {
      if (isEdit && role) {
        await updateRole({ id: role.id, name: name.trim() }).unwrap();
        toast.success("Role renamed");
      } else {
        await createRole({ name: name.trim() }).unwrap();
        toast.success("Role created");
      }
      setOpen(false);
    } catch (e) {
      toast.error(errMessage(e));
    }
  }

  return (
    <Sheet open={open} onOpenChange={handleOpenChange}>
      <SheetTrigger asChild>{trigger}</SheetTrigger>
      <SheetContent className="flex w-full flex-col gap-0 sm:max-w-md">
        <SheetHeader>
          <SheetTitle>{isEdit ? "Rename role" : "Create role"}</SheetTitle>
          <SheetDescription>
            {isEdit
              ? "Change this role's name."
              : "Create a role, then set its permissions."}
          </SheetDescription>
        </SheetHeader>
        <div className="flex-1 space-y-4 px-4">
          <label className="block space-y-1.5">
            <span className="text-sm font-medium">
              Name<span className="text-destructive"> *</span>
            </span>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. dispatcher"
            />
          </label>
        </div>
        <SheetFooter>
          <Button disabled={!canSubmit} onClick={onSubmit}>
            {busy ? <Loader2Icon className="size-4 animate-spin" /> : null}
            {isEdit ? "Save" : "Create role"}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}

/* ── Permission matrix ───────────────────────────────────────────────── */

export function RolePermissionsSheet({
  role,
  permissions,
  trigger,
}: {
  role: Role;
  permissions: Permission[];
  trigger: ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<Set<string>>(new Set());

  const [syncPermissions, { isLoading: saving }] =
    useSyncRolePermissionsMutation();

  // Group permissions by their prefix (e.g. "order" from "order.create").
  const groups = useMemo(() => {
    const map = new Map<string, Permission[]>();
    for (const p of permissions) {
      const key = p.name.includes(".") ? p.name.split(".")[0] : "other";
      const list = map.get(key) ?? [];
      list.push(p);
      map.set(key, list);
    }
    return Array.from(map.entries()).sort(([a], [b]) => a.localeCompare(b));
  }, [permissions]);

  function handleOpenChange(next: boolean) {
    if (next) {
      setSelected(new Set((role.permissions ?? []).map((p) => p.name)));
    }
    setOpen(next);
  }

  function toggle(name: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(name)) next.delete(name);
      else next.add(name);
      return next;
    });
  }

  function toggleGroup(names: string[], allOn: boolean) {
    setSelected((prev) => {
      const next = new Set(prev);
      names.forEach((n) => (allOn ? next.delete(n) : next.add(n)));
      return next;
    });
  }

  async function onSave() {
    try {
      await syncPermissions({
        id: role.id,
        permissions: Array.from(selected),
      }).unwrap();
      toast.success("Permissions updated");
      setOpen(false);
    } catch (e) {
      toast.error(errMessage(e));
    }
  }

  return (
    <Sheet open={open} onOpenChange={handleOpenChange}>
      <SheetTrigger asChild>{trigger}</SheetTrigger>
      <SheetContent className="flex w-full flex-col gap-0 sm:max-w-lg">
        <SheetHeader>
          <SheetTitle>Permissions · {role.name}</SheetTitle>
          <SheetDescription>
            {selected.size} of {permissions.length} permissions selected.
          </SheetDescription>
        </SheetHeader>

        <div className="flex-1 space-y-5 overflow-y-auto px-4 py-2">
          {groups.map(([group, perms]) => {
            const names = perms.map((p) => p.name);
            const allOn = names.every((n) => selected.has(n));
            return (
              <div key={group} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    {group}
                  </span>
                  <button
                    type="button"
                    onClick={() => toggleGroup(names, allOn)}
                    className="text-xs font-medium text-primary hover:underline"
                  >
                    {allOn ? "Clear all" : "Select all"}
                  </button>
                </div>
                <div className="grid grid-cols-1 gap-1.5 sm:grid-cols-2">
                  {perms.map((p) => (
                    <label
                      key={p.id}
                      className="flex items-center gap-2 rounded-md border border-input px-2.5 py-1.5 text-sm"
                    >
                      <input
                        type="checkbox"
                        checked={selected.has(p.name)}
                        onChange={() => toggle(p.name)}
                        className="size-4 accent-primary"
                      />
                      <span className="truncate">{p.name}</span>
                    </label>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        <SheetFooter>
          <Button disabled={saving} onClick={onSave}>
            {saving ? <Loader2Icon className="size-4 animate-spin" /> : null}
            Save permissions
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
