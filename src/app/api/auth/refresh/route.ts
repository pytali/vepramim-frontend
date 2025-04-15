import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { AUTH_COOKIE_NAME, REFRESH_COOKIE_NAME } from "@/lib/auth"

const API_BASE_URL = process.env.API_BASE_URL || "https://service-api.brasildigital.net.br"

export async function POST() {
    try {
        const cookieStore = await cookies()
        const refreshToken = cookieStore.get(REFRESH_COOKIE_NAME)?.value

        if (!refreshToken) {
            return NextResponse.json({ message: "Refresh token não encontrado" }, { status: 401 })
        }

        // Fazer a chamada real à API para atualizar o token
        const response = await fetch(`${API_BASE_URL}/operations/api/auth/refreshtoken`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ refreshToken }),
        })

        if (!response.ok) {
            // Se o refresh token for inválido, remover os cookies
            cookieStore.delete(AUTH_COOKIE_NAME)
            cookieStore.delete(REFRESH_COOKIE_NAME)

            const errorData = await response.json()
            return NextResponse.json(
                { message: errorData.message || "Falha ao atualizar token" },
                { status: response.status }
            )
        }

        const data = await response.json()

        // Extrair os dados da resposta da API
        const { token, refreshToken: newRefreshToken, expiresIn } = data

        // Calcular a data de expiração
        const expiresAt = new Date()
        expiresAt.setSeconds(expiresAt.getSeconds() + expiresIn)

        // Atualizar o cookie do token de autenticação
        cookieStore.set(AUTH_COOKIE_NAME, token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            expires: expiresAt,
            path: "/",
        })

        // Atualizar o cookie do refresh token se um novo foi fornecido
        if (newRefreshToken) {
            const refreshExpiresAt = new Date()
            refreshExpiresAt.setDate(refreshExpiresAt.getDate() + 7) // 7 dias

            cookieStore.set(REFRESH_COOKIE_NAME, newRefreshToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "lax",
                expires: refreshExpiresAt,
                path: "/",
            })
        }

        return NextResponse.json({
            success: true,
            expiresAt: expiresAt.toISOString(),
        })
    } catch (error) {
        console.error("Token refresh error:", error)
        return NextResponse.json({ message: "Erro interno do servidor" }, { status: 500 })
    }
}

