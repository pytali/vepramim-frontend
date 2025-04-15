import { cookies } from "next/headers"

// Constantes para os nomes dos cookies
export const AUTH_COOKIE_NAME = "auth_token"
export const REFRESH_COOKIE_NAME = "refresh_token"

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

