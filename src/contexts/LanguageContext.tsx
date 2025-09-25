import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';

type LanguageContextType = {
    selectedLanguage: string;
    setSelectedLanguage: (language: string) => void;
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const useLanguage = () => {
    const context = useContext(LanguageContext);
    if (!context) {
        throw new Error('useLanguage must be used within a LanguageProvider');
    }
    return context;
};

type LanguageProviderProps = {
    children: ReactNode;
};

export const LanguageProvider = ({ children }: LanguageProviderProps) => {
    const [selectedLanguage, setSelectedLanguage] = useState<string>(() => {
        // ✅ Récupérer la langue sauvegardée ou utiliser 'fr' par défaut
        return localStorage.getItem('selectedLanguage') || 'fr';
    });

    useEffect(() => {
        // ✅ Sauvegarder la langue dans localStorage
        localStorage.setItem('selectedLanguage', selectedLanguage);
    }, [selectedLanguage]);

    return (
        <LanguageContext.Provider value={{ selectedLanguage, setSelectedLanguage }}>
            {children}
        </LanguageContext.Provider>
    );
};