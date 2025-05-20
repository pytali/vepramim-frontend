import { useEffect, useState } from "react";
import { AuthorizationOnuRequest, ConnectionType, UnauthOnu, VLAN_MAPPING } from "@/types/onu";
import { Login, OnuSignalInfo, RadiusSource } from "../types";
import { useActivityLogStore } from "@/store/activity-log";
import { getCurrentUser } from "@/lib/client-auth";
import { ACCEPTABLE_SIGNAL_THRESHOLD, CRITICAL_SIGNAL_THRESHOLD } from "@/lib/constants";
import { useOLTStore } from "@/store/olts";
import { isStandardLogin, getStandardLogin, BASE_LOGIN_MAPPING, BASE_MAPPING } from "@/utils/activationUtils";


export function useOnuActivation() {
    const { addLog, updateOnuLog } = useActivityLogStore();
    const { olts } = useOLTStore();
    const [loading, setLoading] = useState(false);
    const [authorizingOnu, setAuthorizingOnu] = useState<string | null>(null);
    const [unauthorizedOnus, setUnauthorizedOnus] = useState<UnauthOnu[]>([]);
    const [selectedOnu, setSelectedOnu] = useState<UnauthOnu | null>(null);
    const [onuName, setOnuName] = useState("");
    const [connectionType, setConnectionType] = useState<ConnectionType>("PPPoE");
    const [serverType, setServerType] = useState<"NETNUMEN" | "UNM">("NETNUMEN");
    const [error, setError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [currentStep, setCurrentStep] = useState(1);
    const [signalInfo, setSignalInfo] = useState<OnuSignalInfo | null>(null);
    const [showSignalWarning, setShowSignalWarning] = useState(false);
    const [copiedToClipboard, setCopiedToClipboard] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [searchingClient, setSearchingClient] = useState(false);
    const [showLoginSelector, setShowLoginSelector] = useState(false);
    const [availableLogins, setAvailableLogins] = useState<Login[]>([]);
    const [selectedLogin, setSelectedLogin] = useState<Login | null>(null);
    const [isVerifyingSignal, setIsVerifyingSignal] = useState(false);
    const [loginSuffix, setLoginSuffix] = useState<number | null>(null);
    const [checkingLogin, setCheckingLogin] = useState(false);
    const [standardLogin, setStandardLogin] = useState<string>("");
    const totalSteps = 4;


    // Verifica se existe login duplicado e determina o sufixo necessário
    const checkExistingLogins = async (base: string, id_cliente: string): Promise<void> => {
        if (!base || !id_cliente) return;

        const basePrefix = BASE_LOGIN_MAPPING[base];
        if (!basePrefix) return;

        setCheckingLogin(true);
        try {
            // Verifica se o login já existe
            const response = await fetch(`/api/login/check?basePrefix=${basePrefix}&idCliente=${id_cliente}`);

            if (!response.ok) {
                throw new Error("Erro ao verificar logins existentes");
            }

            const data = await response.json();

            setStandardLogin(data.login);
            setLoginSuffix(data.suffix);

        } catch (error) {
            console.error("Erro ao verificar logins duplicados:", error);
        } finally {
            setCheckingLogin(false);
        }
    };

    // Função para obter o login final com sufixo quando necessário
    const getFinalLogin = (): string => {
        if (!standardLogin) return selectedLogin?.login || "N/A";

        // Se tem sufixo, adiciona ao login padrão
        if (loginSuffix) {
            return `${standardLogin}_${loginSuffix}`;
        }

        return standardLogin;
    };

    // Função para obter o login padronizado quando necessário
    const getLoginForOnu = (): string => {
        if (!selectedLogin || !selectedLogin.base || !selectedLogin.id_cliente) {
            return selectedLogin?.login || "N/A";
        }

        // Usar o login final com sufixo se disponível
        if (standardLogin) {
            return getFinalLogin();
        }

        // Verificar se o login precisa ser padronizado
        if (!isStandardLogin(selectedLogin.login, selectedLogin.base, selectedLogin.id_cliente)) {
            return getStandardLogin(selectedLogin.base, selectedLogin.id_cliente);
        }

        return selectedLogin.login;
    };

    useEffect(() => {
        fetchUnauthorizedOnus();
    }, []);

    // Carregar a lista de OLTs se necessário
    useEffect(() => {
        if (olts.length === 0) {
            useOLTStore.getState().fetchOLTs();
        }
    }, [olts.length]);

    const fetchUnauthorizedOnus = async () => {
        setLoading(true);
        setError(null);

        try {
            const response = await fetch("/api/onu/unauthorized");

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error_description || `Erro ao buscar ONUs: ${response.status}`);
            }

            const data = await response.json();

            if (data.data && Array.isArray(data.data)) {
                setUnauthorizedOnus(data.data);
            } else {
                setUnauthorizedOnus([]);
            }
        } catch (err) {
            console.error("Erro ao buscar ONUs não autorizadas:", err);
            setError(err instanceof Error ? err.message : "Falha ao carregar ONUs não autorizadas. Tente novamente.");
        } finally {
            setLoading(false);
        }
    };

    const handleSelectOnu = (onu: UnauthOnu) => {
        setSelectedOnu(onu);
        // Inicializar o nome com o número de série
        setOnuName(`ONU_${onu.sn}`);
        // Limpar informações de sinal ao selecionar nova ONU
        setSignalInfo(null);
    };

    const checkOnuSignal = async () => {
        if (!selectedOnu) return;

        try {
            // Verificar a rota correta para obter o sinal da ONU após ativação
            const response = await fetch(`/api/onu/${selectedOnu.sn}`);

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error_description || `Erro ao verificar sinal da ONU: ${response.status}`);
            }

            const data = await response.json();

            if (data.data && data.data[0]?.onu_signal) {
                const onuSignal = data.data[0].onu_signal;
                // Avaliar o status do sinal
                const rxPowerValue = parseFloat(onuSignal.rx_power);
                const p_rx_power = parseFloat(onuSignal.p_rx_power);

                // Verificar se os valores são números válidos
                if (isNaN(rxPowerValue) || isNaN(p_rx_power)) {
                    console.log("Valores de sinal inválidos:", onuSignal);
                    setSignalInfo(null);
                    return;
                }

                let status: "optimal" | "acceptable" | "critical" = "optimal";

                // Avaliamos com base no pior valor entre os dois

                if (p_rx_power < (CRITICAL_SIGNAL_THRESHOLD - 2) || rxPowerValue < CRITICAL_SIGNAL_THRESHOLD) {
                    status = "critical";
                    setShowSignalWarning(true);
                } else if (p_rx_power < (ACCEPTABLE_SIGNAL_THRESHOLD - 2) || rxPowerValue < ACCEPTABLE_SIGNAL_THRESHOLD) {
                    status = "acceptable";
                }

                setSignalInfo({
                    rxPower: rxPowerValue,
                    p_rx_power: p_rx_power,
                    status: status
                });

                // Agora que temos o sinal, podemos mostrar a mensagem de sucesso
                setSuccessMessage(`ONU ${selectedOnu.sn} autorizada com sucesso!`);

                // Obter o login correto para o log (padronizado se necessário)
                const loginToUse = getLoginForOnu();

                // Atualizar o log com as informações de sinal se temos um log recente desta ONU
                const updatedLogText = `LEMBRE DE HABILITAR O ACESSO REMOTO!
•⁠  SN/MAC: ${selectedOnu.sn}
•⁠  OLT: ${selectedOnu.oltName}
•⁠  SLOT: ${selectedOnu.ponId.split("-")[2] || "N/A"}
•⁠  PON: ${selectedOnu.ponId.split("-")[3] || "N/A"}
•⁠  ⁠BASE: ${BASE_MAPPING[selectedLogin?.base || ""] || "N/A"}
•⁠  ⁠LOGIN: ${loginToUse}
•⁠  ⁠SENHA: ${selectedLogin?.id_cliente || "N/A"}
•⁠  ⁠Sinal OLT→ONU: ${rxPowerValue.toFixed(2)} dBm
•⁠  ⁠Sinal ONU→OLT: ${p_rx_power.toFixed(2)} dBm
•⁠  ⁠VLAN: ${VLAN_MAPPING[connectionType]}`;

                // Atualizar o log de atividade com as informações de sinal
                updateOnuLog(selectedOnu.sn, updatedLogText);
            } else {
                // Se não conseguir obter o sinal, continuamos com o fluxo normal
                console.log("Não foi possível obter informações de sinal dos dados retornados:", data);
                setSignalInfo(null);
                // Mesmo sem sinal, mostramos a mensagem de sucesso após a tentativa
                setSuccessMessage(`ONU ${selectedOnu.sn} autorizada com sucesso!`);
            }
        } catch (err) {
            console.error("Erro ao verificar sinal da ONU:", err);
            // Não bloqueamos o fluxo se não conseguir obter o sinal
            setSignalInfo(null);
            // Mesmo com erro, mostramos a mensagem de sucesso após a tentativa
            setSuccessMessage(`ONU ${selectedOnu.sn} autorizada com sucesso!`);
        } finally {
            setIsVerifyingSignal(false);
        }
    };

    const authorizeOnu = async () => {
        if (!selectedOnu) return;

        setAuthorizingOnu(selectedOnu.sn);
        setError(null);
        setSuccessMessage(null);
        setIsVerifyingSignal(false);

        try {
            // Preparar payload conforme a documentação da API
            const payload: AuthorizationOnuRequest = {
                sn: selectedOnu.sn,
                oltId: selectedOnu.oltIp,
                ponId: selectedOnu.ponId,
                onuType: selectedOnu.dt,
                serverType: serverType,
                name: onuName,
                vlan: VLAN_MAPPING[connectionType]
            };

            const response = await fetch("/api/onu/authorize", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error_description || `Erro ao autorizar ONU: ${response.status}`);
            }

            // Extrair slots e portas
            const slot = selectedOnu.ponId.split("-")[2] || "N/A";
            const pon = selectedOnu.ponId.split("-")[3] || "N/A";
            const baseCode = BASE_MAPPING[selectedLogin?.base || ""] || "N/A";
            // Obter o login correto (padronizado se necessário)
            const loginToUse = getLoginForOnu();

            // Montar o texto completo para o log
            const logText = `LEMBRE DE HABILITAR O ACESSO REMOTO!
•⁠  SN/MAC: ${selectedOnu.sn}
•⁠  OLT: ${selectedOnu.oltName}
•⁠  SLOT: ${slot}
•⁠  PON: ${pon}
•⁠  ⁠BASE: ${baseCode}
•⁠  ⁠LOGIN: ${loginToUse}
•⁠  ⁠SENHA: ${selectedLogin?.id_cliente || "N/A"}
•⁠  ⁠Sinal OLT→ONU: N/A dBm
•⁠  ⁠Sinal ONU→OLT: N/A dBm
•⁠  ⁠VLAN: ${VLAN_MAPPING[connectionType]}`;

            // Obter informações do usuário via API
            const userInfo = await getCurrentUser();
            // Usar nome de usuário do token ou fallback para 'sistema'
            const username = userInfo?.username || userInfo?.name || 'sistema';

            // Registrar o evento no log de atividades
            addLog({
                type: 'onu_activation',
                message: `ONU ativada: ${selectedOnu.sn}`,
                onuSerial: selectedOnu.sn,
                onuData: logText,
                user: username
            });

            // Não mostrar mensagem de sucesso ainda
            // setSuccessMessage(`ONU ${selectedOnu.sn} autorizada com sucesso!`);

            // Indicar que estamos verificando o sinal
            setIsVerifyingSignal(true);

            // Recarregar a lista após autorização bem-sucedida
            fetchUnauthorizedOnus();

            // Avançar para o passo de conclusão
            setCurrentStep(totalSteps);

            // Adicionar um atraso antes de verificar o sinal
            // Isso dá tempo para que a ONU seja registrada e o sinal estabilize
            setTimeout(() => {
                checkOnuSignal();
            }, 60000);
        } catch (err) {
            console.error("Erro ao autorizar ONU:", err);
            setError(err instanceof Error ? err.message : "Falha ao autorizar ONU. Verifique os dados e tente novamente.");
            setIsVerifyingSignal(false);
        } finally {
            setAuthorizingOnu(null);
        }
    };

    const goToNextStep = () => {
        if (currentStep < totalSteps) {
            setCurrentStep(currentStep + 1);
        }
    };

    const goToPreviousStep = () => {
        if (currentStep > 1) {
            setCurrentStep(currentStep - 1);
        }
    };

    const resetProcess = () => {
        setSelectedOnu(null);
        setOnuName("");
        setSearchQuery("");
        setSelectedLogin(null);
        setCurrentStep(1);
        setSuccessMessage(null);
        setError(null);
        setSignalInfo(null);
        setShowSignalWarning(false);
    };

    const copyOnuDetailsToClipboard = (params: { sn: string; olt: string; slot: string; pon: string; base: string; login: string; senha: string; rxPower: string; p_rx_power: string; vlan: string }) => {
        const textToCopy = `LEMBRE DE HABILITAR O ACESSO REMOTO!\n•⁠  SN/MAC: ${params.sn}\n•⁠  OLT: ${params.olt}\n•⁠  SLOT: ${params.slot}\n•⁠  PON: ${params.pon}\n•⁠  ⁠BASE: ${params.base}\n•⁠  ⁠LOGIN: ${params.login}\n•⁠  ⁠SENHA: ${params.senha}\n•⁠  ⁠Sinal OLT→ONU: ${params.rxPower} dBm\n•⁠  ⁠Sinal ONU→OLT: ${params.p_rx_power} dBm\n•⁠  ⁠VLAN: ${params.vlan}`;
        navigator.clipboard.writeText(textToCopy).then(() => {
            setCopiedToClipboard(true);
            setTimeout(() => setCopiedToClipboard(false), 2000);
        });
    };

    // Determina se a entrada é um ID de contrato (numérico) ou um SN (alfanumérico)
    const isIdContrato = (query: string): boolean => {
        return /^\d+$/.test(query);
    };

    // Processa um login selecionado pelo usuário
    const handleLoginSelect = (login: Login) => {
        setShowLoginSelector(false);
        setSelectedLogin(login);
        setLoginSuffix(null); // Resetar o sufixo
        setStandardLogin(""); // Resetar o login padronizado

        // Verificar a possibilidade de login duplicado
        if (login.base && login.id_cliente) {
            checkExistingLogins(login.base, login.id_cliente);
        }

        // Atualizar o nome da ONU com base nos dados do login
        // TODO: Verificar se é necessário manter o nome original da ONU
        if (login.base && login.id_cliente) {
            // Obter o código abreviado da base ou usar a base original se não tiver mapeamento
            const baseCode = BASE_MAPPING[login.base] || login.base;
            setOnuName(`${baseCode} - ${login.id_cliente}`);
        }
    };

    // Busca o cliente pelo ID do contrato ou SN
    const searchClient = async () => {
        if (!searchQuery.trim()) {
            setError("Por favor, digite um número de série ou ID de cliente");
            return;
        }

        setSearchingClient(true);
        setError(null);

        try {
            if (isIdContrato(searchQuery)) {
                // Busca dados do radius
                const response = await fetch(`/api/client?idCliente=${searchQuery}`);

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.error_description || "Erro ao buscar dados do cliente");
                }

                const radiusData = await response.json();

                if (radiusData.error) {
                    throw new Error("Cliente não encontrado");
                }

                // Combine logins de todos os endpoints disponíveis
                let allLogins: Login[] = [];

                // Verifica se há dados em múltiplos endpoints
                if (radiusData.data && radiusData.data.length > 0) {
                    radiusData.data.forEach((source: RadiusSource) => {
                        if (source.logins && Array.isArray(source.logins)) {
                            // Adiciona informação do endpoint e base em cada login
                            const loginsWithSource = source.logins.map((login: Login) => ({
                                ...login,
                                endpoint: source.endpoint,
                                base: source.base || source.endpoint.replace('https://', '').split('/')[0]
                            }));
                            allLogins = [...allLogins, ...loginsWithSource];
                        }
                    });
                }

                if (allLogins.length === 0) {
                    throw new Error("Nenhum login encontrado para este cliente");
                }
                // Se houver apenas um login, seleciona automaticamente
                if (allLogins.length === 1) {
                    handleLoginSelect(allLogins[0]);
                } else {
                    // Se houver múltiplos logins, mostra o seletor
                    setAvailableLogins(allLogins);
                    setShowLoginSelector(true);
                }
            } else {
                // Se for um SN, verifica se é o mesmo da ONU selecionada
                if (searchQuery.toUpperCase() === selectedOnu?.sn.toUpperCase()) {
                    // Mesmo SN, pode prosseguir sem associar cliente
                    setSearchQuery("");
                } else {
                    throw new Error("O número de série não corresponde à ONU selecionada");
                }
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : "Ocorreu um erro durante a busca");
        } finally {
            setSearchingClient(false);
        }
    };

    // Adicionar a função deleteOnu
    const deleteOnu = async (data: { sn: string; oltId: string; ponId: string; serverType: "NETNUMEN" | "UNM" }) => {
        try {
            const response = await fetch("/api/onu/delete", {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error_description || `Erro ao excluir ONU: ${response.status}`);
            }

            // Recarregar a lista após exclusão bem-sucedida
            fetchUnauthorizedOnus();
        } catch (err) {
            console.error("Erro ao excluir ONU:", err);
            throw err;
        }
    };

    return {
        loading,
        authorizingOnu,
        unauthorizedOnus,
        selectedOnu,
        onuName,
        connectionType,
        serverType,
        error,
        successMessage,
        currentStep,
        signalInfo,
        showSignalWarning,
        copiedToClipboard,
        searchQuery,
        searchingClient,
        showLoginSelector,
        availableLogins,
        selectedLogin,
        isVerifyingSignal,
        totalSteps,
        loginSuffix,
        standardLogin,
        checkingLogin,
        setOnuName,
        setConnectionType,
        setServerType,
        setShowSignalWarning,
        setShowLoginSelector,
        setSearchQuery,
        fetchUnauthorizedOnus,
        handleSelectOnu,
        authorizeOnu,
        goToNextStep,
        goToPreviousStep,
        resetProcess,
        copyOnuDetailsToClipboard,
        handleLoginSelect,
        searchClient,
        deleteOnu
    };
} 