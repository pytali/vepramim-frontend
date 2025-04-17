'use client';

import { ClienteInfo } from '../../types';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface Props {
    data: ClienteInfo;
    onChange: (data: ClienteInfo) => void;
}

export default function InformacoesCliente({ data, onChange }: Props) {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { id, value } = e.target;
        onChange({
            ...data,
            [id]: value,
        });
    };

    const handleSelectChange = (value: string) => {
        onChange({
            ...data,
            redeLan: value,
        });
    };

    const redeLanOptions = [
        "ONT ZTE",
        "ONT STAVIX",
        "ONU STAVIX",
        "ONU STAVIX + ROTEADOR TP-LINK",
        "ONU STAVIX + ROTEADOR GREATEK",
        "ONU STAVIX + ROTEADOR DLINK",
        "ONU STAVIX + ROTEADOR INTELBRAS",
        "ONU FIBERHOME",
        "ONU FIBERHOME + ROTEADOR TP-LINK",
        "ONU FIBERHOME + ROTEADOR GREATEK",
        "ONU FIBERHOME + ROTEADOR DLINK",
        "ONU FIBERHOME + ROTEADOR INTELBRAS"
    ];

    return (
        <div className="glass-card rounded-2xl p-6 mb-8">
            <h2 className="text-xl font-light text-gray-900 dark:text-white mb-6">Informações do Cliente</h2>

            <form className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <Label htmlFor="planoCliente" className="text-gray-700 dark:text-gray-300 text-sm">
                            Plano do Cliente
                        </Label>
                        <Input
                            id="planoCliente"
                            type="text"
                            placeholder="Digite o plano do cliente"
                            value={data.planoCliente}
                            onChange={handleChange}
                            className="bg-white/50 dark:bg-background/30 border-gray-300 dark:border-gray-700 focus:border-gray-400 dark:focus:border-gray-500 h-12 rounded-xl"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="loginPppoe" className="text-gray-700 dark:text-gray-300 text-sm">
                            Login PPPoE
                        </Label>
                        <Input
                            id="loginPppoe"
                            type="text"
                            placeholder="Digite o login PPPoE"
                            value={data.loginPppoe}
                            onChange={handleChange}
                            className="bg-white/50 dark:bg-background/30 border-gray-300 dark:border-gray-700 focus:border-gray-400 dark:focus:border-gray-500 h-12 rounded-xl"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="senhaPppoe" className="text-gray-700 dark:text-gray-300 text-sm">
                            Senha PPPoE
                        </Label>
                        <Input
                            id="senhaPppoe"
                            type="text"
                            placeholder="Digite a senha PPPoE"
                            value={data.senhaPppoe}
                            onChange={handleChange}
                            className="bg-white/50 dark:bg-background/30 border-gray-300 dark:border-gray-700 focus:border-gray-400 dark:focus:border-gray-500 h-12 rounded-xl"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="redeLan" className="text-gray-700 dark:text-gray-300 text-sm">
                            Rede LAN
                        </Label>
                        <Select value={data.redeLan} onValueChange={handleSelectChange}>
                            <SelectTrigger className="bg-white/50 dark:bg-background/30 border-gray-300 dark:border-gray-700 focus:border-gray-400 dark:focus:border-gray-500 h-12 rounded-xl">
                                <SelectValue placeholder="Selecione o tipo de rede" />
                            </SelectTrigger>
                            <SelectContent>
                                {redeLanOptions.map((option) => (
                                    <SelectItem key={option} value={option}>
                                        {option}
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