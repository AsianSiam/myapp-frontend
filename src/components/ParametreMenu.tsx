import { DropdownMenuSeparator, DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from './ui/dropdown-menu';
import { Settings, Sun, Moon } from 'lucide-react';
import { languages } from '@/config/language-config';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { useLanguage } from '@/contexts/LanguageContext';
import { devises } from '@/config/devises-config';
import { useCurrency } from '@/contexts/CurrencyContext';
import { useTheme } from '@/contexts/ThemeContext';

const ParametreMenu = () => {
    const { selectedLanguage, setSelectedLanguage } = useLanguage();
    const { selectedCurrency, setSelectedCurrency } = useCurrency();
    const { theme, setTheme } = useTheme();

    const handleLanguageChange = (language: string) => {
        setSelectedLanguage(language);
    };

    const handleCurrencyChange = (currency: string) => {
        setSelectedCurrency(currency);
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger className="flex items-center justify-center p-2 text-app-primary hover:text-accent rounded-lg transition-colors">
                <Settings className="h-6 w-6" />
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-80 dropdown-menu animate-scale-in" align="end">                                                
                <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                    <div className="w-full grid grid-cols-2 gap-4 items-center py-2">
                        <span className="text-sm font-medium text-app-primary">
                            Langue
                        </span>
                        <Select value={selectedLanguage} onValueChange={handleLanguageChange}>
                            <SelectTrigger className="h-8 border-0 text-app-secondary select-trigger-enhanced">
                                <SelectValue placeholder="Select language" />
                            </SelectTrigger>
                            <SelectContent className="dropdown-menu animate-fade-in">
                                {languages.map((language) => (
                                    <SelectItem key={language.value} value={language.value} className="text-app-primary select-item-enhanced">
                                        {language.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </DropdownMenuItem>
                <div className="h-px border-app-subtle mx-3"></div>                        
                
                <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                    <div className="w-full grid grid-cols-2 gap-4 items-center py-2">
                        <span className="text-sm font-medium text-app-primary">
                            Devise
                        </span>
                        <Select value={selectedCurrency} onValueChange={handleCurrencyChange}>
                            <SelectTrigger className="h-8 border-0 text-app-secondary select-trigger-enhanced">
                                <SelectValue placeholder="Select currency" />
                            </SelectTrigger>
                            <SelectContent className="dropdown-menu animate-fade-in">
                                {devises.map((devise) => (
                                    <SelectItem key={devise.value} value={devise.value} className="text-app-primary select-item-enhanced">
                                        {devise.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </DropdownMenuItem>
                <div className="h-px border-app-subtle mx-3"></div>                                                 
                <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                    <div className="w-full grid grid-cols-2 gap-4 items-center py-2">
                        <span className="text-sm font-medium text-app-primary">
                            Mode d'affichage
                        </span>
                        <Select value={theme} onValueChange={(value: 'light' | 'dark') => setTheme(value)}>
                            <SelectTrigger className="h-8 border-0 text-app-secondary select-trigger-enhanced">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="dropdown-menu animate-fade-in">
                                <SelectItem value="light" className="text-app-primary select-item-enhanced">
                                    <div className="flex items-center gap-2">
                                        <Sun className="h-4 w-4 text-amber-500" />
                                        Clair
                                    </div>
                                </SelectItem>
                                <SelectItem value="dark" className="text-app-primary select-item-enhanced">
                                    <div className="flex items-center gap-2">
                                        <Moon className="h-4 w-4 text-slate-400" />
                                        Sombre
                                    </div>
                                </SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </DropdownMenuItem>
                
                <DropdownMenuSeparator />
            </DropdownMenuContent>
        </DropdownMenu>
    )
};

export { ParametreMenu };