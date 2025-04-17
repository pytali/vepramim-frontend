export interface ChamadoInfo {
    protocolo: string;
    tipo: 'INSTALACAO' | 'SUPORTE' | 'MANUTENCAO';
    status: 'ABERTO' | 'EM_ANDAMENTO' | 'CONCLUIDO' | 'CANCELADO';
    motivoChamado?: string;
    dataReservada?: string;
    localizacao?: string;
    alarmeEquipamento?: string;
    descricaoAtendimento?: string;
} 