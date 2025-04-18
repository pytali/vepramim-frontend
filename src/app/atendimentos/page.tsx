'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Copy, Trash2 } from 'lucide-react';
import { Logo } from '@/components/logo';
import { Toast, ToastContainer } from '@/components/ui/toast';
import InformacoesAtendimento from './components/sections/InformacoesAtendimento';
import InformacoesCliente from './components/sections/InformacoesCliente';
import InformacoesConcentrador from './components/sections/InformacoesConcentrador';
import InformacoesChamado from './components/sections/InformacoesChamado';
import MetodosAplicados from './components/sections/MetodosAplicados';
import { useAtendimentoPersistence } from './hooks/useAtendimentoPersistence';
import { formatAtendimentoText } from './utils/formatAtendimento';

export default function AtendimentoPage() {
    const router = useRouter();
    const { atendimento, setAtendimento, resetAtendimento } = useAtendimentoPersistence();
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState("");
    const [toastType, setToastType] = useState<"success" | "error">("success");
    const [isCopying, setIsCopying] = useState(false);

    const handleAtendimentoInfoChange = (data: typeof atendimento.atendimentoInfo) => {
        setAtendimento((prev) => ({
            ...prev,
            atendimentoInfo: data,
        }));
    };

    const handleClienteInfoChange = (data: typeof atendimento.clienteInfo) => {
        setAtendimento((prev) => ({
            ...prev,
            clienteInfo: data,
        }));
    };

    const handleConcentradorInfoChange = (data: typeof atendimento.concentradorInfo) => {
        setAtendimento((prev) => ({
            ...prev,
            concentradorInfo: data,
        }));
    };

    const handleChamadoInfoChange = (data: typeof atendimento.chamadoInfo) => {
        setAtendimento((prev) => ({
            ...prev,
            chamadoInfo: data,
        }));
    };

    const handleMetodosGeraisChange = (data: typeof atendimento.metodosGerais) => {
        setAtendimento((prev) => ({
            ...prev,
            metodosGerais: data,
        }));
    };

    const handleRede2gChange = (data: typeof atendimento.rede2g) => {
        setAtendimento((prev) => ({
            ...prev,
            rede2g: data,
        }));
    };

    const handleRede5gChange = (data: typeof atendimento.rede5g) => {
        setAtendimento((prev) => ({
            ...prev,
            rede5g: data,
        }));
    };

    const handleCopyData = () => {
        setIsCopying(true);
        const texto = formatAtendimentoText(atendimento);

        navigator.clipboard.writeText(texto)
            .then(() => {
                setToastMessage("Dados copiados com sucesso!");
                setToastType("success");
                setShowToast(true);
            })
            .catch((err) => {
                console.error("Erro ao copiar dados:", err);
                setToastMessage("Erro ao copiar dados");
                setToastType("error");
                setShowToast(true);
            })
            .finally(() => {
                setTimeout(() => {
                    setIsCopying(false);
                }, 200);
            });
    };

    const handleReset = () => {
        resetAtendimento();
        setToastMessage("Dados limpos com sucesso!");
        setToastType("success");
        setShowToast(true);
    };

    return (
        <div className="min-h-screen gradient-bg">
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute top-1/3 right-1/2 w-[800px] h-[800px] rounded-full bg-blue-500/10 blur-[150px]"></div>
                <div className="absolute bottom-1/3 left-1/3 w-[600px] h-[600px] rounded-full bg-purple-500/10 blur-[150px]"></div>
            </div>

            <header className="relative z-10 flex justify-between items-center p-6 backdrop-blur-md bg-white/10 dark:bg-black/10">
                <div className="flex items-center gap-4">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => router.push("/dashboard")}
                        className="rounded-full bg-gray-200/50 hover:bg-gray-200/80 dark:bg-white/5 dark:hover:bg-white/10 text-gray-700 dark:text-white"
                    >
                        <ArrowLeft className="h-5 w-5" />
                        <span className="sr-only">Voltar</span>
                    </Button>
                    <Logo height={36} />
                    <span className="text-xl font-light text-gray-900 dark:text-white ml-2">| Atendimento</span>
                </div>
            </header>

            <main className="relative z-10 container mx-auto max-w-7xl px-4 py-8">
                <InformacoesAtendimento
                    data={atendimento.atendimentoInfo}
                    onChange={handleAtendimentoInfoChange}
                />

                <InformacoesCliente
                    data={atendimento.clienteInfo}
                    onChange={handleClienteInfoChange}
                />

                <InformacoesConcentrador
                    data={atendimento.concentradorInfo}
                    onChange={handleConcentradorInfoChange}
                />

                <InformacoesChamado
                    data={atendimento.chamadoInfo}
                    onChange={handleChamadoInfoChange}
                />

                <MetodosAplicados
                    metodosGerais={atendimento.metodosGerais}
                    rede2g={atendimento.rede2g}
                    rede5g={atendimento.rede5g}
                    onChangeMetodosGerais={handleMetodosGeraisChange}
                    onChangeRede2g={handleRede2gChange}
                    onChangeRede5g={handleRede5gChange}
                />
            </main>

            <div className="fixed bottom-8 right-8 flex gap-2">
                <button
                    onClick={handleReset}
                    className="bg-red-500 hover:bg-red-600 text-white dark:bg-red-500/20 dark:hover:bg-red-500/30 dark:text-white dark:border dark:border-red-500/20 rounded-full p-4 shadow-lg flex items-center gap-2 transition-transform duration-200"
                >
                    <Trash2 className="h-5 w-5" />
                    <span>Limpar</span>
                </button>

                <button
                    onClick={handleCopyData}
                    disabled={isCopying}
                    className={`bg-gray-900 hover:bg-gray-800 text-white dark:bg-white/10 dark:hover:bg-white/20 dark:text-white dark:border dark:border-white/20 rounded-full p-4 shadow-lg flex items-center gap-2 transition-transform duration-200 ${isCopying ? 'scale-95' : ''}`}
                >
                    <Copy className={`h-5 w-5 transition-transform duration-200 ${isCopying ? 'scale-90' : ''}`} />
                    <span>Copiar</span>
                </button>
            </div>

            <ToastContainer>
                {showToast && (
                    <Toast
                        message={toastMessage}
                        type={toastType}
                        onClose={() => setShowToast(false)}
                    />
                )}
            </ToastContainer>
        </div>
    );
}
