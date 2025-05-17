import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ConnectionType, UnauthOnu, VLAN_MAPPING } from "@/types/onu";
import { Check, ChevronLeft, Copy, AlertTriangle, Loader2 } from "lucide-react";
import { Login, OnuSignalInfo } from "../types";
import { useEffect, useState, useRef, useCallback } from "react";
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import { ACCEPTABLE_SIGNAL_THRESHOLD, CRITICAL_SIGNAL_THRESHOLD, OPTIMAL_SIGNAL_THRESHOLD } from "@/lib/constants";
import { useOLTStore } from "@/store/olts";

// Mapeamento das bases para os prefixos de login
const BASE__LOGIN_MAPPING: Record<string, string> = {
    "ixc.brasildigital.net.br": "brd",
    "ixc.candeiasnet.com.br": "cdy",
    "ixc.br364telecom.com.br": "364"
};

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
    loginSuffix: number | null;
    standardLogin: string;
    onPrevious: () => void;
    onAuthorize: () => void;
    onCopyDetails: () => void;
    onReset: () => void;
    onDeleteOnu?: (data: { sn: string; oltId: string; ponId: string; serverType: "NETNUMEN" | "UNM" }) => Promise<void>;
    checkExistingLogins?: (base: string, id_cliente: string) => Promise<void>;
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
    loginSuffix,
    standardLogin,
    onPrevious,
    onAuthorize,
    onCopyDetails,
    onReset,
    onDeleteOnu,
    checkExistingLogins
}: Step4Props) {
    const [signalError, setSignalError] = useState<string | null>(null);
    const [isDeletingOnu, setIsDeletingOnu] = useState(false);
    const [lottieError, setLottieError] = useState(false);
    const [isUpdatingLogin, setIsUpdatingLogin] = useState(false);
    const [loginUpdated, setLoginUpdated] = useState(false);
    const [isCheckingLogin, setIsCheckingLogin] = useState(false);
    const [toastMessage, setToastMessage] = useState<string | null>(null);
    const [toastType, setToastType] = useState<'success' | 'error'>('success');
    const containerRef = useRef<HTMLDivElement>(null);
    const hasDeletedOnuRef = useRef<boolean>(false);
    const hasUpdatedLoginRef = useRef<boolean>(false);

    // Obtém a lista de OLTs do store
    const { olts } = useOLTStore();

    // Função para verificar se o login é do tipo IPoE
    const isIPoELogin = (autenticacao: "L" | "H" | "M" | "V" | "D" | "I" | "E") => {
        return autenticacao === 'D';
    };

    // Verifica se o login atual é IPoE
    const isCurrentLoginIPoE = selectedLogin && isIPoELogin(selectedLogin.autenticacao);

    // Função para gerar um login IPoE atualizado com as informações da nova ONU
    const getUpdatedIPoELogin = () => {
        if (!selectedOnu || !isCurrentLoginIPoE) return null;

        // Encontrar a OLT correspondente no datastore pelo oltIp
        const matchedOlt = olts.find(olt => olt.device_ip === selectedOnu.oltIp);

        if (!matchedOlt || !matchedOlt.ipoe) {
            console.warn("OLT não encontrada ou sem prefixo IPoE definido");
            return null;
        }

        // Extrai as partes relevantes do slot e PON da selectedOnu.ponId
        const ponParts = selectedOnu.ponId.split('-');
        if (ponParts.length < 2) return null;

        // Formato: ipoe.slot.pon.sn (usando o prefixo ipoe da OLT encontrada)
        return `${matchedOlt.ipoe.trim()}.${ponParts[2]}.${ponParts[3]}.${selectedOnu.sn}`;
    };

    // Função para verificar se o login está no padrão correto
    const isStandardLogin = (login: string, base: string, id_cliente: string): boolean => {
        const basePrefix = BASE__LOGIN_MAPPING[base];
        if (!basePrefix) return true; // Se não temos mapeamento, consideramos como padrão
        const expectedPattern = `${basePrefix}_${id_cliente}`;
        return login.startsWith(expectedPattern);
    };

    // Função para gerar o novo login no padrão correto
    const getStandardLogin = (base: string, id_cliente: string): string => {
        const basePrefix = BASE__LOGIN_MAPPING[base];
        if (!basePrefix) return ""; // Se não temos mapeamento, retornamos vazio
        return `${basePrefix}_${id_cliente}`;
    };

    // Função para obter o login padronizado com sufixo quando necessário
    const getFinalLogin = (): string => {
        // Se o login é do tipo IPoE mas o tipo de conexão foi alterado para PPPoE
        if (isCurrentLoginIPoE && connectionType === "PPPoE") {
            // Usar o login padrão PPPoE em vez do login IPoE
            if (standardLogin) {
                return loginSuffix ? `${standardLogin}_${loginSuffix}` : standardLogin;
            }
            // Fallback: gerar login PPPoE do zero
            if (selectedLogin && selectedLogin.base && selectedLogin.id_cliente) {
                const basePrefix = BASE__LOGIN_MAPPING[selectedLogin.base];
                if (basePrefix) {
                    const newStandardLogin = `${basePrefix}_${selectedLogin.id_cliente}`;
                    return loginSuffix ? `${newStandardLogin}_${loginSuffix}` : newStandardLogin;
                }
            }
            return selectedLogin?.login || "";
        }

        // Se o login é do tipo IPoE e o tipo de conexão continua como IPoE
        if (isCurrentLoginIPoE && connectionType === "IPoE") {
            const updatedIPoELogin = getUpdatedIPoELogin();
            return updatedIPoELogin || selectedLogin?.login || "";
        }

        // Verifica primeiro se o login atual já está no padrão correto
        if (selectedLogin && selectedLogin.base && selectedLogin.id_cliente && selectedLogin.login) {
            if (isStandardLogin(selectedLogin.login, selectedLogin.base, selectedLogin.id_cliente)) {
                // Login já está no padrão correto - mantém como está
                return selectedLogin.login;
            }
        }

        // Se já temos o login padrão e o sufixo determinados (para PPPoE)
        if (standardLogin) {
            // Se tem sufixo, adiciona ao login padrão
            if (loginSuffix) {
                return `${standardLogin}_${loginSuffix}`;
            }
            return standardLogin;
        }

        // Fallback para a lógica antiga
        if (selectedLogin && selectedLogin.base && selectedLogin.id_cliente) {
            if (isStandardLogin(selectedLogin.login, selectedLogin.base, selectedLogin.id_cliente)) {
                return selectedLogin.login;
            } else {
                return getStandardLogin(selectedLogin.base, selectedLogin.id_cliente);
            }
        }

        return selectedLogin?.login || "";
    };

    // Verificar se o login está no padrão correto e obter o login padrão se necessário
    const loginForOnu = getFinalLogin();

    // Determinar se o login será alterado
    const willLoginChange = selectedLogin && selectedLogin.login
        ? selectedLogin.base && selectedLogin.id_cliente
            ? !isStandardLogin(selectedLogin.login, selectedLogin.base, selectedLogin.id_cliente)
                ? loginForOnu !== selectedLogin.login
                : isCurrentLoginIPoE && (connectionType === "PPPoE" || connectionType === "IPoE")
                    ? loginForOnu !== selectedLogin.login
                    : false
            : loginForOnu !== selectedLogin.login
        : false;

    // Função para exibir toast
    const showToast = useCallback((message: string, type: 'success' | 'error' = 'success') => {
        setToastMessage(message);
        setToastType(type);

        // Limpar toast após alguns segundos
        setTimeout(() => {
            setToastMessage(null);
        }, 3000);
    }, []);

    // Carregar a lista de OLTs ao montar o componente se ainda não estiver carregada
    useEffect(() => {
        if (olts.length === 0) {
            useOLTStore.getState().fetchOLTs();
        }
    }, [olts.length]);

    // Função para atualizar o login do cliente
    const updateClientLogin = useCallback(async () => {
        if (!selectedLogin || !willLoginChange || !loginForOnu || hasUpdatedLoginRef.current) {
            return;
        }

        try {
            setIsUpdatingLogin(true);
            hasUpdatedLoginRef.current = true;

            const response = await fetch(`/api/client/?id=${selectedLogin.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    login: loginForOnu,
                    senha: selectedLogin.id_cliente,
                    endpoint: selectedLogin.base,
                    id_cliente: selectedLogin.id_cliente,
                    id_grupo: selectedLogin.id_grupo,
                    autenticacao: connectionType === "PPPoE" ? "PPPoE" : "IPoE",
                    id_contrato: selectedLogin.id_contrato
                })
            });
            if (!response.ok) {
                throw new Error('Falha ao atualizar o login do cliente');
            }

            setLoginUpdated(true);
            showToast("Login do cliente atualizado com sucesso", "success");
        } catch (error) {
            console.error("Erro ao atualizar login do cliente:", error);
            showToast("Não foi possível atualizar o login do cliente", "error");
            // Se houve erro, permitir nova tentativa
            hasUpdatedLoginRef.current = false;
        } finally {
            setIsUpdatingLogin(false);
        }
    }, [selectedLogin, willLoginChange, loginForOnu, connectionType, showToast]);

    // Efeito para atualizar o login quando a ONU for ativada com sucesso e o sinal estiver bom
    useEffect(() => {
        if (successMessage && !signalError && signalInfo && willLoginChange && !isUpdatingLogin && !loginUpdated) {
            updateClientLogin();
        }
    }, [successMessage, signalError, signalInfo, willLoginChange, isUpdatingLogin, loginUpdated, updateClientLogin]);

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

    // Resetar as flags quando um novo ONU for selecionado
    useEffect(() => {
        hasDeletedOnuRef.current = false;
        hasUpdatedLoginRef.current = false;
        setLoginUpdated(false);
    }, [selectedOnu]);

    // Verificar login PPPoE quando mudar de IPoE para PPPoE
    useEffect(() => {
        const verifyLoginAvailability = async () => {
            // Só verificar se for login IPoE mudando para PPPoE e ainda não temos suffix definido
            if (isCurrentLoginIPoE &&
                connectionType === "PPPoE" &&
                selectedLogin?.base &&
                selectedLogin?.id_cliente &&
                !loginSuffix &&
                checkExistingLogins) {

                setIsCheckingLogin(true);
                try {
                    // Usar a função do hook para verificar a disponibilidade do login
                    await checkExistingLogins(selectedLogin.base, selectedLogin.id_cliente);
                } catch (error) {
                    console.error("Erro ao verificar disponibilidade do login:", error);
                } finally {
                    setIsCheckingLogin(false);
                }
            }
        };

        verifyLoginAvailability();
    }, [isCurrentLoginIPoE, connectionType, selectedLogin, loginSuffix, checkExistingLogins]);

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
                                <>
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

                                    {/* Seção para mostrar as credenciais da ONU */}
                                    {selectedLogin && loginForOnu && (
                                        <>

                                            {isCurrentLoginIPoE && connectionType === "PPPoE" ? (
                                                <>
                                                    <div className="mb-6 p-4 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
                                                        <h3 className="font-medium text-blue-800 dark:text-blue-300 text-center mb-3">
                                                            Credenciais para Configuração
                                                        </h3>
                                                        <div className="grid grid-cols-2 gap-3">
                                                            <div className="text-blue-700 dark:text-blue-400 font-medium">Login:</div>
                                                            <div className="font-mono font-semibold text-blue-700 dark:text-blue-300">
                                                                {loginForOnu}
                                                            </div>
                                                            <div className="text-blue-700 dark:text-blue-400 font-medium">Senha:</div>
                                                            <div className="font-mono font-semibold text-blue-700 dark:text-blue-300">
                                                                {selectedLogin.id_cliente}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </>
                                            ) : !isCurrentLoginIPoE && connectionType === "PPPoE" ? (
                                                <>
                                                    <div className="mb-6 p-4 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
                                                        <h3 className="font-medium text-blue-800 dark:text-blue-300 text-center mb-3">
                                                            Credenciais para Configuração
                                                        </h3>
                                                        <div className="grid grid-cols-2 gap-3">
                                                            <div className="text-blue-700 dark:text-blue-400 font-medium">Login:</div>
                                                            <div className="font-mono font-semibold text-blue-700 dark:text-blue-300">
                                                                {loginForOnu}
                                                            </div>
                                                            <div className="text-blue-700 dark:text-blue-400 font-medium">Senha:</div>
                                                            <div className="font-mono font-semibold text-blue-700 dark:text-blue-300">
                                                                {selectedLogin.id_cliente}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </>
                                            ) : (
                                                <>
                                                </>
                                            )}

                                            {willLoginChange && (
                                                <div className="mb-6 p-4 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
                                                    <div className="text-sm bg-blue-100 dark:bg-blue-800/50 p-2 rounded">
                                                        <p className="flex items-center text-blue-700 dark:text-blue-300">
                                                            <AlertTriangle className="h-4 w-4 mr-1 flex-shrink-0" />
                                                            <span>
                                                                {isCurrentLoginIPoE && connectionType === "PPPoE" ? (
                                                                    isCheckingLogin ? (
                                                                        <>
                                                                            <Loader2 className="h-3 w-3 mr-1 animate-spin inline" />
                                                                            Verificando disponibilidade do login PPPoE...
                                                                        </>
                                                                    ) : (
                                                                        <>
                                                                            O tipo de conexão foi alterado de IPoE para PPPoE. O login seguirá o padrão da empresa.
                                                                            {loginSuffix && <span className="ml-1 block">(com sufixo <span className="font-mono">_{loginSuffix}</span> para evitar duplicação)</span>}
                                                                        </>
                                                                    )
                                                                ) : isCurrentLoginIPoE && connectionType === "IPoE" ? (
                                                                    "As informações do login IPoE serão atualizadas com os dados da nova ONU."
                                                                ) : (
                                                                    "O login será ajustado para o padrão da empresa."
                                                                )}
                                                                {loginUpdated && <span className="ml-1 text-green-600 font-medium">(Atualizado)</span>}
                                                                {isUpdatingLogin && <span className="ml-1 text-blue-600 font-medium">(Atualizando...)</span>}
                                                            </span>
                                                        </p>
                                                    </div>
                                                </div>
                                            )}
                                        </>
                                    )}
                                </>
                            )}

                            <div className="flex justify-center space-x-4">
                                {isDeletingOnu || isUpdatingLogin ? (
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
                                                    {selectedLogin.id_cliente} - {selectedLogin.base}
                                                </div>
                                            </>
                                        )}
                                    </div>
                                </div>

                                {selectedLogin && (
                                    <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
                                        <h3 className="font-medium text-blue-800 dark:text-blue-300 mb-2">
                                            Login para configuração da ONU
                                        </h3>
                                        <div className="text-lg font-mono font-semibold text-blue-700 dark:text-blue-300 bg-blue-100 dark:bg-blue-800/50 p-2 rounded text-center mb-2">
                                            {loginForOnu}
                                        </div>
                                        {willLoginChange && (
                                            <div className="text-sm text-blue-600 dark:text-blue-400">
                                                <p className="flex items-center">
                                                    <AlertTriangle className="h-4 w-4 mr-1 inline" />
                                                    {isCurrentLoginIPoE && connectionType === "PPPoE" ? (
                                                        isCheckingLogin ? (
                                                            <>
                                                                <Loader2 className="h-3 w-3 mr-1 animate-spin inline" />
                                                                Verificando disponibilidade do login PPPoE...
                                                            </>
                                                        ) : (
                                                            <>
                                                                O tipo de conexão foi alterado de IPoE para PPPoE. O login seguirá o padrão da empresa.
                                                                {loginSuffix && <span className="ml-1 block">(com sufixo <span className="font-mono">_{loginSuffix}</span> para evitar duplicação)</span>}
                                                            </>
                                                        )
                                                    ) : isCurrentLoginIPoE && connectionType === "IPoE" ? (
                                                        "As informações do login IPoE serão atualizadas com os dados da nova ONU."
                                                    ) : (
                                                        "O login será ajustado para o padrão da empresa."
                                                    )}
                                                </p>
                                                <p>
                                                    Login original: <span className="font-medium">{selectedLogin.login}</span>
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                )}

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

            {/* Toast */}
            {toastMessage && (
                <div className={`fixed bottom-4 right-4 px-6 py-3 rounded-lg text-white shadow-lg z-50 ${toastType === 'success' ? 'bg-green-500' : 'bg-red-500'}`}>
                    <div className="flex items-center gap-2">
                        {toastType === 'success' ? (
                            <Check className="h-5 w-5" />
                        ) : (
                            <AlertTriangle className="h-5 w-5" />
                        )}
                        {toastMessage}
                    </div>
                </div>
            )}
        </Card>
    );
} 