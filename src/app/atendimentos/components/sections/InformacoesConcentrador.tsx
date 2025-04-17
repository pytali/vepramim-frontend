'use client';

import { ConcentradorInfo } from '../../types';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

interface Props {
    data: ConcentradorInfo;
    onChange: (data: ConcentradorInfo) => void;
}

export default function InformacoesConcentrador({ data, onChange }: Props) {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value } = e.target;
        const numericFields = ['slot', 'pon', 'sinalFibra'];

        onChange({
            ...data,
            [id]: numericFields.includes(id) ? Number(value) : value,
        });
    };

    return (
        <div className="glass-card rounded-2xl p-6 mb-8">
            <h2 className="text-xl font-light text-gray-900 dark:text-white mb-6">Informações do Concentrador</h2>

            <form className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div className="space-y-2">
                        <Label htmlFor="olt" className="text-gray-700 dark:text-gray-300 text-sm">
                            OLT
                        </Label>
                        <Input
                            id="olt"
                            type="text"
                            placeholder="Digite a OLT"
                            value={data.olt}
                            onChange={handleChange}
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
                        <Label htmlFor="macEquipamento" className="text-gray-700 dark:text-gray-300 text-sm">
                            MAC do Equipamento
                        </Label>
                        <Input
                            id="macEquipamento"
                            type="text"
                            placeholder="Digite o MAC do equipamento"
                            value={data.macEquipamento}
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
                </div>
            </form>
        </div>
    );
} 