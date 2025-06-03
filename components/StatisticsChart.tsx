"use client"

import { Bar } from "react-chartjs-2"
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js"

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

export default function StatisticsChart() {
  const data = {
    labels: ["Missions en attente", "Missions postposées", "Missions programmées"],
    datasets: [
      {
        label: "Nombre de missions",
        data: [12, 19, 3],
        backgroundColor: "rgba(75, 192, 192, 0.6)",
      },
    ],
  }

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
      },
      title: {
        display: true,
        text: "Statistiques des missions",
      },
    },
  }

  return <Bar data={data} options={options} />
}

