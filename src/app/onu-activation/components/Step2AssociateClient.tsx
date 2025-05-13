import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { UnauthOnu } from "@/types/onu";
import { AlertCircle, ChevronLeft, ChevronRight, Loader2, Search } from "lucide-react";
import { Login } from "../types";

interface Step2Props {
    selectedOnu: UnauthOnu | null;
    searchQuery: string;
    setSearchQuery: (query: string) => void;
    searchingClient: boolean;
    error: string | null;
    selectedLogin: Login | null;
    onSearchClient: () => void;
    onPrevious: () => void;
    onNext: () => void;
}

export function Step2AssociateClient({
    selectedOnu,
    searchQuery,
    setSearchQuery,
    searchingClient,
    error,
    selectedLogin,
    onSearchClient,
    onPrevious,
    onNext
}: Step2Props) {
    return (
        <Card className="w-full max-w-2xl mx-auto">
            <CardContent className="p-6">
                <h2 className="text-2xl font-semibold mb-4 text-center">
                    Passo 2: Associar Cliente
                </h2>

                {selectedOnu && (
                    <div className="space-y-4">
                        <div className="p-4 rounded-lg bg-primary/5 border border-primary/20 mb-4">
                            <div className="font-medium mb-2">ONU Selecionada</div>
                            <div className="grid grid-cols-2 gap-2 text-sm">
                                <div className="text-muted-foreground">Número de Série:</div>
                                <div className="font-semibold">{selectedOnu.sn}</div>
                                <div className="text-muted-foreground">OLT:</div>
                                <div>{selectedOnu.oltName}</div>
                                <div className="text-muted-foreground">PON:</div>
                                <div>{selectedOnu.ponId}</div>
                            </div>
                        </div>

                        <div className="space-y-3">
                            <Label htmlFor="searchQuery" className="font-medium">
                                Buscar por ID de Cliente
                            </Label>
                            <div className="flex space-x-2">
                                <Input
                                    id="searchQuery"
                                    placeholder="Digite o ID do Cliente"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="flex-grow"
                                />
                                <Button
                                    onClick={onSearchClient}
                                    disabled={searchingClient || !searchQuery.trim()}
                                    className="flex items-center whitespace-nowrap"
                                >
                                    {searchingClient ? (
                                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                    ) : (
                                        <Search className="h-4 w-4 mr-2" />
                                    )}
                                    Buscar
                                </Button>
                            </div>
                            <p className="text-sm text-muted-foreground">
                                Digite o ID do Cliente para associar.
                            </p>
                        </div>

                        {error && (
                            <div className="bg-destructive/10 text-destructive rounded p-3 mt-4">
                                <div className="flex items-center gap-2">
                                    <AlertCircle className="h-5 w-5" />
                                    <span>{error}</span>
                                </div>
                            </div>
                        )}

                        {selectedLogin && (
                            <div className="p-4 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 mt-4">
                                <div className="font-medium text-green-800 dark:text-green-300 mb-2">Cliente Associado</div>
                                <div className="grid grid-cols-2 gap-2 text-sm">
                                    <div className="text-green-700 dark:text-green-400">Login:</div>
                                    <div className="font-semibold">{selectedLogin.login}</div>
                                    <div className="text-green-700 dark:text-green-400">ID do Contrato:</div>
                                    <div>{selectedLogin.id_contrato}</div>
                                    <div className="text-green-700 dark:text-green-400">Base:</div>
                                    <div>{selectedLogin.base}</div>
                                </div>
                            </div>
                        )}

                        <div className="flex justify-between mt-6">
                            <Button
                                variant="outline"
                                onClick={onPrevious}
                                className="flex items-center"
                            >
                                <ChevronLeft className="mr-2 h-4 w-4" />
                                Anterior
                            </Button>
                            <Button
                                onClick={onNext}
                                className="flex items-center"
                            >
                                Próximo
                                <ChevronRight className="ml-2 h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    );
} 