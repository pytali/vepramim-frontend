"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { LogOut } from "lucide-react"
import { Logo } from "@/components/logo"
import { getCurrentUser } from "@/lib/client-auth"
import { User } from "@/types/auth"
import { ModeToggle } from "@/components/mode-toggle"

export function UserHeader() {
    const router = useRouter()
    const [user, setUser] = useState<User | null>(null)
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        async function loadUser() {
            try {
                const userData = await getCurrentUser()
                setUser(userData)
            } catch (error) {
                console.error("Erro ao carregar usuário:", error)
            } finally {
                setIsLoading(false)
            }
        }

        loadUser()
    }, [])

    async function handleLogout() {
        try {
            // Chamar a API para remover os cookies
            await fetch("/api/auth", {
                method: "DELETE",
            })

            // Redirecionar para a página de login
            router.push("/")

            // Forçar um refresh da página para garantir que o middleware seja executado
            router.refresh()
        } catch (error) {
            console.error("Erro ao fazer logout:", error)
        }
    }

    return (
        <header className="relative z-10 flex justify-between items-center p-6 backdrop-blur-md bg-white/10 dark:bg-black/10">
            <div>
                <Logo height={36} />
            </div>
            <div className="flex items-center gap-4">
                {!isLoading && user && (
                    <span className="text-gray-700 dark:text-white font-medium" data-testid="user-name">
                        Olá, {user.username || user.name}
                    </span>
                )}
                <ModeToggle />
                <Button
                    variant="ghost"
                    onClick={handleLogout}
                    className="rounded-full bg-gray-200/50 hover:bg-gray-200/80 dark:bg-white/5 dark:hover:bg-white/10 text-gray-700 dark:text-white transition-all duration-300 w-10 hover:w-24 p-0 overflow-hidden flex justify-start items-center"
                >
                    <div className="flex items-center justify-center min-w-10 h-10">
                        <LogOut className="h-5 w-5" />
                    </div>
                    <span className="pr-3 font-medium">Sair</span>
                </Button>
            </div>
        </header>
    )
} 