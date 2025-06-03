"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"

const schema = z.object({
  // ENTÊTE
  date: z.string().nonempty("La date est requise"),
  serie: z.enum(["1", "2", "3"], { required_error: "La série est requise" }),
  officerId: z.string().nonempty("L'identifiant de l'officier est requis"),

  // ÉTAT DES MISSIONS
  pendingMissions: z.number().min(0, "Le nombre doit être positif"),
  pendingMissionsRemarks: z.string().optional(),
  postponedMissions: z.number().min(0, "Le nombre doit être positif"),
  postponedMissionsRemarks: z.string().optional(),
  scheduledMissions: z.number().min(0, "Le nombre doit être positif"),
  scheduledMissionsRemarks: z.string().optional(),

  // PERSONNEL PRÉSENT
  sunray: z.string().array(),
  charco: z.string().array(),
  atf: z.string().array(),

  // ÉQUIPES TERRAIN
  constatTeams: z
    .number()
    .min(0)
    .refine(
      (val) => {
        const serie = watch("serie")
        if (serie === "1" && val !== 9) return false
        if (serie === "2" && val !== 12) return false
        if (serie === "3" && val !== 10) return false
        return true
      },
      {
        message: "Le nombre d'équipes constat ne correspond pas à la série sélectionnée",
      },
    )
    .optional(),
  constatRemarks: z.string().optional(),
  panterTeams: z.number().min(0),
  panterRemarks: z.string().optional(),
  psoTeams: z.number().min(0),
  psoRemarks: z.string().optional(),
  eagleTeams: z.number().min(0),
  eagleRemarks: z.string().optional(),
  mobilityTeams: z.number().min(0),
  mobilityRemarks: z.string().optional(),

  // MISSIONS
  paragonMissions: z.number().min(0),
  cadPauseMissions: z.number().min(0),
  realPV: z.number().min(0),
  proxiMissions: z.number().min(0),
  proxiForms: z.number().min(0),
  psoMissions: z.number().min(0),
  eagleMissions: z.number().min(0),

  // FIN DE SERVICE
  previousSunray: z.string(),
  pendingMissionsToResume: z.number().min(0),
  pendingMissionsToResumeRemarks: z.string().optional(),
  postponedMissionsToResume: z.number().min(0),
  postponedMissionsToResumeRemarks: z.string().optional(),
  scheduledMissionsToResume: z.number().min(0),
  scheduledMissionsToResumeRemarks: z.string().optional(),

  // REMARQUES FINALES
  generalRemarks: z.string().optional(),
  equipmentList: z.string().array(),
  equipmentRemarks: z.string().optional(),
})

type FormData = z.infer<typeof schema>

