import { AccessDeniedPage } from '@/components/RoleBasedAccess';

export default function AccessDenied() {
    return <AccessDeniedPage />;
}

export const metadata = {
    title: 'Acesso Negado',
    description: 'Você não tem permissão para acessar esta página',
}; 