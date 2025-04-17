"use client"

import * as React from "react"
import { ptBR } from "date-fns/locale"
import {
    startOfMonth,
    endOfMonth,
    startOfWeek,
    endOfWeek,
    eachDayOfInterval,
    format,
    isSameMonth,
    isSameDay,
    addMonths,
    subMonths,
    addDays,
} from "date-fns"
import { ChevronLeft, ChevronRight } from "lucide-react"

import { cn } from "@/lib/utils"

export interface CalendarProps {
    className?: string;
    selectedDate?: Date;
    onDateSelect?: (date: Date) => void;
    defaultMonth?: Date;
}

function Calendar({
    className,
    selectedDate,
    onDateSelect,
    defaultMonth = new Date(),
}: CalendarProps) {
    const [currentMonth, setCurrentMonth] = React.useState(startOfMonth(defaultMonth));
    const [selected, setSelected] = React.useState<Date | undefined>(selectedDate);

    // Atualizar o estado interno quando a prop mudar
    React.useEffect(() => {
        if (selectedDate) {
            setSelected(selectedDate);
        }
    }, [selectedDate]);

    // Gerar dias do mês atual
    const generateDays = () => {
        // Primeiro dia do mês
        const monthStart = startOfMonth(currentMonth);
        // Último dia do mês
        const monthEnd = endOfMonth(currentMonth);
        // Primeiro dia da primeira semana (pode ser do mês anterior)
        const startDate = startOfWeek(monthStart, { locale: ptBR });
        // Último dia da última semana (pode ser do próximo mês)
        const endDate = endOfWeek(monthEnd, { locale: ptBR });

        // Gerar array com todos os dias do período
        return eachDayOfInterval({ start: startDate, end: endDate });
    };

    const days = generateDays();
    const weekdays = ["dom", "seg", "ter", "qua", "qui", "sex", "sab"];

    // Manipulador de clique na data
    const handleDateClick = (day: Date) => {
        // Adicionar um dia para corrigir o problema de offset
        const correctedDate = addDays(day, 1);
        setSelected(correctedDate);
        if (onDateSelect) {
            onDateSelect(correctedDate);
        }
    };

    // Navegar para o mês anterior
    const prevMonth = () => {
        setCurrentMonth(subMonths(currentMonth, 1));
    };

    // Navegar para o próximo mês
    const nextMonth = () => {
        setCurrentMonth(addMonths(currentMonth, 1));
    };

    return (
        <div className={cn("p-3", className)}>
            {/* Cabeçalho com mês e ano */}
            <div className="flex justify-center pt-1 relative items-center mb-2">
                <button
                    onClick={prevMonth}
                    className="absolute left-1 h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100 border rounded-md flex items-center justify-center"
                >
                    <ChevronLeft className="h-4 w-4" />
                </button>
                <span className="text-sm font-medium">
                    {format(currentMonth, "MMMM yyyy", { locale: ptBR })}
                </span>
                <button
                    onClick={nextMonth}
                    className="absolute right-1 h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100 border rounded-md flex items-center justify-center"
                >
                    <ChevronRight className="h-4 w-4" />
                </button>
            </div>

            {/* Dias da semana */}
            <div className="grid grid-cols-7 gap-0 mb-1">
                {weekdays.map(day => (
                    <div key={day} className="text-center text-muted-foreground text-xs font-normal p-0">
                        {day}
                    </div>
                ))}
            </div>

            {/* Dias do calendário */}
            <div className="grid grid-cols-7 gap-1">
                {days.map((day, i) => {
                    const isCurrentMonth = isSameMonth(day, currentMonth);
                    const isSelected = selected ? isSameDay(day, selected) : false;

                    return (
                        <div
                            key={i}
                            className="relative p-0 text-center h-9"
                        >
                            <button
                                type="button"
                                onClick={() => handleDateClick(day)}
                                className={cn(
                                    "h-9 w-9 rounded-full flex items-center justify-center",
                                    isCurrentMonth ? "text-foreground" : "text-muted-foreground opacity-50",
                                    isSelected ? "bg-primary text-primary-foreground" : "hover:bg-accent hover:text-accent-foreground"
                                )}
                            >
                                {format(day, "d")}
                            </button>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

Calendar.displayName = "Calendar";

export { Calendar }; 