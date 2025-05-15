import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AlertTriangle } from "lucide-react";
import { SignalWarningDialogProps } from "../types";
import { useEffect, useState } from "react";
import { ACCEPTABLE_SIGNAL_THRESHOLD, CRITICAL_SIGNAL_THRESHOLD } from "@/lib/constants";

export function SignalWarningDialog({ isOpen, onClose, signalInfo }: SignalWarningDialogProps) {
    const [countdown, setCountdown] = useState(5);
    const [canClose, setCanClose] = useState(false);

    // Reinicia o temporizador quando o modal é aberto
    useEffect(() => {
        if (isOpen) {
            setCanClose(false);
            setCountdown(5);

            const timer = setInterval(() => {
                setCountdown((prev) => {
                    if (prev <= 1) {
                        clearInterval(timer);
                        setCanClose(true);
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);

            return () => clearInterval(timer);
        }
    }, [isOpen]);

    // Função de fechamento controlada
    const handleClose = () => {
        if (canClose) {
            onClose();
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={handleClose}>
            <DialogContent className="sm:max-w-md" onInteractOutside={(e) => {
                // Previne fechamento por clique fora durante o período de bloqueio
                if (!canClose) {
                    e.preventDefault();
                }
            }}>
                <DialogHeader>
                    <DialogTitle className="flex items-center">
                        <AlertTriangle className="h-5 w-5 text-amber-500 mr-2" />
                        Alerta de Sinal Fraco
                    </DialogTitle>
                </DialogHeader>

                {signalInfo && (
                    <div className="py-4">
                        <p>Os sinais da ONU estão abaixo do recomendado:</p>
                        <ul className="list-disc pl-5 mt-2 space-y-1">
                            <li>
                                Sinal OLT→ONU: <span className="font-semibold text-red-600">{signalInfo.rxPower.toFixed(2)} dBm</span>
                            </li>
                            <li>
                                Sinal ONU→OLT: <span className="font-semibold text-red-600">{signalInfo.p_rx_power.toFixed(2)} dBm</span>
                            </li>
                        </ul>
                        <p className="mt-3">Sinais fracos podem causar:</p>
                        <ul className="list-disc pl-5 mt-1 space-y-1">
                            <li>Instabilidade de conexão</li>
                            <li>Quedas frequentes</li>
                            <li>Velocidade reduzida</li>
                        </ul>
                        <p className="mt-3">Níveis recomendados de sinal:</p>
                        <ul className="list-disc pl-5 mt-1 space-y-1">
                            <li>Aceitável: maior que <span className="font-semibold">{ACCEPTABLE_SIGNAL_THRESHOLD} dBm</span></li>
                            <li>Crítico: menor que <span className="font-semibold">{ACCEPTABLE_SIGNAL_THRESHOLD} dBm</span></li>
                            <li>Exclusão automática: menor que <span className="font-semibold">{CRITICAL_SIGNAL_THRESHOLD} dBm</span></li>
                        </ul>
                        <p className="mt-2">Recomenda-se verificar a estrutura da rede para garantir uma melhor estabilidade.</p>
                    </div>
                )}

                <DialogFooter className="flex items-center justify-between">
                    <Button
                        onClick={() => handleClose()}
                        disabled={!canClose}
                        className="w-full"
                    >
                        {canClose ? "Entendi" : `Entendi (${countdown}s)`}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
} 