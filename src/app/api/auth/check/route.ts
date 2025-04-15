import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { AUTH_COOKIE_NAME, refreshAuthToken } from "@/lib/auth"

// Endpoint para verificar se o usuário está autenticado
export async function GET() {
    const cookieStore = await cookies()
    const token = cookieStore.get(AUTH_COOKIE_NAME)

    if (!token) {
        // Tentar atualizar o token usando o refresh token
        const refreshed = await refreshAuthToken()

        if (!refreshed) {
            return NextResponse.json({ authenticated: false }, { status: 401 })
        }

        // Token atualizado com sucesso
        return NextResponse.json({ authenticated: true, refreshed: true })
    }

    return NextResponse.json({ authenticated: true })
}

