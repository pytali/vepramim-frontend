import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { VLAN_MAPPING } from "@/types/onu";
import { Check, ChevronLeft, Copy, AlertTriangle, Loader2 } from "lucide-react";
import { Step4Props } from "../types";
import { useEffect, useRef } from "react";
import { useOLTStore } from "@/store/olts";
import { useStep4LoginLogic } from "../hooks/useStep4LoginLogic";
import { useStep4SignalLogic } from "../hooks/useStep4SignalLogic";
import { LottieWrapper } from "./step4/LottieWrapper";
import { Step4Toast } from "./step4/Step4Toast";
import { SignalInfoCard } from "./step4/SignalInfoCard";
import { CredentialsCard } from "./step4/CredentialsCard";
import { BASE_MAPPING } from "@/utils/activationUtils";



export function Step4ConfirmAuthorize(props: Step4Props) {
    const {
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
    } = props;

    const { olts } = useOLTStore();
    const containerRef = useRef<HTMLDivElement>(null);

    // Lógica de login
    const {
        loginForOnu,
        willLoginChange,
        isCurrentLoginIPoE,
        updateClientLogin,
        loginUpdated,
        isUpdatingLogin,
        isCheckingLogin,
        setIsCheckingLogin,
        toastMessage,
        toastType,
    } = useStep4LoginLogic({
        selectedOnu,
        selectedLogin,
        connectionType,
        olts,
        loginSuffix,
        standardLogin,
        checkExistingLogins
    });

    // Lógica de sinal
    const {
        signalError,
        isDeletingOnu,
        lottieError,
    } = useStep4SignalLogic({
        signalInfo,
        onDeleteOnu,
        selectedOnu,
        serverType
    });

    // Atualizar login do cliente quando necessário
    useEffect(() => {
        if (successMessage && !signalError && signalInfo && willLoginChange && !isUpdatingLogin && !loginUpdated) {
            updateClientLogin();
        }
    }, [successMessage, signalError, signalInfo, willLoginChange, isUpdatingLogin, loginUpdated, updateClientLogin]);

    // Verificar login PPPoE quando mudar de IPoE para PPPoE
    useEffect(() => {
        const verifyLoginAvailability = async () => {
            if (isCurrentLoginIPoE &&
                connectionType === "PPPoE" &&
                selectedLogin?.base &&
                selectedLogin?.id_cliente &&
                !loginSuffix &&
                checkExistingLogins) {
                setIsCheckingLogin(true);
                try {
                    await checkExistingLogins(selectedLogin.base, selectedLogin.id_cliente);
                } catch {
                    // erro já tratado
                } finally {
                    setIsCheckingLogin(false);
                }
            }
        };
        verifyLoginAvailability();
    }, [isCurrentLoginIPoE, connectionType, selectedLogin, loginSuffix, checkExistingLogins, setIsCheckingLogin]);

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
                                        <LottieWrapper src="https://lottie.host/fdba93bd-e1bc-49ad-8e6a-7689c5383287/hJLyE6GITV.lottie" lottieError={lottieError} />
                                    </div>
                                    <p className="text-xl font-medium mt-4 text-blue-700">ONU autorizada, verificando sinal...</p>
                                    <p className="text-sm mt-2 text-gray-500">
                                        Este processo leva aproximadamente 60 segundos para ser concluído.
                                    </p>
                                </div>
                            ) : successMessage && !signalError && (
                                <div className="bg-green-50 p-6 rounded-lg text-center mb-10">
                                    <div className="h-32 w-32 mx-auto mb-4">
                                        <LottieWrapper src="https://lottie.host/836ceddd-aa49-47ab-9ba6-a74c6d4517c5/AezGcQ8fos.lottie" lottieError={lottieError} />
                                    </div>
                                    <p className="text-lg font-medium text-green-700">{successMessage}</p>
                                </div>
                            )}

                            {signalError && (
                                <div className="p-4 rounded-lg bg-red-50 border border-red-200 mb-6">
                                    <div className="h-32 w-32 mx-auto mb-4">
                                        <LottieWrapper src="https://lottie.host/96119506-44b2-4399-890b-5a41e67b70ce/rN9yy2iGzw.lottie" lottieError={lottieError} />
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
                                    <SignalInfoCard signalInfo={signalInfo} />

                                    {selectedLogin && loginForOnu && (
                                        <>
                                            {isCurrentLoginIPoE && connectionType === "PPPoE" ? (
                                                <CredentialsCard login={loginForOnu} senha={selectedLogin.id_cliente} connectionType={connectionType} color="blue">
                                                    {willLoginChange && (
                                                        <div className="text-sm bg-blue-100 dark:bg-blue-800/50 p-2 rounded mt-3">
                                                            <p className="flex items-center text-blue-700 dark:text-blue-300">
                                                                <AlertTriangle className="h-4 w-4 mr-1 flex-shrink-0" />
                                                                <span>
                                                                    {isCheckingLogin ? (
                                                                        <>
                                                                            <Loader2 className="h-3 w-3 mr-1 animate-spin inline" />
                                                                            Verificando disponibilidade do login PPPoE...
                                                                        </>
                                                                    ) : (
                                                                        <>
                                                                            O tipo de conexão foi alterado de IPoE para PPPoE. O login seguirá o padrão da empresa.
                                                                            {loginSuffix && <span className="ml-1 block">(com sufixo <span className="font-mono">_{loginSuffix}</span> para evitar duplicação)</span>}
                                                                        </>
                                                                    )}
                                                                </span>
                                                            </p>
                                                        </div>
                                                    )}
                                                </CredentialsCard>
                                            ) : isCurrentLoginIPoE ? (
                                                <CredentialsCard login={loginForOnu} senha={selectedLogin.id_cliente} connectionType={connectionType} color="blue">
                                                    {willLoginChange && (
                                                        <div className="text-sm bg-blue-100 dark:bg-blue-800/50 p-2 rounded mt-3">
                                                            <p className="flex items-center text-blue-700 dark:text-blue-300">
                                                                <AlertTriangle className="h-4 w-4 mr-1 flex-shrink-0" />
                                                                <span>
                                                                    As informações do login IPoE serão atualizadas com os dados da nova ONU.
                                                                </span>
                                                            </p>
                                                        </div>
                                                    )}
                                                </CredentialsCard>
                                            ) : connectionType === "IPoE" ? (
                                                <CredentialsCard login={loginForOnu} senha={selectedLogin.id_cliente} connectionType={connectionType} color="blue">
                                                    {willLoginChange && (
                                                        <div className="text-sm bg-blue-100 dark:bg-blue-800/50 p-2 rounded mt-3">
                                                            <p className="flex items-center text-blue-700 dark:text-blue-300">
                                                                <AlertTriangle className="h-4 w-4 mr-1 flex-shrink-0" />
                                                                <span>
                                                                    O tipo de conexão foi alterado de PPPoE para IPoE. Um novo login IPoE foi gerado automaticamente.
                                                                </span>
                                                            </p>
                                                        </div>
                                                    )}
                                                </CredentialsCard>
                                            ) : (
                                                <CredentialsCard login={loginForOnu} senha={selectedLogin.id_cliente} connectionType={connectionType} color="blue">
                                                    {willLoginChange && (
                                                        <div className="text-sm bg-blue-100 dark:bg-blue-800/50 p-2 rounded mt-3">
                                                            <p className="flex items-center text-blue-700 dark:text-blue-300">
                                                                <AlertTriangle className="h-4 w-4 mr-1 flex-shrink-0" />
                                                                <span>
                                                                    O login será ajustado para o padrão da empresa.
                                                                </span>
                                                            </p>
                                                        </div>
                                                    )}
                                                </CredentialsCard>
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
                                        {!signalError && signalInfo && !isVerifyingSignal && selectedLogin && selectedOnu && (
                                            <>
                                                <Button
                                                    variant="outline"
                                                    onClick={() => onCopyDetails({
                                                        sn: selectedOnu.sn,
                                                        olt: selectedOnu.oltName || selectedOnu.oltIp,
                                                        slot: selectedOnu.ponId.split("-")[2] || "",
                                                        pon: selectedOnu.ponId.split("-")[3] || "",
                                                        base: BASE_MAPPING[selectedLogin.base || ""] || selectedLogin.base || "",
                                                        login: loginForOnu,
                                                        senha: selectedLogin.id_cliente,
                                                        rxPower: signalInfo.rxPower.toFixed(2),
                                                        p_rx_power: signalInfo.p_rx_power.toFixed(2),
                                                        vlan: VLAN_MAPPING[connectionType],
                                                    })}
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
                                                <div className="flex items-center">
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
                                                    ) : isCurrentLoginIPoE ? (
                                                        "As informações do login IPoE serão atualizadas com os dados da nova ONU."
                                                    ) : connectionType === "IPoE" ? (
                                                        <>
                                                            O tipo de conexão foi alterado de PPPoE para IPoE. Um novo login IPoE será gerado automaticamente.
                                                            <div className="mt-1">
                                                                Login original PPPoE: <span className="font-medium font-mono">{selectedLogin.login}</span>
                                                            </div>
                                                        </>
                                                    ) : (
                                                        "O login será ajustado para o padrão da empresa."
                                                    )}
                                                </div>
                                                <div>
                                                    Login original: <span className="font-medium">{selectedLogin.login}</span>
                                                </div>
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
                                                    <LottieWrapper src="https://lottie.host/fdba93bd-e1bc-49ad-8e6a-7689c5383287/hJLyE6GITV.lottie" lottieError={lottieError} className="h-8 w-8" />
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
            <Step4Toast toastMessage={toastMessage} toastType={toastType} />
        </Card>
    );
} 