import { cookies } from "next/headers"
import { jwtDecode } from "jwt-decode"
import { TokenPayload, Role, Permission, rolePermissions } from "@/types/auth"

// Constantes para os nomes dos cookies
export const AUTH_COOKIE_NAME = "auth_token"
export const REFRESH_COOKIE_NAME = "refresh_token"

// ==========================================
// Funções específicas do servidor
// ==========================================

// Função para definir cookies no lado do servidor
export async function setAuthCookies(token: string, refreshToken: string, expiresIn: number) {
    const cookieStore = await cookies()

    // Calcular a data de expiração
    const expiresAt = new Date()
    expiresAt.setSeconds(expiresAt.getSeconds() + expiresIn)

    // Definir o cookie de autenticação
    cookieStore.set(AUTH_COOKIE_NAME, token, {
        httpOnly: true, // Impede acesso via JavaScript (proteção contra XSS)
        secure: process.env.NODE_ENV === "production", // Só transmite via HTTPS em produção
        sameSite: "lax", // Proteção contra CSRF
        expires: expiresAt, // Define quando o cookie expira
        path: "/", // Disponível em todo o site
    })

    // Definir o cookie de refresh token com uma expiração mais longa
    const refreshExpiresAt = new Date()
    refreshExpiresAt.setDate(refreshExpiresAt.getDate() + 7) // 7 dias

    cookieStore.set(REFRESH_COOKIE_NAME, refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        expires: refreshExpiresAt,
        path: "/",
    })
}

// Função para remover cookies de autenticação
export async function removeAuthCookies() {
    const cookieStore = await cookies()
    cookieStore.delete(AUTH_COOKIE_NAME)
    cookieStore.delete(REFRESH_COOKIE_NAME)
}

// Função para verificar se o usuário está autenticado
export async function isAuthenticated() {
    const cookieStore = await cookies()
    return !!cookieStore.get(AUTH_COOKIE_NAME)
}

// Função para obter o token de autenticação
export async function getAuthToken() {
    const cookieStore = await cookies()
    return cookieStore.get(AUTH_COOKIE_NAME)?.value
}

// Função para obter o refresh token
export async function getRefreshToken() {
    const cookieStore = await cookies()
    return cookieStore.get(REFRESH_COOKIE_NAME)?.value
}

// Função para obter informações do usuário a partir do token JWT (servidor)
export async function getUserFromToken(): Promise<TokenPayload | null> {
    const token = await getAuthToken();

    if (!token) {
        return null;
    }

    try {
        // Decodificar o token JWT
        const decoded = jwtDecode<TokenPayload>(token);
        return decoded;
    } catch (error) {
        console.error("Erro ao decodificar token:", error);
        return null;
    }
}

// Função para atualizar o token usando o refresh token
export async function refreshAuthToken() {
    const refreshToken = await getRefreshToken()

    if (!refreshToken) {
        return false
    }

    try {
        const response = await fetch(`${process.env.API_BASE_URL}/operations/api/auth/refreshtoken`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ refreshToken }),
        })

        if (!response.ok) {
            return false
        }

        const data = await response.json()

        // Atualizar os cookies com o novo token
        setAuthCookies(data.token, data.refreshToken, data.expiresIn)
        return true
    } catch (error) {
        console.error("Erro ao atualizar token:", error)
        return false
    }
}

// =========================================
// Funções relacionadas a roles e permissões
// =========================================

// Função para extrair roles do token JWT
export async function getUserRoles(): Promise<Role[]> {
    const userData = await getUserFromToken();

    if (!userData) {
        return [];
    }

    // Verificar se há roles diretas no token
    if (userData.roles && Array.isArray(userData.roles)) {
        return userData.roles;
    }

    // Verificar se há roles no formato realm_access (usado pelo Keycloak)
    if (userData.realm_access && userData.realm_access.roles && Array.isArray(userData.realm_access.roles)) {
        // Converter string roles para o enum Role quando possível
        return userData.realm_access.roles
            .map(roleStr => {
                // Verificar se a string corresponde a um valor do enum Role
                return Object.values(Role).includes(roleStr as Role)
                    ? roleStr as Role
                    : null;
            })
            .filter((role): role is Role => role !== null);
    }

    return [];
}

// Função para verificar se o usuário tem uma determinada role
export async function hasRole(requiredRole: Role): Promise<boolean> {
    const userRoles = await getUserRoles();
    return userRoles.includes(requiredRole);
}

// Função para verificar se o usuário tem alguma das roles especificadas
export async function hasAnyRole(requiredRoles: Role[]): Promise<boolean> {
    const userRoles = await getUserRoles();
    return requiredRoles.some(role => userRoles.includes(role));
}

// Função para verificar se o usuário tem todas as roles especificadas
export async function hasAllRoles(requiredRoles: Role[]): Promise<boolean> {
    const userRoles = await getUserRoles();
    return requiredRoles.every(role => userRoles.includes(role));
}

// Função para verificar se o usuário tem permissão para realizar uma ação
export async function hasPermission(resource: string, action: Permission['action']): Promise<boolean> {
    const userRoles = await getUserRoles();

    // Verificar se alguma das roles do usuário tem a permissão necessária
    return userRoles.some(role => {
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

