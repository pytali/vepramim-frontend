import React from "react";

interface CredentialsCardProps {
    login: string;
    senha: string;
    color?: string; // ex: 'blue', 'green', etc
    children?: React.ReactNode;
    connectionType: string;
}

export function CredentialsCard({ login, senha, color = 'blue', children, connectionType }: CredentialsCardProps) {
    const bg = color === 'blue' ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800' : 'bg-green-50 border-green-200';
    const text = color === 'blue' ? 'text-blue-800 dark:text-blue-300' : 'text-green-800';
    const mono = color === 'blue' ? 'text-blue-700 dark:text-blue-300' : 'text-green-700';

    return connectionType === "PPPoE" ? (
        <div className={`mb-6 p-4 rounded-lg ${bg} border`}>
            <h3 className={`font-medium ${text} text-center mb-3`}>
                Credenciais para Configuração
            </h3>
            <div className="grid grid-cols-2 gap-3">
                <div className={`${mono} font-medium`}>Login:</div>
                <div className={`font-mono font-semibold ${mono}`}>{login}</div>
                <div className={`${mono} font-medium`}>Senha:</div>
                <div className={`font-mono font-semibold ${mono}`}>{senha}</div>
            </div>
            {children && <div className="mt-3">{children}</div>}
        </div>
    ) : (
        <div className={`mb-6 p-4 rounded-lg ${bg} border`}>
            <h3 className={`font-medium ${text} text-center mb-3`}>
                Credenciais IPoE
            </h3>
            <div className="grid grid-cols-1 gap-3">
                <div className={`font-mono font-semibold ${mono} text-center`}>{login}</div>
            </div>
            <div className="mt-3 text-sm text-center text-blue-600">
                <p>Este é o login IPoE gerado automaticamente. Não é necessário senha para este tipo de conexão.</p>
            </div>
            {children && <div className="mt-3">{children}</div>}
        </div>
    );
} 