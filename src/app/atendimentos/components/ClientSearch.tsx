import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, FileSearch } from 'lucide-react';
import { useOLTStore } from "@/store/olts";
import LoginSelector from './LoginSelector';
import { parseONUSerial } from '@/app/api/actions';
import { AtendimentoCompleto } from '../types';

interface OnuData {
    data: Array<{
        olt_id: string
        pon_id: string
        onu_id: string
        onu_name: string
        onu_description: string
        onu_type: string
        onu_ip: string
        onu_mac: string
        onu_swver: string
        onu_state?: {
            admin_state: string
            oper_state: string
            auth: string
            last_off_time: string
            last_off_reason?: string
            last_on_time?: string
        }
        onu_signal?: {
            rx_power: string
            tx_power: string
            temperature: string
            voltage: string
            p_rx_power: string
            p_tx_power: string
        }
    }>
}

interface Login {
    login: string;
    conexao: string;
    id_contrato: string;
    senha: string;
    online: string;
    ultima_conexao_inicial: string;
}

interface ClientSearchProps {
    onClientDataFound: (data: {
        loginPPPoE?: string;
        senha?: string;
        plano?: string;
        olt?: string;
        slot?: string;
        pon?: string;
        sn?: string;
        sinalFibra?: string;
        status?: "UP" | "LINK LOSS" | "DYNG GASP";
        error?: string;
    }) => void;
    atendimento: AtendimentoCompleto;
    setAtendimento: (atendimento: AtendimentoCompleto) => void;
    showFullView: boolean;
    setShowFullView: (show: boolean) => void;
}

interface OpaResponse {
    error: boolean;
    data: {
        nomeDoAtendente: string;
        nomeDoTitular: string;
        nomeDoContatante: string;
        telefoneDoContatante: string;
        protocoloDoAtendimento: string;
        dataDoAtendimento: string;
        motivoDoChamado: string;
    }
}

const formatPhoneNumber = (phone: string): string => {
    // Remove todos os caracteres não numéricos e o sufixo @c.us
    const numbers = phone.replace(/\D/g, '').replace('@c.us', '');

    // Se não tiver números suficientes, retorna vazio
    if (numbers.length < 12) return ''; // Considerando DDI(2) + DDD(2) + Número(8 ou 9)

    // Remove o DDI (55) se existir
    const numberWithoutDDI = numbers.startsWith('55') ? numbers.slice(2) : numbers;

    // Verifica se é um número válido (com DDD e 8 ou 9 dígitos)
    if (numberWithoutDDI.length < 10 || numberWithoutDDI.length > 11) return '';

    // Formata o número baseado no tamanho (com ou sem 9)
    if (numberWithoutDDI.length === 11) {
        // Celular com 9
        return `+55 (${numberWithoutDDI.slice(0, 2)}) ${numberWithoutDDI.slice(2, 3)} ${numberWithoutDDI.slice(3, 7)}-${numberWithoutDDI.slice(7)}`;
    } else {
        // Telefone fixo
        return `+55 (${numberWithoutDDI.slice(0, 2)}) ${numberWithoutDDI.slice(2, 6)}-${numberWithoutDDI.slice(6)}`;
    }
};

