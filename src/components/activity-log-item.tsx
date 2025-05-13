import { useState } from "react"
import { Wifi, Copy, CheckCircle, ExternalLink } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import { ptBR } from "date-fns/locale"
import { ActivityLogEntry } from "@/store/activity-log"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { useRouter } from "next/navigation"

interface ActivityLogItemProps {
    log: ActivityLogEntry
}

export function ActivityLogItem({ log }: ActivityLogItemProps) {
    const router = useRouter()
    const [copied, setCopied] = useState(false)

    // Converter timestamp para Date se for string
    const timestamp = typeof log.timestamp === 'string'
        ? new Date(log.timestamp)
        : log.timestamp

    // Formatar a data e hora para exibição
    const formattedDate = timestamp.toLocaleDateString('pt-BR')
    const formattedTime = timestamp.toLocaleTimeString('pt-BR')
    const timeAgo = formatDistanceToNow(timestamp, {
        addSuffix: true,
        locale: ptBR
    })

    // Dados que serão copiados
    const copyData = log.onuData
        ? (typeof log.onuData === 'string'
            ? log.onuData
            : `Serial: ${log.onuData.serial}${log.onuData.slot ? `\nSlot: ${log.onuData.slot}` : ''}${log.onuData.port ? `\nPorta: ${log.onuData.port}` : ''}${log.onuData.onuId ? `\nONU ID: ${log.onuData.onuId}` : ''}${log.onuData.olt ? `\nOLT: ${log.onuData.olt}` : ''}`)
        : log.onuSerial || ''

    const handleCopyData = () => {
        if (copyData) {
            navigator.clipboard.writeText(copyData)
            setCopied(true)
            setTimeout(() => setCopied(false), 2000)
        }
    }

    const checkOnuStatus = () => {
        if (log.type === 'onu_search' || log.type === 'onu_activation') {
            router.push(`/onu-search?serial=${log.onuSerial}&fromLog=true`);
        }
    }

    return (
        <div className="flex items-center gap-4 p-3 rounded-xl bg-gray-100/50 dark:bg-white/5 border border-gray-200/50 dark:border-white/5">
            <div className="w-8 h-8 min-w-8 rounded-full bg-gray-200/70 dark:bg-white/10 flex items-center justify-center">
                <Wifi className="h-4 w-4 text-gray-700 dark:text-white" />
            </div>

            <div className="flex-grow">
                <p className="text-gray-900 dark:text-white text-sm">{log.message}</p>
                <div className="flex items-center gap-2 text-xs">
                    <p className="text-gray-600 dark:text-gray-400">{timeAgo}</p>
                    <span className="text-gray-400">•</span>
                    <p className="text-gray-600 dark:text-gray-400">{formattedDate} às {formattedTime}</p>
                    {log.user && (
                        <>
                            <span className="text-gray-400">•</span>
                            <p className="text-gray-600 dark:text-gray-400">por {log.user}</p>
                        </>
                    )}
                </div>
            </div>

            <div className="flex items-center gap-2 ml-auto">
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button
                                size="icon"
                                variant="ghost"
                                className="h-8 w-8 rounded-full"
                                onClick={handleCopyData}
                                disabled={!copyData}
                            >
                                {copied ? <CheckCircle className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>{copied ? "Copiado!" : "Copiar dados"}</p>
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>

                {(typeof log.onuData === 'string' || log.onuData?.serial) && (
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button
                                    size="icon"
                                    variant="ghost"
                                    className="h-8 w-8 rounded-full"
                                    onClick={checkOnuStatus}
                                >
                                    <ExternalLink className="h-4 w-4" />
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>Verificar status</p>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                )}
            </div>
        </div>
    )
} 