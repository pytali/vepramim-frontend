"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Search, Server, Wifi, Activity, Plus, ClipboardPenLine, Power } from "lucide-react"
import { useOLTStore } from "@/store/olts"
import { useActivityLogStore, ActivityLogEntry } from "@/store/activity-log"
import { ActivityLogItem } from "@/components/activity-log-item"
import { Role } from "@/types/auth"
import { RoleCheck } from "@/components/RoleBasedAccess"
import { UserHeader } from "@/components/user-header"

export default function Dashboard() {
  const router = useRouter()
  const { olts, isLoading, fetchOLTs } = useOLTStore()
  const { getRecentLogs, addLog } = useActivityLogStore()

  // Iniciar com null para evitar erro de hidratação
  const [recentLogs, setRecentLogs] = useState<ActivityLogEntry[] | null>(null)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    // Marcar o componente como montado para evitar renderização inconsistente
    setMounted(true)

    // Buscar logs somente após a montagem do componente no cliente
    setRecentLogs(getRecentLogs(10))

    fetchOLTs()

    // Adicionar alguns logs de exemplo se não houver logs
    if (getRecentLogs(10).length === 0) {
      // Exemplo de logs para demonstração
      const sampleData: Omit<ActivityLogEntry, 'id' | 'timestamp'>[] = [
        {
          type: 'onu_activation',
          message: 'ONU ativada: FHTT1001',
          onuSerial: 'FHTT1001',
          onuData: {
            serial: 'FHTT1001',
            slot: '1',
            port: '1',
            onuId: '1',
            olt: 'OLT-01'
          },
          user: 'admin'
        },
        {
          type: 'onu_search',
          message: 'ONU pesquisada: FHTT1002',
          onuSerial: 'FHTT1002',
          onuData: {
            serial: 'FHTT1002',
            slot: '1',
            port: '2',
            onuId: '2',
            olt: 'OLT-01'
          },
          user: 'tecnico'
        },
        {
          type: 'onu_activation',
          message: 'ONU ativada: FHTT1003',
          onuSerial: 'FHTT1003',
          onuData: {
            serial: 'FHTT1003',
            slot: '1',
            port: '3',
            onuId: '3',
            olt: 'OLT-02'
          },
          user: 'admin'
        }
      ]

      sampleData.forEach(log => {
        addLog(log)
      })

      // Atualizar os logs após adicionar os exemplos
      setRecentLogs(getRecentLogs(10))
    }
  }, [fetchOLTs, addLog, getRecentLogs])

  return (
    <div className="min-h-screen gradient-bg">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[800px] h-[800px] rounded-full bg-blue-500/10 blur-[150px]"></div>
        <div className="absolute bottom-1/3 right-1/3 w-[600px] h-[600px] rounded-full bg-purple-500/10 blur-[150px]"></div>
      </div>

      <UserHeader />

      <main className="relative z-10 container mx-auto p-6 pt-12">
        <h2 className="text-3xl font-light text-gray-900 dark:text-white mb-2">Dashboard</h2>
        <p className="text-gray-600 dark:text-gray-400 mb-12">Visão geral do sistema</p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="glass-card rounded-2xl p-6 transition-all duration-300 hover:translate-y-[-5px]">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-light text-gray-900 dark:text-white">OLTs</h3>
              <div className="w-10 h-10 rounded-full flex items-center justify-center bg-gray-200/70 dark:bg-white/10">
                <Server className="h-5 w-5 text-gray-700 dark:text-white" />
              </div>
            </div>
            <p className="text-4xl font-light text-gray-900 dark:text-white mb-4">{isLoading ? "..." : olts.length}</p>
            <p className="text-gray-600 dark:text-gray-400 text-sm">Total de OLTs no sistema</p>
          </div>

          <div className="glass-card rounded-2xl p-6 transition-all duration-300 hover:translate-y-[-5px]">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-light text-gray-900 dark:text-white">ONUs</h3>
              <div className="w-10 h-10 rounded-full flex items-center justify-center bg-gray-200/70 dark:bg-white/10">
                <Wifi className="h-5 w-5 text-gray-700 dark:text-white" />
              </div>
            </div>
            <div className="flex flex-col gap-2 mb-4">
              <Button
                className="bg-gray-900 hover:bg-gray-800 text-white dark:bg-white/10 dark:hover:bg-white/20 dark:text-white dark:border dark:border-white/20 rounded-xl"
                onClick={() => router.push("/onu-search")}
              >
                <Search className="h-4 w-4 mr-2" />
                Pesquisar ONU
              </Button>
              <RoleCheck requiredRoles={[Role.ADMIN, Role.SUPPORT, Role.TECHNICIAN]}>
                <Button
                  className="bg-gray-900 hover:bg-gray-800 text-white dark:bg-white/10 dark:hover:bg-white/20 dark:text-white dark:border dark:border-white/20 rounded-xl"
                  onClick={() => router.push("/onu-activation")}
                >
                  <Power className="h-4 w-4 mr-2" />
                  Ativar ONU
                </Button>
              </RoleCheck>
            </div>
            <p className="text-gray-600 dark:text-gray-400 text-sm">Gerenciamento de ONUs</p>
          </div>

          <RoleCheck requiredRoles={[Role.ADMIN, Role.SUPPORT]}>
            <div className="glass-card rounded-2xl p-6 transition-all duration-300 hover:translate-y-[-5px]">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-light text-gray-900 dark:text-white">Atendimentos</h3>
                <div className="w-10 h-10 rounded-full flex items-center justify-center bg-gray-200/70 dark:bg-white/10">
                  <ClipboardPenLine className="h-5 w-5 text-gray-700 dark:text-white" />
                </div>
              </div>
              <div className="mb-4">
                <Button
                  className="bg-gray-900 hover:bg-gray-800 text-white dark:bg-white/10 dark:hover:bg-white/20 dark:text-white dark:border dark:border-white/20 rounded-xl"
                  onClick={() => router.push("/atendimentos")}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Gerar atendimento
                </Button>
              </div>
              <p className="text-gray-600 dark:text-gray-400 text-sm">Geração de atendimentos</p>
            </div>
          </RoleCheck>

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

          {/* Renderização condicional baseada no estado de montagem do componente */}
          {!mounted ? (
            // Durante SSR ou antes da montagem do componente, renderizar um placeholder
            <p className="text-gray-600 dark:text-gray-400 text-center py-4">Carregando atividades...</p>
          ) : recentLogs && recentLogs.length > 0 ? (
            // Após a montagem do componente e com logs disponíveis
            <div className="space-y-4">
              {recentLogs.map((log) => (
                <ActivityLogItem key={log.id} log={log} />
              ))}
            </div>
          ) : (
            // Após a montagem do componente mas sem logs
            <p className="text-gray-600 dark:text-gray-400 text-center py-4">Nenhuma atividade recente</p>
          )}
        </div>
      </main>
    </div>
  )
}
