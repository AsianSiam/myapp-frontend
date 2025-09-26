import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';

type Theme = 'light' | 'dark';

type ThemeContextType = {
    theme: Theme;
    setTheme: (theme: Theme) => void;
    toggleTheme: () => void;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
};

type ThemeProviderProps = {
    children: ReactNode;
};

export const ThemeProvider = ({ children }: ThemeProviderProps) => {
    const [theme, setTheme] = useState<Theme>(() => {
        // ✅ Récupérer le thème sauvegardé ou utiliser 'light' par défaut
        return (localStorage.getItem('theme') as Theme) || 'light';
    });

    useEffect(() => {
        console.log('Theme changed to:', theme); // Debug
        
        // ✅ Sauvegarder le thème dans localStorage
        localStorage.setItem('theme', theme);
        
        // ✅ Ajouter/retirer la classe 'dark' sur le document
        if (theme === 'dark') {
            document.documentElement.classList.add('dark');
            console.log('Added dark class to html element'); // Debug
        } else {
            document.documentElement.classList.remove('dark');
            console.log('Removed dark class from html element'); // Debug
        }
    }, [theme]);

    const toggleTheme = () => {
        setTheme(prev => prev === 'light' ? 'dark' : 'light');
    };

    return (
        <ThemeContext.Provider value={{ theme, setTheme, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};