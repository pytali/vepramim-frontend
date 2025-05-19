import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ConnectionType } from "@/types/onu";
import { ChevronLeft, ChevronRight, RefreshCw } from "lucide-react";
import { ContractData, Step3Props, ContractResponse } from "../types";
import { useCallback, useEffect, useState } from "react";
import { useOLTStore } from "@/store/olts";
import { BASE_MAPPING, ENDPOINT_MAPPING, normalizeToASCII } from "@/utils/activationUtils";


export function Step3ConfigureOnu({
    selectedOnu,
    selectedLogin,
    onuName,
    connectionType,
    serverType,
    setOnuName,
    setConnectionType,
    setServerType,
    onPrevious,
    onNext
}: Step3Props) {
    const [isLoading, setIsLoading] = useState(false);
    const [contractData, setContractData] = useState<ContractData | null>(null);
    const { olts, fetchOLTs } = useOLTStore();

    const fetchContractData = useCallback(async () => {
        if (!selectedLogin?.id_contrato) return;

        setIsLoading(true);
        try {
            const response = await fetch(`/api/client?idContrato=${selectedLogin.id_contrato}`);
            const result = await response.json();

            if (result && !result.error) {
                let data;

                // Verificar se a resposta contém um array de múltiplas bases
                if (Array.isArray(result.data)) {
                    // Encontrar a base correspondente ao selectedLogin.base
                    const baseData = result.data.find((item: ContractResponse) => {
                        const baseFromEndpoint = ENDPOINT_MAPPING[item.endpoint];
                        return baseFromEndpoint === selectedLogin.base;
                    });

                    // Se encontrou a base correspondente, use o primeiro contrato dela
                    if (baseData && baseData.contratos && baseData.contratos.length > 0) {
                        data = baseData.contratos[0];
                    }
                } else {
                    // Formato antigo - dados diretamente no result.data
                    data = result.data;
                }

                if (data) {
                    // Obter o código da base usando o mapping
                    const baseCode = BASE_MAPPING[selectedLogin.base || ""] || selectedLogin.base || "";
                    const login = selectedLogin.login || "";

                    setContractData({
                        endereco: data.endereco,
                        numero: data.numero
                    });

                    // Formatação do login
                    const formattedLogin = login.split("_").length > 2
                        ? login.split("_")[1] + "_" + login.split("_")[2]
                        : selectedLogin.id_cliente;

                    // Formato: {baseCode} - {login} - {endereco} + {numero}
                    const rawName = `${baseCode} - ${formattedLogin} - ${data.endereco} ${data.numero}`;

                    // Normalizar o nome removendo acentuação e caracteres especiais
                    const generatedName = normalizeToASCII(rawName);

                    setOnuName(generatedName);
                }
            }
        } catch (error) {
            console.error("Erro ao buscar dados do contrato:", error);
        } finally {
            setIsLoading(false);
        }
    }, [selectedLogin, setOnuName]);

    useEffect(() => {
        if (selectedLogin?.id_contrato) {
            fetchContractData();
        }
    }, [fetchContractData, selectedLogin]);

    useEffect(() => {
        // Carregar a lista de OLTs quando o componente for montado
        fetchOLTs();
    }, [fetchOLTs]);

    useEffect(() => {
        if (selectedOnu && olts.length > 0) {
            // Encontrar a OLT correspondente pelo IP
            const matchingOlt = olts.find(olt => olt.device_ip === selectedOnu.oltIp);

            if (matchingOlt) {
                // Definir o serverType com base no location da OLT
                const newServerType = matchingOlt.location === "UNM" ? "UNM" : "NETNUMEN";
                setServerType(newServerType);
            }
        }
    }, [selectedOnu, olts, setServerType]);

    return (
        <Card className="w-full max-w-2xl mx-auto">
            <CardContent className="p-6">
                <h2 className="text-2xl font-semibold mb-4 text-center">
                    Passo 3: Configure os detalhes da ONU
                </h2>

                {selectedOnu && (
                    <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4 bg-muted/50 p-4 rounded-lg mb-6">
                            <div>
                                <p className="text-sm text-muted-foreground">Número de Série</p>
                                <p className="font-medium">{selectedOnu.sn}</p>
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">IP da OLT</p>
                                <p className="font-medium">{selectedOnu.oltIp}</p>
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Porta PON</p>
                                <p className="font-medium">{`${selectedOnu.ponId.split("-")[2]}-${selectedOnu.ponId.split("-")[3]}`}</p>
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Nome da OLT</p>
                                <p className="font-medium">{selectedOnu.oltName}</p>
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Tipo de ONU</p>
                                <p className="font-medium">{selectedOnu.dt}</p>
                            </div>
                            {selectedLogin && (
                                <div>
                                    <p className="text-sm text-muted-foreground">Cliente</p>
                                    <p className="font-medium">
                                        {selectedLogin.id_cliente} - {selectedLogin.base}
                                    </p>
                                </div>
                            )}
                        </div>

                        <div>
                            <Label htmlFor="onuName" className="font-medium">
                                Nome da ONU *
                            </Label>
                            <div className="flex gap-2 mt-1">
                                <Input
                                    id="onuName"
                                    placeholder="Nome da ONU"
                                    value={onuName}
                                    onChange={(e) => setOnuName(e.target.value)}
                                    className="w-full"
                                    required
                                />
                                <Button
                                    variant="outline"
                                    size="icon"
                                    onClick={fetchContractData}
                                    disabled={isLoading || !selectedLogin?.id_contrato}
                                >
                                    <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
                                </Button>
                            </div>
                            {contractData && selectedLogin && (
                                <p className="text-sm text-muted-foreground mt-1">
                                    Gerado a partir dos dados do contrato:
                                    {` ${BASE_MAPPING[selectedLogin.base || ""] || selectedLogin.base} - ${selectedLogin.login.split("_").length > 2 ? selectedLogin.login.split("_")[1] + "_" + selectedLogin.login.split("_")[2] : selectedLogin.id_cliente} - ${contractData.endereco} ${contractData.numero}`}
                                </p>
                            )}
                        </div>

                        <div>
                            <Label htmlFor="connectionType" className="font-medium">
                                Tipo de Conexão
                            </Label>
                            <Select
                                value={connectionType}
                                onValueChange={(value) => setConnectionType(value as ConnectionType)}
                            >
                                <SelectTrigger className="mt-1">
                                    <SelectValue placeholder="Selecione o tipo de conexão" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="PPPoE">PPPoE (VLAN 2000)</SelectItem>
                                    <SelectItem value="IPoE">IPoE (VLAN 2020)</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div>
                            <Label htmlFor="serverType" className="font-medium">
                                Tipo de Servidor
                            </Label>
                            <Select
                                value={serverType}
                                disabled={true}
                                onValueChange={(value) => setServerType(value as "NETNUMEN" | "UNM")}
                            >
                                <SelectTrigger className="mt-1">
                                    <SelectValue placeholder="Selecione o tipo de servidor" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="NETNUMEN">NETNUMEN</SelectItem>
                                    <SelectItem value="UNM">UNM</SelectItem>
                                </SelectContent>
                            </Select>
                            <p className="text-sm text-muted-foreground mt-1">
                                Selecionado automaticamente com base na OLT
                            </p>
                        </div>

                        <div className="flex justify-between mt-6">
                            <Button
                                variant="outline"
                                onClick={onPrevious}
                                className="flex items-center"
                            >
                                <ChevronLeft className="mr-2 h-4 w-4" />
                                Anterior
                            </Button>
                            <Button
                                onClick={onNext}
                                disabled={!onuName}
                                className="flex items-center"
                            >
                                Próximo
                                <ChevronRight className="ml-2 h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    );
} 