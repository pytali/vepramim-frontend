import { ConnectionType, UnauthOnu } from "@/types/onu";

export interface OnuSignalInfo {
    rxPower: number; // Sinal da OLT para a ONU
    p_rx_power: number; // Sinal da ONU para a OLT
    status: "optimal" | "acceptable" | "critical";
}

export interface Login {
    login: string;
    conexao: string;
    id_contrato: string;
    id_cliente: string;
    senha: string;
    online: string;
    ultima_conexao_inicial: string;
    endpoint?: string;
    base?: string;
    id_grupo?: string;
    id: string;
    autenticacao: "L" | "H" | "M" | "V" | "D" | "I" | "E";
}

export interface RadiusSource {
    logins: Login[];
    endpoint: string;
    base?: string;
}

export interface LoginSelectorProps {
    isOpen: boolean;
    onClose: () => void;
    logins: Login[];
    onSelect: (login: Login) => void;
}

export interface SignalWarningDialogProps {
    isOpen: boolean;
    onClose: () => void;
    signalInfo: OnuSignalInfo | null;
}

export interface OnuActivationStepProps {
    selectedOnu: UnauthOnu | null;
    onPrevious: () => void;
    onNext: () => void;
    error: string | null;
}

export interface StepIndicatorProps {
    currentStep: number;
    totalSteps: number;
}

export interface Step1Props {
    loading: boolean;
    error: string | null;
    unauthorizedOnus: UnauthOnu[];
    selectedOnu: UnauthOnu | null;
    onSelectOnu: (onu: UnauthOnu) => void;
    onRefreshList: () => void;
    onNext: () => void;
}

export interface Step2Props {
    selectedOnu: UnauthOnu | null;
    searchQuery: string;
    setSearchQuery: (query: string) => void;
    searchingClient: boolean;
    error: string | null;
    selectedLogin: Login | null;
    loginSuffix: number | null;
    standardLogin: string;
    checkingLogin: boolean;
    onSearchClient: () => void;
    onPrevious: () => void;
    onNext: () => void;
}


export interface ContractData {
    endereco: string;
    numero: string;
}

// Interface para dados da resposta da API
export interface ContractResponse {
    contratos: Array<{
        endereco: string;
        numero: string;
        id: string;
        id_cliente: string;
        status: string;
        // Adicionando outros campos conhecidos
        contrato: string;
        bairro: string;
        complemento: string;
        cep: string;
        cidade: string;
    }>;
    endpoint: string;
}

export interface Step3Props {
    selectedOnu: UnauthOnu | null;
    selectedLogin: Login | null;
    onuName: string;
    connectionType: ConnectionType;
    serverType: "NETNUMEN" | "UNM";
    setOnuName: (name: string) => void;
    setConnectionType: (type: ConnectionType) => void;
    setServerType: (type: "NETNUMEN" | "UNM") => void;
    onPrevious: () => void;
    onNext: () => void;
}


export interface Step4Props {
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
    onCopyDetails: (params: {
        sn: string;
        olt: string;
        slot: string;
        pon: string;
        base: string;
        login: string;
        senha: string;
        rxPower: string;
        p_rx_power: string;
        vlan: string;
    }) => void;
    onReset: () => void;
    onDeleteOnu?: (data: { sn: string; oltId: string; ponId: string; serverType: "NETNUMEN" | "UNM" }) => Promise<void>;
    checkExistingLogins?: (base: string, id_cliente: string) => Promise<void>;
}