import { NextRequest, NextResponse } from "next/server"
import { getAuthToken, refreshAuthToken } from "@/lib/auth"

const API_BASE_URL = "https://service-api.brasildigital.net.br" // Replace with actual API base URL

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ sn: string }> }
) {
  try {
    const { sn } = await context.params

    let token = await getAuthToken()

    if (!token) {
      // Tentar atualizar o token
      const refreshed = await refreshAuthToken()
      if (!refreshed) {
        return NextResponse.json({ message: "Não autorizado" }, { status: 401 })
      }
      token = await getAuthToken()
    }

    // Call the actual API endpoint
    const response = await fetch(`${API_BASE_URL}/operations/api/v1/onu/${sn}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    if (!response.ok) {
      // Se o token expirou, tentar atualizar e tentar novamente
      if (response.status === 401) {
        const refreshed = await refreshAuthToken()
        if (refreshed) {
          token = await getAuthToken()
          const retryResponse = await fetch(`${API_BASE_URL}/operations/api/v1/onu/${sn}`, {
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

      // Handle different error status codes
      if (response.status === 404) {
        return NextResponse.json({ error_description: "ONU não encontrada" }, { status: 404 })
      }

      if (response.status === 406) {
        return NextResponse.json({ error_description: "Mais de uma ONU encontrada com o mesmo SN" }, { status: 406 })
      }

      if (response.status === 412) {
        return NextResponse.json({ error_description: "Número de série inválido" }, { status: 412 })
      }

      return NextResponse.json({ error_description: "Erro ao buscar ONU" }, { status: response.status })
    }

    // Parse the response
    const data = await response.json()

    // Return the ONU data
    return NextResponse.json(data)
  } catch (error) {
    console.error("Error fetching ONU:", error)
    return NextResponse.json({ error_description: "Erro interno do servidor" }, { status: 500 })
  }
}