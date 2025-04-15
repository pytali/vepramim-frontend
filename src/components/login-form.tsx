"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Lock, User } from "lucide-react"

export default function LoginForm() {
  const router = useRouter()
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    try {
      const response = await fetch("/api/auth", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || "Falha na autenticação")
      }

      await response.json()

      // Redirecionar para o dashboard
      router.push("/dashboard")

      // Forçar um refresh da página para garantir que o middleware seja executado
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Ocorreu um erro durante o login")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="glass-card rounded-2xl p-8 shadow-xl">
      <div className="mb-8">
        <h2 className="text-2xl font-light text-gray-900 dark:text-white mb-2">Login</h2>
        <p className="text-gray-600 dark:text-gray-400 text-sm">Entre com suas credenciais para acessar o sistema</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="username" className="text-gray-700 dark:text-gray-300 text-sm">
            Usuário
          </Label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-500">
              <User size={18} />
            </div>
            <Input
              id="username"
              type="text"
              placeholder="Digite seu usuário"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="pl-10 bg-white/50 dark:bg-background/30 border-gray-300 dark:border-gray-700 focus:border-gray-400 dark:focus:border-gray-500 h-12 rounded-xl"
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="password" className="text-gray-700 dark:text-gray-300 text-sm">
            Senha
          </Label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-500">
              <Lock size={18} />
            </div>
            <Input
              id="password"
              type="password"
              placeholder="Digite sua senha"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="pl-10 bg-white/50 dark:bg-background/30 border-gray-300 dark:border-gray-700 focus:border-gray-400 dark:focus:border-gray-500 h-12 rounded-xl"
              required
            />
          </div>
        </div>

        {error && (
          <Alert
            variant="destructive"
            className="bg-red-100 dark:bg-red-900/20 border-red-200 dark:border-red-800 text-red-800 dark:text-red-300"
          >
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <Button
          type="submit"
          className="w-full h-12 rounded-xl bg-gray-900 hover:bg-gray-800 text-white dark:bg-white/10 dark:hover:bg-white/20 dark:text-white dark:border dark:border-white/20"
          disabled={isLoading}
        >
          {isLoading ? "Autenticando..." : "Entrar"}
        </Button>
      </form>

      <div className="mt-8 text-center text-xs text-gray-500">Brasil Digital © {new Date().getFullYear()}</div>
    </div>
  )
}
