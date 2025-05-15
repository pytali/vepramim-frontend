// Constantes para thresholds de sinal de ONU
// Estes valores estão em dBm (decibel-miliwatt)

// Threshold para sinal aceitável (>= ACCEPTABLE_SIGNAL_THRESHOLD é aceitável, < é crítico)
export const ACCEPTABLE_SIGNAL_THRESHOLD =
    process.env.NEXT_PUBLIC_ACCEPTABLE_SIGNAL_THRESHOLD
        ? parseFloat(process.env.NEXT_PUBLIC_ACCEPTABLE_SIGNAL_THRESHOLD)
        : -23;

// Threshold para sinal ótimo (>= OPTIMAL_SIGNAL_THRESHOLD é ótimo, < é aceitável)
export const OPTIMAL_SIGNAL_THRESHOLD =
    process.env.NEXT_PUBLIC_OPTIMAL_SIGNAL_THRESHOLD
        ? parseFloat(process.env.NEXT_PUBLIC_OPTIMAL_SIGNAL_THRESHOLD)
        : -21;

// Threshold para exclusão de ONU por sinal muito fraco
export const CRITICAL_SIGNAL_THRESHOLD =
    process.env.NEXT_PUBLIC_CRITICAL_SIGNAL_THRESHOLD
        ? parseFloat(process.env.NEXT_PUBLIC_CRITICAL_SIGNAL_THRESHOLD)
        : -26; 