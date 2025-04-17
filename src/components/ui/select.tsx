"use client"

import * as React from "react"
import * as SelectPrimitive from "@radix-ui/react-select"
import { Check, ChevronDown } from "lucide-react"

import { cn } from "@/lib/utils"

// Exporta o Root component diretamente
const Select = SelectPrimitive.Root

const SelectTrigger = React.forwardRef<
    React.ComponentRef<typeof SelectPrimitive.Trigger>,
    React.ComponentPropsWithoutRef<typeof SelectPrimitive.Trigger>
>(({ className, children, ...props }, ref) => {
    const [mounted, setMounted] = React.useState(false)

    React.useEffect(() => {
        setMounted(true)
    }, [])

    if (!mounted) {
        return (
            <button
                type="button"
                className={cn(
                    "flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
                    className
                )}
                disabled
            >
                {children}
                <ChevronDown className="h-4 w-4 opacity-50" />
            </button>
        )
    }

    return (
        <SelectPrimitive.Trigger
            ref={ref}
            className={cn(
                "flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
                className
            )}
            {...props}
        >
            {children}
            <SelectPrimitive.Icon asChild>
                <ChevronDown className="h-4 w-4 opacity-50" />
            </SelectPrimitive.Icon>
        </SelectPrimitive.Trigger>
    )
})
SelectTrigger.displayName = SelectPrimitive.Trigger.displayName

// Implementação personalizada do Content para evitar efeitos no background
const SelectContent = React.forwardRef<
    React.ComponentRef<typeof SelectPrimitive.Content>,
    React.ComponentPropsWithoutRef<typeof SelectPrimitive.Content>
>(({ className, children, position = "popper", ...props }, ref) => {
    const [mounted, setMounted] = React.useState(false)

    // Evita bloqueio de rolagem
    React.useEffect(() => {
        if (mounted) {
            // Guarda o valor original de overflow
            const originalOverflow = window.getComputedStyle(document.body).overflow
            const originalPaddingRight = window.getComputedStyle(document.body).paddingRight
            const originalPosition = window.getComputedStyle(document.body).position

            // Função para corrigir rolagem
            const fixScroll = () => {
                if (document.body.style.overflow === 'hidden') {
                    document.body.style.overflow = 'auto'
                    document.body.style.paddingRight = '0'
                }
                if (document.body.style.position === 'fixed') {
                    document.body.style.position = 'static'
                }
            }

            // Observer para detectar mudanças de estilo no body e corrigir
            const observer = new MutationObserver(() => {
                fixScroll()
            })

            // Observa mudanças nos atributos de estilo do body
            observer.observe(document.body, {
                attributes: true,
                attributeFilter: ['style']
            })

            // Corrige imediatamente caso já esteja com scroll bloqueado
            fixScroll()

            // Intervalo para garantir que a rolagem não seja bloqueada
            const interval = setInterval(fixScroll, 100)

            return () => {
                observer.disconnect()
                clearInterval(interval)
                // Restaura valores originais ao desmontar
                document.body.style.overflow = originalOverflow
                document.body.style.paddingRight = originalPaddingRight
                document.body.style.position = originalPosition
            }
        }
    }, [mounted])

    React.useEffect(() => {
        setMounted(true)
    }, [])

    if (!mounted) {
        return null
    }

    // Implementação personalizada para evitar efeitos no background
    return (
        <SelectPrimitive.Portal>
            <SelectPrimitive.Content
                ref={ref}
                className={cn(
                    "absolute z-[9999] min-w-[8rem] overflow-hidden rounded-md border bg-white dark:bg-gray-900 text-popover-foreground shadow-md",
                    position === "popper" &&
                    "data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1",
                    className
                )}
                position={position}
                sideOffset={2}
                style={{
                    backdropFilter: 'none',
                    WebkitBackdropFilter: 'none',
                    maxHeight: 'var(--radix-popper-available-height)'
                }}

                onCloseAutoFocus={(e) => {
                    e.preventDefault();
                    if (props.onCloseAutoFocus) {
                        props.onCloseAutoFocus(e);
                    }
                }}
                {...props}
            >
                <SelectPrimitive.Viewport
                    className={cn(
                        "p-1 overflow-y-auto scrollbar-thin",
                        position === "popper"
                            ? "h-[var(--radix-select-trigger-height)] max-h-[320px] w-full min-w-[var(--radix-select-trigger-width)]"
                            : "max-h-[320px]"
                    )}
                    style={{
                        maxHeight: "calc(var(--radix-popper-available-height, 320px) - 10px)",
                        overflowY: "auto"
                    }}
                >
                    {children}
                </SelectPrimitive.Viewport>
            </SelectPrimitive.Content>
        </SelectPrimitive.Portal>
    )
})
SelectContent.displayName = SelectPrimitive.Content.displayName

const SelectItem = React.forwardRef<
    React.ComponentRef<typeof SelectPrimitive.Item>,
    React.ComponentPropsWithoutRef<typeof SelectPrimitive.Item>
>(({ className, children, ...props }, ref) => (
    <SelectPrimitive.Item
        ref={ref}
        className={cn(
            "relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
            className
        )}
        {...props}
    >
        <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
            <SelectPrimitive.ItemIndicator>
                <Check className="h-4 w-4" />
            </SelectPrimitive.ItemIndicator>
        </span>
        <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
    </SelectPrimitive.Item>
))
SelectItem.displayName = SelectPrimitive.Item.displayName

const SelectValue = SelectPrimitive.Value

export {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} 