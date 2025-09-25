import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';

type CurrencyContextType = {
    selectedCurrency: string;
    setSelectedCurrency: (Currency: string) => void;
};

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

export const useCurrency = () => {
    const context = useContext(CurrencyContext);
    if (!context) {
        throw new Error('useCurrency must be used within a CurrencyProvider');
    }
    return context;
};

type CurrencyProviderProps = {
    children: ReactNode;
};

export const CurrencyProvider = ({ children }: CurrencyProviderProps) => {
    const [selectedCurrency, setSelectedCurrency] = useState<string>(() => {
        // ✅ Récupérer la devise sauvegardée ou utiliser 'CHF' par défaut
        return localStorage.getItem('selectedCurrency') || 'CHF';
    });

    useEffect(() => {
        // ✅ Sauvegarder la devise dans localStorage
        localStorage.setItem('selectedCurrency', selectedCurrency);
    }, [selectedCurrency]);

    return (
        <CurrencyContext.Provider value={{ selectedCurrency, setSelectedCurrency }}>
            {children}
        </CurrencyContext.Provider>
    );
};