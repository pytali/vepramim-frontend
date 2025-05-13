import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type ActivityLogEntry = {
    id: string
    type: 'onu_activation' | 'onu_search' | 'system'
    message: string
    timestamp: Date | string
    onuSerial?: string
    onuData?: {
        serial: string
        slot?: string
        port?: string
        onuId?: string
        olt?: string
    } | string
    user?: string
}

interface ActivityLogState {
    logs: ActivityLogEntry[]
    addLog: (log: Omit<ActivityLogEntry, 'id' | 'timestamp'>) => void
    getRecentLogs: (count?: number) => ActivityLogEntry[]
    clearLogs: () => void
    updateOnuLog: (onuSerial: string, newOnuData: string) => void
}

export const useActivityLogStore = create<ActivityLogState>()(
    persist(
        (set, get) => ({
            logs: [],

            addLog: (logData) => set((state) => {
                const newLog = {
                    ...logData,
                    id: crypto.randomUUID(),
                    timestamp: new Date(),
                }

                // Manter apenas os 50 logs mais recentes para não consumir muita memória
                const updatedLogs = [newLog, ...state.logs].slice(0, 50)

                return { logs: updatedLogs }
            }),

            getRecentLogs: (count = 10) => {
                // Garantir que o timestamp seja um objeto Date antes de chamar getTime()
                return get().logs
                    .slice(0, count)
                    .map(log => ({
                        ...log,
                        // Converter timestamp para Date se for string
                        timestamp: typeof log.timestamp === 'string' ? new Date(log.timestamp) : log.timestamp
                    }))
                    .sort((a, b) => {
                        const dateA = a.timestamp instanceof Date ? a.timestamp : new Date(a.timestamp as string)
                        const dateB = b.timestamp instanceof Date ? b.timestamp : new Date(b.timestamp as string)
                        return dateB.getTime() - dateA.getTime()
                    })
            },

            clearLogs: () => set({ logs: [] }),

            updateOnuLog: (onuSerial, newOnuData) => set((state) => {
                const updatedLogs = state.logs.map(log =>
                    log.onuSerial === onuSerial ? { ...log, onuData: newOnuData } : log
                )
                return { logs: updatedLogs }
            }),
        }),
        {
            name: 'activity-logs',
        }
    )
) 