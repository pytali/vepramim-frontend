import { useState, useCallback, useRef } from "react";
import { BASE_LOGIN_MAPPING, isIPoELogin, isStandardLogin, getStandardLogin, getUpdatedIPoELogin } from "@/utils/activationUtils";
import { OLT } from "@/store/olts";
import { UnauthOnu, ConnectionType } from "@/types/onu";
import { Login } from "../types";

interface UseStep4LoginLogicProps {
    selectedOnu: UnauthOnu | null;
    selectedLogin: Login | null;
    connectionType: ConnectionType;
    olts: OLT[];
    loginSuffix: number | null;
    standardLogin: string;
    checkExistingLogins?: (base: string, id_cliente: string) => Promise<void>;
}

export function useStep4LoginLogic({
    selectedOnu,
    selectedLogin,
    connectionType,
    olts,
    loginSuffix,
    standardLogin,
    checkExistingLogins
}: UseStep4LoginLogicProps) {
    const [isUpdatingLogin, setIsUpdatingLogin] = useState(false);
    const [loginUpdated, setLoginUpdated] = useState(false);
    const [isCheckingLogin, setIsCheckingLogin] = useState(false);
    const [toastMessage, setToastMessage] = useState<string | null>(null);
    const [toastType, setToastType] = useState<'success' | 'error'>('success');
    const hasUpdatedLoginRef = useRef<boolean>(false);

    // Verifica se o login atual é IPoE
    const isCurrentLoginIPoE = selectedLogin && isIPoELogin(selectedLogin.autenticacao);

    // Função para obter o login padronizado com sufixo quando necessário
    const getFinalLogin = (): string => {
        if (isCurrentLoginIPoE && connectionType === "PPPoE") {
            if (standardLogin) {
                return loginSuffix ? `${standardLogin}_${loginSuffix}` : standardLogin;
            }
            if (selectedLogin && selectedLogin.base && selectedLogin.id_cliente) {
                const basePrefix = BASE_LOGIN_MAPPING[selectedLogin.base];
                if (basePrefix) {
                    const newStandardLogin = `${basePrefix}_${selectedLogin.id_cliente}`;
                    return loginSuffix ? `${newStandardLogin}_${loginSuffix}` : newStandardLogin;
                }
            }
            return selectedLogin?.login || "";
        }
        if (isCurrentLoginIPoE && connectionType === "IPoE") {
            const updatedIPoELogin = getUpdatedIPoELogin(olts, selectedOnu!);
            return updatedIPoELogin || selectedLogin?.login || "";
        }
        if (!isCurrentLoginIPoE && connectionType === "IPoE") {
            const updatedIPoELogin = getUpdatedIPoELogin(olts, selectedOnu!);
            return updatedIPoELogin || selectedLogin?.login || "";
        }
        if (selectedLogin && selectedLogin.base && selectedLogin.id_cliente && selectedLogin.login) {
            if (isStandardLogin(selectedLogin.login, selectedLogin.base, selectedLogin.id_cliente)) {
                return selectedLogin.login;
            }
        }
        if (standardLogin) {
            if (loginSuffix) {
                return `${standardLogin}_${loginSuffix}`;
            }
            return standardLogin;
        }
        if (selectedLogin && selectedLogin.base && selectedLogin.id_cliente) {
            if (isStandardLogin(selectedLogin.login, selectedLogin.base, selectedLogin.id_cliente)) {
                return selectedLogin.login;
            } else {
                return getStandardLogin(selectedLogin.base, selectedLogin.id_cliente);
            }
        }
        return selectedLogin?.login || "";
    };

    const loginForOnu = getFinalLogin();

    const willLoginChange = selectedLogin && selectedLogin.login
        ? (
            (isCurrentLoginIPoE && (connectionType === "PPPoE" || connectionType === "IPoE") && loginForOnu !== selectedLogin.login) ||
            (!isCurrentLoginIPoE && connectionType === "IPoE") ||
            (!isCurrentLoginIPoE && connectionType === "PPPoE" &&
                selectedLogin.base && selectedLogin.id_cliente &&
                !isStandardLogin(selectedLogin.login, selectedLogin.base, selectedLogin.id_cliente) &&
                loginForOnu !== selectedLogin.login)
        )
        : false;

    const showToast = useCallback((message: string, type: 'success' | 'error' = 'success') => {
        setToastMessage(message);
        setToastType(type);
        setTimeout(() => {
            setToastMessage(null);
        }, 3000);
    }, []);

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
            hasUpdatedLoginRef.current = false;
        } finally {
            setIsUpdatingLogin(false);
        }
    }, [selectedLogin, willLoginChange, loginForOnu, connectionType, showToast]);

    return {
        loginForOnu,
        willLoginChange,
        isCurrentLoginIPoE,
        updateClientLogin,
        loginUpdated,
        isUpdatingLogin,
        isCheckingLogin,
        setIsCheckingLogin,
        showToast,
        toastMessage,
        toastType,
        setLoginUpdated,
        hasUpdatedLoginRef,
        checkExistingLogins
    };
} 