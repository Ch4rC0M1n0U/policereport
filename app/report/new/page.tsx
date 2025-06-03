import { redirect } from "next/navigation"
import ReportForm from "@/components/ReportForm"
import { getServerSession } from "next-auth"
import { authOptions } from "@/pages/api/auth/[...nextauth]"

export default async function NewReport() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect("/")
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Nouveau cahier de veille</h1>
      <ReportForm />
    </div>
  )
}
