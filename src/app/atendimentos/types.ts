export type AtendimentoInfo = {
    nomeAtendente: string;
    protocoloAtendimento: string;
    nomeContatante: string;
    telefone: string;
    titular: string;
    dataAtendimento: string;
}

export type ClienteInfo = {
    planoCliente: string;
    loginPppoe: string;
    senhaPppoe: string;
    redeLan: string;
}

export type CPEInfo = {
    olt: string;
    slot: number;
    pon: number;
    sn: string;
    sinalFibra: number;
    status: 'UP' | 'LINK LOSS' | 'DYNG GASP';
}

export type ChamadoInfo = {
    status: 'PENDENTE' | 'CONCLUIDO';
    motivoChamado: string;
    dataReservada: Date;
    localizacao: string;
    alarmeEquipamento: string;
    descricaoAtendimento: string;
}

export type MetodosGerais = {
    atualizacaoFirmware: boolean;
    limpezaMac: boolean;
    alteradoSntp: boolean;
    setadoDns: boolean;
    upnp: 'LIGADO' | 'DESLIGADO';
    firewall: 'ALTO' | 'MÉDIO' | 'BAIXO';
    alg: 'LIGADO' | 'DESLIGADO';
}

export type Rede2G = {
    canal: {
        alterado: boolean;
        de: string;
        para: string;
    };
    modo: {
        alterado: boolean;
        de: string;
        para: string;
    };
    larguraBanda: {
        alterado: boolean;
        de: string;
        para: string;
    };
    sgi: 'LIGADO' | 'DESLIGADO';
    encriptacao: boolean;
}

export type Rede5G = {
    canal: {
        alterado: boolean;
        de: string;
        para: string;
    };
    modo: {
        alterado: boolean;
        de: string;
        para: string;
    };
    larguraBanda: {
        alterado: boolean;
        de: string;
        para: string;
    };
    sgi: 'LIGADO' | 'DESLIGADO';
    encriptacao: boolean;
}

export type AtendimentoCompleto = {
    atendimentoInfo: AtendimentoInfo;
    clienteInfo: ClienteInfo;
    cpeInfo: CPEInfo;
    chamadoInfo: ChamadoInfo;
    metodosGerais: MetodosGerais;
    rede2g: Rede2G;
    rede5g: Rede5G;
} 