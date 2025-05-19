import { useState, useRef, useEffect } from "react";
import { CRITICAL_SIGNAL_THRESHOLD } from "@/lib/constants";
import { UnauthOnu } from "@/types/onu";
import { OnuSignalInfo } from "../types";

interface UseStep4SignalLogicProps {
    signalInfo: OnuSignalInfo | null;
    onDeleteOnu?: (data: { sn: string; oltId: string; ponId: string; serverType: "NETNUMEN" | "UNM" }) => Promise<void>;
    selectedOnu: UnauthOnu | null;
    serverType: "NETNUMEN" | "UNM";
}

export function useStep4SignalLogic({
    signalInfo,
    onDeleteOnu,
    selectedOnu,
    serverType
}: UseStep4SignalLogicProps) {
    const [signalError, setSignalError] = useState<string | null>(null);
    const [isDeletingOnu, setIsDeletingOnu] = useState(false);
    const [lottieError, setLottieError] = useState(false);
    const hasDeletedOnuRef = useRef<boolean>(false);

    // Monitorar e corrigir possíveis erros de lottie
    useEffect(() => {
        const handleError = (error: ErrorEvent) => {
            if (error.message && error.message.includes('ImageData')) {
                setLottieError(true);
            }
        };
        window.addEventListener('error', handleError);
        return () => {
            window.removeEventListener('error', handleError);
        };
    }, []);

    // Lógica para deletar ONU caso sinal esteja crítico
    useEffect(() => {
        const handleLowSignal = async () => {
            if (hasDeletedOnuRef.current) return;
            if (signalInfo && onDeleteOnu && selectedOnu) {
                if (signalInfo.status === "critical" || signalInfo.rxPower <= CRITICAL_SIGNAL_THRESHOLD) {
                    try {
                        setIsDeletingOnu(true);
                        hasDeletedOnuRef.current = true;
                        await onDeleteOnu({
                            sn: selectedOnu.sn,
                            oltId: selectedOnu.oltIp,
                            ponId: selectedOnu.ponId,
                            serverType
                        });
                        setSignalError("A ONU não foi autorizada porque o sinal está fora do padrão aceitável.");
                    } catch {
                        setSignalError("A ONU foi autorizada, mas o sinal está fora do padrão aceitável.");
                        hasDeletedOnuRef.current = false;
                    } finally {
                        setIsDeletingOnu(false);
                    }
                }
            }
        };
        if (signalInfo) {
            handleLowSignal();
        }
    }, [signalInfo, onDeleteOnu, selectedOnu, serverType]);

    // Resetar as flags quando um novo ONU for selecionado
    useEffect(() => {
        hasDeletedOnuRef.current = false;
        setSignalError(null);
    }, [selectedOnu]);

    return {
        signalError,
        setSignalError,
        isDeletingOnu,
        lottieError,
        setLottieError,
        hasDeletedOnuRef
    };
} 