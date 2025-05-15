import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { WebChat } from "@/components/web-chat"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Brasil Digital - Gerenciamento OLT/ONU",
  description: "Sistema de gerenciamento de OLTs e ONUs",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
          {children}
          <WebChat />
        </ThemeProvider>
      </body>
    </html>
  )
}
