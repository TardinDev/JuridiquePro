import { useEffect, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { useSEO } from "@/hooks/useSEO"
import {
  apiGetBackupSummary,
  apiDownloadBackup,
  apiRestoreBackup,
  type BackupSummary,
} from "@/lib/api"
import { ConfirmDialog } from "@/components/ui/confirm-dialog"
import { toast } from "sonner"
import { Download, Upload, Database, AlertTriangle, FileJson } from "lucide-react"

const TABLE_LABELS: Record<keyof BackupSummary["counts"], string> = {
  users: "Utilisateurs",
  testimonials: "Témoignages",
  contact_messages: "Messages de contact",
  blog_posts: "Articles de blog",
  homepage_content: "Contenus homepage",
}

export default function AdminBackup() {
  useSEO({ title: "Admin — Sauvegardes" })

  const [summary, setSummary] = useState<BackupSummary | null>(null)
  const [loading, setLoading] = useState(true)
  const [exporting, setExporting] = useState(false)
  const [importing, setImporting] = useState(false)
  const [pendingPayload, setPendingPayload] = useState<unknown | null>(null)
  const [pendingReplace, setPendingReplace] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const fetchSummary = () => {
    setLoading(true)
    apiGetBackupSummary()
      .then(setSummary)
      .catch(() => toast.error("Erreur lors du chargement du résumé"))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    fetchSummary()
  }, [])

  const handleExport = async () => {
    setExporting(true)
    try {
      await apiDownloadBackup()
      toast.success("Backup téléchargé")
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Échec de l'export")
    } finally {
      setExporting(false)
    }
  }

  const handleFileSelected = (e: React.ChangeEvent<HTMLInputElement>, replace: boolean) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => {
      try {
        const parsed = JSON.parse(reader.result as string)
        if (!parsed?.tables || typeof parsed.version !== "number") {
          toast.error("Fichier invalide : ce n'est pas un backup JuridiquePro")
          return
        }
        setPendingPayload(parsed)
        setPendingReplace(replace)
      } catch {
        toast.error("Fichier illisible (JSON invalide)")
      }
    }
    reader.readAsText(file)
    e.target.value = ""
  }

  const triggerImport = (replace: boolean) => {
    if (!fileInputRef.current) return
    fileInputRef.current.dataset.replace = String(replace)
    fileInputRef.current.click()
  }

  const confirmImport = async () => {
    if (!pendingPayload) return
    setImporting(true)
    try {
      const result = await apiRestoreBackup(pendingPayload, pendingReplace)
      const insertedTotal = Object.values(result.inserted).reduce((a, b) => a + b, 0)
      toast.success(`${result.message} (${insertedTotal} lignes ajoutées)`)
      fetchSummary()
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Échec de l'import")
    } finally {
      setImporting(false)
      setPendingPayload(null)
      setPendingReplace(false)
    }
  }

  const totalRows = summary
    ? Object.values(summary.counts).reduce((a, b) => a + b, 0)
    : 0

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-heading text-2xl font-bold text-foreground">Sauvegardes</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Exportez et restaurez l'intégralité du contenu de la base de données.
        </p>
      </div>

      {/* Database summary */}
      <div className="rounded-2xl border border-border bg-card p-6">
        <div className="mb-4 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-royal/10 text-royal">
            <Database className="h-5 w-5" />
          </div>
          <div>
            <h2 className="font-heading text-base font-bold text-foreground">État actuel</h2>
            <p className="text-xs text-muted-foreground">
              {loading ? "Chargement..." : `${totalRows} lignes au total`}
            </p>
          </div>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {summary &&
            (Object.keys(summary.counts) as (keyof BackupSummary["counts"])[]).map((key) => (
              <div key={key} className="rounded-xl border border-border bg-muted/20 p-4">
                <p className="text-xs text-muted-foreground">{TABLE_LABELS[key]}</p>
                <p className="mt-1 text-2xl font-bold text-foreground">{summary.counts[key]}</p>
              </div>
            ))}
        </div>
      </div>

      {/* Export */}
      <div className="rounded-2xl border border-border bg-card p-6">
        <div className="flex items-start gap-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-green-500/10 text-green-600">
            <Download className="h-5 w-5" />
          </div>
          <div className="flex-1">
            <h2 className="font-heading text-base font-bold text-foreground">Exporter</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Télécharge un fichier JSON contenant toutes les tables. À conserver
              en lieu sûr (Drive, Dropbox, disque externe).
            </p>
            <Button onClick={handleExport} disabled={exporting} className="mt-4">
              <Download className="h-4 w-4 mr-2" />
              {exporting ? "Export en cours..." : "Télécharger le backup"}
            </Button>
          </div>
        </div>
      </div>

      {/* Import */}
      <div className="rounded-2xl border border-border bg-card p-6">
        <div className="flex items-start gap-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-500/10 text-blue-600">
            <Upload className="h-5 w-5" />
          </div>
          <div className="flex-1">
            <h2 className="font-heading text-base font-bold text-foreground">Restaurer</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Importez un fichier de backup JSON. Deux modes :
            </p>
            <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
              <li>
                <strong className="text-foreground">Fusion</strong> — ajoute uniquement les lignes
                dont l'ID n'existe pas déjà (sans risque pour les données actuelles).
              </li>
              <li>
                <strong className="text-foreground">Remplacement</strong> — efface toutes les données
                actuelles avant import (irréversible).
              </li>
            </ul>
            <div className="mt-4 flex flex-wrap gap-3">
              <Button
                onClick={() => triggerImport(false)}
                disabled={importing}
                variant="outline"
              >
                <FileJson className="h-4 w-4 mr-2" />
                Importer (fusion)
              </Button>
              <Button
                onClick={() => triggerImport(true)}
                disabled={importing}
                variant="destructive"
              >
                <AlertTriangle className="h-4 w-4 mr-2" />
                Importer (remplacement)
              </Button>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="application/json,.json"
              className="hidden"
              onChange={(e) => {
                const replace = e.target.dataset.replace === "true"
                handleFileSelected(e, replace)
              }}
            />
          </div>
        </div>
      </div>

      <ConfirmDialog
        open={pendingPayload !== null}
        onOpenChange={(open) => {
          if (!open) {
            setPendingPayload(null)
            setPendingReplace(false)
          }
        }}
        title={pendingReplace ? "Confirmer le remplacement" : "Confirmer l'import"}
        description={
          pendingReplace
            ? "Toutes les données actuelles seront SUPPRIMÉES et remplacées par celles du backup. Cette action est irréversible."
            : "Les lignes manquantes du backup seront ajoutées à la base. Les lignes existantes ne seront pas modifiées."
        }
        confirmLabel={pendingReplace ? "Remplacer tout" : "Importer"}
        variant={pendingReplace ? "danger" : "default"}
        onConfirm={confirmImport}
        loading={importing}
      />
    </div>
  )
}
