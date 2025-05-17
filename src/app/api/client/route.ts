import { NextRequest, NextResponse } from 'next/server';
import { getClientRadius, getClientPlan, updateClientRadius } from '../actions';

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

export async function PUT(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const body = await request.json();
    const idRadius = searchParams.get('id') || '';

    try {
        if (!idRadius) {
            return NextResponse.json({ error: 'ID do radius não informado' }, { status: 400 });
        }

        if (!body) {
            return NextResponse.json({ error: 'Corpo da requisição não informado' }, { status: 400 });
        }

        const data = await updateClientRadius(idRadius, body);
        return NextResponse.json(data);

    } catch (error) {
        console.error('Erro na API:', error);
        if (error instanceof Error) {
            console.error('Erro na API:', error.message);
        }
        return NextResponse.json(
            { error: 'Erro interno do servidor' },
            { status: 500 }
        );
    }
}