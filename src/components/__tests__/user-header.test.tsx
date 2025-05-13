import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { UserHeader } from '../user-header';
import { getCurrentUser } from '@/lib/client-auth';

// Mock the next/navigation
jest.mock('next/navigation', () => ({
    useRouter() {
        return {
            push: jest.fn(),
            refresh: jest.fn()
        };
    }
}));

// Mock the client-auth module
jest.mock('@/lib/client-auth', () => ({
    getCurrentUser: jest.fn()
}));

describe('UserHeader', () => {
    beforeEach(() => {
        // Reset the mock before each test
        jest.clearAllMocks();
    });

    it('deve renderizar o botão de logout sem o nome do usuário quando o usuário não está carregado', () => {
        // Mock implementation for getCurrentUser that returns null
        (getCurrentUser as jest.Mock).mockResolvedValue(null);

        render(<UserHeader />);

        // Verificar se o botão de logout está presente
        expect(screen.getByRole('button')).toBeInTheDocument();
        expect(screen.getByText('Sair')).toBeInTheDocument();

        // Verificar que o nome do usuário não está presente
        expect(screen.queryByTestId('user-name')).not.toBeInTheDocument();
    });

    it('deve renderizar o nome do usuário quando o usuário está carregado', async () => {
        // Mock implementation for getCurrentUser that returns a user
        (getCurrentUser as jest.Mock).mockResolvedValue({
            name: 'Teste Usuário',
            username: 'testeusuario'
        });

        render(<UserHeader />);

        // Aguardar o carregamento do usuário
        await waitFor(() => {
            expect(screen.getByText('Teste Usuário')).toBeInTheDocument();
        });

        // Verificar se o botão de logout está presente
        expect(screen.getByRole('button')).toBeInTheDocument();
        expect(screen.getByText('Sair')).toBeInTheDocument();
    });
}); 