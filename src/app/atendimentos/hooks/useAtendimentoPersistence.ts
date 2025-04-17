import { useState, useEffect } from 'react';
import { AtendimentoCompleto } from '../types';
import { mockAtendimento } from '../mocks';

const STORAGE_KEY = '@vepramim:ultimo-atendimento';

export function useAtendimentoPersistence() {
    const [atendimento, setAtendimento] = useState<AtendimentoCompleto>(() => {
        if (typeof window === 'undefined') return mockAtendimento;

        const storedAtendimento = localStorage.getItem(STORAGE_KEY);
        if (!storedAtendimento) return mockAtendimento;

        try {
            return JSON.parse(storedAtendimento);
        } catch {
            return mockAtendimento;
        }
    });

    useEffect(() => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(atendimento));
    }, [atendimento]);

    const resetAtendimento = () => {
        setAtendimento(mockAtendimento);
        localStorage.removeItem(STORAGE_KEY);
    };

    return {
        atendimento,
        setAtendimento,
        resetAtendimento,
    };
} 