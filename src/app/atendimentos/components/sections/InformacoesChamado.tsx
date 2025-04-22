'use client';

import { ChamadoInfo } from '../../types';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { DatePicker } from '@/components/ui/date-picker';
import { useState } from 'react';

interface Props {
    data: ChamadoInfo;
    onChange: (data: ChamadoInfo) => void;
}

export default function InformacoesChamado({ data, onChange }: Props) {
    const [isTextareaExpanded, setIsTextareaExpanded] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { id, value } = e.target;
        onChange({
            ...data,
            [id]: value,
        });
    };

    const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { id } = e.target;
        onChange({
            ...data,
            [id]: e.target.value,
        });
    };

    return (
        <div className="glass-card rounded-2xl p-6 mb-8">
            <h2 className="text-xl font-light text-gray-900 dark:text-white mb-6">Informações do Chamado</h2>

            <form className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div className="space-y-2">
                        <Label htmlFor="motivoChamado" className="text-gray-700 dark:text-gray-300 text-sm">
                            Motivo do Chamado
                        </Label>
                        <Input
                            id="motivoChamado"
                            type="text"
                            placeholder="Digite o motivo do chamado"
                            value={data.motivoChamado}
                            onChange={handleChange}
                            className="bg-white/50 dark:bg-background/30 border-gray-300 dark:border-gray-700 focus:border-gray-400 dark:focus:border-gray-500 h-12 rounded-xl"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="dataReservada" className="text-gray-700 dark:text-gray-300 text-sm">
                            Data Reservada
                        </Label>
                        <DatePicker
                            id="dataReservada"
                            date={data.dataReservada ? new Date(data.dataReservada) : undefined}
                            onChange={(date) => {
                                handleChange({
                                    target: {
                                        id: "dataReservada",
                                        value: date ? date.toISOString().split('T')[0] : ""
                                    }
                                } as React.ChangeEvent<HTMLInputElement>);
                            }}
                            onBlur={() => handleBlur({ target: { id: "dataReservada" } } as React.FocusEvent<HTMLInputElement>)}
                            className="bg-white/50 dark:bg-background/30 border-gray-300 dark:border-gray-700 focus:border-gray-400 dark:focus:border-gray-500 h-12 rounded-xl"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="localizacao" className="text-gray-700 dark:text-gray-300 text-sm">
                            Localização do Cliente
                        </Label>
                        <Input
                            id="localizacao"
                            type="text"
                            className="bg-white/50 dark:bg-background/30 border-gray-300 dark:border-gray-700 focus:border-gray-400 dark:focus:border-gray-500 h-12 rounded-xl"
                            placeholder="Digite a localização do cliente"
                            value={data.localizacao}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="space-y-2 col-span-full flex flex-col items-center">
                        <Label htmlFor="descricaoAtendimento" className="text-gray-700 dark:text-gray-300 text-sm text-center">
                            Descrição do Atendimento
                        </Label>
                        <Textarea
                            id="descricaoAtendimento"
                            className={`bg-white/50 dark:bg-background/30 border-gray-300 dark:border-gray-700 focus:border-gray-400 dark:focus:border-gray-500 w-full rounded-xl resize-none transition-all duration-500 ease-in-out ${isTextareaExpanded ? 'min-h-[200px]' : 'min-h-[45px]'}`}
                            placeholder="Digite a descrição do atendimento"
                            value={data.descricaoAtendimento}
                            onFocus={() => setIsTextareaExpanded(true)}
                            onBlur={(e) => {
                                if (!e.target.value) {
                                    setIsTextareaExpanded(false);
                                }
                                handleBlur(e);
                            }}
                            onChange={handleChange}
                        />
                    </div>
                </div>
            </form>
        </div>
    );
} 