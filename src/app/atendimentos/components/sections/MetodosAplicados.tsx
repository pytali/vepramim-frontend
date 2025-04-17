'use client';

import { MetodosGerais, Rede2G, Rede5G } from '../../types';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '../../../../components/ui/radio-group';
import { useEffect, useState } from 'react';

type RadioValue = "SIM" | "NÃO" | "LIGADO" | "DESLIGADO" | "ALTO" | "MÉDIO" | "BAIXO";
type SelectValue = string;

interface CustomChangeEvent {
    target: {
        id: string;
        value: string | boolean;
        type?: string;
        checked?: boolean;
    };
}

interface Props {
    metodosGerais: MetodosGerais;
    rede2g: Rede2G;
    rede5g: Rede5G;
    onChangeMetodosGerais: (data: MetodosGerais) => void;
    onChangeRede2g: (data: Rede2G) => void;
    onChangeRede5g: (data: Rede5G) => void;
}

export default function MetodosAplicados({
    metodosGerais,
    rede2g,
    rede5g,
    onChangeMetodosGerais,
    onChangeRede2g,
    onChangeRede5g,
}: Props) {
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
    }, []);

    const handleChangeMetodosGerais = (e: CustomChangeEvent) => {
        const { id, value, type, checked } = e.target;
        onChangeMetodosGerais({
            ...metodosGerais,
            [id]: type === 'radio' ? value : checked,
        });
    };

    const handleChangeRede2g = (e: CustomChangeEvent) => {
        const { id, value } = e.target;
        const [field, subfield] = id.split('-');

        if (subfield) {
            const fieldValue = rede2g[field as keyof Rede2G];
            if (typeof fieldValue === 'object' && fieldValue !== null) {
                onChangeRede2g({
                    ...rede2g,
                    [field]: {
                        ...fieldValue,
                        [subfield]: value,
                    },
                });
            }
        } else {
            onChangeRede2g({
                ...rede2g,
                [field]: value,
            });
        }
    };

    const handleChangeRede5g = (e: CustomChangeEvent) => {
        const { id, value } = e.target;
        const [field, subfield] = id.split('-');

        if (subfield) {
            const fieldValue = rede5g[field as keyof Rede5G];
            if (typeof fieldValue === 'object' && fieldValue !== null) {
                onChangeRede5g({
                    ...rede5g,
                    [field]: {
                        ...fieldValue,
                        [subfield]: value,
                    },
                });
            }
        } else {
            onChangeRede5g({
                ...rede5g,
                [field]: value,
            });
        }
    };

    const sectionClasses = "glass-card rounded-2xl p-6 mb-8";
    const titleClasses = "text-xl font-light text-gray-900 dark:text-white mb-6";
    const subtitleClasses = "text-lg font-light text-gray-800 dark:text-gray-200 mb-4";
    const gridClasses = "grid grid-cols-1 gap-4";
    const itemClasses = "flex items-center justify-between p-4 rounded-xl bg-white/50 dark:bg-gray-800/30 border border-gray-200 dark:border-gray-700";
    const labelClasses = "text-gray-700 dark:text-gray-300";
    const controlsClasses = "flex items-center gap-4";

    if (!isClient) {
        return (
            <div className="space-y-8">
                <div className="animate-pulse space-y-4">
                    <div className="h-8 bg-gray-200 rounded"></div>
                    <div className="h-8 bg-gray-200 rounded"></div>
                    <div className="h-8 bg-gray-200 rounded"></div>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            {/* Métodos Gerais */}
            <section className={sectionClasses}>
                <h2 className={titleClasses}>Métodos Aplicados no Equipamento</h2>
                <h3 className={subtitleClasses}>Geral</h3>

                <div className={gridClasses}>
                    {/* Atualização Firmware */}
                    <div className={itemClasses}>
                        <Label className={labelClasses}>Atualização da Firmware</Label>
                        <RadioGroup
                            value={metodosGerais.atualizacaoFirmware ? "NÃO" : "SIM"}
                            onValueChange={(value: RadioValue) => {
                                handleChangeMetodosGerais({
                                    target: {
                                        id: "atualizacaoFirmware",
                                        value: value === "NÃO",
                                        type: "radio"
                                    }
                                } as CustomChangeEvent);
                            }}
                            className={controlsClasses}
                        >
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="SIM" id="atualizacaoFirmware-sim" />
                                <Label htmlFor="atualizacaoFirmware-sim">Sim</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="NÃO" id="atualizacaoFirmware-nao" />
                                <Label htmlFor="atualizacaoFirmware-nao">Não</Label>
                            </div>
                        </RadioGroup>
                    </div>

                    {/* Limpeza MAC */}
                    <div className={itemClasses}>
                        <Label className={labelClasses}>Limpeza de MAC</Label>
                        <RadioGroup
                            value={metodosGerais.limpezaMac ? "NÃO" : "SIM"}
                            onValueChange={(value: RadioValue) => {
                                handleChangeMetodosGerais({
                                    target: {
                                        id: "limpezaMac",
                                        value: value === "NÃO",
                                        type: "radio"
                                    }
                                } as CustomChangeEvent);
                            }}
                            className={controlsClasses}
                        >
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="SIM" id="limpezaMac-sim" />
                                <Label htmlFor="limpezaMac-sim">Sim</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="NÃO" id="limpezaMac-nao" />
                                <Label htmlFor="limpezaMac-nao">Não</Label>
                            </div>
                        </RadioGroup>
                    </div>

                    {/* SNTP */}
                    <div className={itemClasses}>
                        <Label className={labelClasses}>Alterado SNTP</Label>
                        <RadioGroup
                            value={metodosGerais.alteradoSntp ? "NÃO" : "SIM"}
                            onValueChange={(value: RadioValue) => {
                                handleChangeMetodosGerais({
                                    target: {
                                        id: "alteradoSntp",
                                        value: value === "NÃO",
                                        type: "radio"
                                    }
                                } as CustomChangeEvent);
                            }}
                            className={controlsClasses}
                        >
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="SIM" id="alteradoSntp-sim" />
                                <Label htmlFor="alteradoSntp-sim">Sim</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="NÃO" id="alteradoSntp-nao" />
                                <Label htmlFor="alteradoSntp-nao">Não</Label>
                            </div>
                        </RadioGroup>
                    </div>

                    {/* DNS */}
                    <div className={itemClasses}>
                        <Label className={labelClasses}>Setado DNS</Label>
                        <RadioGroup
                            value={metodosGerais.setadoDns ? "NÃO" : "SIM"}
                            onValueChange={(value: RadioValue) => {
                                handleChangeMetodosGerais({
                                    target: {
                                        id: "setadoDns",
                                        value: value === "NÃO",
                                        type: "radio"
                                    }
                                } as CustomChangeEvent);
                            }}
                            className={controlsClasses}
                        >
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="SIM" id="setadoDns-sim" />
                                <Label htmlFor="setadoDns-sim">Sim</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="NÃO" id="setadoDns-nao" />
                                <Label htmlFor="setadoDns-nao">Não</Label>
                            </div>
                        </RadioGroup>
                    </div>

                    {/* UPnP */}
                    <div className={itemClasses}>
                        <Label className={labelClasses}>UPnP</Label>
                        <RadioGroup
                            value={metodosGerais.upnp}
                            onValueChange={(value: RadioValue) => handleChangeMetodosGerais({
                                target: {
                                    id: "upnp",
                                    value
                                }
                            } as CustomChangeEvent)}
                            className={controlsClasses}
                        >
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="LIGADO" id="upnp-ligado" />
                                <Label htmlFor="upnp-ligado">Ligado</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="DESLIGADO" id="upnp-desligado" />
                                <Label htmlFor="upnp-desligado">Desligado</Label>
                            </div>
                        </RadioGroup>
                    </div>

                    {/* Firewall */}
                    <div className={itemClasses}>
                        <Label className={labelClasses}>Firewall</Label>
                        <RadioGroup
                            value={metodosGerais.firewall}
                            onValueChange={(value: RadioValue) => handleChangeMetodosGerais({
                                target: {
                                    id: "firewall",
                                    value
                                }
                            } as CustomChangeEvent)}
                            className={controlsClasses}
                        >
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="ALTO" id="firewall-alto" />
                                <Label htmlFor="firewall-alto">Alto</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="MÉDIO" id="firewall-medio" />
                                <Label htmlFor="firewall-medio">Médio</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="BAIXO" id="firewall-baixo" />
                                <Label htmlFor="firewall-baixo">Baixo</Label>
                            </div>
                        </RadioGroup>
                    </div>

                    {/* ALG */}
                    <div className={itemClasses}>
                        <Label className={labelClasses}>ALG</Label>
                        <RadioGroup
                            value={metodosGerais.alg}
                            onValueChange={(value: RadioValue) => handleChangeMetodosGerais({
                                target: {
                                    id: "alg",
                                    value
                                }
                            } as CustomChangeEvent)}
                            className={controlsClasses}
                        >
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="LIGADO" id="alg-ligado" />
                                <Label htmlFor="alg-ligado">Ligado</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="DESLIGADO" id="alg-desligado" />
                                <Label htmlFor="alg-desligado">Desligado</Label>
                            </div>
                        </RadioGroup>
                    </div>
                </div>
            </section>

            {/* Rede 2.4G */}
            <section className={sectionClasses}>
                <h2 className={titleClasses}>Rede 2.4G</h2>
                <div className={gridClasses}>
                    {/* Canal */}
                    <div className={itemClasses}>
                        <Label className={labelClasses}>Alterado Canal</Label>
                        <div className={controlsClasses}>
                            <RadioGroup
                                value={rede2g.canal.alterado ? "NÃO" : "SIM"}
                                onValueChange={(value: RadioValue) => {
                                    handleChangeRede2g({
                                        target: {
                                            id: "canal-alterado",
                                            value: value === "NÃO",
                                        }
                                    } as CustomChangeEvent);
                                }}
                                className="flex items-center gap-2"
                            >
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="NÃO" id="canal-nao" />
                                    <Label htmlFor="canal-nao">Não</Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="SIM" id="canal-sim" />
                                    <Label htmlFor="canal-sim">Sim</Label>
                                </div>
                            </RadioGroup>

                            {!rede2g.canal.alterado && (
                                <>
                                    <div className="text-sm font-medium">De</div>
                                    <Select
                                        value={rede2g.canal.de}
                                        onValueChange={(value: SelectValue) => handleChangeRede2g({
                                            target: {
                                                id: "canal-de",
                                                value
                                            }
                                        } as CustomChangeEvent)}
                                    >
                                        <SelectTrigger className="w-[120px]">
                                            <SelectValue placeholder="De" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="auto">auto</SelectItem>
                                            {Array.from({ length: 13 }, (_, i) => (
                                                <SelectItem key={i + 1} value={(i + 1).toString()}>
                                                    {i + 1}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </>
                            )}

                            {!rede2g.canal.alterado && (
                                <>
                                    <div className="text-sm font-medium">Para</div>
                                    <Select
                                        value={rede2g.canal.para}
                                        onValueChange={(value: SelectValue) => handleChangeRede2g({
                                            target: {
                                                id: "canal-para",
                                                value
                                            }
                                        } as CustomChangeEvent)}
                                    >
                                        <SelectTrigger className="w-[120px]">
                                            <SelectValue placeholder="Para" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="auto">auto</SelectItem>
                                            {Array.from({ length: 13 }, (_, i) => (
                                                <SelectItem key={i + 1} value={(i + 1).toString()}>
                                                    {i + 1}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </>
                            )}
                        </div>
                    </div>

                    {/* Modo */}
                    <div className={itemClasses}>
                        <Label className={labelClasses}>Alterado Modo</Label>
                        <div className={controlsClasses}>
                            <RadioGroup
                                value={rede2g.modo.alterado ? "NÃO" : "SIM"}
                                onValueChange={(value: RadioValue) => {
                                    handleChangeRede2g({
                                        target: {
                                            id: "modo-alterado",
                                            value: value === "NÃO",
                                            type: "radio"
                                        }
                                    } as CustomChangeEvent);
                                }}
                                className="flex items-center gap-2"
                            >
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="NÃO" id="modo-nao" />
                                    <Label htmlFor="modo-nao">Não</Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="SIM" id="modo-sim" />
                                    <Label htmlFor="modo-sim">Sim</Label>
                                </div>
                            </RadioGroup>

                            {!rede2g.modo.alterado && (
                                <>
                                    <div className="text-sm font-medium">De</div>
                                    <Select
                                        value={rede2g.modo.de}
                                        onValueChange={(value: SelectValue) => handleChangeRede2g({
                                            target: { id: "modo-de", value }
                                        })}
                                    >
                                        <SelectTrigger className="w-[120px]">
                                            <SelectValue placeholder="De" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="B/G/N">B/G/N</SelectItem>
                                            <SelectItem value="B/G/N/AC">B/G/N/AC</SelectItem>
                                            <SelectItem value="B/G/N/AC/AX">B/G/N/AC/AX</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </>
                            )}

                            {!rede2g.modo.alterado && (
                                <>
                                    <div className="text-sm font-medium">Para</div>
                                    <Select
                                        value={rede2g.modo.para}
                                        onValueChange={(value: SelectValue) => handleChangeRede2g({
                                            target: { id: "modo-para", value }
                                        })}
                                    >
                                        <SelectTrigger className="w-[120px]">
                                            <SelectValue placeholder="Para" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="B/G/N">B/G/N</SelectItem>
                                            <SelectItem value="B/G/N/AC">B/G/N/AC</SelectItem>
                                            <SelectItem value="B/G/N/AC/AX">B/G/N/AC/AX</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </>
                            )}
                        </div>
                    </div>

                    {/* Largura de Banda */}
                    <div className={itemClasses}>
                        <Label className={labelClasses}>Alterado Largura de Banda</Label>
                        <div className={controlsClasses}>
                            <RadioGroup
                                value={rede2g.larguraBanda.alterado ? "NÃO" : "SIM"}
                                onValueChange={(value: RadioValue) => {
                                    handleChangeRede2g({
                                        target: {
                                            id: "larguraBanda-alterado",
                                            value: value === "NÃO",
                                            type: "radio"
                                        }
                                    } as CustomChangeEvent);
                                }}
                                className="flex items-center gap-2"
                            >
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="NÃO" id="larguraBanda-nao" />
                                    <Label htmlFor="larguraBanda-nao">Não</Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="SIM" id="larguraBanda-sim" />
                                    <Label htmlFor="larguraBanda-sim">Sim</Label>
                                </div>
                            </RadioGroup>

                            {!rede2g.larguraBanda.alterado && (
                                <>
                                    <div className="text-sm font-medium">De</div>
                                    <Select
                                        value={rede2g.larguraBanda.de}
                                        onValueChange={(value: SelectValue) => handleChangeRede2g({
                                            target: { id: "larguraBanda-de", value }
                                        })}
                                    >
                                        <SelectTrigger className="w-[120px]">
                                            <SelectValue placeholder="De" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="auto">auto</SelectItem>
                                            <SelectItem value="20MHZ">20MHZ</SelectItem>
                                            <SelectItem value="40MHZ">40MHZ</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </>
                            )}

                            {!rede2g.larguraBanda.alterado && (
                                <>
                                    <div className="text-sm font-medium">Para</div>
                                    <Select
                                        value={rede2g.larguraBanda.para}
                                        onValueChange={(value: SelectValue) => handleChangeRede2g({
                                            target: { id: "larguraBanda-para", value }
                                        })}
                                    >
                                        <SelectTrigger className="w-[120px]">
                                            <SelectValue placeholder="Para" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="auto">auto</SelectItem>
                                            <SelectItem value="20MHZ">20MHZ</SelectItem>
                                            <SelectItem value="40MHZ">40MHZ</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </>
                            )}
                        </div>
                    </div>

                    {/* SGI */}
                    <div className={itemClasses}>
                        <Label className={labelClasses}>SGI</Label>
                        <RadioGroup
                            value={rede2g.sgi}
                            onValueChange={(value: RadioValue) => handleChangeRede2g({
                                target: { id: "sgi", value, type: "radio" }
                            } as CustomChangeEvent)}
                            className={controlsClasses}
                        >
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="LIGADO" id="sgi-ligado" />
                                <Label htmlFor="sgi-ligado">Ligado</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="DESLIGADO" id="sgi-desligado" />
                                <Label htmlFor="sgi-desligado">Desligado</Label>
                            </div>
                        </RadioGroup>
                    </div>

                    {/* Encriptação */}
                    <div className={itemClasses}>
                        <Label className={labelClasses}>Alterado Encriptação</Label>
                        <RadioGroup
                            value={rede2g.encriptacao ? "NÃO" : "SIM"}
                            onValueChange={(value: RadioValue) => handleChangeRede2g({
                                target: { id: "encriptacao", value: value === "NÃO", type: "radio" }
                            } as CustomChangeEvent)}
                            className={controlsClasses}
                        >
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="SIM" id="encriptacao-sim" />
                                <Label htmlFor="encriptacao-sim">Sim</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="NÃO" id="encriptacao-nao" />
                                <Label htmlFor="encriptacao-nao">Não</Label>
                            </div>
                        </RadioGroup>
                    </div>
                </div>
            </section>

            {/* Rede 5G */}
            <section className={sectionClasses}>
                <h2 className={titleClasses}>Rede 5G</h2>
                <div className={gridClasses}>
                    {/* Canal */}
                    <div className={itemClasses}>
                        <Label className={labelClasses}>Alterado Canal</Label>
                        <div className={controlsClasses}>
                            <RadioGroup
                                value={rede5g.canal.alterado ? "NÃO" : "SIM"}
                                onValueChange={(value: RadioValue) => {
                                    handleChangeRede5g({
                                        target: {
                                            id: "canal-alterado",
                                            value: value === "NÃO",
                                            type: "radio"
                                        }
                                    } as CustomChangeEvent);
                                }}
                                className="flex items-center gap-2"
                            >
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="NÃO" id="canal5g-nao" />
                                    <Label htmlFor="canal5g-nao">Não</Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="SIM" id="canal5g-sim" />
                                    <Label htmlFor="canal5g-sim">Sim</Label>
                                </div>
                            </RadioGroup>

                            {!rede5g.canal.alterado && (
                                <>
                                    <div className="text-sm font-medium">De</div>
                                    <Select
                                        value={rede5g.canal.de}
                                        onValueChange={(value: SelectValue) => handleChangeRede5g({
                                            target: {
                                                id: "canal-de",
                                                value
                                            }
                                        } as CustomChangeEvent)}
                                    >
                                        <SelectTrigger className="w-[120px]">
                                            <SelectValue placeholder="De" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="auto">auto</SelectItem>
                                            {[36, 40, 44, 48, 52, 56, 60, 64, 100, 104, 108, 112, 116, 120, 124, 128].map(
                                                (canal) => (
                                                    <SelectItem key={canal} value={canal.toString()}>
                                                        {canal}
                                                    </SelectItem>
                                                )
                                            )}
                                        </SelectContent>
                                    </Select>
                                </>
                            )}

                            {!rede5g.canal.alterado && (
                                <>
                                    <div className="text-sm font-medium">Para</div>
                                    <Select
                                        value={rede5g.canal.para}
                                        onValueChange={(value: SelectValue) => handleChangeRede5g({
                                            target: {
                                                id: "canal-para",
                                                value
                                            }
                                        } as CustomChangeEvent)}
                                    >
                                        <SelectTrigger className="w-[120px]">
                                            <SelectValue placeholder="Para" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="auto">auto</SelectItem>
                                            {[36, 40, 44, 48, 52, 56, 60, 64, 100, 104, 108, 112, 116, 120, 124, 128].map(
                                                (canal) => (
                                                    <SelectItem key={canal} value={canal.toString()}>
                                                        {canal}
                                                    </SelectItem>
                                                )
                                            )}
                                        </SelectContent>
                                    </Select>
                                </>
                            )}
                        </div>
                    </div>

                    {/* Modo */}
                    <div className={itemClasses}>
                        <Label className={labelClasses}>Alterado Modo</Label>
                        <div className={controlsClasses}>
                            <RadioGroup
                                value={rede5g.modo.alterado ? "NÃO" : "SIM"}
                                onValueChange={(value: RadioValue) => handleChangeRede5g({
                                    target: { id: "modo-alterado", value: value === "NÃO", type: "radio" }
                                } as CustomChangeEvent)}
                                className="flex items-center gap-2"
                            >
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="NÃO" id="modo5g-nao" />
                                    <Label htmlFor="modo5g-nao">Não</Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="SIM" id="modo5g-sim" />
                                    <Label htmlFor="modo5g-sim">Sim</Label>
                                </div>
                            </RadioGroup>

                            {!rede5g.modo.alterado && (
                                <>
                                    <div className="text-sm font-medium">De</div>
                                    <Select
                                        value={rede5g.modo.de}
                                        onValueChange={(value: SelectValue) => handleChangeRede5g({
                                            target: { id: "modo-de", value }
                                        } as CustomChangeEvent)}
                                    >
                                        <SelectTrigger className="w-[120px]">
                                            <SelectValue placeholder="De" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="B/G/N">B/G/N</SelectItem>
                                            <SelectItem value="B/G/N/AC">B/G/N/AC</SelectItem>
                                            <SelectItem value="B/G/N/AC/AX">B/G/N/AC/AX</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </>
                            )}

                            {!rede5g.modo.alterado && (
                                <>
                                    <div className="text-sm font-medium">Para</div>
                                    <Select
                                        value={rede5g.modo.para}
                                        onValueChange={(value: SelectValue) => handleChangeRede5g({
                                            target: { id: "modo-para", value }
                                        } as CustomChangeEvent)}
                                    >
                                        <SelectTrigger className="w-[120px]">
                                            <SelectValue placeholder="Para" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="B/G/N">B/G/N</SelectItem>
                                            <SelectItem value="B/G/N/AC">B/G/N/AC</SelectItem>
                                            <SelectItem value="B/G/N/AC/AX">B/G/N/AC/AX</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </>
                            )}
                        </div>
                    </div>

                    {/* Largura de Banda */}
                    <div className={itemClasses}>
                        <Label className={labelClasses}>Alterado Largura de Banda</Label>
                        <div className={controlsClasses}>
                            <RadioGroup
                                value={rede5g.larguraBanda.alterado ? "NÃO" : "SIM"}
                                onValueChange={(value: RadioValue) => handleChangeRede5g({
                                    target: { id: "larguraBanda-alterado", value: value === "NÃO", type: "radio" }
                                } as CustomChangeEvent)}
                                className="flex items-center gap-2"
                            >
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="NÃO" id="larguraBanda5g-nao" />
                                    <Label htmlFor="larguraBanda5g-nao">Não</Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="SIM" id="larguraBanda5g-sim" />
                                    <Label htmlFor="larguraBanda5g-sim">Sim</Label>
                                </div>
                            </RadioGroup>

                            {!rede5g.larguraBanda.alterado && (
                                <>
                                    <div className="text-sm font-medium">De</div>
                                    <Select
                                        value={rede5g.larguraBanda.de}
                                        onValueChange={(value: SelectValue) => handleChangeRede5g({
                                            target: { id: "larguraBanda-de", value }
                                        } as CustomChangeEvent)}
                                    >
                                        <SelectTrigger className="w-[120px]">
                                            <SelectValue placeholder="De" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="auto">auto</SelectItem>
                                            <SelectItem value="20MHZ">20MHZ</SelectItem>
                                            <SelectItem value="40MHZ">40MHZ</SelectItem>
                                            <SelectItem value="80MHZ">80MHZ</SelectItem>
                                            <SelectItem value="160MHZ">160MHZ</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </>
                            )}

                            {!rede5g.larguraBanda.alterado && (
                                <>
                                    <div className="text-sm font-medium">Para</div>
                                    <Select
                                        value={rede5g.larguraBanda.para}
                                        onValueChange={(value: SelectValue) => handleChangeRede5g({
                                            target: { id: "larguraBanda-para", value }
                                        } as CustomChangeEvent)}
                                    >
                                        <SelectTrigger className="w-[120px]">
                                            <SelectValue placeholder="Para" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="auto">auto</SelectItem>
                                            <SelectItem value="20MHZ">20MHZ</SelectItem>
                                            <SelectItem value="40MHZ">40MHZ</SelectItem>
                                            <SelectItem value="80MHZ">80MHZ</SelectItem>
                                            <SelectItem value="160MHZ">160MHZ</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </>
                            )}
                        </div>
                    </div>

                    {/* SGI */}
                    <div className={itemClasses}>
                        <Label className={labelClasses}>SGI</Label>
                        <RadioGroup
                            value={rede5g.sgi}
                            onValueChange={(value: RadioValue) => handleChangeRede5g({
                                target: { id: "sgi", value, type: "radio" }
                            } as CustomChangeEvent)}
                            className={controlsClasses}
                        >
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="LIGADO" id="sgi5g-ligado" />
                                <Label htmlFor="sgi5g-ligado">Ligado</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="DESLIGADO" id="sgi5g-desligado" />
                                <Label htmlFor="sgi5g-desligado">Desligado</Label>
                            </div>
                        </RadioGroup>
                    </div>

                    {/* Encriptação */}
                    <div className={itemClasses}>
                        <Label className={labelClasses}>Alterado Encriptação</Label>
                        <RadioGroup
                            value={rede5g.encriptacao ? "NÃO" : "SIM"}
                            onValueChange={(value: RadioValue) => handleChangeRede5g({
                                target: { id: "encriptacao", value: value === "NÃO", type: "radio" }
                            } as CustomChangeEvent)}
                            className={controlsClasses}
                        >
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="SIM" id="encriptacao5g-sim" />
                                <Label htmlFor="encriptacao5g-sim">Sim</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="NÃO" id="encriptacao5g-nao" />
                                <Label htmlFor="encriptacao5g-nao">Não</Label>
                            </div>
                        </RadioGroup>
                    </div>
                </div>
            </section>
        </div>
    );
} 