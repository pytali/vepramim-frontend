import * as React from "react"
import { Check, ChevronsUpDown, Plus } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandSeparator,
} from "@/components/ui/command"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { Input } from "@/components/ui/input"

export interface ComboboxOption {
    label: string
    value: string
}

interface ComboboxProps {
    options: ComboboxOption[]
    value?: string
    onValueChange: (value: string) => void
    placeholder?: string
    emptyMessage?: string
    className?: string
    searchPlaceholder?: string
    allowCustomValue?: boolean
    customValueLabel?: string
}

export function Combobox({
    options,
    value,
    onValueChange,
    placeholder = "Selecione uma opção",
    emptyMessage = "Nenhuma opção encontrada.",
    className,
    searchPlaceholder = "Pesquisar...",
    allowCustomValue = false,
    customValueLabel = "Outro / Não encontrei na lista"
}: ComboboxProps) {
    const [open, setOpen] = React.useState(false)
    const [searchQuery, setSearchQuery] = React.useState("")
    const [isCustomValueMode, setIsCustomValueMode] = React.useState(false)
    const [customValue, setCustomValue] = React.useState("")

    const customOptionId = "custom-option"

    const filteredOptions = React.useMemo(() => {
        if (!searchQuery) return options
        return options.filter(option =>
            option.label.toLowerCase().includes(searchQuery.toLowerCase())
        )
    }, [options, searchQuery])

    const handleSelectOption = React.useCallback((selectedValue: string) => {
        if (selectedValue === customOptionId) {
            setIsCustomValueMode(true)
            return
        }

        onValueChange(selectedValue === value ? "" : selectedValue)
        setOpen(false)
        setSearchQuery("")
        setIsCustomValueMode(false)
    }, [onValueChange, value, customOptionId])

    const handleCustomValueSubmit = React.useCallback(() => {
        if (customValue.trim()) {
            onValueChange(customValue.trim())
            setCustomValue("")
            setIsCustomValueMode(false)
            setOpen(false)
        }
    }, [customValue, onValueChange])

    React.useEffect(() => {
        // Se o modo de valor personalizado estiver ativo, focar no campo de entrada
        if (isCustomValueMode) {
            const input = document.getElementById("custom-value-input")
            if (input) {
                input.focus()
            }
        }
    }, [isCustomValueMode])

    // Verificar se o valor atual não está nas opções (possível valor personalizado)
    const selectedOption = options.find(opt => opt.value === value)
    const displayValue = selectedOption?.label || (value && !selectedOption ? value : placeholder)

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className={cn("w-full justify-between", className)}
                >
                    {displayValue}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0" align="start">
                {isCustomValueMode ? (
                    <div className="flex p-2">
                        <Input
                            id="custom-value-input"
                            value={customValue}
                            onChange={(e) => setCustomValue(e.target.value)}
                            placeholder="Digite seu valor..."
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    handleCustomValueSubmit()
                                }
                                if (e.key === 'Escape') {
                                    setIsCustomValueMode(false)
                                }
                            }}
                            className="flex-1"
                        />
                        <Button
                            variant="default"
                            size="sm"
                            onClick={handleCustomValueSubmit}
                            className="ml-2"
                        >
                            Confirmar
                        </Button>
                    </div>
                ) : (
                    <Command shouldFilter={false}>
                        <CommandInput
                            placeholder={searchPlaceholder}
                            className="h-9"
                            value={searchQuery}
                            onValueChange={setSearchQuery}
                        />
                        <CommandEmpty>{emptyMessage}</CommandEmpty>
                        <CommandGroup className="max-h-[300px] overflow-y-auto">
                            {filteredOptions.map((option) => (
                                <div
                                    key={option.value}
                                    className="w-full"
                                    onClick={() => handleSelectOption(option.value)}
                                >
                                    <CommandItem
                                        value={option.value}
                                        onSelect={() => handleSelectOption(option.value)}
                                        className="cursor-pointer hover:bg-accent w-full"
                                    >
                                        <Check
                                            className={cn(
                                                "mr-2 h-4 w-4",
                                                value === option.value ? "opacity-100" : "opacity-0"
                                            )}
                                        />
                                        {option.label}
                                    </CommandItem>
                                </div>
                            ))}
                        </CommandGroup>

                        {allowCustomValue && (
                            <>
                                <CommandSeparator />
                                <CommandGroup>
                                    <div
                                        className="w-full"
                                        onClick={() => handleSelectOption(customOptionId)}
                                    >
                                        <CommandItem
                                            value={customOptionId}
                                            onSelect={() => handleSelectOption(customOptionId)}
                                            className="cursor-pointer hover:bg-accent w-full"
                                        >
                                            <Plus className="mr-2 h-4 w-4" />
                                            {customValueLabel}
                                        </CommandItem>
                                    </div>
                                </CommandGroup>
                            </>
                        )}
                    </Command>
                )}
            </PopoverContent>
        </Popover>
    )
} 