import { NextResponse } from "next/server"
import { getAuthToken, refreshAuthToken } from "@/lib/auth"

const API_BASE_URL = "https://service-api.brasildigital.net.br"

export async function GET() {
    try {
        let token = await getAuthToken()

        if (!token) {
            const refreshed = await refreshAuthToken()
            if (!refreshed) {
                return NextResponse.json({ message: "Não autorizado" }, { status: 401 })
            }
            token = await getAuthToken()
        }

        const response = await fetch(`${API_BASE_URL}/operations/api/v1/onu/unauthorized`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })

        if (!response.ok) {
            if (response.status === 401) {
                const refreshed = await refreshAuthToken()
                if (refreshed) {
                    token = await getAuthToken()
                    const retryResponse = await fetch(`${API_BASE_URL}/operations/api/v1/onu/unauthorized`, {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    })

                    if (retryResponse.ok) {
                        const data = await retryResponse.json()
                        return NextResponse.json(data)
                    }
                }
            }

            return NextResponse.json(
                { error_description: "Erro ao buscar ONUs não autorizadas" },
                { status: response.status }
            )
        }

        const data = await response.json()
        return NextResponse.json(data)
    } catch (error) {
        console.error("Erro ao buscar ONUs não autorizadas:", error)
        return NextResponse.json(
            { error_description: "Erro interno do servidor" },
            { status: 500 }
        )
    }
} 