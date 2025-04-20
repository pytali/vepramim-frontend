import { AtendimentoCompleto } from './types';

export const mockClientes = [
    { id: 'brd_64137_2', nome: 'Cliente Teste 1' },
    { id: 'brd_64137', nome: 'Cliente Teste 2' },
];

export const mockAtendimento: AtendimentoCompleto = {
    atendimentoInfo: {
        nomeAtendente: 'João Silva',
        protocoloAtendimento: 'PROT123456',
        nomeContatante: 'Maria Oliveira',
        telefone: '(11) 99999-9999',
        titular: 'José Santos',
        dataAtendimento: '2024-03-20',
    },
    clienteInfo: {
        planoCliente: 'Fibra 500MB',
        loginPppoe: 'cliente123',
        senhaPppoe: 'senha123',
        redeLan: 'ONT ZTE',
    },
    cpeInfo: {
        olt: 'OLT-001',
        slot: 1,
        pon: 8,
        sn: 'FHTT11112222',
        sinalFibra: -25,
        status: 'UP',
    },
    chamadoInfo: {
        motivoChamado: 'Lentidão na conexão',
        status: 'PENDENTE',
        dataReservada: new Date(Date.now() + 1000 * 60 * 60 * 24),
        localizacao: 'Rua Exemplo, 123',
        alarmeEquipamento: 'LINK LOSS',
        descricaoAtendimento: 'Cliente relatou lentidão na conexão. Realizado teste de velocidade e configurações do equipamento.',
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