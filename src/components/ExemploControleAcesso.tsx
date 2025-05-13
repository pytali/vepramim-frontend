'use client';

import React from 'react';
import { Role } from '@/types/auth';
import { RoleCheck, PermissionCheck } from './RoleBasedAccess';

/**
 * Componente de exemplo que demonstra o uso do sistema de roles
 */
export function ExemploControleAcesso() {
    return (
        <div className="p-6 space-y-8">
            <h1 className="text-2xl font-bold">Exemplo de Controle de Acesso</h1>

            <div className="bg-gray-100 p-4 rounded-lg">
                <h2 className="text-xl font-semibold mb-4">Verificação por Role</h2>

                {/* Conteúdo visível apenas para administradores */}
                <RoleCheck
                    requiredRole={Role.ADMIN}
                    fallback={<p className="text-red-500">Você precisa ser um administrador para ver este conteúdo.</p>}
                >
                    <div className="bg-green-100 p-4 rounded-lg mb-4">
                        <p className="font-semibold">Conteúdo exclusivo para Administradores</p>
                        <p>Este bloco só é visível para usuários com a role ADMIN.</p>
                    </div>
                </RoleCheck>

                {/* Conteúdo visível para técnicos ou supervisores */}
                <RoleCheck
                    requiredRoles={[Role.TECHNICIAN, Role.SUPERVISOR]}
                    fallback={<p className="text-red-500">Você precisa ser um técnico ou supervisor para ver este conteúdo.</p>}
                >
                    <div className="bg-blue-100 p-4 rounded-lg mb-4">
                        <p className="font-semibold">Conteúdo para Técnicos ou Supervisores</p>
                        <p>Este bloco é visível para usuários que têm a role TECHNICIAN ou SUPERVISOR.</p>
                    </div>
                </RoleCheck>

                {/* Conteúdo visível apenas para usuários com múltiplas roles */}
                <RoleCheck
                    requiredRoles={[Role.MANAGER, Role.ADMIN]}
                    requiredAllRoles={true}
                    fallback={<p className="text-red-500">Você precisa ser um gerente E administrador para ver este conteúdo.</p>}
                >
                    <div className="bg-purple-100 p-4 rounded-lg">
                        <p className="font-semibold">Conteúdo para Gerentes que também são Administradores</p>
                        <p>Este bloco só é visível para usuários que têm AMBAS as roles: MANAGER e ADMIN.</p>
                    </div>
                </RoleCheck>
            </div>

            <div className="bg-gray-100 p-4 rounded-lg">
                <h2 className="text-xl font-semibold mb-4">Verificação por Permissão</h2>

                {/* Conteúdo visível apenas para quem pode criar ONUs */}
                <PermissionCheck
                    resource="onu"
                    action="create"
                    fallback={<p className="text-red-500">Você não tem permissão para criar ONUs.</p>}
                >
                    <div className="bg-yellow-100 p-4 rounded-lg mb-4">
                        <p className="font-semibold">Funcionalidade de Criação de ONU</p>
                        <p>Este bloco é visível para usuários que podem criar ONUs.</p>
                        <button className="bg-green-500 text-white px-4 py-2 rounded-md mt-2">
                            Criar Nova ONU
                        </button>
                    </div>
                </PermissionCheck>

                {/* Botão de exclusão visível apenas para quem pode excluir ONUs */}
                <div className="bg-white p-4 rounded-lg border">
                    <p className="font-semibold">Gerenciamento de ONU</p>
                    <p>ID: 12345 | Nome: ONU-Cliente-A</p>
                    <div className="flex gap-2 mt-2">
                        <button className="bg-blue-500 text-white px-4 py-2 rounded-md">
                            Editar
                        </button>

                        <PermissionCheck
                            resource="onu"
                            action="delete"
                            fallback={<button className="bg-gray-300 text-gray-500 px-4 py-2 rounded-md cursor-not-allowed">
                                Excluir (Sem permissão)
                            </button>}
                        >
                            <button className="bg-red-500 text-white px-4 py-2 rounded-md">
                                Excluir
                            </button>
                        </PermissionCheck>
                    </div>
                </div>
            </div>
        </div>
    );
} 