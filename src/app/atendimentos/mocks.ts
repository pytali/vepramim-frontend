import { AtendimentoCompleto } from './types';


export const mockAtendimento: AtendimentoCompleto = {
    atendimentoInfo: {
        nomeAtendente: '',
        protocoloAtendimento: '',
        nomeContatante: '',
        telefone: '',
        titular: '',
        dataAtendimento: new Date(Date.now())
    },
    clienteInfo: {
        planoCliente: '',
        loginPppoe: '',
        senhaPppoe: '',
        redeLan: '',
    },
    cpeInfo: {
        olt: '',
        slot: 0,
        pon: 0,
        sn: '',
        sinalFibra: -0,
        status: 'UP',
    },
    chamadoInfo: {
        motivoChamado: '',
        status: 'PENDENTE',
        dataReservada: new Date(Date.now() + 1000 * 60 * 60 * 24),
        localizacao: '',
        descricaoAtendimento: '',
        alarmeEquipamento: '',
    },
    metodosGerais: {
        atualizacaoFirmware: true,
        limpezaMac: true,
        alteradoSntp: true,
        setadoDns: true,
        upnp: 'LIGADO',
        firewall: 'ALTO',
        alg: 'LIGADO',
    },
    rede2g: {
        canal: {
            alterado: true,
            de: '1',
            para: '6',
        },
        modo: {
            alterado: true,
            de: 'B/G/N',
            para: 'B/G/N/AC',
        },
        larguraBanda: {
            alterado: true,
            de: '20MHZ',
            para: '40MHZ',
        },
        sgi: 'LIGADO',
        encriptacao: true,
    },
    rede5g: {
        canal: {
            alterado: true,
            de: '36',
            para: '44',
        },
        modo: {
            alterado: true,
            de: 'B/G/N/AC',
            para: 'B/G/N/AC/AX',
        },
        larguraBanda: {
            alterado: true,
            de: '40MHZ',
            para: '80MHZ',
        },
        sgi: 'LIGADO',
        encriptacao: true,
    },
}; 