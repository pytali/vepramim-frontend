import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { AUTH_COOKIE_NAME, REFRESH_COOKIE_NAME } from "./lib/auth"

// Rotas que requerem autenticação
const protectedRoutes = ["/dashboard", "/onu-search"]

// Rotas públicas
const publicRoutes = ["/"]

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl

    // Verificar se a rota requer autenticação
    const isProtectedRoute = protectedRoutes.some((route) => pathname === route || pathname.startsWith(`${route}/`))

    // Verificar se a rota é pública
    const isPublicRoute = publicRoutes.some((route) => pathname === route || pathname.startsWith(`${route}/`))

    // Obter o token de autenticação do cookie
    const token = request.cookies.get(AUTH_COOKIE_NAME)

    // Se for uma rota protegida e não houver token, redirecionar para a página de login
    if (isProtectedRoute && !token) {
        // Verificar se há um refresh token
        const refreshToken = request.cookies.get(REFRESH_COOKIE_NAME)

        if (refreshToken) {
            // Se houver um refresh token, redirecionar para uma página que tentará atualizar o token
            const url = new URL("/api/auth/refresh", request.url)
            url.searchParams.set("redirect", pathname)
            return NextResponse.redirect(url)
        }

        const url = new URL("/", request.url)
        return NextResponse.redirect(url)
    }

    // Se for uma rota pública e houver token, redirecionar para o dashboard
    if (isPublicRoute && token && pathname === "/") {
        const url = new URL("/dashboard", request.url)
        return NextResponse.redirect(url)
    }

    return NextResponse.next()
}

// Configurar o middleware para ser executado apenas nas rotas especificadas
export const config = {
    matcher: ["/dashboard", "/onu-search", "/"]
}

