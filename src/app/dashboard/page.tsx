"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Search, Server, Wifi, Activity, LogOut } from "lucide-react"
import { Logo } from "@/components/logo"

export default function Dashboard() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [oltCount, setOltCount] = useState(0)

  useEffect(() => {
    // Buscar dados reais das OLTs
    async function fetchOLTs() {
      try {
        const response = await fetch("/api/olts")

        if (!response.ok) {
          if (response.status === 401) {
            // Se não autorizado, redirecionar para login
            router.push("/")
            return
          }
          console.error("Erro ao buscar OLTs:", await response.text())
          setOltCount(0)
        } else {
          const {data} = await response.json()
          // Assumindo que a API retorna um array de OLTs
          setOltCount(data.length || 0)
        }
      } catch (error) {
        console.error("Erro ao buscar OLTs:", error)
        setOltCount(0)
      } finally {
        setIsLoading(false)
      }
    }

    fetchOLTs()
  }, [router])

  async function handleLogout() {
    try {
      // Chamar a API para remover os cookies
      await fetch("/api/auth", {
        method: "DELETE",
      })

      // Redirecionar para a página de login
      router.push("/")

      // Forçar um refresh da página para garantir que o middleware seja executado
      router.refresh()
    } catch (error) {
      console.error("Erro ao fazer logout:", error)
    }
  }

  return (
      <div className="min-h-screen gradient-bg">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[800px] h-[800px] rounded-full bg-blue-500/10 blur-[150px]"></div>
          <div className="absolute bottom-1/3 right-1/3 w-[600px] h-[600px] rounded-full bg-purple-500/10 blur-[150px]"></div>
        </div>

        <header className="relative z-10 flex justify-between items-center p-6 backdrop-blur-md bg-white/10 dark:bg-black/10">
          <div>
            <Logo height={36} />
          </div>
          <div className="mr-12">
            <Button
                variant="ghost"
                onClick={handleLogout}
                className="rounded-full bg-gray-200/50 hover:bg-gray-200/80 dark:bg-white/5 dark:hover:bg-white/10 text-gray-700 dark:text-white transition-all duration-300 w-10 hover:w-24 p-0 overflow-hidden flex justify-start items-center"
            >
              <div className="flex items-center justify-center min-w-10 h-10">
                <LogOut className="h-5 w-5" />
              </div>
              <span className="pr-3 font-medium">Sair</span>
            </Button>
          </div>
        </header>

        <main className="relative z-10 container mx-auto p-6 pt-12">
          <h2 className="text-3xl font-light text-gray-900 dark:text-white mb-2">Dashboard</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-12">Visão geral do sistema</p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="glass-card rounded-2xl p-6 transition-all duration-300 hover:translate-y-[-5px]">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-light text-gray-900 dark:text-white">OLTs</h3>
                <div className="w-10 h-10 rounded-full flex items-center justify-center bg-gray-200/70 dark:bg-white/10">
                  <Server className="h-5 w-5 text-gray-700 dark:text-white" />
                </div>
              </div>
              <p className="text-4xl font-light text-gray-900 dark:text-white mb-4">{isLoading ? "..." : oltCount}</p>
              <p className="text-gray-600 dark:text-gray-400 text-sm">Total de OLTs no sistema</p>
            </div>

            <div className="glass-card rounded-2xl p-6 transition-all duration-300 hover:translate-y-[-5px]">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-light text-gray-900 dark:text-white">ONUs</h3>
                <div className="w-10 h-10 rounded-full flex items-center justify-center bg-gray-200/70 dark:bg-white/10">
                  <Wifi className="h-5 w-5 text-gray-700 dark:text-white" />
                </div>
              </div>
              <div className="mb-4">
                <Button
                    className="bg-gray-900 hover:bg-gray-800 text-white dark:bg-white/10 dark:hover:bg-white/20 dark:text-white dark:border dark:border-white/20 rounded-xl"
                    onClick={() => router.push("/onu-search")}
                >
                  <Search className="h-4 w-4 mr-2" />
                  Pesquisar ONU
                </Button>
              </div>
              <p className="text-gray-600 dark:text-gray-400 text-sm">Busque ONUs por número de série</p>
            </div>

            <div className="glass-card rounded-2xl p-6 transition-all duration-300 hover:translate-y-[-5px]">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-light text-gray-900 dark:text-white">Sistema</h3>
                <div className="w-10 h-10 rounded-full flex items-center justify-center bg-gray-200/70 dark:bg-white/10">
                  <Activity className="h-5 w-5 text-gray-700 dark:text-white" />
                </div>
              </div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                <span className="text-gray-900 dark:text-white">Online</span>
              </div>
              <p className="text-gray-600 dark:text-gray-400 text-sm">Status do sistema</p>
            </div>
          </div>

          <div className="mt-12 glass-card rounded-2xl p-6">
            <h3 className="text-xl font-light text-gray-900 dark:text-white mb-6">Atividade Recente</h3>
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                  <div
                      key={i}
                      className="flex items-center gap-4 p-3 rounded-xl bg-gray-100/50 dark:bg-white/5 border border-gray-200/50 dark:border-white/5"
                  >
                    <div className="w-8 h-8 rounded-full bg-gray-200/70 dark:bg-white/10 flex items-center justify-center">
                      <Wifi className="h-4 w-4 text-gray-700 dark:text-white" />
                    </div>
                    <div>
                      <p className="text-gray-900 dark:text-white text-sm">ONU registrada: FHTT{1000 + i}</p>
                      <p className="text-gray-600 dark:text-gray-400 text-xs">Há {i * 5} minutos</p>
                    </div>
                  </div>
              ))}
            </div>
          </div>
        </main>
      </div>
  )
}
