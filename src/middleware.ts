import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { AUTH_COOKIE_NAME, REFRESH_COOKIE_NAME } from "./lib/auth"
import { jwtDecode } from "jwt-decode"
import { Role, TokenPayload } from "./types/auth"

// Interface para configuração de rota
interface RouteConfig {
    path: string;
    requiredRoles?: Role[]; // Roles necessárias para acessar a rota (opcional)
}

// Rotas que requerem autenticação (com configuração de roles)
const protectedRoutes: RouteConfig[] = [
    { path: "/dashboard" }, // Qualquer usuário autenticado pode acessar
    { path: "/onu-search" }, // Qualquer usuário autenticado pode acessar
    {
        path: "/admin",
        requiredRoles: [Role.ADMIN]
    },
    {
        path: "/manager",
        requiredRoles: [Role.MANAGER, Role.ADMIN]
    },
    {
        path: "/technician",
        requiredRoles: [Role.TECHNICIAN, Role.SUPERVISOR, Role.ADMIN]
    },
    {
        path: "/onu-activation",
        requiredRoles: [Role.ADMIN, Role.SUPPORT, Role.TECHNICIAN]

    },
    {
        path: "/atendimentos",
        requiredRoles: [Role.ADMIN, Role.SUPPORT]
    }
]

// Rotas públicas
const publicRoutes = ["/"]

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl

    // Verificar se a rota requer autenticação
    const matchedRoute = protectedRoutes.find(route =>
        pathname === route.path || pathname.startsWith(`${route.path}/`)
    )

    const isProtectedRoute = !!matchedRoute

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

    // Se a rota requer roles específicas, verificar se o usuário tem as roles necessárias
    if (isProtectedRoute && token && matchedRoute.requiredRoles && matchedRoute.requiredRoles.length > 0) {
        try {
            // Decodificar o token JWT
            const decoded = jwtDecode<TokenPayload>(token.value)

            let userRoles: Role[] = []

            // Verificar se há roles diretas no token
            if (decoded.roles && Array.isArray(decoded.roles)) {
                userRoles = decoded.roles
            }

            // Verificar se há roles no formato realm_access (usado pelo Keycloak)
            if (decoded.realm_access?.roles && Array.isArray(decoded.realm_access.roles)) {
                userRoles = decoded.realm_access.roles
                    .filter(roleStr => Object.values(Role).includes(roleStr as Role))
                    .map(roleStr => roleStr as Role)
            }

            // Verificar se o usuário tem pelo menos uma das roles necessárias
            const hasRequiredRole = matchedRoute.requiredRoles.some(role => userRoles.includes(role))

            if (!hasRequiredRole) {
                // Redirecionar para a página de acesso negado
                const url = new URL("/access-denied", request.url)
                return NextResponse.redirect(url)
            }
        } catch (error) {
            console.error("Erro ao verificar roles:", error)
            // Em caso de erro, redirecionar para a página de login
            const url = new URL("/", request.url)
            return NextResponse.redirect(url)
        }
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
    matcher: [
        "/dashboard",
        "/onu-search",
        "/",
        "/admin/:path*",
        "/manager/:path*",
        "/technician/:path*",
        "/onu-activation/:path*"
    ]
}

