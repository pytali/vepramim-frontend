"use client"

import * as React from "react"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { CalendarIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"

interface DatePickerProps {
    date?: Date
    onChange: (date: Date | undefined) => void
    className?: string
    id?: string
    onBlur?: () => void
}

export function DatePicker({ date, onChange, className, id, onBlur }: DatePickerProps) {
    const [mounted, setMounted] = React.useState(false)

    React.useEffect(() => {
        setMounted(true)
    }, [])

    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button
                    variant={"outline"}
                    className={cn(
                        "w-full justify-start text-left font-normal h-12 rounded-xl",
                        !date && "text-muted-foreground",
                        className,
                    )}
                    id={id}
                    onBlur={onBlur}
                >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {mounted && date ? format(date, "dd/MM/yyyy", { locale: ptBR }) : "Selecione uma data"}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
                <div className="p-3 border-b">
                    <Button
                        variant="outline"
                        className="w-full"
                        onClick={() => {
                            onChange(new Date())
                        }}
                    >
                        Hoje
                    </Button>
                </div>
                <Calendar selectedDate={date} onDateSelect={onChange} />
            </PopoverContent>
        </Popover>
    )
}
