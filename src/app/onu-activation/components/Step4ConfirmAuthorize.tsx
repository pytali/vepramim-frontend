import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ConnectionType, UnauthOnu, VLAN_MAPPING } from "@/types/onu";
import { Check, ChevronLeft, Copy, Loader2 } from "lucide-react";
import { Login, OnuSignalInfo } from "../types";
import { useEffect, useState } from "react";

interface Step4Props {
    selectedOnu: UnauthOnu | null;
    selectedLogin: Login | null;
    onuName: string;
    connectionType: ConnectionType;
    serverType: "NETNUMEN" | "UNM";
    authorizingOnu: string | null;
    successMessage: string | null;
    signalInfo: OnuSignalInfo | null;
    copiedToClipboard: boolean;
    onPrevious: () => void;
    onAuthorize: () => void;
    onCopyDetails: () => void;
    onReset: () => void;
}

export function Step4ConfirmAuthorize({
    selectedOnu,
    selectedLogin,
    onuName,
    connectionType,
    serverType,
    authorizingOnu,
    successMessage,
    signalInfo,
    copiedToClipboard,
    onPrevious,
    onAuthorize,
    onCopyDetails,
    onReset
}: Step4Props) {
    const [countdown, setCountdown] = useState(50);

    useEffect(() => {
        let timer: NodeJS.Timeout;

        if (successMessage && !signalInfo && countdown > 0) {
            timer = setTimeout(() => {
                setCountdown(prev => prev - 1);
            }, 1000);
        }

        return () => {
            if (timer) clearTimeout(timer);
        };
    }, [successMessage, signalInfo, countdown]);

    return (
        <Card className="w-full max-w-2xl mx-auto">
            <CardContent className="p-6">
                <h2 className="text-2xl font-semibold mb-4 text-center">
                    Passo 4: Confirmar e autorizar
                </h2>

                {successMessage ? (
                    <>
                        <div className="text-center space-y-6">
                            <div className="bg-green-100 text-green-800 p-4 rounded-lg text-center mb-6">
                                <Check className="h-12 w-12 mx-auto mb-2 text-green-600" />
                                <p className="text-lg font-medium">{successMessage}</p>
                                {!signalInfo && (
                                    <p className="text-sm mt-3">
                                        Verificando sinal... pode levar alguns minutos.
                                        <span className="ml-2 inline-block">
                                            <span
                                                className={`countdown-timer font-bold text-2xl px-2 py-1 rounded-md ${countdown < 10
                                                    ? "text-red-600 animate-pulse"
                                                    : countdown < 20
                                                        ? "text-amber-600"
                                                        : "text-primary"
                                                    }`}
                                            >
                                                {countdown}s
                                            </span>
                                        </span>
                                    </p>
                                )}
                            </div>

                            {signalInfo && (
                                <div className="p-4 rounded-lg bg-primary/5 border border-primary/20 mb-6">
                                    <h3 className="font-medium text-center mb-4">Informações do Sinal</h3>
                                    <div className="space-y-3">
                                        <div className="flex justify-between items-center">
                                            <span>Sinal OLT→ONU:</span>
                                            <div className="flex items-center gap-2">
                                                <span className={`font-semibold 
                                            ${signalInfo.rxPower > -23 ? "text-green-600" :
                                                        signalInfo.rxPower > -26 ? "text-amber-600" : "text-red-600"}`}>
                                                    {signalInfo.rxPower.toFixed(2)} dBm
                                                </span>
                                                <div className={`w-3 h-3 rounded-full 
                                            ${signalInfo.rxPower > -23 ? "bg-green-600" :
                                                        signalInfo.rxPower > -26 ? "bg-amber-600" : "bg-red-600"}`} />
                                            </div>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span>Sinal ONU→OLT:</span>
                                            <div className="flex items-center gap-2">
                                                <span className={`font-semibold 
                                            ${signalInfo.p_rx_power > -23 ? "text-green-600" :
                                                        signalInfo.p_rx_power > -26 ? "text-amber-600" : "text-red-600"}`}>
                                                    {signalInfo.p_rx_power.toFixed(2)} dBm
                                                </span>
                                                <div className={`w-3 h-3 rounded-full 
                                            ${signalInfo.p_rx_power > -23 ? "bg-green-600" :
                                                        signalInfo.p_rx_power > -26 ? "bg-amber-600" : "bg-red-600"}`} />
                                            </div>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span>Status Geral:</span>
                                            <div className="flex items-center gap-2">
                                                <span className={`font-semibold 
                                            ${signalInfo.status === "optimal" ? "text-green-600" :
                                                        signalInfo.status === "acceptable" ? "text-amber-600" : "text-red-600"}`}>
                                                    {signalInfo.status === "optimal" ? "Ótimo" :
                                                        signalInfo.status === "acceptable" ? "Aceitável" : "Crítico"}
                                                </span>
                                                <div className={`w-3 h-3 rounded-full 
                                            ${signalInfo.status === "optimal" ? "bg-green-600" :
                                                        signalInfo.status === "acceptable" ? "bg-amber-600" : "bg-red-600"}`} />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            <div className="flex justify-center space-x-4">
                                <Button
                                    variant="outline"
                                    onClick={onCopyDetails}
                                    className="flex items-center"
                                >
                                    {copiedToClipboard ? (
                                        <>
                                            <Check className="mr-2 h-4 w-4" />
                                            Copiado!
                                        </>
                                    ) : (
                                        <>
                                            <Copy className="mr-2 h-4 w-4" />
                                            Copiar detalhes
                                        </>
                                    )}
                                </Button>
                                <Button onClick={onReset}>
                                    Ativar outra ONU
                                </Button>
                            </div>
                        </div>
                    </>
                ) : (
                    <>
                        {selectedOnu && (
                            <div className="space-y-6">
                                <div className="space-y-2">
                                    <h3 className="font-medium">Detalhes da ONU</h3>
                                    <div className="grid grid-cols-2 gap-2 bg-muted/50 p-4 rounded-lg">
                                        <div className="text-muted-foreground">Número de Série:</div>
                                        <div className="font-medium">{selectedOnu.sn}</div>
                                        <div className="text-muted-foreground">OLT:</div>
                                        <div>{selectedOnu.oltName} ({selectedOnu.oltIp})</div>
                                        <div className="text-muted-foreground">PON ID:</div>
                                        <div>{selectedOnu.ponId}</div>
                                        <div className="text-muted-foreground">Tipo:</div>
                                        <div>{selectedOnu.dt}</div>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <h3 className="font-medium">Configurações</h3>
                                    <div className="grid grid-cols-2 gap-2 bg-muted/50 p-4 rounded-lg">
                                        <div className="text-muted-foreground">Nome da ONU:</div>
                                        <div className="font-medium">{onuName}</div>
                                        <div className="text-muted-foreground">Tipo de Conexão:</div>
                                        <div>{connectionType} (VLAN {VLAN_MAPPING[connectionType]})</div>
                                        <div className="text-muted-foreground">Tipo de Servidor:</div>
                                        <div>{serverType}</div>
                                        {selectedLogin && (
                                            <>
                                                <div className="text-muted-foreground">Cliente:</div>
                                                <div className="font-medium">
                                                    {selectedLogin.id_contrato} - {selectedLogin.base}
                                                </div>
                                            </>
                                        )}
                                    </div>
                                </div>

                                <div className="flex justify-between mt-6">
                                    <Button
                                        variant="outline"
                                        onClick={onPrevious}
                                        className="flex items-center"
                                    >
                                        <ChevronLeft className="mr-2 h-4 w-4" />
                                        Anterior
                                    </Button>
                                    <Button
                                        onClick={onAuthorize}
                                        disabled={authorizingOnu === selectedOnu.sn}
                                        className="flex items-center"
                                    >
                                        {authorizingOnu === selectedOnu.sn ? (
                                            <>
                                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                Autorizando...
                                            </>
                                        ) : (
                                            "Autorizar ONU"
                                        )}
                                    </Button>
                                </div>
                            </div>
                        )}
                    </>
                )}
            </CardContent>
        </Card>
    );
} 