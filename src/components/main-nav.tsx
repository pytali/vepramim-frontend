"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"

const navItems = [
    {
        href: "/dashboard",
        label: "Dashboard"
    },
    {
        href: "/onu-search",
        label: "Busca de ONUs"
    },
    {
        href: "/onu-activation",
        label: "Ativação de ONUs"
    },
]

export function MainNav() {
    const pathname = usePathname()

    return (
        <nav className="flex items-center space-x-4 lg:space-x-6">
            {navItems.map((item) => (
                <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                        "text-sm font-medium transition-colors hover:text-primary",
                        pathname === item.href
                            ? "text-primary font-bold"
                            : "text-muted-foreground"
                    )}
                >
                    {item.label}
                </Link>
            ))}
        </nav>
    )
} 