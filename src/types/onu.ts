export interface UnauthOnu {
    mac?: string;
    loid?: string;
    pwd?: string;
    error?: string;
    ponId: string;
    sn: string;
    authTime?: string;
    dt: string;
    oltIp: string;
    oltName?: string;
}

export interface UnauthOnuListResponse {
    timestamp?: string;
    status?: string;
    error_number?: string;
    error_description?: string;
    total_records?: number;
    data: UnauthOnu[];
}

export interface AuthorizationOnuRequest {
    sn: string;
    oltId: string;
    ponId: string;
    onuType: string;
    serverType: "NETNUMEN" | "UNM";
    name: string;
    vlan?: string;
}

export type ConnectionType = "PPPoE" | "IPoE";

export const VLAN_MAPPING: Record<ConnectionType, string> = {
    "PPPoE": "2000",
    "IPoE": "2020"
}; 