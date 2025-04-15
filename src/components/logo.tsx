"use client"

import Image from "next/image"
import { useTheme } from "next-themes"
import { useEffect, useState } from "react"

interface LogoProps {
    className?: string
    height?: number
}

export function Logo({ className = "", height = 40 }: LogoProps) {
    const { theme, resolvedTheme } = useTheme()
    const [mounted, setMounted] = useState(false)

    // Prevent hydration mismatch
    useEffect(() => {
        setMounted(true)
    }, [])

    if (!mounted) {
        return <div className={`h-[${height}px] w-[180px] ${className}`} />
    }

    const isDark = theme === "dark" || resolvedTheme === "dark"
    const logoSrc = isDark ? "/images/logo-brasil-digital-dark.png" : "/images/logo-brasildigital-color.png"

    return (
        <Image
            src={logoSrc || "/placeholder.svg"}
            alt="Brasil Digital Logo"
            width={180}
            height={height}
            className={className}
            priority
        />
    )
}
