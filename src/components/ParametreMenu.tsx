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
            <DropdownMenuTrigger className="flex items-center justify-center p-2 hover:text-slate-500 hover:bg-white rounded-md transition-colors">
                <Settings className="h-6 w-6" />
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-80 bg-white border border-gray-200" align="end"> {/* ✅ Largeur fixe */}                                                
                <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                    <div className="w-full grid grid-cols-2 gap-4 items-center"> {/* ✅ Grid pour uniformité */}
                        <span className="text-sm font-medium text-gray-700 text-left">
                            Langue
                        </span>
                        <Select value={selectedLanguage} onValueChange={handleLanguageChange}>
                            <SelectTrigger className="bg-white w-full h-6 border-none shadow-none focus:ring-0 hover:bg-gray-100"> {/* ✅ Hauteur fixe */}
                                <SelectValue placeholder="Select language" />
                            </SelectTrigger>
                            <SelectContent className="bg-white border-none shadow-lg"> {/* ✅ Ombre pour le menu déroulant */}
                                {languages.map((language) => (
                                    <SelectItem key={language.value} value={language.value}>
                                        {language.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </DropdownMenuItem>
                <div className="h-px bg-gray-100 mx-3"></div> {/* ✅ Trait noir très fin */}                        
                
                {/* ✅ Devise - Layout uniforme */}
                <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                    <div className="w-full grid grid-cols-2 gap-6 items-center"> {/* ✅ Grid pour uniformité */}
                        <span className="text-sm font-medium text-gray-700 text-left">
                            Devise
                        </span>
                        <Select value={selectedCurrency} onValueChange={handleCurrencyChange}>
                            <SelectTrigger className="bg-white w-full h-6 border-none shadow-none focus:ring-0 hover:bg-gray-100"> {/* ✅ Hauteur fixe */}
                                <SelectValue placeholder="Select currency" />
                            </SelectTrigger>
                            <SelectContent className="bg-white border-none shadow-lg">
                                {devises.map((devise) => (
                                    <SelectItem key={devise.value} value={devise.value}>
                                        {devise.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </DropdownMenuItem>
                <div className="h-px bg-gray-100 mx-3"></div> {/* ✅ Trait noir très fin */}                                                 
                {/* ✅ Thème (clair/sombre) - Layout uniforme */}
                <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                    <div className="w-full grid grid-cols-2 gap-6 items-center"> {/* ✅ Grid pour uniformité */}
                        <span className="text-sm font-medium text-gray-700 text-left">
                            Mode d'affichage
                        </span>
                        <Select value={theme} onValueChange={(value: 'light' | 'dark') => setTheme(value)}>
                            <SelectTrigger className="bg-white w-full h-6 border-none shadow-none focus:ring-0 hover:bg-gray-100"> {/* ✅ Hauteur fixe */}
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="bg-white border-none shadow-lg">
                                <SelectItem value="light">
                                    <div className="flex items-center gap-2">
                                        <Sun className="h-4 w-4" />
                                        Clair
                                    </div>
                                </SelectItem>
                                <SelectItem value="dark">
                                    <div className="flex items-center gap-2">
                                        <Moon className="h-4 w-4" />
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