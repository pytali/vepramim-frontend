import { UnauthOnu } from "@/types/onu";

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