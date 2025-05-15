import { NextRequest, NextResponse } from "next/server"
import { getAuthToken } from "@/lib/auth"

const API_BASE_URL = "https://service-api.brasildigital.net.br"


export async function DELETE(request: NextRequest) {
    const body = await request.json()

    try {
        const token = await getAuthToken()

        if (!token) {
            return NextResponse.json({ error_description: "Não autorizado" }, { status: 401 })
        }

        const response = await fetch(`${API_BASE_URL}/operations/api/v1/onu/delete`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify(body)
        })

        console.log(response.status)

        if (!response.ok) {
            const errorData = await response.json()
            return NextResponse.json(
                { error_description: errorData.error_description || "Erro ao deletar ONU" },
                { status: response.status }
            )
        }

        const data = await response.json()
        return NextResponse.json(data)

    } catch (error) {
        console.error("Erro ao deletar ONU:", error)
        return NextResponse.json({ error_description: "Erro interno do servidor" }, { status: 500 })
    }
}