import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Step1Props } from "../types";
import { ChevronRight, Loader2 } from "lucide-react";



export function Step1SelectOnu({
    loading,
    error,
    unauthorizedOnus,
    selectedOnu,
    onSelectOnu,
    onRefreshList,
    onNext
}: Step1Props) {
    return (
        <Card className="w-full max-w-2xl mx-auto">
            <CardContent className="p-6">
                <h2 className="text-2xl font-semibold mb-4 text-center">
                    Passo 1: Selecione uma ONU
                </h2>

                <div className="flex justify-end mb-4">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={onRefreshList}
                        disabled={loading}
                    >
                        {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Atualizar Lista"}
                    </Button>
                </div>

                {error && (
                    <div className="bg-destructive/10 text-destructive p-3 rounded mb-4">
                        {error}
                    </div>
                )}

                <ScrollArea className="h-[400px] rounded border p-2">
                    {loading ? (
                        <div className="flex justify-center items-center h-40">
                            <Loader2 className="h-6 w-6 animate-spin" />
                        </div>
                    ) : unauthorizedOnus.length === 0 ? (
                        <div className="text-center text-muted-foreground p-8">
                            Nenhuma ONU não autorizada encontrada
                        </div>
                    ) : (
                        <ul className="space-y-2">
                            {unauthorizedOnus.map((onu) => (
                                onu.sn !== "RTKG11111111" ? (
                                    <li
                                        key={`${onu.sn}-${onu.ponId}-${onu.oltIp}`}
                                        className={`p-4 rounded cursor-pointer transition-colors ${selectedOnu?.sn === onu.sn
                                            ? "bg-primary/10 border-2 border-primary"
                                            : "hover:bg-accent border border-gray-200 dark:border-gray-700"
                                            }`}
                                        onClick={() => onSelectOnu(onu)}
                                    >
                                        <div className="font-medium text-lg">SN: {onu.sn}</div>
                                        <div className="text-sm text-muted-foreground mt-1">
                                            PON: {onu.ponId} | OLT: {onu.oltIp}
                                        </div>
                                        <div className="text-sm text-muted-foreground">
                                            Tipo: {onu.dt} | OLT: {onu.oltName}
                                        </div>
                                    </li>
                                ) : null
                            ))}
                        </ul>
                    )}
                </ScrollArea>

                <div className="flex justify-end mt-6">
                    <Button
                        onClick={onNext}
                        disabled={!selectedOnu}
                        className="flex items-center"
                    >
                        Próximo
                        <ChevronRight className="ml-2 h-4 w-4" />
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
} 