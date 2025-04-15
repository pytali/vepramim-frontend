"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Search, ArrowLeft, Signal, Thermometer, Zap } from "lucide-react"
import { Logo } from "@/components/logo"

interface OnuData {
  data: Array<{
    onu_name: string
    onu_description: string
    onu_type: string
    onu_ip: string
    onu_mac: string
    onu_swver: string
    onu_state?: {
      admin_state: string
      oper_state: string
      auth: string
      last_off_time: string
      last_off_reason?: string
      last_on_time?: string
    }
    onu_signal?: {
      rx_power: number
      tx_power: number
      temperature: number
      voltage: number
    }
  }>
}

export default function OnuSearch() {
  const router = useRouter()
  const [serialNumber, setSerialNumber] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [onuData, setOnuData] = useState<OnuData | null>(null)

  async function handleSearch(e: React.FormEvent) {
    e.preventDefault()
    setError("")
    setOnuData(null)

    if (!serialNumber.trim()) {
      setError("Por favor, digite um número de série")
      return
    }

    setIsLoading(true)

    try {
      // Fazer a chamada real à API
      const response = await fetch(`/api/onu/${serialNumber}`)

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error_description || "Erro ao buscar ONU")
      }

      const data = await response.json()
      setOnuData(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Ocorreu um erro durante a busca")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen gradient-bg">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/3 right-1/2 w-[800px] h-[800px] rounded-full bg-blue-500/10 blur-[150px]"></div>
        <div className="absolute bottom-1/3 left-1/3 w-[600px] h-[600px] rounded-full bg-purple-500/10 blur-[150px]"></div>
      </div>

      <header className="relative z-10 flex justify-between items-center p-6 backdrop-blur-md bg-white/10 dark:bg-black/10">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.push("/dashboard")}
            className="rounded-full bg-gray-200/50 hover:bg-gray-200/80 dark:bg-white/5 dark:hover:bg-white/10 text-gray-700 dark:text-white"
          >
            <ArrowLeft className="h-5 w-5" />
            <span className="sr-only">Voltar</span>
          </Button>
          <Logo height={36} />
          <span className="text-xl font-light text-gray-900 dark:text-white ml-2">| Pesquisa de ONU</span>
        </div>
      </header>

      <main className="relative z-10 container mx-auto p-6 pt-12">
        <div className="glass-card rounded-2xl p-6 mb-8">
          <h2 className="text-xl font-light text-gray-900 dark:text-white mb-4">Buscar ONU</h2>

          <form onSubmit={handleSearch} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="serialNumber" className="text-gray-700 dark:text-gray-300 text-sm">
                Número de Série
              </Label>
              <div className="flex gap-2">
                <Input
                  id="serialNumber"
                  type="text"
                  placeholder="Ex: FHTT11112222"
                  value={serialNumber}
                  onChange={(e) => setSerialNumber(e.target.value)}
                  className="bg-white/50 dark:bg-background/30 border-gray-300 dark:border-gray-700 focus:border-gray-400 dark:focus:border-gray-500 h-12 rounded-xl"
                  required
                />
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="bg-gray-900 hover:bg-gray-800 text-white dark:bg-white/10 dark:hover:bg-white/20 dark:text-white dark:border dark:border-white/20 rounded-xl px-6"
                >
                  {isLoading ? "Buscando..." : <Search className="h-4 w-4 mr-2" />}
                  {isLoading ? "" : "Buscar"}
                </Button>
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
          </form>
        </div>

        {onuData && (
          <div className="glass-card rounded-2xl p-6">
            <h2 className="text-xl font-light text-gray-900 dark:text-white mb-6">Informações da ONU</h2>

            {onuData.data && onuData.data.length > 0 ? (
              <div className="space-y-8">
                <div className="flex flex-col md:flex-row gap-6">
                  <div className="flex-1 space-y-6">
                    <div>
                      <h3 className="text-gray-600 dark:text-gray-400 text-sm mb-3">Informações Básicas</h3>
                      <div className="space-y-3">
                        <div className="flex p-3 rounded-xl bg-gray-100/50 dark:bg-white/5 border border-gray-200/50 dark:border-white/5">
                          <span className="text-gray-600 dark:text-gray-400 min-w-[120px] font-medium">Nome</span>
                          <span className="text-gray-900 dark:text-white pl-4 flex-1 text-right break-words">
                            {onuData.data[0].onu_name}
                          </span>
                        </div>
                        <div className="flex p-3 rounded-xl bg-gray-100/50 dark:bg-white/5 border border-gray-200/50 dark:border-white/5">
                          <span className="text-gray-600 dark:text-gray-400 min-w-[120px] font-medium">Descrição</span>
                          <span className="text-gray-900 dark:text-white pl-4 flex-1 text-right break-words">
                            {onuData.data[0].onu_description}
                          </span>
                        </div>
                        <div className="flex p-3 rounded-xl bg-gray-100/50 dark:bg-white/5 border border-gray-200/50 dark:border-white/5">
                          <span className="text-gray-600 dark:text-gray-400 min-w-[120px] font-medium">Tipo</span>
                          <span className="text-gray-900 dark:text-white pl-4 flex-1 text-right break-words">
                            {onuData.data[0].onu_type}
                          </span>
                        </div>
                        <div className="flex p-3 rounded-xl bg-gray-100/50 dark:bg-white/5 border border-gray-200/50 dark:border-white/5">
                          <span className="text-gray-600 dark:text-gray-400 min-w-[120px] font-medium">IP</span>
                          <span className="text-gray-900 dark:text-white pl-4 flex-1 text-right break-words">
                            {onuData.data[0].onu_ip}
                          </span>
                        </div>
                        <div className="flex p-3 rounded-xl bg-gray-100/50 dark:bg-white/5 border border-gray-200/50 dark:border-white/5">
                          <span className="text-gray-600 dark:text-gray-400 min-w-[120px] font-medium">MAC</span>
                          <span className="text-gray-900 dark:text-white pl-4 flex-1 text-right break-words">
                            {onuData.data[0].onu_mac}
                          </span>
                        </div>
                        <div className="flex p-3 rounded-xl bg-gray-100/50 dark:bg-white/5 border border-gray-200/50 dark:border-white/5">
                          <span className="text-gray-600 dark:text-gray-400 min-w-[120px] font-medium">Versão SW</span>
                          <span className="text-gray-900 dark:text-white pl-4 flex-1 text-right break-words">
                            {onuData.data[0].onu_swver}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex-1 space-y-6">
                    <div>
                      <h3 className="text-gray-600 dark:text-gray-400 text-sm mb-3">Estado</h3>
                      <div className="space-y-3">
                        <div className="flex p-3 rounded-xl bg-gray-100/50 dark:bg-white/5 border border-gray-200/50 dark:border-white/5">
                          <span className="text-gray-600 dark:text-gray-400 min-w-[120px] font-medium">
                            Estado Admin
                          </span>
                          <span className="text-gray-900 dark:text-white pl-4 flex-1 text-right break-words">
                            {onuData.data[0].onu_state?.admin_state}
                          </span>
                        </div>
                        <div className="flex p-3 rounded-xl bg-gray-100/50 dark:bg-white/5 border border-gray-200/50 dark:border-white/5">
                          <span className="text-gray-600 dark:text-gray-400 min-w-[120px] font-medium">
                            Estado Operacional
                          </span>
                          <span className="text-gray-900 dark:text-white pl-4 flex-1 text-right break-words">
                            {onuData.data[0].onu_state?.oper_state}
                          </span>
                        </div>
                        <div className="flex p-3 rounded-xl bg-gray-100/50 dark:bg-white/5 border border-gray-200/50 dark:border-white/5">
                          <span className="text-gray-600 dark:text-gray-400 min-w-[120px] font-medium">
                            Autenticação
                          </span>
                          <span className="text-gray-900 dark:text-white pl-4 flex-1 text-right break-words">
                            {onuData.data[0].onu_state?.auth}
                          </span>
                        </div>
                        <div className="flex p-3 rounded-xl bg-gray-100/50 dark:bg-white/5 border border-gray-200/50 dark:border-white/5">
                          <span className="text-gray-600 dark:text-gray-400 min-w-[120px] font-medium">
                            Última Desconexão
                          </span>
                          <span className="text-gray-900 dark:text-white pl-4 flex-1 text-right break-words">
                            {onuData.data[0].onu_state?.last_off_time}
                          </span>
                        </div>
                        <div className="flex p-3 rounded-xl bg-gray-100/50 dark:bg-white/5 border border-gray-200/50 dark:border-white/5">
                          <span className="text-gray-600 dark:text-gray-400 min-w-[120px] font-medium">
                            Motivo Desconexão
                          </span>
                          <span className="text-gray-900 dark:text-white pl-4 flex-1 text-right break-words">
                            {onuData.data[0].onu_state?.last_off_reason || "--"}
                          </span>
                        </div>

                        <div className="flex p-3 rounded-xl bg-gray-100/50 dark:bg-white/5 border border-gray-200/50 dark:border-white/5">
                          <span className="text-gray-600 dark:text-gray-400 min-w-[120px] font-medium">
                            Última Conexão
                          </span>
                          <span className="text-gray-900 dark:text-white pl-4 flex-1 text-right break-words">
                            {onuData.data[0].onu_state?.last_on_time || "--"}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {onuData.data[0].onu_signal && (
                  <div>
                    <h3 className="text-gray-600 dark:text-gray-400 text-sm mb-4">Sinal</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                      <div className="p-6 rounded-2xl bg-gray-100/50 dark:bg-white/5 border border-gray-200/50 dark:border-white/5 flex flex-col items-center">
                        <div className="w-12 h-12 rounded-full bg-gray-200/70 dark:bg-white/10 flex items-center justify-center mb-4">
                          <Signal className="h-6 w-6 text-green-500" />
                        </div>
                        <div className="text-center">
                          <p className="text-gray-600 dark:text-gray-400 text-sm mb-1">Potência RX</p>
                          <p className="text-2xl font-light text-gray-900 dark:text-white">
                            {Number(onuData.data[0].onu_signal.rx_power).toFixed(2)} dBm
                          </p>
                        </div>
                        <div className="w-full mt-4">
                          <div className="signal-indicator signal-good"></div>
                        </div>
                      </div>

                      <div className="p-6 rounded-2xl bg-gray-100/50 dark:bg-white/5 border border-gray-200/50 dark:border-white/5 flex flex-col items-center">
                        <div className="w-12 h-12 rounded-full bg-gray-200/70 dark:bg-white/10 flex items-center justify-center mb-4">
                          <Signal className="h-6 w-6 text-green-500" />
                        </div>
                        <div className="text-center">
                          <p className="text-gray-600 dark:text-gray-400 text-sm mb-1">Potência TX</p>
                          <p className="text-2xl font-light text-gray-900 dark:text-white">
                            {Number(onuData.data[0].onu_signal.tx_power).toFixed(2)} dBm
                          </p>
                        </div>
                        <div className="w-full mt-4">
                          <div className="signal-indicator signal-good"></div>
                        </div>
                      </div>

                      <div className="p-6 rounded-2xl bg-gray-100/50 dark:bg-white/5 border border-gray-200/50 dark:border-white/5 flex flex-col items-center">
                        <div className="w-12 h-12 rounded-full bg-gray-200/70 dark:bg-white/10 flex items-center justify-center mb-4">
                          <Thermometer className="h-6 w-6 text-yellow-500" />
                        </div>
                        <div className="text-center">
                          <p className="text-gray-600 dark:text-gray-400 text-sm mb-1">Temperatura</p>
                          <p className="text-2xl font-light text-gray-900 dark:text-white">
                            {Number(onuData.data[0].onu_signal.temperature).toFixed(1)} ºC
                          </p>
                        </div>
                        <div className="w-full mt-4">
                          <div className="signal-indicator signal-medium"></div>
                        </div>
                      </div>

                      <div className="p-6 rounded-2xl bg-gray-100/50 dark:bg-white/5 border border-gray-200/50 dark:border-white/5 flex flex-col items-center">
                        <div className="w-12 h-12 rounded-full bg-gray-200/70 dark:bg-white/10 flex items-center justify-center mb-4">
                          <Zap className="h-6 w-6 text-blue-500" />
                        </div>
                        <div className="text-center">
                          <p className="text-gray-600 dark:text-gray-400 text-sm mb-1">Voltagem</p>
                          <p className="text-2xl font-light text-gray-900 dark:text-white">
                            {onuData.data[0].onu_signal.voltage} v
                          </p>
                        </div>
                        <div className="w-full mt-4">
                          <div className="signal-indicator signal-good"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <p className="text-gray-600 dark:text-gray-400">Nenhum dado encontrado para esta ONU.</p>
            )}
          </div>
        )}
      </main>
    </div>
  )
}
