import { AtendimentoCompleto } from '../types';

export function formatAtendimentoText(atendimento: AtendimentoCompleto): string {
    const formatRedeInfo = (rede: typeof atendimento.rede2g | typeof atendimento.rede5g) => {
        const linhas = [];

        if (!rede.canal.alterado) {
            linhas.push(`ALTERADO CANAL: DE ${rede.canal.de} PARA ${rede.canal.para}`);
        } else {
            linhas.push('ALTERADO CANAL: NÃO');
        }

        if (!rede.modo.alterado) {
            linhas.push(`ALTERADO MODO: DE ${rede.modo.de} PARA ${rede.modo.para}`);
        } else {
            linhas.push('ALTERADO MODO: NÃO');
        }

        if (!rede.larguraBanda.alterado) {
            linhas.push(`ALTERADO LARGURA DA BANDA: DE ${rede.larguraBanda.de} PARA ${rede.larguraBanda.para}`);
        } else {
            linhas.push('ALTERADO LARGURA DA BANDA: NÃO');
        }

        linhas.push(`ALTERADO SGI: ${rede.sgi}`);
        if (rede.encriptacao) {
            linhas.push(`ALTERADO ENCRIPTAÇÃO: NÃO`);
        } else {
            linhas.push(`ALTERADO ENCRIPTAÇÃO: SIM`);
        }

        return linhas.join('\n');
    };

    return `[INFORMAÇÕES DO ATENDIMENTO]
ATENDENTE: ${atendimento.atendimentoInfo.nomeAtendente}
DATA DO ATENDIMENTO: ${atendimento.atendimentoInfo.dataAtendimento}
PROTOCOLO: ${atendimento.atendimentoInfo.protocoloAtendimento}
CONTATANTE: ${atendimento.atendimentoInfo.nomeContatante}
CONTATO: ${atendimento.atendimentoInfo.telefone}
TITULAR: ${atendimento.atendimentoInfo.titular}

[INFORMAÇÕES DO CPE]
OLT ${atendimento.cpeInfo.olt} SLOT ${atendimento.cpeInfo.slot} PON ${atendimento.cpeInfo.pon}
SINAL DA FIBRA: ${atendimento.cpeInfo.sinalFibra}
PON DO EQUIPAMENTO: ${atendimento.cpeInfo.sn}
STATUS: ${atendimento.cpeInfo.status}

[INFORMAÇÕES DO CLIENTE]
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
ATUALIZAÇÃO DE FIRMWARE: ${atendimento.metodosGerais.atualizacaoFirmware ? 'NÃO' : 'SIM'}
LIMPEZA DE MAC: ${atendimento.metodosGerais.limpezaMac ? 'NÃO' : 'SIM'}
ALTERADO SNTP: ${atendimento.metodosGerais.alteradoSntp ? 'NÃO' : 'SIM'}
SETADO DNS: ${atendimento.metodosGerais.setadoDns ? 'NÃO' : 'SIM'}
UPnP: ${atendimento.metodosGerais.upnp}
FIREWALL: ${atendimento.metodosGerais.firewall}
ALG: ${atendimento.metodosGerais.alg}

REDE 2.4G
${formatRedeInfo(atendimento.rede2g)}

REDE 5G
${formatRedeInfo(atendimento.rede5g)}`;
} 