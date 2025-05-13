import { jwtDecode } from "jwt-decode";
import { TokenPayload, Role, Permission, rolePermissions, User } from "@/types/auth";

// Cookie names - mesmos nomes do arquivo auth.ts
export const AUTH_COOKIE_NAME = "auth_token";
export const REFRESH_COOKIE_NAME = "refresh_token";

/**
 * Função para obter o token do cookie no lado do cliente 
 * Obs: Esta função não vai funcionar para cookies httpOnly
 */
export function getClientAuthToken(): string | null {
    if (typeof document === 'undefined') {
        return null; // Não está no navegador
    }

    // Dividir a string de cookies em um array de cookies individuais
    const cookiesArr = document.cookie.split(';');

    // Procurar pelo cookie de autenticação
    for (const cookie of cookiesArr) {
        const [name, value] = cookie.trim().split('=');
        if (name === AUTH_COOKIE_NAME) {
            return value;
        }
    }

    // Verificar se podemos obter o token via localStorage como fallback
    try {
        const token = localStorage.getItem(AUTH_COOKIE_NAME);
        if (token) {
            return token;
        }
    } catch {
        // Ignora erros de acesso ao localStorage (ex: modo privado)
    }

    return null;
}

/**
 * Função para decodificar o JWT e obter informações do usuário no lado do cliente
 * Obs: Esta função não vai funcionar para cookies httpOnly
 */
export function getClientUserFromToken(): TokenPayload | null {
    const token = getClientAuthToken();

    if (!token) {
        return null;
    }

    try {
        const decoded = jwtDecode<TokenPayload>(token);
        return decoded;
    } catch (error) {
        console.error("Erro ao decodificar token:", error);
        return null;
    }
}

/**
 * Recupera informações do usuário através da API (método recomendado)
 * Este método funciona mesmo com cookies httpOnly, pois utiliza a API
 * que acessa o token pelo lado do servidor
 */
export async function getCurrentUser(): Promise<User | null> {
    try {
        const response = await fetch('/api/user');

        if (!response.ok) {
            return null;
        }

        const data = await response.json();

        if (data.authenticated && data.user) {
            return data.user;
        }

        return null;
    } catch (error) {
        console.error("Erro ao buscar usuário atual:", error);
        return null;
    }
}

// =========================================
// Funções relacionadas a roles e permissões no cliente
// =========================================

/**
 * Extrai as roles do usuário usando a API
 */
export async function getClientUserRoles(): Promise<Role[]> {
    const user = await getCurrentUser();

    if (!user || !user.roles) {
        return [];
    }

    return user.roles;
}

/**
 * Verifica se o usuário tem uma determinada role
 */
export async function hasRole(requiredRole: Role): Promise<boolean> {
    const roles = await getClientUserRoles();
    return roles.includes(requiredRole);
}

/**
 * Verifica se o usuário tem alguma das roles especificadas
 */
export async function hasAnyRole(requiredRoles: Role[]): Promise<boolean> {
    const roles = await getClientUserRoles();
    return requiredRoles.some(role => roles.includes(role));
}

/**
 * Verifica se o usuário tem todas as roles especificadas
 */
export async function hasAllRoles(requiredRoles: Role[]): Promise<boolean> {
    const roles = await getClientUserRoles();
    return requiredRoles.every(role => roles.includes(role));
}

/**
 * Verifica se o usuário tem permissão para realizar uma ação
 */
export async function hasPermission(resource: string, action: Permission['action']): Promise<boolean> {
    const roles = await getClientUserRoles();

    // Verificar se alguma das roles do usuário tem a permissão necessária
    return roles.some(role => {
        const permissions = rolePermissions[role] || [];

        return permissions.some(permission => {
            // Permissão "*" indica que tem acesso a todos os recursos
            if (permission.resource === '*') {
                return permission.action === action || permission.action === '*';
            }

            // Verificar se a permissão específica existe
            return permission.resource === resource &&
                (permission.action === action || permission.action === '*');
        });
    });
} 