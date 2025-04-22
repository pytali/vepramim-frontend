import { NextRequest, NextResponse } from 'next/server';
import { getAtendimento } from '../actions';

export async function GET(request: NextRequest) {
    const protocolo = request.nextUrl.searchParams.get('protocolo');

    if (!protocolo) {
        return NextResponse.json({ error: 'Protocolo não fornecido' }, { status: 400 });
    }

    try {
        const atendimento = await getAtendimento(protocolo);
        return NextResponse.json(atendimento);
    } catch (error) {
        console.error('Erro ao buscar atendimento:', error);
        return NextResponse.json({ error: 'Erro ao buscar atendimento' }, { status: 500 });
    }
}