import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Login {
    login: string;
    conexao: string;
    id_contrato: string;
    senha: string;
    online: string;
    ultima_conexao_inicial: string;
}

interface LoginSelectorProps {
    isOpen: boolean;
    onClose: () => void;
    logins: Login[];
    onSelect: (login: Login) => void;
}

export default function LoginSelector({ isOpen, onClose, logins, onSelect }: LoginSelectorProps) {
    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-2xl">
                <DialogHeader>
                    <DialogTitle>Selecione o Login</DialogTitle>
                    <DialogDescription>
                        Foram encontrados múltiplos logins para este cliente. Selecione qual deseja consultar.
                    </DialogDescription>
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