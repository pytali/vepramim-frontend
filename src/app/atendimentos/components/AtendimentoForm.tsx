'use client';

import { useState } from 'react';
import { AtendimentoCompleto } from '../types';
import { mockAtendimento, mockClientes } from '../mocks';

export default function AtendimentoForm() {
    const [atendimento, setAtendimento] = useState<AtendimentoCompleto>(mockAtendimento);
    const [showClienteDialog, setShowClienteDialog] = useState(false);
    const [showAtendimentoDialog, setShowAtendimentoDialog] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setShowAtendimentoDialog(true);
    };

    const handleBuscarCliente = (e: React.FormEvent) => {
        e.preventDefault();
        setShowClienteDialog(true);
    };

    const handleLimpar = () => {
        setAtendimento(mockAtendimento);
    };

    const handleCopiarAtendimento = () => {
        const texto = `[INFORMAÇÕES DO ATENDIMENTO]
ATENDENTE: ${atendimento.atendimentoInfo.nomeAtendente}
DATA DO ATENDIMENTO: ${atendimento.atendimentoInfo.dataAtendimento}
PROTOCOLO: ${atendimento.atendimentoInfo.protocoloAtendimento}
CONTATANTE: ${atendimento.atendimentoInfo.nomeContatante}
CONTATO: ${atendimento.atendimentoInfo.telefone}
TITULAR: ${atendimento.atendimentoInfo.titular}

[INFORMAÇÕES DO CONCENTRADOR]
OLT ${atendimento.concentradorInfo.olt} SLOT ${atendimento.concentradorInfo.slot} PON ${atendimento.concentradorInfo.pon}
SINAL DA FIBRA: ${atendimento.concentradorInfo.sinalFibra}
PON DO EQUIPAMENTO: ${atendimento.concentradorInfo.macEquipamento}
REDE LAN: ${atendimento.clienteInfo.redeLan}
PLANO: ${atendimento.clienteInfo.planoCliente}
LOGIN: ${atendimento.clienteInfo.loginPppoe}
SENHA: ${atendimento.clienteInfo.senhaPppoe}

[INFORMAÇÕES DO CHAMADO]
MOTIVO DO CHAMADO: ${atendimento.chamadoInfo.motivoChamado}
DATA RESERVADA: ${atendimento.chamadoInfo.dataReservada}
LOCALIZAÇÃO DO CLIENTE: ${atendimento.chamadoInfo.localizacao}
ALARME DO EQUIPAMENTO: ${atendimento.chamadoInfo.alarmeEquipamento}
DESCRIÇÃO DO ATENDIMENTO: ${atendimento.chamadoInfo.descricaoAtendimento}

[MÉTODOS APLICADOS NO EQUIPAMENTO]
GERAL
ATUALIZAÇÃO DE FIRMWARE: ${atendimento.metodosGerais.atualizacaoFirmware ? 'SIM' : 'NÃO'}
LIMPEZA DE MAC: ${atendimento.metodosGerais.limpezaMac ? 'SIM' : 'NÃO'}
ALTERADO SNTP: ${atendimento.metodosGerais.alteradoSntp ? 'SIM' : 'NÃO'}
SETADO DNS: ${atendimento.metodosGerais.setadoDns ? 'SIM' : 'NÃO'}
UPnP: ${atendimento.metodosGerais.upnp}
FIREWALL: ${atendimento.metodosGerais.firewall}
ALG: ${atendimento.metodosGerais.alg}

REDE 2.4G
ALTERADO CANAL: DE ${atendimento.rede2g.canal.de} PARA ${atendimento.rede2g.canal.para}
ALTERADO MODO: DE ${atendimento.rede2g.modo.de} PARA ${atendimento.rede2g.modo.para}
ALTERADO LARGURA DA BANDA: DE ${atendimento.rede2g.larguraBanda.de} PARA ${atendimento.rede2g.larguraBanda.para}
ALTERADO SGI: ${atendimento.rede2g.sgi}
ALTERADO ENCRIPTAÇÃO: ${atendimento.rede2g.encriptacao ? 'SIM' : 'NÃO'}

REDE 5G
ALTERADO CANAL: DE ${atendimento.rede5g.canal.de} PARA ${atendimento.rede5g.canal.para}
ALTERADO MODO: DE ${atendimento.rede5g.modo.de} PARA ${atendimento.rede5g.modo.para}
ALTERADO LARGURA DA BANDA: DE ${atendimento.rede5g.larguraBanda.de} PARA ${atendimento.rede5g.larguraBanda.para}
ALTERADO SGI: ${atendimento.rede5g.sgi}
ALTERADO ENCRIPTAÇÃO: ${atendimento.rede5g.encriptacao ? 'SIM' : 'NÃO'}`;

        navigator.clipboard.writeText(texto);
        setShowAtendimentoDialog(false);
    };

    return (
        <div className="container-fluid mt-4 mb-4">
            <header>
                <div className="container mt-4" id="titulo_pagina">
                    <p className="h3 text-center text">ATENDIMENTO</p>
                    <button id="logout-btn" className="btn btn-danger">Sair</button>
                </div>
            </header>

            <main className="body">
                <div className="container busca_cliente">
                    <form onSubmit={handleBuscarCliente}>
                        <div className="form-group mb-3 search-client">
                            <input type="number" className="form-control" id="id_contrato" placeholder="Insira o contrato do cliente para buscar informações..." />
                            <div className="d-grid">
                                <button className="btn btn-secondary" type="submit">Buscar</button>
                            </div>
                        </div>
                    </form>
                </div>

                {/* Diálogo de Clientes */}
                <dialog open={showClienteDialog} className="modal">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">Selecione o cliente que você está atendendo:</h5>
                        </div>
                        <div className="modal-body">
                            <ul className="lista-de-clientes">
                                {mockClientes.map((cliente) => (
                                    <li key={cliente.id}>
                                        <p>Cliente: {cliente.id}</p>
                                        <button
                                            className="btn btn-primary"
                                            onClick={() => setShowClienteDialog(false)}
                                        >
                                            Selecionar
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </dialog>

                {/* Formulário Principal */}
                <form onSubmit={handleSubmit}>
                    {/* ... Seções do formulário ... */}
                    <footer>
                        <div className="text-end mt-3">
                            <button className="btn btn-success" type="submit">
                                Gerar atendimento
                            </button>
                            <button
                                className="btn btn-danger ms-2"
                                type="button"
                                onClick={handleLimpar}
                            >
                                Limpar
                            </button>
                        </div>
                    </footer>
                </form>

                {/* Modal de Atendimento */}
                <dialog open={showAtendimentoDialog} className="modal">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">Atendimento Gerado</h5>
                        </div>
                        <div className="modal-body">
                            <pre>
                                {/* Conteúdo do atendimento formatado */}
                            </pre>
                            <button
                                className="btn btn-primary"
                                onClick={handleCopiarAtendimento}
                            >
                                Copiar
                            </button>
                        </div>
                    </div>
                </dialog>
            </main>
        </div>
    );
} 