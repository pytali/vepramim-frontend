import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export function formatDateToBR(date: Date | string | undefined): string {
    if (!date) return '';

    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return format(dateObj, 'dd/MM/yyyy', { locale: ptBR });
} 