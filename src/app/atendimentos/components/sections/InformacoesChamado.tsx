'use client';

import { ChamadoInfo } from '../../types';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface Props {
    data: ChamadoInfo;
    onChange: (data: ChamadoInfo) => void;
}

export default function InformacoesChamado({ data, onChange }: Props) {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value } = e.target;
        onChange({
            ...data,
            [id]: value,
        });
    };

    const handleSelectChange = (value: string, field: keyof ChamadoInfo) => {
        onChange({
            ...data,
            [field]: value,
        });
    };

    return (
        <div className="glass-card rounded-2xl p-6 mb-8">
            <h2 className="text-xl font-light text-gray-900 dark:text-white mb-6">Informações do Chamado</h2>

            <form className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div className="space-y-2">
                        <Label htmlFor="protocolo" className="text-gray-700 dark:text-gray-300 text-sm">
                            Protocolo
                        </Label>
                        <Input
                            id="protocolo"
                            type="text"
                            placeholder="Digite o protocolo"
                            value={data.protocolo}
                            onChange={handleChange}
                            className="bg-white/50 dark:bg-background/30 border-gray-300 dark:border-gray-700 focus:border-gray-400 dark:focus:border-gray-500 h-12 rounded-xl"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="tipo" className="text-gray-700 dark:text-gray-300 text-sm">
                            Tipo
                        </Label>
                        <Select
                            value={data.motivoChamado}
                            onValueChange={(value) => handleSelectChange(value, 'motivoChamado')}
                        >
                            <SelectTrigger className="bg-white/50 dark:bg-background/30 border-gray-300 dark:border-gray-700 focus:border-gray-400 dark:focus:border-gray-500 h-12 rounded-xl">
                                <SelectValue placeholder="Selecione o tipo" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="INSTALACAO">Instalação</SelectItem>
                                <SelectItem value="SUPORTE">Suporte</SelectItem>
                                <SelectItem value="MANUTENCAO">Manutenção</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="status" className="text-gray-700 dark:text-gray-300 text-sm">
                            Status
                        </Label>
                        <Select
                            value={data.status}
                            onValueChange={(value) => handleSelectChange(value, 'status')}
                        >
                            <SelectTrigger className="bg-white/50 dark:bg-background/30 border-gray-300 dark:border-gray-700 focus:border-gray-400 dark:focus:border-gray-500 h-12 rounded-xl">
                                <SelectValue placeholder="Selecione o status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="ABERTO">Aberto</SelectItem>
                                <SelectItem value="EM_ANDAMENTO">Em Andamento</SelectItem>
                                <SelectItem value="CONCLUIDO">Concluído</SelectItem>
                                <SelectItem value="CANCELADO">Cancelado</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
            </form>
        </div>
    );
} 