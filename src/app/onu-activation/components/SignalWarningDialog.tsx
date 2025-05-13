import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AlertTriangle } from "lucide-react";
import { SignalWarningDialogProps } from "../types";

export function SignalWarningDialog({ isOpen, onClose, signalInfo }: SignalWarningDialogProps) {
    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent>
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
                        <p className="mt-2">Recomenda-se verificar a estrutura da rede para garantir uma melhor estabilidade.</p>
                    </div>
                )}

                <DialogFooter>
                    <Button onClick={onClose}>
                        Entendi
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
} 