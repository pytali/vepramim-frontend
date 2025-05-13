// Tipos para autenticação e controle de acesso

// Enum com os possíveis tipos de roles
export enum Role {
    ADMIN = "grpNOC3",
    USER = "USER",
    TECHNICIAN = "grpTecnicos",
    MANAGER = "MANAGER",
    SUPERVISOR = "SUPERVISOR",
    SUPPORT = "grpNOC1",
    // Adicione outras roles conforme necessário
}

// Interface para o payload do JWT
export interface TokenPayload {
    user_id?: number;
    sub?: string;
    username?: string;
    preferred_username?: string;
    name?: string;
    email?: string;
    exp?: number;
    iat?: number;
    roles?: Role[]; // Array de roles do usuário
    realm_access?: {
        roles?: string[]; // Campo para compatibilidade com formatos como Keycloak
    };
    // Outros campos do token JWT
    [key: string]: unknown;
}

// Interface para o usuário
export interface User {
    id?: number | string;
    username?: string;
    preferred_username?: string;
    name?: string;
    email?: string;
    roles?: Role[]; // Array de roles do usuário
}

// Interface para verificação de permissões
export interface Permission {
    resource: string;
    action: 'read' | 'write' | 'delete' | 'create' | 'update' | '*';
}

// Mapeamento de roles para permissões
export const rolePermissions: Record<Role, Permission[]> = {
    [Role.ADMIN]: [
        { resource: '*', action: '*' },
    ],
    [Role.USER]: [
        { resource: 'onu', action: 'read' },
        { resource: 'client', action: 'read' },
    ],
    [Role.TECHNICIAN]: [
        { resource: 'onu', action: 'read' },
        { resource: 'onu', action: 'create' },
        { resource: 'onu', action: 'update' },
        { resource: 'client', action: 'read' },
    ],
    [Role.MANAGER]: [
        { resource: 'onu', action: 'read' },
        { resource: 'onu', action: 'create' },
        { resource: 'onu', action: 'update' },
        { resource: 'client', action: 'read' },
        { resource: 'client', action: 'create' },
        { resource: 'client', action: 'update' },
    ],
    [Role.SUPERVISOR]: [
        { resource: 'onu', action: 'read' },
        { resource: 'onu', action: 'create' },
        { resource: 'onu', action: 'update' },
        { resource: 'onu', action: 'delete' },
        { resource: 'client', action: 'read' },
        { resource: 'client', action: 'create' },
        { resource: 'client', action: 'update' },
    ],
    [Role.SUPPORT]: [
        { resource: 'onu', action: 'read' },
        { resource: 'client', action: 'read' },
    ],
}; 