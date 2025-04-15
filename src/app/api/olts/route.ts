import { NextResponse } from "next/server"
import { getAuthToken, refreshAuthToken } from "@/lib/auth"

const API_BASE_URL = "https://service-api.brasildigital.net.br" // Replace with actual API base URL

export async function GET() {
  try {
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
    const response = await fetch(`${API_BASE_URL}/operations/api/v1/olts`, {
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
          const retryResponse = await fetch(`${API_BASE_URL}/operations/api/v1/olts`, {
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

      return NextResponse.json({ message: "Erro ao buscar OLTs" }, { status: response.status })
    }

    // Parse the response
    const data = await response.json()

    // Return the OLTs data
    return NextResponse.json(data)
  } catch (error) {
    console.error("Error fetching OLTs:", error)
    return NextResponse.json({ message: "Erro interno do servidor" }, { status: 500 })
  }
}