export default function ClientSearch({
    onClientDataFound,
    atendimento,
    setAtendimento,
    showFullView,
    setShowFullView
}: ClientSearchProps) {
    const [idCliente, setIdCliente] = useState('');
    const [protocolo, setProtocolo] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isLoadingProtocolo, setIsLoadingProtocolo] = useState(false);
    const [showLoginSelector, setShowLoginSelector] = useState(false);
    const [availableLogins, setAvailableLogins] = useState<Login[]>([]);
    const { olts, fetchOLTs } = useOLTStore();

    // Verifica se já existem dados preenchidos no atendimento para mostrar a visualização completa
    useEffect(() => {
        const hasData =
            atendimento.clienteInfo.loginPppoe ||
            atendimento.atendimentoInfo.titular ||
            atendimento.atendimentoInfo.protocoloAtendimento;

        if (hasData) {
            setShowFullView(true);
        }
    }, [atendimento, setShowFullView]);

    const processClientData = async (clientData: Login) => {
        try {
            // Busca dados do plano
            const planResponse = await fetch(`/api/client?idContrato=${clientData.id_contrato}`);
            const planData = await planResponse.json();

            if (planData.error) {
                onClientDataFound({ error: 'Erro ao buscar dados do plano' });
                return;
            }
            //Atualiza os dados do cliente
            onClientDataFound({
                loginPPPoE: clientData.login,
                senha: clientData.senha,
                plano: planData.data,
            });

            // Extrai o SN da ONU
            const onuSN = await parseONUSerial(clientData.conexao);
            let onuData: OnuData | null = null;

            if (!onuSN) {
                onClientDataFound({ error: 'ONU não encontrada' });
                return;
            }

            // Busca dados da ONU
            const onuResponse = await fetch(`/api/onu/${onuSN}`);
            if (!onuResponse.ok) {
                onClientDataFound({ error: 'Erro ao buscar dados da ONU' });
                return;
            }
            onuData = await onuResponse.json();

            if (!onuData?.data?.length) {
                onClientDataFound({ error: 'Dados da ONU não encontrados' });
                return;
            }

            // Atualiza os dados do CPE
            onClientDataFound({
                olt: olts.find(olt => olt.device_id === onuData?.data[0]?.olt_id)?.device_name || '',
                slot: onuData?.data[0]?.pon_id.split('-')[2],
                pon: onuData?.data[0]?.pon_id.split('-')[3],
                sn: onuSN || '',
                sinalFibra: onuData?.data[0]?.onu_signal?.rx_power,
                status: onuData?.data[0]?.onu_state?.oper_state as "UP" | "LINK LOSS" | "DYNG GASP" | undefined
            });
        } catch (error) {
            console.error('Erro ao processar dados do cliente:', error);
            onClientDataFound({ error: 'Erro ao processar dados do cliente' });
        }
    };

    const handleSearch = async () => {
        if (!idCliente) {
            onClientDataFound({ error: 'Por favor, insira o ID do cliente' });
            return;
        }

        if (olts.length === 0) {
            await fetchOLTs();
        }

        setIsLoading(true);
        try {
            // Busca dados do radius
            const response = await fetch(`/api/client?idCliente=${idCliente}`);
            const radiusData = await response.json();

            if (radiusData.error) {
                onClientDataFound({ error: 'Cliente não encontrado' });
                return;
            }

            const logins = radiusData.data[0]?.logins;
            if (!logins || logins.length === 0) {
                onClientDataFound({ error: 'Nenhum login encontrado para este cliente' });
                return;
            }

            // Se houver apenas um login, processa diretamente
            if (logins.length === 1) {
                await processClientData(logins[0]);
                setShowFullView(true);
            } else {
                // Se houver múltiplos logins, mostra o seletor
                setAvailableLogins(logins);
                setShowLoginSelector(true);
            }
        } catch (error) {
            console.error('Erro na busca:', error);
            onClientDataFound({ error: 'Erro ao buscar dados do cliente' });
        } finally {
            setIsLoading(false);
        }
    };

    const handleLoginSelect = async (selectedLogin: Login) => {
        setShowLoginSelector(false);
        setIsLoading(true);
        await processClientData(selectedLogin);
        setIsLoading(false);
    };

    const handleSearchProtocolo = async () => {
        if (!protocolo) {
            onClientDataFound({ error: 'Por favor, insira o protocolo' });
            return;
        }

        setIsLoadingProtocolo(true);
        try {
            const response = await fetch(`/api/opa?protocolo=${protocolo}`);
            const data = await response.json() as OpaResponse;

            if (data.error) {
                onClientDataFound({ error: 'Protocolo não encontrado' });
                return;
            }

            // Formata o número de telefone antes de salvar
            const formattedPhone = formatPhoneNumber(data.data.telefoneDoContatante);

            // Atualiza os dados do atendimento
            setAtendimento({
                ...atendimento,
                atendimentoInfo: {
                    ...atendimento.atendimentoInfo,
                    nomeAtendente: data.data.nomeDoAtendente,
                    protocoloAtendimento: data.data.protocoloDoAtendimento,
                    nomeContatante: data.data.nomeDoContatante,
                    telefone: formattedPhone,
                    titular: data.data.nomeDoTitular,
                    dataAtendimento: new Date(data.data.dataDoAtendimento)
                },
                chamadoInfo: {
                    ...atendimento.chamadoInfo,
                    motivoChamado: data.data.motivoDoChamado
                }
            });

            onClientDataFound({});
            setShowFullView(true);

        } catch (error) {
            console.error('Erro na busca do protocolo:', error);
            onClientDataFound({ error: 'Erro ao buscar protocolo' });
        } finally {
            setIsLoadingProtocolo(false);
        }
    };

    return (
        <>
            <div
                className={`transition-all duration-700 ease-in-out will-change-transform ${showFullView
                    ? 'flex gap-2 mb-6 transform-none opacity-100'
                    : 'flex flex-col items-center justify-center min-h-[60vh] transform opacity-100'
                    }`}
            >
                {!showFullView ? (
                    <div className="flex flex-col items-center gap-10 w-full max-w-2xl animate-fade-in">
                        <div className="flex flex-col items-center gap-4 w-full">
                            <h2 className="text-2xl font-medium text-center text-gray-800 dark:text-gray-200 mb-2 animate-slide-down">
                                Buscar por ID do Cliente
                            </h2>
                            <div className="flex gap-2 w-full transform transition-transform duration-300 hover:scale-[1.01] focus-within:scale-[1.01]">
                                <Input
                                    type="text"
                                    placeholder="Digite o ID do cliente"
                                    value={idCliente}
                                    onChange={(e) => setIdCliente(e.target.value)}
                                    className="flex-1 h-14 text-lg shadow-sm rounded-xl focus:ring-2 focus:ring-blue-500 transition-shadow duration-300"
                                />
                                <Button
                                    onClick={handleSearch}
                                    disabled={isLoading}
                                    className="bg-gray-900 hover:bg-gray-800 text-white dark:bg-white/10 dark:hover:bg-white/20 h-14 px-6 text-lg rounded-xl shadow-md hover:shadow-lg transform transition-all duration-300 hover:-translate-y-1 active:translate-y-0 active:shadow-md"
                                    size="lg"
                                >
                                    <Search className="h-5 w-5 mr-2" />
                                    {isLoading ? 'Buscando...' : 'Buscar'}
                                </Button>
                            </div>
                        </div>

                        <div className="flex items-center gap-4 text-center py-2 w-full">
                            <div className="h-px bg-gray-300 dark:bg-gray-700 flex-1"></div>
                            <span className="text-gray-500 dark:text-gray-400 text-lg font-medium px-3">OU</span>
                            <div className="h-px bg-gray-300 dark:bg-gray-700 flex-1"></div>
                        </div>

                        <div className="flex flex-col items-center gap-4 w-full">
                            <h2 className="text-2xl font-medium text-center text-gray-800 dark:text-gray-200 mb-2 animate-slide-up">
                                Buscar por Protocolo
                            </h2>
                            <div className="flex gap-2 w-full transform transition-transform duration-300 hover:scale-[1.01] focus-within:scale-[1.01]">
                                <Input
                                    type="text"
                                    placeholder="Digite o protocolo"
                                    value={protocolo}
                                    onChange={(e) => setProtocolo(e.target.value)}
                                    className="flex-1 h-14 text-lg shadow-sm rounded-xl focus:ring-2 focus:ring-blue-500 transition-shadow duration-300"
                                />
                                <Button
                                    onClick={handleSearchProtocolo}
                                    disabled={isLoadingProtocolo}
                                    className="bg-gray-900 hover:bg-gray-800 text-white dark:bg-white/10 dark:hover:bg-white/20 h-14 px-6 text-lg rounded-xl shadow-md hover:shadow-lg transform transition-all duration-300 hover:-translate-y-1 active:translate-y-0 active:shadow-md"
                                    size="lg"
                                >
                                    <FileSearch className="h-5 w-5 mr-2" />
                                    {isLoadingProtocolo ? 'Buscando...' : 'Buscar'}
                                </Button>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="flex gap-2 flex-1 max-w-2xl animate-fade-in">
                        <Input
                            type="text"
                            placeholder="Digite o ID do cliente"
                            value={idCliente}
                            onChange={(e) => setIdCliente(e.target.value)}
                            className="max-w-xs"
                        />
                        <Button
                            onClick={handleSearch}
                            disabled={isLoading}
                            className="bg-gray-900 hover:bg-gray-800 text-white dark:bg-white/10 dark:hover:bg-white/20"
                        >
                            <Search className="h-4 w-4 mr-2" />
                            {isLoading ? 'Buscando...' : 'Buscar'}
                        </Button>

                        <Input
                            type="text"
                            placeholder="Digite o protocolo"
                            value={protocolo}
                            onChange={(e) => setProtocolo(e.target.value)}
                            className="max-w-xs"
                        />
                        <Button
                            onClick={handleSearchProtocolo}
                            disabled={isLoadingProtocolo}
                            className="bg-gray-900 hover:bg-gray-800 text-white dark:bg-white/10 dark:hover:bg-white/20"
                        >
                            <FileSearch className="h-4 w-4 mr-2" />
                            {isLoadingProtocolo ? 'Buscando...' : 'Buscar Protocolo'}
                        </Button>
                    </div>
                )}
            </div>

            <style jsx global>{`
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                
                @keyframes slideDown {
                    from { transform: translateY(-20px); opacity: 0; }
                    to { transform: translateY(0); opacity: 1; }
                }
                
                @keyframes slideUp {
                    from { transform: translateY(20px); opacity: 0; }
                    to { transform: translateY(0); opacity: 1; }
                }
                
                .animate-fade-in {
                    animation: fadeIn 0.6s ease-out forwards;
                }
                
                .animate-slide-down {
                    animation: slideDown 0.7s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
                }
                
                .animate-slide-up {
                    animation: slideUp 0.7s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
                }
            `}</style>

            <LoginSelector
                isOpen={showLoginSelector}
                onClose={() => setShowLoginSelector(false)}
                logins={availableLogins}
                onSelect={(login) => {
                    handleLoginSelect(login);
                    setShowFullView(true);
                }}
            />
        </>
    );
} 