import { useEffect, useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useAuthStore } from "@/store/useAuthStore"
import {
  apiGetAdminUsers,
  apiUpdateUserRole,
  apiDeleteUser,
  type ApiUser,
} from "@/lib/api"
import { useSEO } from "@/hooks/useSEO"
import { ConfirmDialog } from "@/components/ui/confirm-dialog"
import { AdminEmptyState } from "@/components/admin/AdminEmptyState"
import { ListRowSkeleton } from "@/components/admin/AdminSkeleton"
import { toast } from "sonner"
import { Users, Shield, ShieldOff, Trash2, UserCircle } from "lucide-react"

export default function AdminUsers() {
  useSEO({ title: "Admin — Utilisateurs" })
  const currentUser = useAuthStore((s) => s.user)
  const [users, setUsers] = useState<ApiUser[]>([])
  const [loading, setLoading] = useState(true)
  const [deleteId, setDeleteId] = useState<number | null>(null)
  const [deleting, setDeleting] = useState(false)
  const [roleChangeUser, setRoleChangeUser] = useState<ApiUser | null>(null)
  const [changingRole, setChangingRole] = useState(false)

  const fetchUsers = () => {
    setLoading(true)
    apiGetAdminUsers()
      .then(setUsers)
      .catch(() => toast.error("Erreur lors du chargement"))
      .finally(() => setLoading(false))
  }

  useEffect(() => { fetchUsers() }, [])

  const handleRoleChange = async () => {
    if (!roleChangeUser) return
    setChangingRole(true)
    const newRole = roleChangeUser.role === "admin" ? "user" : "admin"
    try {
      await apiUpdateUserRole(roleChangeUser.id, newRole as "user" | "admin")
      toast.success(`Role mis a jour: ${newRole}`)
      fetchUsers()
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Erreur lors de la mise a jour")
    } finally {
      setChangingRole(false)
      setRoleChangeUser(null)
    }
  }

  const handleDelete = async () => {
    if (!deleteId) return
    setDeleting(true)
    try {
      await apiDeleteUser(deleteId)
      toast.success("Utilisateur supprime")
      fetchUsers()
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Erreur lors de la suppression")
    } finally {
      setDeleting(false)
      setDeleteId(null)
    }
  }

  const isSelf = (userId: number) => currentUser?.id === userId

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-2xl font-bold text-foreground">Utilisateurs</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {users.length} utilisateur{users.length > 1 ? "s" : ""} inscrit{users.length > 1 ? "s" : ""}
        </p>
      </div>

      {/* User list */}
      {loading ? (
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => (
            <ListRowSkeleton key={i} />
          ))}
        </div>
      ) : users.length === 0 ? (
        <AdminEmptyState
          icon={Users}
          title="Aucun utilisateur"
          description="Aucun utilisateur inscrit pour le moment."
        />
      ) : (
        <div className="space-y-3">
          {users.map((u) => (
            <div
              key={u.id}
              className="flex items-center justify-between rounded-2xl border border-border bg-card p-5 transition-all hover:shadow-sm"
            >
              <div className="flex items-center gap-4 min-w-0">
                <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${
                  u.role === "admin" ? "bg-royal/10 text-royal" : "bg-muted text-muted-foreground"
                }`}>
                  <UserCircle className="h-5 w-5" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="font-heading font-bold text-foreground truncate">
                      {u.full_name}
                    </h3>
                    {isSelf(u.id) && (
                      <Badge variant="outline" className="text-[10px]">Vous</Badge>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground truncate">{u.email}</p>
                  <p className="text-xs text-muted-foreground/60">
                    Inscrit le {new Date(u.created_at).toLocaleDateString("fr-FR", {
                      day: "numeric", month: "long", year: "numeric",
                    })}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 shrink-0 ml-4">
                <Badge className={
                  u.role === "admin"
                    ? "bg-royal/10 text-royal border-royal/20"
                    : "bg-muted text-muted-foreground border-border"
                }>
                  {u.role === "admin" ? "Admin" : "Utilisateur"}
                </Badge>

                {!isSelf(u.id) && (
                  <>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setRoleChangeUser(u)}
                      className="rounded-full text-xs"
                      title={u.role === "admin" ? "Retirer les droits admin" : "Promouvoir admin"}
                    >
                      {u.role === "admin" ? (
                        <><ShieldOff className="mr-1 h-3.5 w-3.5" /> Retirer admin</>
                      ) : (
                        <><Shield className="mr-1 h-3.5 w-3.5" /> Promouvoir</>
                      )}
                    </Button>
                    <button
                      onClick={() => setDeleteId(u.id)}
                      className="flex h-8 w-8 items-center justify-center rounded-full text-muted-foreground hover:bg-red-50 hover:text-red-500 transition-colors"
                      title="Supprimer"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Role change dialog */}
      <ConfirmDialog
        open={roleChangeUser !== null}
        onOpenChange={(open) => !open && setRoleChangeUser(null)}
        title={roleChangeUser?.role === "admin" ? "Retirer les droits admin ?" : "Promouvoir en admin ?"}
        description={
          roleChangeUser?.role === "admin"
            ? `${roleChangeUser?.full_name} ne pourra plus acceder au panneau d'administration.`
            : `${roleChangeUser?.full_name} aura acces a l'ensemble du panneau d'administration.`
        }
        confirmLabel={roleChangeUser?.role === "admin" ? "Retirer" : "Promouvoir"}
        variant={roleChangeUser?.role === "admin" ? "danger" : "default"}
        loading={changingRole}
        onConfirm={handleRoleChange}
      />

      {/* Delete dialog */}
      <ConfirmDialog
        open={deleteId !== null}
        onOpenChange={(open) => !open && setDeleteId(null)}
        title="Supprimer cet utilisateur ?"
        description="Cette action est irreversible. L'utilisateur et ses temoignages seront definitivement supprimes."
        confirmLabel="Supprimer"
        variant="danger"
        loading={deleting}
        onConfirm={handleDelete}
      />
    </div>
  )
}
