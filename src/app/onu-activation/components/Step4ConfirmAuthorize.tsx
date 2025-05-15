import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ConnectionType, UnauthOnu, VLAN_MAPPING } from "@/types/onu";
import { Check, ChevronLeft, Copy, AlertTriangle } from "lucide-react";
import { Login, OnuSignalInfo } from "../types";
import { useEffect, useState, useRef } from "react";
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import { ACCEPTABLE_SIGNAL_THRESHOLD, CRITICAL_SIGNAL_THRESHOLD, OPTIMAL_SIGNAL_THRESHOLD } from "@/lib/constants";

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
    isVerifyingSignal: boolean;
    error: string | null;
    onPrevious: () => void;
    onAuthorize: () => void;
    onCopyDetails: () => void;
    onReset: () => void;
    onDeleteOnu?: (data: { sn: string; oltId: string; ponId: string; serverType: "NETNUMEN" | "UNM" }) => Promise<void>;
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
    isVerifyingSignal,
    error,
    onPrevious,
    onAuthorize,
    onCopyDetails,
    onReset,
    onDeleteOnu
}: Step4Props) {
    const [signalError, setSignalError] = useState<string | null>(null);
    const [isDeletingOnu, setIsDeletingOnu] = useState(false);
    const [lottieError, setLottieError] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);
    const hasDeletedOnuRef = useRef<boolean>(false);

    // Monitorar e corrigir possíveis erros de lottie
    useEffect(() => {
        // Capturar possíveis erros de Lottie relacionados a ImageData
        const handleError = (error: ErrorEvent) => {
            if (error.message && error.message.includes('ImageData')) {
                console.warn('Detected ImageData error with Lottie animation:', error.message);
                setLottieError(true);
            }
        };

        window.addEventListener('error', handleError);
        return () => {
            window.removeEventListener('error', handleError);
        };
    }, []);

    useEffect(() => {
        const handleLowSignal = async () => {
            // Verificar se já excluímos esta ONU para evitar múltiplas requisições
            if (hasDeletedOnuRef.current) {
                return;
            }

            if (signalInfo && onDeleteOnu && selectedOnu) {
                // Verificar se o sinal está abaixo do limiar
                if (signalInfo.status === "critical" || signalInfo.rxPower <= CRITICAL_SIGNAL_THRESHOLD) {
                    try {
                        setIsDeletingOnu(true);
                        // Marcar que já começamos a operação de exclusão
                        hasDeletedOnuRef.current = true;

                        await onDeleteOnu({
                            sn: selectedOnu.sn,
                            oltId: selectedOnu.oltIp,
                            ponId: selectedOnu.ponId,
                            serverType
                        });

                        setSignalError("A ONU não foi autorizada porque o sinal está fora do padrão aceitável.");
                    } catch (error) {
                        console.error("Erro ao excluir ONU:", error);
                        setSignalError("A ONU foi autorizada, mas o sinal está fora do padrão aceitável.");
                        // Se houve erro, permitir nova tentativa
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

    // Resetar a flag de exclusão quando um novo ONU for selecionado
    useEffect(() => {
        hasDeletedOnuRef.current = false;
    }, [selectedOnu]);

    // Renderiza o componente Lottie com tratamento de erro
    const renderLottie = (src: string, className?: string) => {
        if (lottieError) {
            // Fallback para quando há erro de ImageData
            return (
                <div className={`flex items-center justify-center ${className || 'h-32 w-32'}`}>
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                </div>
            );
        }

        try {
            return (
                <DotLottieReact
                    src={src}
                    loop
                    autoplay
                    renderConfig={{
                        autoResize: true,
                    }}
                />
            );
        } catch (err) {
            console.error("Erro ao renderizar Lottie:", err);
            return (
                <div className={`flex items-center justify-center ${className || 'h-32 w-32'}`}>
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                </div>
            );
        }
    };

    return (
        <Card className="w-full max-w-2xl mx-auto">
            <CardContent className="p-6">
                <h2 className="text-2xl font-semibold mb-4 text-center">
                    Passo 4: Confirmar e autorizar
                </h2>

                {error && !isVerifyingSignal && !successMessage && (
                    <div className="p-4 rounded-lg bg-red-50 border border-red-200 mb-6">
                        <div className="flex items-center justify-center gap-2 mb-2">
                            <AlertTriangle className="h-5 w-5 text-red-500" />
                            <h3 className="font-medium text-red-700">Erro ao autorizar</h3>
                        </div>
                        <p className="text-red-700 mb-4 text-center">{error}</p>
                    </div>
                )}

                {successMessage || isVerifyingSignal ? (
                    <>
                        <div className="text-center space-y-6">
                            {isVerifyingSignal && !signalInfo ? (
                                <div className="p-4 rounded-lg text-center mb-6" ref={containerRef}>
                                    <div className="w-full h-96 mx-auto">
                                        {renderLottie("https://lottie.host/fdba93bd-e1bc-49ad-8e6a-7689c5383287/hJLyE6GITV.lottie")}
                                    </div>
                                    <p className="text-xl font-medium mt-4 text-blue-700">ONU autorizada, verificando sinal...</p>
                                    <p className="text-sm mt-2 text-gray-500">
                                        Este processo leva aproximadamente 40 segundos para ser concluído.
                                    </p>
                                </div>
                            ) : successMessage && !signalError && (
                                <div className="bg-green-50 p-6 rounded-lg text-center mb-10">
                                    <div className="h-32 w-32 mx-auto mb-4">
                                        {renderLottie("https://lottie.host/836ceddd-aa49-47ab-9ba6-a74c6d4517c5/AezGcQ8fos.lottie")}
                                    </div>
                                    <p className="text-lg font-medium text-green-700">{successMessage}</p>
                                </div>
                            )}

                            {signalError && (
                                <div className="p-4 rounded-lg bg-red-50 border border-red-200 mb-6">
                                    <div className="h-32 w-32 mx-auto mb-4">
                                        {renderLottie("https://lottie.host/96119506-44b2-4399-890b-5a41e67b70ce/rN9yy2iGzw.lottie")}
                                    </div>
                                    <div className="flex items-center justify-center gap-2 mb-2">
                                        <AlertTriangle className="h-5 w-5 text-red-500" />
                                        <h3 className="font-medium text-red-700">Alerta de Sinal</h3>
                                    </div>
                                    <p className="text-red-700 mb-4">{signalError}</p>

                                    {signalInfo && (
                                        <div className="bg-red-100/50 p-3 rounded-md mb-4">
                                            <p className="font-medium text-red-800 mb-2">Valores de sinal detectados:</p>
                                            <div className="grid grid-cols-2 gap-2 text-sm">
                                                <span className="text-red-700">Sinal OLT→ONU:</span>
                                                <span className="font-medium text-red-800">{signalInfo.rxPower.toFixed(2)} dBm</span>
                                                <span className="text-red-700">Sinal ONU→OLT:</span>
                                                <span className="font-medium text-red-800">{signalInfo.p_rx_power.toFixed(2)} dBm</span>
                                            </div>
                                        </div>
                                    )}

                                    <p className="text-sm text-red-600 mt-2">
                                        Entre em contato com o suporte técnico para mais detalhes e assistência.
                                    </p>
                                </div>
                            )}

                            {signalInfo && !signalError && (
                                <div className="p-4 rounded-lg bg-primary/5 border border-primary/20 mb-6">
                                    <h3 className="font-medium text-center mb-4">Informações do Sinal</h3>
                                    <div className="space-y-3">
                                        <div className="flex justify-between items-center">
                                            <span>Sinal OLT→ONU:</span>
                                            <div className="flex items-center gap-2">
                                                <span className={`font-semibold 
                                                ${signalInfo.rxPower > OPTIMAL_SIGNAL_THRESHOLD ? "text-green-600" :
                                                        signalInfo.rxPower > ACCEPTABLE_SIGNAL_THRESHOLD ? "text-amber-600" : "text-red-600"}`}>
                                                    {signalInfo.rxPower.toFixed(2)} dBm
                                                </span>
                                                <div className={`w-3 h-3 rounded-full 
                                                ${signalInfo.rxPower > OPTIMAL_SIGNAL_THRESHOLD ? "bg-green-600" :
                                                        signalInfo.rxPower > ACCEPTABLE_SIGNAL_THRESHOLD ? "bg-amber-600" : "bg-red-600"}`} />
                                            </div>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span>Sinal ONU→OLT:</span>
                                            <div className="flex items-center gap-2">
                                                <span className={`font-semibold 
                                                ${signalInfo.p_rx_power > OPTIMAL_SIGNAL_THRESHOLD ? "text-green-600" :
                                                        signalInfo.p_rx_power > ACCEPTABLE_SIGNAL_THRESHOLD ? "text-amber-600" : "text-red-600"}`}>
                                                    {signalInfo.p_rx_power.toFixed(2)} dBm
                                                </span>
                                                <div className={`w-3 h-3 rounded-full 
                                                ${signalInfo.p_rx_power > OPTIMAL_SIGNAL_THRESHOLD ? "bg-green-600" :
                                                        signalInfo.p_rx_power > ACCEPTABLE_SIGNAL_THRESHOLD ? "bg-amber-600" : "bg-red-600"}`} />
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
                                {isDeletingOnu ? (
                                    <Button disabled className="flex items-center">
                                        <div className="mr-2 h-5 w-5">
                                            <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-primary"></div>
                                        </div>
                                        Processando...
                                    </Button>
                                ) : (
                                    <>
                                        {!signalError && signalInfo && !isVerifyingSignal && (
                                            <>
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
                                            </>
                                        )}
                                        {signalError && (
                                            <Button onClick={onReset}>
                                                Ativar outra ONU
                                            </Button>
                                        )}
                                    </>
                                )}
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
                                                <div className="mr-2 h-8 w-8">
                                                    {renderLottie("https://lottie.host/fdba93bd-e1bc-49ad-8e6a-7689c5383287/hJLyE6GITV.lottie", "h-8 w-8")}
                                                </div>
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