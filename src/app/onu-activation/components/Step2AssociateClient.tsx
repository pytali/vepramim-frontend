import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AlertCircle, ChevronLeft, ChevronRight, Loader2, Search } from "lucide-react";
import { Step2Props } from "../types";
import { isIPoELogin, isStandardLogin, getStandardLogin } from "@/utils/activationUtils";


export function Step2AssociateClient({
    selectedOnu,
    searchQuery,
    setSearchQuery,
    searchingClient,
    error,
    selectedLogin,
    loginSuffix,
    standardLogin,
    checkingLogin,
    onSearchClient,
    onPrevious,
    onNext
}: Step2Props) {

    // Verifica se o login atual é IPoE
    const isCurrentLoginIPoE = selectedLogin && isIPoELogin(selectedLogin.autenticacao);

    // Verifica se o login segue o padrão
    let isLoginStandard = false;

    if (selectedLogin && selectedLogin.login && selectedLogin.base && selectedLogin.id_cliente) {
        isLoginStandard = isStandardLogin(
            selectedLogin.login,
            selectedLogin.base,
            selectedLogin.id_cliente
        );
    }

    // Função para obter o formato final de login com sufixo se necessário
    const getFinalLoginFormat = () => {
        if (!standardLogin) {
            if (selectedLogin?.base && selectedLogin?.id_cliente) {
                const baseLogin = getStandardLogin(selectedLogin.base, selectedLogin.id_cliente);
                return loginSuffix ? `${baseLogin}_${loginSuffix}` : baseLogin;
            }
            return "Formatando login...";
        }

        return loginSuffix ? `${standardLogin}_${loginSuffix}` : standardLogin;
    };

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
                                Buscar por ID de Cliente*
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

                            {/* Exibir aviso apenas se não for login IPoE */}
                            {!isCurrentLoginIPoE && (
                                <div className="text-sm text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20 p-3 rounded-md border border-amber-200 dark:border-amber-800">
                                    <p className="font-medium">Aviso importante:</p>
                                    <p>O login do cliente será automaticamente ajustado para o padrão <span className="font-mono">{'{BASE}_{id_cliente}'}</span> caso esteja em formato diferente.</p>
                                    <p>Se já existirem logins duplicados, serão adicionados sufixos como <span className="font-mono">_2</span>, <span className="font-mono">_3</span>, etc.</p>
                                </div>
                            )}
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

                                {/* Exibir informações de validação de login somente se não for IPoE */}
                                {selectedLogin.login && selectedLogin.base && selectedLogin.id_cliente && !isCurrentLoginIPoE && (
                                    <div className="mt-3 p-2 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded">
                                        {isLoginStandard ? (
                                            <p className="text-sm text-blue-700 dark:text-blue-400">
                                                <span className="font-medium">Login verificado:</span> O formato está de acordo com o padrão recomendado.
                                            </p>
                                        ) : !isLoginStandard ? (
                                            <>
                                                <p className="text-sm text-blue-700 dark:text-blue-400">
                                                    <span className="font-medium">Atenção:</span> O login atual não segue o padrão recomendado.
                                                </p>
                                                {checkingLogin && (
                                                    <div className="flex items-center text-sm text-blue-700 dark:text-blue-400">
                                                        <Loader2 className="h-3 w-3 mr-2 animate-spin" />
                                                        Verificando disponibilidade do login...
                                                    </div>
                                                )}
                                                <p className="text-sm text-blue-700 dark:text-blue-400">
                                                    Novo formato de login: <span className="font-mono font-medium">{getFinalLoginFormat()}</span>
                                                    {loginSuffix && (
                                                        <span className="ml-1">(com sufixo <span className="font-mono">_{loginSuffix}</span> para evitar duplicação)</span>
                                                    )}
                                                </p>
                                            </>
                                        ) : loginSuffix ? (
                                            <>
                                                <p className="text-sm text-blue-700 dark:text-blue-400">
                                                    <span className="font-medium">Atenção:</span> Já existem logins com este padrão.
                                                </p>
                                                <p className="text-sm text-blue-700 dark:text-blue-400">
                                                    Será utilizado o sufixo <span className="font-mono">_{loginSuffix}</span>: <span className="font-mono font-medium">{getFinalLoginFormat()}</span>
                                                </p>
                                            </>
                                        ) : (
                                            <p className="text-sm text-blue-700 dark:text-blue-400">
                                                <span className="font-medium">Login verificado:</span> O formato está de acordo com o padrão recomendado.
                                            </p>
                                        )}
                                    </div>
                                )}

                                {/* Mostrar informação de login IPoE */}
                                {isCurrentLoginIPoE && (
                                    <div className="mt-3 p-2 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded">
                                        <p className="text-sm text-blue-700 dark:text-blue-400">
                                            <span className="font-medium">Login IPoE detectado:</span> As informações serão atualizadas com os dados da nova ONU.
                                        </p>
                                    </div>
                                )}
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
                                disabled={!selectedLogin}
                                className="flex items-center"
                            >
                                Próximo
                                <ChevronRight className="ml-2 h-4 w-4" />
                            </Button>
                        </div>

                        {!selectedLogin && (
                            <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-md text-center">
                                <p className="text-blue-700 dark:text-blue-300 font-medium">Para continuar:</p>
                                <p className="text-blue-600 dark:text-blue-400">
                                    1. Digite o ID do cliente na caixa de busca acima
                                </p>
                                <p className="text-blue-600 dark:text-blue-400">
                                    2. Clique no botão &quot;Buscar&quot;
                                </p>
                                <p className="text-blue-600 dark:text-blue-400">
                                    3. Quando o cliente aparecer, o botão &quot;Próximo&quot; será liberado
                                </p>
                            </div>
                        )}
                    </div>
                )}
            </CardContent>
        </Card>
    );
} 