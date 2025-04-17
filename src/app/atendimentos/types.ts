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

export type ConcentradorInfo = {
    olt: string;
    slot: number;
    pon: number;
    macEquipamento: string;
    sinalFibra: number;
}

export type ChamadoInfo = {
    status: 'PENDENTE' | 'CONCLUIDO';
    protocolo: string;
    motivoChamado: string;
    dataReservada: string;
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
    concentradorInfo: ConcentradorInfo;
    chamadoInfo: ChamadoInfo;
    metodosGerais: MetodosGerais;
    rede2g: Rede2G;
    rede5g: Rede5G;
} 