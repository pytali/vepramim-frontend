'use client';

import React, { useEffect, useState } from 'react';
import { Role, Permission } from '@/types/auth';
import { hasRole, hasAnyRole, hasPermission } from '@/lib/client-auth';

// Props para o componente RoleCheck
interface RoleCheckProps {
    children: React.ReactNode;
    requiredRole?: Role;
    requiredRoles?: Role[];
    requiredAllRoles?: boolean;
    fallback?: React.ReactNode;
}

/**
 * Componente que verifica se o usuário tem a(s) role(s) necessária(s)
 * e renderiza o conteúdo apenas se tiver autorização
 */
export function RoleCheck({
    children,
    requiredRole,
    requiredRoles = [],
    requiredAllRoles = false,
    fallback = null,
}: RoleCheckProps) {
    const [hasAccess, setHasAccess] = useState<boolean | null>(null);

    useEffect(() => {
        async function checkAccess() {
            try {
                if (requiredRole) {
                    // Verificar uma única role
                    const access = await hasRole(requiredRole);
                    setHasAccess(access);
                } else if (requiredRoles.length > 0) {
                    if (requiredAllRoles) {
                        // Verificar se tem todas as roles necessárias
                        const access = await Promise.all(
                            requiredRoles.map(role => hasRole(role))
                        );
                        setHasAccess(access.every(Boolean));
                    } else {
                        // Verificar se tem pelo menos uma das roles necessárias
                        const access = await hasAnyRole(requiredRoles);
                        setHasAccess(access);
                    }
                } else {
                    // Se não houver verificação, permitir acesso
                    setHasAccess(true);
                }
            } catch (error) {
                console.error('Erro ao verificar acesso:', error);
                setHasAccess(false);
            }
        }

        checkAccess();
    }, [requiredRole, requiredRoles, requiredAllRoles]);

    // Durante a verificação, não mostrar nada
    if (hasAccess === null) {
        return null;
    }

    // Retornar o conteúdo ou fallback com base na verificação
    return hasAccess ? <>{children}</> : <>{fallback}</>;
}

// Props para o componente PermissionCheck
interface PermissionCheckProps {
    children: React.ReactNode;
    resource: string;
    action: Permission['action'];
    fallback?: React.ReactNode;
}

/**
 * Componente que verifica se o usuário tem permissão específica
 * e renderiza o conteúdo apenas se tiver autorização
 */
export function PermissionCheck({
    children,
    resource,
    action,
    fallback = null,
}: PermissionCheckProps) {
    const [hasAccess, setHasAccess] = useState<boolean | null>(null);

    useEffect(() => {
        async function checkPermission() {
            try {
                const access = await hasPermission(resource, action);
                setHasAccess(access);
            } catch (error) {
                console.error('Erro ao verificar permissão:', error);
                setHasAccess(false);
            }
        }

        checkPermission();
    }, [resource, action]);

    // Durante a verificação, não mostrar nada
    if (hasAccess === null) {
        return null;
    }

    // Retornar o conteúdo ou fallback com base na verificação
    return hasAccess ? <>{children}</> : <>{fallback}</>;
}

// Componente que verifica se a rota atual tem acesso negado
export function AccessDeniedPage() {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen px-4">
            <h1 className="text-3xl font-bold mb-4">Acesso Negado</h1>
            <p className="text-lg text-center max-w-md mb-6">
                Você não tem permissão para acessar esta página. Entre em contato com o administrador se isso for um erro.
            </p>
            <a
                href="/dashboard"
                className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
                Voltar para Dashboard
            </a>
        </div>
    );
} 