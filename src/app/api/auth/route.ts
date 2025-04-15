import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { AUTH_COOKIE_NAME, REFRESH_COOKIE_NAME } from "@/lib/auth"

const API_BASE_URL = process.env.API_BASE_URL || "https://service-api.brasildigital.net.br"

export async function POST(request: Request) {
  try {
    const { username, password } = await request.json()


    // Validate input
    if (!username || !password) {
      return NextResponse.json({ message: "Usuário e senha são obrigatórios" }, { status: 400 })
    }
    if(username === "dev" && process.env.NODE_ENV === "production") {
        return NextResponse.json({ message: "Usuário e senha inválidos" }, { status: 401 })
    }


    // Fazer a chamada real à API de autenticação
    const response = await fetch(`${API_BASE_URL}/operations/api/auth/generatetoken`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    })

    if (!response.ok) {
      const errorData = await response.json()
      return NextResponse.json({ message: errorData.message || "Falha na autenticação" }, { status: response.status })
    }

    const data = await response.json()

    // Extrair os dados da resposta da API
    const token = data.access_token
    const refreshToken = data.refresh_token
    const expiresIn = data.expires_in

    // Calcular a data de expiração
    const expiresAt = new Date()
    expiresAt.setSeconds(expiresAt.getSeconds() + expiresIn)

    // Definir cookies
    const cookieStore = await cookies()

    // Cookie para o token de autenticação
    cookieStore.set(AUTH_COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      expires: expiresAt,
      path: "/",
    })

    // Cookie para o refresh token (validade mais longa)
    const refreshExpiresAt = new Date()
    refreshExpiresAt.setDate(refreshExpiresAt.getDate() + 7) // 7 dias

    cookieStore.set(REFRESH_COOKIE_NAME, refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      expires: refreshExpiresAt,
      path: "/",
    })

    // Retornar resposta com informações sobre a expiração
    return NextResponse.json({
      success: true,
      expiresAt: expiresAt.toISOString(),
    })
  } catch (error) {
    console.error("Authentication error:", error)
    return NextResponse.json({ message: "Erro interno do servidor" }, { status: 500 })
  }
}

// Endpoint para logout
export async function DELETE() {
  const cookieStore = await cookies()

  // Remover cookies de autenticação
  cookieStore.delete(AUTH_COOKIE_NAME)
  cookieStore.delete(REFRESH_COOKIE_NAME)

  return NextResponse.json({ success: true })
}

