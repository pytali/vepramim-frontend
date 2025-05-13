import { NextResponse } from "next/server";
import { getAuthToken } from "@/lib/auth";
import { jwtDecode } from "jwt-decode";
import { TokenPayload, Role } from "@/types/auth";

/**
 * Endpoint para obter informações do usuário atual
 * Este endpoint pode ser acessado pelo cliente para obter informações do usuário
 * sem precisar manipular diretamente o JWT (que é httpOnly)
 */
export async function GET() {
    try {
        // Obter o token de autenticação do cookie (só funciona no servidor)
        const token = await getAuthToken();

        if (!token) {
            return NextResponse.json(
                {
                    error: "Não autorizado",
                    authenticated: false
                },
                { status: 401 }
            );
        }

        // Decodificar o token JWT para extrair informações do usuário
        const decoded = jwtDecode<TokenPayload>(token);

        // Extrair roles do token
        let userRoles: Role[] = [];

        // Verificar se há roles diretas no token
        if (decoded.roles && Array.isArray(decoded.roles)) {
            userRoles = decoded.roles;
        }

        // Verificar se há roles no formato realm_access (usado pelo Keycloak)
        if (decoded.realm_access?.roles && Array.isArray(decoded.realm_access.roles)) {
            // Converter string roles para o enum Role quando possível
            const keycloakRoles = decoded.realm_access.roles
                .filter(roleStr => Object.values(Role).includes(roleStr as Role))
                .map(roleStr => roleStr as Role);

            // Adicionar roles de Keycloak se não estiverem já presentes
            keycloakRoles.forEach(role => {
                if (!userRoles.includes(role)) {
                    userRoles.push(role);
                }
            });
        }

        // Extrair e retornar os dados relevantes
        return NextResponse.json({
            authenticated: true,
            user: {
                id: decoded?.user_id || decoded?.sub,
                username: decoded?.username || decoded?.preferred_username,
                name: decoded?.name,
                email: decoded?.email,
                roles: userRoles
            }
        });
    } catch (error) {
        console.error("Erro ao obter informações do usuário:", error);
        return NextResponse.json(
            { error: "Erro interno do servidor" },
            { status: 500 }
        );
    }
} 