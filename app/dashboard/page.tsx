import { getServerSession } from "next-auth/next"
import { redirect } from "next/navigation"
import Link from "next/link"
import StatisticsChart from "@/components/StatisticsChart"

export default async function Dashboard() {
  const session = await getServerSession()
  if (!session) {
    redirect("/")
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Tableau de bord</h1>
      <div className="grid grid-cols-2 gap-8">
        <div>
          <h2 className="text-xl font-semibold mb-4">Actions</h2>
          <Link href="/report/new" className="bg-blue-500 text-white p-2 rounded inline-block">
            Créer un nouveau cahier de veille
          </Link>
        </div>
        <div>
          <h2 className="text-xl font-semibold mb-4">Statistiques</h2>
          <StatisticsChart />
        </div>
      </div>
    </div>
  )
}
