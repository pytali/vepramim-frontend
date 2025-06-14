import { UnauthOnu } from "@/types/onu";
import type { OLT } from "@/store/olts";

// Mapeamento das bases para os prefixos de login
export const BASE_LOGIN_MAPPING: Record<string, string> = {
    "ixc.brasildigital.net.br": "brd",
    "ixc.candeiasnet.com.br": "cdy",
    "ixc.br364telecom.com.br": "364"
};

export const BASE_MAPPING: Record<string, string> = {
    "ixc.brasildigital.net.br": "BRD",
    "ixc.candeiasnet.com.br": "CDEY",
    "ixc.br364telecom.com.br": "BR364"
};

// Mapeamento de endpoints para bases
export const ENDPOINT_MAPPING: Record<string, string> = {
    "https://ixc.brasildigital.net.br/webservice/v1/cliente_contrato": "ixc.brasildigital.net.br",
    "https://ixc.candeiasnet.com.br/webservice/v1/cliente_contrato": "ixc.candeiasnet.com.br",
    "https://ixc.br364telecom.com.br/webservice/v1/cliente_contrato": "ixc.br364telecom.com.br"
};

/**
 * Verifica se o login é do tipo IPoE.
 * @param autenticacao Tipo de autenticação
 * @returns true se for IPoE
 */
export function isIPoELogin(autenticacao: "L" | "H" | "M" | "V" | "D" | "I" | "E") {
    return autenticacao === 'D';
}

/**
 * Verifica se o login está no padrão correto.
 * @param login Login atual
 * @param base Base do cliente
 * @param id_cliente ID do cliente
 * @returns true se estiver no padrão
 */
export function isStandardLogin(login: string, base: string, id_cliente: string): boolean {
    const basePrefix = BASE_LOGIN_MAPPING[base];
    if (!basePrefix) return true; // Se não temos mapeamento, consideramos como padrão
    const expectedPattern = `${basePrefix}_${id_cliente}`;
    return login.startsWith(expectedPattern);
}

/**
 * Gera o login padrão para a base e id_cliente.
 * @param base Base do cliente
 * @param id_cliente ID do cliente
 * @returns Login padrão
 */
export function getStandardLogin(base: string, id_cliente: string): string {
    const basePrefix = BASE_LOGIN_MAPPING[base];
    if (!basePrefix) return "";
    return `${basePrefix}_${id_cliente}`;
}

/**
 * Gera um login IPoE atualizado com as informações da nova ONU.
 * @param olts Lista de OLTs
 * @param selectedOnu ONU selecionada
 * @returns Login IPoE atualizado ou null
 */
export function getUpdatedIPoELogin(olts: OLT[], selectedOnu: UnauthOnu) {
    if (!selectedOnu) return null;
    const matchedOlt = olts.find((olt) => olt.device_ip === selectedOnu.oltIp);
    if (!matchedOlt || !matchedOlt.ipoe) return null;
    const ponParts = selectedOnu.ponId.split('-');
    if (ponParts.length < 2) return null;
    return `${matchedOlt.ipoe.trim()}.${ponParts[2]}.${ponParts[3]}.${selectedOnu.sn}`;
}


// Função para normalizar strings removendo acentuação e caracteres especiais
export const normalizeToASCII = (str: string): string => {
    return str
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, ""); // Remove diacríticos
};

export const normalizeLogin = (login: string): string => {
    const SUBSTITUTIONS = [".", ":"]

    for (const char of SUBSTITUTIONS) {
        login = login.replaceAll(char, '');
    }

    return login.trim();
};

