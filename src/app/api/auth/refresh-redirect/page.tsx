"use client"

import { useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"

export default function RefreshRedirect() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const redirectPath = searchParams.get("redirect") || "/dashboard"

    useEffect(() => {
        async function refreshToken() {
            try {
                const response = await fetch("/api/auth/refresh", {
                    method: "POST",
                })

                if (response.ok) {
                    // Token atualizado com sucesso, redirecionar para a página original
                    router.push(redirectPath)
                } else {
                    // Falha ao atualizar o token, redirecionar para a página de login
                    router.push("/")
                }
            } catch (error) {
                console.error("Erro ao atualizar token:", error)
                router.push("/")
            }
        }

        refreshToken()
    }, [router, redirectPath])

    return (
        <div className="min-h-screen gradient-bg flex items-center justify-center">
            <div className="relative">
                <div className="w-16 h-16 border-4 border-gray-300 dark:border-gray-700 border-t-gray-900 dark:border-t-white rounded-full animate-spin"></div>
                <div className="mt-4 text-gray-900 dark:text-white text-center">Autenticando...</div>
            </div>
        </div>
    )
}