export default function ReportForm() {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  })
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [constatTeamsWarning, setConstatTeamsWarning] = useState<string | null>(null)

  const onSubmit = async (data: FormData) => {
    setSubmitting(true)
    setError(null)
    try {
      const warningMessage = getConstatTeamsWarning(data.serie, data.constatTeams)
      setConstatTeamsWarning(warningMessage)

      const dataToSubmit = {
        ...data,
        constatTeamsWarning: warningMessage,
      }

      const response = await fetch("/api/reports", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dataToSubmit),
      })
      if (!response.ok) throw new Error("Erreur lors de l'envoi du rapport")
      setSuccess(true)
    } catch (error) {
      setError(error.message)
    } finally {
      setSubmitting(false)
    }
  }

  // Fonction auxiliaire pour obtenir le message d'avertissement
  const getConstatTeamsWarning = (serie: string, constatTeams: number): string | null => {
    if (serie === "1" && constatTeams !== 9) {
      return "Le nombre d'équipes constat ne correspond pas à la série 1 (attendu : 9)"
    }
    if (serie === "2" && constatTeams !== 12) {
      return "Le nombre d'équipes constat ne correspond pas à la série 2 (attendu : 12)"
    }
    if (serie === "3" && constatTeams !== 10) {
      return "Le nombre d'équipes constat ne correspond pas à la série 3 (attendu : 10)"
    }
    return null
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* ENTÊTE */}
      <Card>
        <CardContent className="grid gap-6 pt-6">
          <h2 className="text-xl font-semibold">ENTÊTE</h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="date">Date du jour</Label>
              <Input type="date" id="date" {...register("date")} />
              {errors.date && <p className="text-sm text-red-500">{errors.date.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="serie">Série</Label>
              <select id="serie" {...register("serie")} className="w-full p-2 border rounded">
                <option value="">Sélectionnez une série</option>
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
              </select>
              {errors.serie && <p className="text-sm text-red-500">{errors.serie.message}</p>}
            </div>
            <div className="space-y-2 col-span-2">
              <Label htmlFor="officerId">Identifiant Officier</Label>
              <Input type="text" id="officerId" {...register("officerId")} />
              {errors.officerId && <p className="text-sm text-red-500">{errors.officerId.message}</p>}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* ÉTAT DES MISSIONS */}
      <Card>
        <CardContent className="grid gap-6 pt-6">
          <h2 className="text-xl font-semibold">ÉTAT DES MISSIONS</h2>
          <div className="grid gap-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="pendingMissions">Missions en attente</Label>
                <Input type="number" id="pendingMissions" {...register("pendingMissions", { valueAsNumber: true })} />
                {errors.pendingMissions && <p className="text-sm text-red-500">{errors.pendingMissions.message}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="pendingMissionsRemarks">Remarques</Label>
                <Textarea id="pendingMissionsRemarks" {...register("pendingMissionsRemarks")} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="postponedMissions">Missions reportées</Label>
                <Input
                  type="number"
                  id="postponedMissions"
                  {...register("postponedMissions", { valueAsNumber: true })}
                />
                {errors.postponedMissions && <p className="text-sm text-red-500">{errors.postponedMissions.message}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="postponedMissionsRemarks">Remarques</Label>
                <Textarea id="postponedMissionsRemarks" {...register("postponedMissionsRemarks")} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="scheduledMissions">Missions planifiées</Label>
                <Input
                  type="number"
                  id="scheduledMissions"
                  {...register("scheduledMissions", { valueAsNumber: true })}
                />
                {errors.scheduledMissions && <p className="text-sm text-red-500">{errors.scheduledMissions.message}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="scheduledMissionsRemarks">Remarques</Label>
                <Textarea id="scheduledMissionsRemarks" {...register("scheduledMissionsRemarks")} />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* PERSONNEL PRÉSENT */}
      <Card>
        <CardContent className="grid gap-6 pt-6">
          <h2 className="text-xl font-semibold">PERSONNEL PRÉSENT</h2>
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="sunray">Sunray</Label>
              <Input type="text" id="sunray" {...register("sunray")} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="charco">Charco</Label>
              <Input type="text" id="charco" {...register("charco")} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="atf">ATF</Label>
              <Input type="text" id="atf" {...register("atf")} />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* ÉQUIPES TERRAIN */}
      <Card>
        <CardContent className="grid gap-6 pt-6">
          <h2 className="text-xl font-semibold">ÉQUIPES TERRAIN</h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="constatTeams">Équipes constat</Label>
              <Input type="number" id="constatTeams" {...register("constatTeams", { valueAsNumber: true })} />
              {errors.constatTeams && <p className="text-sm text-red-500">{errors.constatTeams.message}</p>}
              {constatTeamsWarning && <p className="text-sm text-yellow-500">{constatTeamsWarning}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="constatRemarks">Remarques</Label>
              <Textarea id="constatRemarks" {...register("constatRemarks")} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="panterTeams">Équipes Panter</Label>
              <Input type="number" id="panterTeams" {...register("panterTeams", { valueAsNumber: true })} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="panterRemarks">Remarques</Label>
              <Textarea id="panterRemarks" {...register("panterRemarks")} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="psoTeams">Équipes PSO</Label>
              <Input type="number" id="psoTeams" {...register("psoTeams", { valueAsNumber: true })} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="psoRemarks">Remarques</Label>
              <Textarea id="psoRemarks" {...register("psoRemarks")} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="eagleTeams">Équipes Eagle</Label>
              <Input type="number" id="eagleTeams" {...register("eagleTeams", { valueAsNumber: true })} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="eagleRemarks">Remarques</Label>
              <Textarea id="eagleRemarks" {...register("eagleRemarks")} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="mobilityTeams">Équipes Mobilité</Label>
              <Input type="number" id="mobilityTeams" {...register("mobilityTeams", { valueAsNumber: true })} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="mobilityRemarks">Remarques</Label>
              <Textarea id="mobilityRemarks" {...register("mobilityRemarks")} />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* MISSIONS */}
      <Card>
        <CardContent className="grid gap-6 pt-6">
          <h2 className="text-xl font-semibold">MISSIONS</h2>
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="paragonMissions">Paragon</Label>
              <Input type="number" id="paragonMissions" {...register("paragonMissions", { valueAsNumber: true })} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="cadPauseMissions">CAD Pause</Label>
              <Input type="number" id="cadPauseMissions" {...register("cadPauseMissions", { valueAsNumber: true })} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="realPV">Real PV</Label>
              <Input type="number" id="realPV" {...register("realPV", { valueAsNumber: true })} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="proxiMissions">Proxi Missions</Label>
              <Input type="number" id="proxiMissions" {...register("proxiMissions", { valueAsNumber: true })} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="proxiForms">Proxi Formulaires</Label>
              <Input type="number" id="proxiForms" {...register("proxiForms", { valueAsNumber: true })} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="psoMissions">PSO Missions</Label>
              <Input type="number" id="psoMissions" {...register("psoMissions", { valueAsNumber: true })} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="eagleMissions">Eagle Missions</Label>
              <Input type="number" id="eagleMissions" {...register("eagleMissions", { valueAsNumber: true })} />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* FIN DE SERVICE */}
      <Card>
        <CardContent className="grid gap-6 pt-6">
          <h2 className="text-xl font-semibold">FIN DE SERVICE</h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="previousSunray">Sunray Précédent</Label>
              <Input type="text" id="previousSunray" {...register("previousSunray")} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="pendingMissionsToResume">Missions en attente à reprendre</Label>
              <Input
                type="number"
                id="pendingMissionsToResume"
                {...register("pendingMissionsToResume", { valueAsNumber: true })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="pendingMissionsToResumeRemarks">Remarques</Label>
              <Textarea id="pendingMissionsToResumeRemarks" {...register("pendingMissionsToResumeRemarks")} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="postponedMissionsToResume">Missions reportées à reprendre</Label>
              <Input
                type="number"
                id="postponedMissionsToResume"
                {...register("postponedMissionsToResume", { valueAsNumber: true })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="postponedMissionsToResumeRemarks">Remarques</Label>
              <Textarea id="postponedMissionsToResumeRemarks" {...register("postponedMissionsToResumeRemarks")} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="scheduledMissionsToResume">Missions planifiées à reprendre</Label>
              <Input
                type="number"
                id="scheduledMissionsToResume"
                {...register("scheduledMissionsToResume", { valueAsNumber: true })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="scheduledMissionsToResumeRemarks">Remarques</Label>
              <Textarea id="scheduledMissionsToResumeRemarks" {...register("scheduledMissionsToResumeRemarks")} />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* REMARQUES FINALES */}
      <Card>
        <CardContent className="grid gap-6 pt-6">
          <h2 className="text-xl font-semibold">REMARQUES FINALES</h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="generalRemarks">Remarques générales</Label>
              <Textarea id="generalRemarks" {...register("generalRemarks")} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="equipmentList">Liste du matériel</Label>
              <Input type="text" id="equipmentList" {...register("equipmentList")} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="equipmentRemarks">Remarques sur le matériel</Label>
              <Textarea id="equipmentRemarks" {...register("equipmentRemarks")} />
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end space-x-4">
        <Button variant="outline" type="reset" disabled={submitting}>
          Réinitialiser
        </Button>
        <Button type="submit" disabled={submitting}>
          {submitting ? "Envoi en cours..." : "Envoyer le rapport"}
        </Button>
      </div>
    </form>
  )
}
