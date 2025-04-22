"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Search, ArrowLeft, Signal, Thermometer, Zap, CheckCircle, AlertTriangle, XCircle } from "lucide-react"
import { Logo } from "@/components/logo"
import { useOLTStore } from "@/store/olts"
import { Toast, ToastContainer } from "@/components/ui/toast"
import { parseONUSerial } from "@/app/api/actions"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"

interface OnuData {
  data: Array<{
    olt_id: string
    pon_id: string
    onu_id: string
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
      rx_power: string
      tx_power: string
      temperature: string
      voltage: string
      p_rx_power: string
      p_tx_power: string
    }
  }>
}

interface Login {
  login: string
  conexao: string
  id_contrato: string
  senha: string
  online: string
  ultima_conexao_inicial: string
}

// Componente LoginSelector
function LoginSelector({ isOpen, onClose, logins, onSelect }: {
  isOpen: boolean
  onClose: () => void
  logins: Login[]
  onSelect: (login: Login) => void
}) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Selecione o Login</DialogTitle>
          <DialogDescription>
            Foram encontrados múltiplos logins para este cliente. Selecione qual deseja consultar.
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="max-h-[400px] pr-4">
          <div className="space-y-2">
            {logins.map((login, index) => (
              <div
                key={index}
                className="p-4 rounded-lg border border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="font-medium">{login.login}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Conexão: {login.conexao || 'N/A'}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Status: {login.online === 'S' ?
                        <span className="text-green-500">Online</span> :
                        <span className="text-red-500">Offline</span>
                      }
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Última conexão: {login.ultima_conexao_inicial || 'N/A'}
                    </p>
                  </div>
                  <Button
                    onClick={() => onSelect(login)}
                    variant="outline"
                  >
                    Selecionar
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}

export default function OnuSearch() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")
  const [serialNumber, setSerialNumber] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [onuData, setOnuData] = useState<OnuData | null>(null)
  const [showToast, setShowToast] = useState(false)
  const [toastMessage, setToastMessage] = useState("")
  const [toastType, setToastType] = useState<"success" | "error">("success")
  const [isCopying, setIsCopying] = useState(false)
  const { olts, fetchOLTs } = useOLTStore()
  const [showLoginSelector, setShowLoginSelector] = useState(false)
  const [availableLogins, setAvailableLogins] = useState<Login[]>([])
  const [showSignalAlert, setShowSignalAlert] = useState(false)
  const [criticalSignalType, setCriticalSignalType] = useState<string>("")
  const [criticalSignalValue, setCriticalSignalValue] = useState<string>("")

  const handleCopyData = () => {
    if (!onuData?.data?.[0]) return

    setIsCopying(true)
    const data = onuData.data[0]
    const oltName = olts.find((olt) => olt.device_id === data.olt_id)?.device_name || ''
    const [, , slot, pon] = data.pon_id.split("-")

    const textToCopy = `SN: ${serialNumber}
Sinal ONU RX: ${data.onu_signal?.rx_power && !isNaN(Number(data.onu_signal.rx_power)) ? Number(data.onu_signal.rx_power).toFixed(2) : '--'} dBm
Sinal OLT RX: ${data.onu_signal?.p_rx_power && !isNaN(Number(data.onu_signal.p_rx_power)) ? Number(data.onu_signal.p_rx_power).toFixed(2) : '--'} dBm
OLT: ${oltName}
Slot: ${slot}
PON: ${pon}
Status: ${data.onu_state?.oper_state || ''}
Modelo ONU/ONT: ${data.onu_type || ''}`

    navigator.clipboard.writeText(textToCopy)
      .then(() => {
        setToastMessage("Dados copiados com sucesso!")
        setToastType("success")
        setShowToast(true)
      })
      .catch((err) => {
        console.error("Erro ao copiar dados:", err)
        setToastMessage("Erro ao copiar dados")
        setToastType("error")
        setShowToast(true)
      })
      .finally(() => {
        setTimeout(() => {
          setIsCopying(false)
        }, 200)
      })
  }

  useEffect(() => {
    if (olts.length === 0) {
      fetchOLTs()
    }
  }, [olts.length, fetchOLTs])

  // Determina se a entrada é um ID de contrato (numérico) ou um SN (alfanumérico)
  const isIdContrato = (query: string): boolean => {
    return /^\d+$/.test(query)
  }

  // Processa um login selecionado pelo usuário
  const handleLoginSelect = async (selectedLogin: Login) => {
    setShowLoginSelector(false)
    setIsLoading(true)

    try {
      // Extrai o SN da ONU
      const onuSN = await parseONUSerial(selectedLogin.conexao)
      if (!onuSN) {
        throw new Error("Não foi possível identificar o SN da ONU")
      }

      // Agora busca a ONU usando o SN obtido
      await searchBySN(onuSN)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Ocorreu um erro durante a busca")
    } finally {
      setIsLoading(false)
    }
  }

  // Busca a ONU pelo número de série
  const searchBySN = async (sn: string) => {
    try {
      const response = await fetch(`/api/onu/${sn}`)

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error_description || "Erro ao buscar ONU")
      }

      const data = await response.json()
      setSerialNumber(sn)
      setOnuData(data)

      // Verificar se os sinais estão abaixo do limiar crítico
      if (data?.data && data.data.length > 0 && data.data[0].onu_signal) {
        const rxPower = Number(data.data[0].onu_signal.rx_power)
        const pRxPower = Number(data.data[0].onu_signal.p_rx_power)

        if (rxPower < -26) {
          setCriticalSignalType("Potência ONU RX")
          setCriticalSignalValue(rxPower.toFixed(2))
          setShowSignalAlert(true)
        } else if (pRxPower < -26) {
          setCriticalSignalType("Potência OLT RX")
          setCriticalSignalValue(pRxPower.toFixed(2))
          setShowSignalAlert(true)
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Ocorreu um erro durante a busca")
    }
  }

  // Busca o cliente pelo ID do contrato, obtém o SN e depois busca a ONU
  const searchByIdContrato = async (idCliente: string) => {
    try {
      // Busca dados do radius
      const response = await fetch(`/api/client?idCliente=${idCliente}`)

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error_description || "Erro ao buscar dados do cliente")
      }

      const radiusData = await response.json()

      if (radiusData.error) {
        throw new Error("Cliente não encontrado")
      }

      const logins = radiusData.data[0]?.logins
      if (!logins || logins.length === 0) {
        throw new Error("Nenhum login encontrado para este cliente")
      }

      // Se houver apenas um login, processa diretamente
      if (logins.length === 1) {
        const clientData = logins[0]
        // Extrai o SN da conexão
        const onuSN = await parseONUSerial(clientData.conexao)
        if (!onuSN) {
          throw new Error("Não foi possível identificar o SN da ONU")
        }

        // Agora busca a ONU usando o SN obtido
        await searchBySN(onuSN)
      } else {
        // Se houver múltiplos logins, mostra o seletor
        setAvailableLogins(logins)
        setShowLoginSelector(true)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Ocorreu um erro durante a busca")
    }
  }

  async function handleSearch(e: React.FormEvent) {
    e.preventDefault()
    setError("")
    setOnuData(null)

    if (!searchQuery.trim()) {
      setError("Por favor, digite um número de série ou ID de cliente")
      return
    }

    setIsLoading(true)

    try {
      if (isIdContrato(searchQuery)) {
        // Se for um ID de contrato (somente números), busca pelo ID
        await searchByIdContrato(searchQuery)
      } else {
        // Se for alfanumérico, assume que é um SN e busca diretamente
        await searchBySN(searchQuery)
      }
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
          <h2 className="text-xl font-light text-gray-900 dark:text-white mb-4">Buscar ONU/Cliente</h2>

          <form onSubmit={handleSearch} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="searchQuery" className="text-gray-700 dark:text-gray-300 text-sm">
                Número de Série ou ID Cliente
              </Label>
              <div className="flex gap-2">
                <Input
                  id="searchQuery"
                  type="text"
                  placeholder="Ex: FHTT11112222 ou 12345"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-white/50 dark:bg-background/30 border-gray-300 dark:border-gray-700 focus:border-gray-400 dark:focus:border-gray-500 h-12 rounded-xl"
                  required
                />
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="bg-gray-900 hover:bg-gray-800 text-white dark:bg-white/10 dark:hover:bg-white/20 dark:text-white dark:border dark:border-white/20 rounded-xl px-4 h-10 flex items-center justify-center self-center my-auto"
                >
                  {isLoading ? "Buscando..." : <Search className="h-4 w-4 mr-2" />}
                  {isLoading ? "" : "Buscar"}
                </Button>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Você pode buscar utilizando o Número de Série (SN) da ONU ou o ID do Cliente
              </p>
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
                          <span className="text-gray-600 dark:text-gray-400 min-w-[120px] font-medium">OLT</span>
                          <span className="text-gray-900 dark:text-white pl-4 flex-1 text-right break-words">
                            {olts.find((olt) => olt.device_id === onuData.data[0].olt_id)?.device_name}
                          </span>
                        </div>
                        <div className="flex p-3 rounded-xl bg-gray-100/50 dark:bg-white/5 border border-gray-200/50 dark:border-white/5">
                          <span className="text-gray-600 dark:text-gray-400 min-w-[120px] font-medium">PON</span>
                          <span className="text-gray-900 dark:text-white pl-4 flex-1 text-right break-words">
                            {`Slot ${onuData.data[0].pon_id.split("-")[2]} Pon ${onuData.data[0].pon_id.split("-")[3]}`}
                          </span>
                        </div>
                        <div className="flex p-3 rounded-xl bg-gray-100/50 dark:bg-white/5 border border-gray-200/50 dark:border-white/5">
                          <span className="text-gray-600 dark:text-gray-400 min-w-[120px] font-medium">Onu ID</span>
                          <span className="text-gray-900 dark:text-white pl-4 flex-1 text-right break-words">
                            {onuData.data[0].onu_id}
                          </span>
                        </div>
                        <div className="flex p-3 rounded-xl bg-gray-100/50 dark:bg-white/5 border border-gray-200/50 dark:border-white/5">
                          <span className="text-gray-600 dark:text-gray-400 min-w-[120px] font-medium">Onu Type</span>
                          <span className="text-gray-900 dark:text-white pl-4 flex-1 text-right break-words">
                            {onuData.data[0].onu_type}
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
                          <span className="text-gray-900 dark:text-white pl-4 flex-1 text-right break-words flex items-center justify-end gap-2">
                            {onuData.data[0].onu_state?.oper_state === "UP" ? (
                              <>
                                <span className="text-green-500 font-medium">
                                  {onuData.data[0].onu_state?.oper_state}
                                </span>
                                <CheckCircle className="h-5 w-5 text-green-500" />
                              </>
                            ) : onuData.data[0].onu_state?.oper_state === "LINK LOSS" ? (
                              <>
                                <span className="text-amber-500 font-medium">
                                  {onuData.data[0].onu_state?.oper_state}
                                </span>
                                <AlertTriangle className="h-5 w-5 text-amber-500" />
                              </>
                            ) : (
                              <>
                                <span className="text-red-500 font-medium">
                                  {onuData.data[0].onu_state?.oper_state}
                                </span>
                                <XCircle className="h-5 w-5 text-red-500" />
                              </>
                            )}
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
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                      <div className="p-6 rounded-2xl bg-gray-100/50 dark:bg-white/5 border border-gray-200/50 dark:border-white/5 flex flex-col items-center">
                        <div className="w-12 h-12 rounded-full bg-gray-200/70 dark:bg-white/10 flex items-center justify-center mb-4">
                          <Signal className="h-6 w-6 text-green-500" />
                        </div>
                        <div className="text-center">
                          <p className="text-gray-600 dark:text-gray-400 text-sm mb-1">Potência OLT RX</p>
                          <p className="text-2xl font-light text-gray-900 dark:text-white">
                            {Number(onuData.data[0].onu_signal.p_rx_power).toFixed(2)} dBm
                          </p>
                        </div>
                        <div className="w-full mt-4">
                          {Number(onuData.data[0].onu_signal.p_rx_power) > -23 ? (
                            <div className="signal-indicator signal-good"></div>
                          ) : Number(onuData.data[0].onu_signal.p_rx_power) > -26 ? (
                            <div className="signal-indicator signal-medium"></div>
                          ) : (
                            <div className="signal-indicator signal-poor"></div>
                          )}
                        </div>
                      </div>
                      <div className="p-6 rounded-2xl bg-gray-100/50 dark:bg-white/5 border border-gray-200/50 dark:border-white/5 flex flex-col items-center">
                        <div className="w-12 h-12 rounded-full bg-gray-200/70 dark:bg-white/10 flex items-center justify-center mb-4">
                          <Signal className="h-6 w-6 text-green-500" />
                        </div>
                        <div className="text-center">
                          <p className="text-gray-600 dark:text-gray-400 text-sm mb-1">Potência ONU RX</p>
                          <p className="text-2xl font-light text-gray-900 dark:text-white">
                            {Number(onuData.data[0].onu_signal.rx_power).toFixed(2)} dBm
                          </p>
                        </div>
                        <div className="w-full mt-4">
                          {Number(onuData.data[0].onu_signal.rx_power) > -23 ? (
                            <div className="signal-indicator signal-good"></div>
                          ) : Number(onuData.data[0].onu_signal.rx_power) > -26 ? (
                            <div className="signal-indicator signal-medium"></div>
                          ) : (
                            <div className="signal-indicator signal-poor"></div>
                          )}
                        </div>
                      </div>

                      <div className="p-6 rounded-2xl bg-gray-100/50 dark:bg-white/5 border border-gray-200/50 dark:border-white/5 flex flex-col items-center">
                        <div className="w-12 h-12 rounded-full bg-gray-200/70 dark:bg-white/10 flex items-center justify-center mb-4">
                          <Signal className="h-6 w-6 text-green-500" />
                        </div>
                        <div className="text-center">
                          <p className="text-gray-600 dark:text-gray-400 text-sm mb-1">Potência ONU TX</p>
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
                          {Number(onuData.data[0].onu_signal.temperature) > 50 ? (
                            <div className="signal-indicator signal-poor"></div>
                          ) : Number(onuData.data[0].onu_signal.temperature) > 40 ? (
                            <div className="signal-indicator signal-medium"></div>
                          ) : (
                            <div className="signal-indicator signal-good"></div>
                          )}
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

      {/* Seletor de login para múltiplos logins */}
      <LoginSelector
        isOpen={showLoginSelector}
        onClose={() => setShowLoginSelector(false)}
        logins={availableLogins}
        onSelect={handleLoginSelect}
      />

      {/* Modal de alerta para sinal crítico */}
      <Dialog open={showSignalAlert} onOpenChange={setShowSignalAlert}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center text-red-500 gap-2">
              <AlertTriangle className="h-5 w-5" />
              Alerta de Sinal Crítico
            </DialogTitle>
            <DialogDescription>
              O valor do sinal <strong>{criticalSignalType}</strong> está crítico ({criticalSignalValue} dBm).
            </DialogDescription>
          </DialogHeader>

          <div className="py-4">
            <p className="text-sm text-gray-700 dark:text-gray-300">
              Valores de potência abaixo de -26 dBm indicam problemas na rede óptica. Recomendamos abrir uma OS para que um técnico possa verificar a situação.
            </p>
          </div>

          <DialogFooter className="flex flex-col sm:flex-row gap-2">
            <Button
              variant="outline"
              onClick={() => setShowSignalAlert(false)}
              className="sm:order-first order-last"
            >
              Fechar
            </Button>
            <Button
              onClick={() => {
                // Aqui poderia direcionar para a tela de abertura de OS
                setShowSignalAlert(false)
                setToastMessage("Função de abertura de OS será implementada em breve")
                setToastType("success")
                setShowToast(true)
              }}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              Abrir OS para Técnico
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {onuData && onuData.data && onuData.data.length > 0 && (
        <button
          onClick={handleCopyData}
          disabled={isCopying}
          className={`fixed bottom-8 right-8 bg-gray-900 hover:bg-gray-800 text-white dark:bg-white/10 dark:hover:bg-white/20 dark:text-white dark:border dark:border-white/20 rounded-full p-4 shadow-lg flex items-center gap-2 transition-transform duration-200 ${isCopying ? 'scale-95' : ''
            }`}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={`transition-transform duration-200 ${isCopying ? 'scale-90' : ''}`}
          >
            <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
            <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
          </svg>
          Copiar
        </button>
      )}

      <ToastContainer>
        {showToast && (
          <Toast
            message={toastMessage}
            type={toastType}
            onClose={() => setShowToast(false)}
          />
        )}
      </ToastContainer>
    </div>
  )
}
