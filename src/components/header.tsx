import { MainNav } from "@/components/main-nav"
import { ModeToggle } from "@/components/mode-toggle"
import { Logo } from "@/components/logo"

export function Header() {
    return (
        <header className="sticky top-0 z-40 w-full border-b bg-background">
            <div className="container flex h-16 items-center space-x-4 sm:justify-between sm:space-x-0">
                <div className="flex gap-6 md:gap-10">
                    <Logo />
                    <MainNav />
                </div>
                <div className="flex flex-1 items-center justify-end space-x-4">
                    <ModeToggle />
                </div>
            </div>
        </header>
    )
} 