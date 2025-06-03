import { redirect } from "next/navigation"
import Link from "next/link"
import StatisticsChart from "@/components/StatisticsChart"
import { getServerSession } from "next-auth"
import { authOptions } from "@/pages/api/auth/[...nextauth]"

export default async function Dashboard() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect("/")
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Tableau de bord</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h2 className="text-xl font-semibold mb-4">Actions</h2>
          <Link
            href="/report/new"
            className="bg-blue-500 text-white p-2 rounded inline-block hover:bg-blue-600 transition-colors"
          >
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
