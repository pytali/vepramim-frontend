import LoginForm from "@/components/login-form"
import { Logo } from "@/components/logo"


export default function Home() {
    return (
        <main className="flex min-h-screen flex-col items-center justify-center p-4 gradient-bg">
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-purple-500/10 dark:bg-purple-500/10 blur-[100px]"></div>
                <div className="absolute bottom-1/4 left-1/3 w-[500px] h-[500px] rounded-full bg-blue-500/10 dark:bg-blue-500/10 blur-[100px]"></div>
            </div>

            <div className="relative z-10 w-full max-w-md">
                <div className="text-center mb-12">
                    <div className="flex justify-center mb-4">
                        <Logo height={50} />
                    </div>
                    <p className="text-gray-600 dark:text-gray-400 text-lg font-light">Sistema de Gerenciamento OLT/ONU</p>
                </div>
                <LoginForm />
            </div>
        </main>
    )
}
