import Image from "next/image"
import LoginForm from "@/components/LoginForm"

export default async function Home() {
  const res = await fetch("https://api.unsplash.com/photos/random?query=police&orientation=landscape", {
    headers: {
      Authorization: `Client-ID ${process.env.UNSPLASH_ACCESS_KEY}`,
    },
  })
  const data = await res.json()
  const imageUrl = data.urls.regular

  return (
    <main className="flex min-h-screen">
      <div className="w-1/2 relative">
        <Image src={imageUrl || "/placeholder.svg"} alt="Background" layout="fill" objectFit="cover" />
      </div>
      <div className="w-1/2 flex items-center justify-center">
        <LoginForm />
      </div>
    </main>
  )
}

