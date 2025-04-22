'use client';

import { CPEInfo } from '../../types';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useOLTStore } from '@/store/olts';
import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';

// Importar Combobox dinamicamente para evitar problemas de hidratação
const DynamicCombobox = dynamic(
    () => import('@/components/ui/combobox').then(mod => mod.Combobox),
    {
        ssr: false,
        loading: () => (
            <div className="h-12 bg-white/50 dark:bg-background/30 border border-gray-300 dark:border-gray-700 rounded-xl flex items-center px-3 text-sm">
                Carregando...
            </div>
        )
    }
);

interface Props {
    data: CPEInfo;
    onChange: (data: CPEInfo) => void;
}

export default function InformacoesCPE({ data, onChange }: Props) {
    const { olts, fetchOLTs } = useOLTStore();
    const [oltValue, setOltValue] = useState(data.olt || '');
    const [statusValue, setStatusValue] = useState<CPEInfo['status']>(data.status || 'UP');

    useEffect(() => {
        if (olts.length === 0) {
            fetchOLTs();
        }
    }, [olts.length, fetchOLTs]);

    // Sincronizar estados locais quando os dados externos são alterados (ex: quando limpar é acionado)
    useEffect(() => {
        setOltValue(data.olt || '');
        setStatusValue(data.status || 'UP');
    }, [data.olt, data.status]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value } = e.target;
        const numericFields = ['slot', 'pon', 'sinalFibra'];

        onChange({
            ...data,
            [id]: numericFields.includes(id) ? Number(value) : value,
        });
    };

    const handleOltChange = (value: string) => {
        setOltValue(value);
        onChange({ ...data, olt: value });
    };

    const handleStatusChange = (value: string) => {
        // Garantindo que o valor é um tipo válido para status
        const typedStatus = value as CPEInfo['status'];
        setStatusValue(typedStatus);
        onChange({ ...data, status: typedStatus });
    };

    const statusOptions = ['UP', 'LINK LOSS', 'DYNG GASP'];

    const oltOptions = olts.map(olt => ({
        label: olt.device_name,
        value: olt.device_name
    }));

    return (
        <div className="glass-card rounded-2xl p-6 mb-8">
            <h2 className="text-xl font-light text-gray-900 dark:text-white mb-6">Informações da CPE</h2>

            <form className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div className="space-y-2">
                        <Label htmlFor="olt" className="text-gray-700 dark:text-gray-300 text-sm">
                            OLT
                        </Label>
                        <DynamicCombobox
                            options={oltOptions}
                            value={oltValue}
                            onValueChange={handleOltChange}
                            placeholder="Selecione a OLT"
                            searchPlaceholder="Digite para pesquisar..."
                            allowCustomValue={true}
                            className="bg-white/50 dark:bg-background/30 border-gray-300 dark:border-gray-700 focus:border-gray-400 dark:focus:border-gray-500 h-12 rounded-xl"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="slot" className="text-gray-700 dark:text-gray-300 text-sm">
                            Slot
                        </Label>
                        <Input
                            id="slot"
                            type="number"
                            placeholder="Digite o número do slot"
                            value={data.slot}
                            onChange={handleChange}
                            className="bg-white/50 dark:bg-background/30 border-gray-300 dark:border-gray-700 focus:border-gray-400 dark:focus:border-gray-500 h-12 rounded-xl"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="pon" className="text-gray-700 dark:text-gray-300 text-sm">
                            PON
                        </Label>
                        <Input
                            id="pon"
                            type="number"
                            placeholder="Digite o número PON"
                            value={data.pon}
                            onChange={handleChange}
                            className="bg-white/50 dark:bg-background/30 border-gray-300 dark:border-gray-700 focus:border-gray-400 dark:focus:border-gray-500 h-12 rounded-xl"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="sn" className="text-gray-700 dark:text-gray-300 text-sm">
                            SN do Equipamento
                        </Label>
                        <Input
                            id="sn"
                            type="text"
                            placeholder="Digite o SN do equipamento"
                            value={data.sn}
                            onChange={handleChange}
                            className="bg-white/50 dark:bg-background/30 border-gray-300 dark:border-gray-700 focus:border-gray-400 dark:focus:border-gray-500 h-12 rounded-xl"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="sinalFibra" className="text-gray-700 dark:text-gray-300 text-sm">
                            Sinal da Fibra
                        </Label>
                        <Input
                            id="sinalFibra"
                            type="number"
                            placeholder="Digite o sinal da fibra"
                            value={data.sinalFibra}
                            onChange={handleChange}
                            className="bg-white/50 dark:bg-background/30 border-gray-300 dark:border-gray-700 focus:border-gray-400 dark:focus:border-gray-500 h-12 rounded-xl"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="status" className="text-gray-700 dark:text-gray-300 text-sm">
                            Status
                        </Label>
                        <Select
                            defaultValue={statusValue}
                            onValueChange={handleStatusChange}
                        >
                            <SelectTrigger className="bg-white/50 dark:bg-background/30 border-gray-300 dark:border-gray-700 focus:border-gray-400 dark:focus:border-gray-500 h-12 rounded-xl">
                                <SelectValue placeholder="Selecione o status" />
                            </SelectTrigger>
                            <SelectContent>
                                {statusOptions.map((status) => (
                                    <SelectItem key={status} value={status}>
                                        {status}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>
            </form>
        </div>
    );
} 