import { NextRequest, NextResponse } from 'next/server';
import { checkExistingLogins } from '../../actions';

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const basePrefix = searchParams.get('basePrefix');
    const idCliente = searchParams.get('idCliente');

    if (!basePrefix || !idCliente) {
        return NextResponse.json(
            { error: 'Parâmetros basePrefix e idCliente são obrigatórios' },
            { status: 400 }
        );
    }

    try {
        const data = await checkExistingLogins(basePrefix, idCliente);

        console.log(data)
        return NextResponse.json(data);
    } catch (error) {
        console.error('Erro ao verificar logins existentes:', error);
        return NextResponse.json(
            { error: 'Erro interno do servidor' },
            { status: 500 }
        );
    }
} 