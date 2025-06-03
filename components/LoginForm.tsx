"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { signIn } from "next-auth/react"

export default function LoginForm() {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    try {
      const result = await signIn("credentials", {
        username,
        password,
        redirect: false,
      })

      if (result?.error) {
        setError("Identifiants invalides")
        setIsLoading(false)
      } else if (result?.ok) {
        router.push("/dashboard")
      }
    } catch (error) {
      console.error("Login error:", error)
      setError("Une erreur s'est produite lors de la connexion")
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 w-full max-w-md">
      <h1 className="text-2xl font-bold mb-6">Connexion</h1>
      {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">{error}</div>}
      <div>
        <label htmlFor="username" className="block mb-2">
          Nom d'utilisateur
        </label>
        <input
          type="text"
          id="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full p-2 border rounded"
          required
          disabled={isLoading}
        />
      </div>
      <div>
        <label htmlFor="password" className="block mb-2">
          Mot de passe
        </label>
        <input
          type="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-2 border rounded"
          required
          disabled={isLoading}
        />
      </div>
      <button
        type="submit"
        className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition-colors"
        disabled={isLoading}
      >
        {isLoading ? "Connexion en cours..." : "Se connecter"}
      </button>
    </form>
  )
}
