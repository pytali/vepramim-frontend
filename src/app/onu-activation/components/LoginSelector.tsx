import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { LoginSelectorProps } from "../types";

export function LoginSelector({ isOpen, onClose, logins, onSelect }: LoginSelectorProps) {
    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-2xl">
                <DialogHeader>
                    <DialogTitle>Selecione o Login</DialogTitle>
                </DialogHeader>

                <ScrollArea className="max-h-[400px] pr-4">
                    <div className="space-y-2">
                        {logins.map((login, index) => (
                            <div
                                key={index}
                                className="p-4 rounded-lg border border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors"
                            >
                                <div className="flex items-center justify-between">
                                    <div className="space-y-1">
                                        <p className="font-medium">{login.login}</p>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">
                                            Conexão: {login.conexao || 'N/A'}
                                        </p>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">
                                            Status: {login.online === 'S' ?
                                                <span className="text-green-500">Online</span> :
                                                <span className="text-red-500">Offline</span>
                                            }
                                        </p>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">
                                            Última conexão: {login.ultima_conexao_inicial || 'N/A'}
                                        </p>
                                        {login.base && (
                                            <p className="text-xs text-blue-500 dark:text-blue-400">
                                                Base: {login.base}
                                            </p>
                                        )}
                                        {login.endpoint && !login.base && (
                                            <p className="text-xs text-blue-500 dark:text-blue-400">
                                                {login.endpoint.replace('https://', '').split('/')[0]}
                                            </p>
                                        )}
                                    </div>
                                    <Button
                                        onClick={() => onSelect(login)}
                                        variant="outline"
                                    >
                                        Selecionar
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>
                </ScrollArea>
            </DialogContent>
        </Dialog>
    );
} 