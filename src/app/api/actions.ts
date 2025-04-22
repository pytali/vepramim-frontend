'use server'

const API_URL = process.env.API_URL
const API_USER = process.env.API_USER
const API_PASSWORD = process.env.API_PASSWORD

let authToken: string | null = null;

async function getAuthToken(): Promise<string> {
    if (authToken) {
        return authToken;
    }

    const response = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            user: API_USER,
            password: API_PASSWORD
        }),
        cache: 'no-store'
    });

    if (!response.ok) {
        throw new Error('Falha na autenticação');
    }

    const data = await response.json();
    if (!data.token) {
        throw new Error('Token não encontrado na resposta');
    }

    authToken = data.token as string;
    return authToken;
}

export async function getClientRadius(idCliente: string) {
    try {
        const token = await getAuthToken();

        const response = await fetch(`${API_URL}/api/v1/cliente/radius?idCliente=${idCliente}`, {
            headers: {
                Authorization: `Bearer ${token}`
            },
            cache: 'no-store'
        });

        if (!response.ok) {
            throw new Error('Erro ao buscar dados do radius');
        }

        return response.json();
    } catch (error) {
        console.error('Erro ao buscar dados do radius:', error);
        throw error;
    }
}

export async function getClientPlan(idContrato: string) {
    try {
        const token = await getAuthToken();

        const response = await fetch(`${API_URL}/api/v1/cliente/plano?idContrato=${idContrato}`, {
            headers: {
                Authorization: `Bearer ${token}`
            },
            cache: 'no-store'
        });

        if (!response.ok) {
            throw new Error('Erro ao buscar plano do cliente');
        }

        return response.json();
    } catch (error) {
        console.error('Erro ao buscar plano do cliente:', error);
        throw error;
    }
}

export async function getAtendimento(protocolo: string) {
    const idAtendimento = await getIdAtendimento(protocolo);

    try {
        const token = await getAuthToken();

        const response = await fetch(`${API_URL}/api/v1/opa/atendimento/?idAtendimento=${idAtendimento.data}`, {
            headers: {
                Authorization: `Bearer ${token}`
            },
            cache: 'no-store'
        });


        if (!response.ok) {
            throw new Error('Erro ao buscar atendimento');
        }

        return response.json();
    } catch (error) {
        console.error('Erro ao buscar atendimento:', error);
        throw error;
    }
}


async function getIdAtendimento(protocolo: string) {
    try {
        const token = await getAuthToken();

        const response = await fetch(`${API_URL}/api/v1/opa/?protocolo=${protocolo}`, {
            headers: {
                Authorization: `Bearer ${token}`
            },
            cache: 'no-store'
        });

        if (!response.ok) {
            throw new Error('Erro ao buscar ID do atendimento');
        }

        return response.json();
    } catch (error) {
        console.error('Erro ao buscar ID do atendimento:', error);
        throw error;
    }
}

export async function parseONUSerial(conexao: string): Promise<string | null> {
    if (!conexao) return null;

    // Tenta extrair o SN do formato ZTEGD42DDE1E:BRD.PVO.VLV.COD:2:15
    const parts = conexao.split(':');
    if (parts.length > 0) {
        return parts[0];
    }

    return null;
} 