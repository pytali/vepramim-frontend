'use client';

import { useState } from 'react';
import { AtendimentoInfo } from '../../types';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { cn } from '@/lib/utils';

interface Props {
    data: AtendimentoInfo;
    onChange: (data: AtendimentoInfo) => void;
}

type ValidationErrors = {
    [K in keyof AtendimentoInfo]?: string;
};

type TouchedFields = {
    [K in keyof AtendimentoInfo]?: boolean;
};

export default function InformacoesAtendimento({ data, onChange }: Props) {
    const [touched, setTouched] = useState<TouchedFields>({});
    const [errors, setErrors] = useState<ValidationErrors>({});

    const validateField = (name: keyof AtendimentoInfo, value: string) => {
        if (!value.trim()) {
            return 'Campo obrigatório';
        }
        if (name === 'telefone' && !/^\(\d{2}\) \d{4,5}-\d{4}$/.test(value)) {
            return 'Formato inválido. Use (99) 99999-9999';
        }
        if (name === 'dataAtendimento' && !value) {
            return 'Data inválida';
        }
        return '';
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value } = e.target;
        const error = validateField(id as keyof AtendimentoInfo, value);

        setErrors(prev => ({
            ...prev,
            [id]: error
        }));

        onChange({
            ...data,
            [id]: value,
        });
    };

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
        const { id } = e.target;
        setTouched(prev => ({
            ...prev,
            [id]: true
        }));
    };

    const inputClasses = "bg-white/50 dark:bg-background/30 border-gray-300 dark:border-gray-700 focus:border-gray-400 dark:focus:border-gray-500 h-12 rounded-xl";
    const labelClasses = "text-gray-700 dark:text-gray-300 text-sm";
    const alertClasses = "bg-red-100 dark:bg-red-900/20 border-red-200 dark:border-red-800";

    return (
        <div className="glass-card rounded-2xl p-6 mb-8">
            <h2 className="text-xl font-light text-gray-900 dark:text-white mb-6">Informações do Atendimento</h2>

            <form className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div className="space-y-2">
                        <Label htmlFor="nomeAtendente" className={labelClasses}>
                            Nome do Atendente
                        </Label>
                        <Input
                            id="nomeAtendente"
                            type="text"
                            placeholder="Digite o nome do atendente"
                            value={data.nomeAtendente}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            className={cn(inputClasses)}
                        />
                        {touched.nomeAtendente && errors.nomeAtendente && (
                            <Alert variant="destructive" className={cn(alertClasses)}>
                                <AlertDescription>{errors.nomeAtendente}</AlertDescription>
                            </Alert>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="protocoloAtendimento" className={labelClasses}>
                            Protocolo
                        </Label>
                        <Input
                            id="protocoloAtendimento"
                            type="text"
                            placeholder="Digite o protocolo"
                            value={data.protocoloAtendimento}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            className={cn(inputClasses)}
                        />
                        {touched.protocoloAtendimento && errors.protocoloAtendimento && (
                            <Alert variant="destructive" className={cn(alertClasses)}>
                                <AlertDescription>{errors.protocoloAtendimento}</AlertDescription>
                            </Alert>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="nomeContatante" className={labelClasses}>
                            Nome do Contato
                        </Label>
                        <Input
                            id="nomeContatante"
                            type="text"
                            placeholder="Digite o nome do contato"
                            value={data.nomeContatante}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            className={cn(inputClasses)}
                        />
                        {touched.nomeContatante && errors.nomeContatante && (
                            <Alert variant="destructive" className={cn(alertClasses)}>
                                <AlertDescription>{errors.nomeContatante}</AlertDescription>
                            </Alert>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="telefone" className={labelClasses}>
                            Telefone
                        </Label>
                        <Input
                            id="telefone"
                            type="text"
                            placeholder="(99) 99999-9999"
                            value={data.telefone}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            className={cn(inputClasses)}
                        />
                        {touched.telefone && errors.telefone && (
                            <Alert variant="destructive" className={cn(alertClasses)}>
                                <AlertDescription>{errors.telefone}</AlertDescription>
                            </Alert>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="titular" className={labelClasses}>
                            Nome do Titular
                        </Label>
                        <Input
                            id="titular"
                            type="text"
                            placeholder="Digite o nome do titular"
                            value={data.titular}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            className={cn(inputClasses)}
                        />
                        {touched.titular && errors.titular && (
                            <Alert variant="destructive" className={cn(alertClasses)}>
                                <AlertDescription>{errors.titular}</AlertDescription>
                            </Alert>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="dataAtendimento" className={labelClasses}>
                            Data do Atendimento
                        </Label>
                        <Input
                            id="dataAtendimento"
                            type="date"
                            value={data.dataAtendimento}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            className={cn(inputClasses)}
                        />
                        {touched.dataAtendimento && errors.dataAtendimento && (
                            <Alert variant="destructive" className={cn(alertClasses)}>
                                <AlertDescription>{errors.dataAtendimento}</AlertDescription>
                            </Alert>
                        )}
                    </div>
                </div>
            </form>
        </div>
    );
} 