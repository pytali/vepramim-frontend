import { create } from 'zustand'

export interface OLT {
    device_id: string
    device_name: string
    device_type: string
    device_ip: string
    status: string
    location: string
    ipoe: string
    // Adicione mais campos conforme necessário
}

interface OLTStore {
    olts: OLT[]
    setOLTs: (olts: OLT[]) => void
    isLoading: boolean
    setIsLoading: (isLoading: boolean) => void
    fetchOLTs: () => Promise<void>
}

export const useOLTStore = create<OLTStore>((set) => ({
    olts: [],
    setOLTs: (olts: OLT[]) => set({ olts }),
    isLoading: true,
    setIsLoading: (isLoading: boolean) => set({ isLoading }),
    fetchOLTs: async () => {
        try {
            set({ isLoading: true })
            const response = await fetch('/api/olts')

            if (!response.ok) {
                throw new Error('Falha ao buscar OLTs')
            }

            const { data } = await response.json()

            set({ olts: data })
        } catch (error) {
            console.error('Erro ao buscar OLTs:', error)
            set({ olts: [] })
        } finally {
            set({ isLoading: false })
        }
    }
})) 