import React from "react";
import { OnuSignalInfo } from "../../types";
import { OPTIMAL_SIGNAL_THRESHOLD, ACCEPTABLE_SIGNAL_THRESHOLD } from "@/lib/constants";

interface SignalInfoCardProps {
    signalInfo: OnuSignalInfo;
}

export function SignalInfoCard({ signalInfo }: SignalInfoCardProps) {
    return (
        <div className="p-4 rounded-lg bg-primary/5 border border-primary/20 mb-6">
            <h3 className="font-medium text-center mb-4">Informações do Sinal</h3>
            <div className="space-y-3">
                <div className="flex justify-between items-center">
                    <span>Sinal OLT→ONU:</span>
                    <div className="flex items-center gap-2">
                        <span className={`font-semibold 
              ${signalInfo.rxPower > OPTIMAL_SIGNAL_THRESHOLD ? "text-green-600" :
                                signalInfo.rxPower > ACCEPTABLE_SIGNAL_THRESHOLD ? "text-amber-600" : "text-red-600"}`}>
                            {signalInfo.rxPower.toFixed(2)} dBm
                        </span>
                        <div className={`w-3 h-3 rounded-full 
              ${signalInfo.rxPower > OPTIMAL_SIGNAL_THRESHOLD ? "bg-green-600" :
                                signalInfo.rxPower > ACCEPTABLE_SIGNAL_THRESHOLD ? "bg-amber-600" : "bg-red-600"}`} />
                    </div>
                </div>
                <div className="flex justify-between items-center">
                    <span>Sinal ONU→OLT:</span>
                    <div className="flex items-center gap-2">
                        <span className={`font-semibold 
              ${signalInfo.p_rx_power + 2 > OPTIMAL_SIGNAL_THRESHOLD ? "text-green-600" :
                                signalInfo.p_rx_power + 2 > ACCEPTABLE_SIGNAL_THRESHOLD ? "text-amber-600" : "text-red-600"}`}>
                            {signalInfo.p_rx_power.toFixed(2)} dBm
                        </span>
                        <div className={`w-3 h-3 rounded-full 
              ${signalInfo.p_rx_power + 2 > OPTIMAL_SIGNAL_THRESHOLD ? "bg-green-600" :
                                signalInfo.p_rx_power + 2 > ACCEPTABLE_SIGNAL_THRESHOLD ? "bg-amber-600" : "bg-red-600"}`} />
                    </div>
                </div>
                <div className="flex justify-between items-center">
                    <span>Status Geral:</span>
                    <div className="flex items-center gap-2">
                        <span className={`font-semibold 
              ${signalInfo.status === "optimal" ? "text-green-600" :
                                signalInfo.status === "acceptable" ? "text-amber-600" : "text-red-600"}`}>
                            {signalInfo.status === "optimal" ? "Ótimo" :
                                signalInfo.status === "acceptable" ? "Aceitável" : "Crítico"}
                        </span>
                        <div className={`w-3 h-3 rounded-full 
              ${signalInfo.status === "optimal" ? "bg-green-600" :
                                signalInfo.status === "acceptable" ? "bg-amber-600" : "bg-red-600"}`} />
                    </div>
                </div>
            </div>
        </div>
    );
} 