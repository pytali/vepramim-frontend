import { NextRequest, NextResponse } from 'next/server';
import { getClientRadius, getClientPlan } from '../actions';

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const idCliente = searchParams.get('idCliente');
    const idContrato = searchParams.get('idContrato');

    try {
        if (idCliente) {
            const data = await getClientRadius(idCliente);
            return NextResponse.json(data);
        }

        if (idContrato) {
            const data = await getClientPlan(idContrato);
            return NextResponse.json(data);
        }

        return NextResponse.json({ error: 'Parâmetros inválidos' }, { status: 400 });
    } catch (error) {
        console.error('Erro na API:', error);
        return NextResponse.json(
            { error: 'Erro interno do servidor' },
            { status: 500 }
        );
    }
} 