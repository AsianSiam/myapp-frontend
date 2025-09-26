import { useState, useRef, useEffect } from 'react';
import { Button } from "./ui/button";
import { Separator } from "@/components/ui/separator";
import { useAuth0 } from "@auth0/auth0-react";
import { Menu, X, User, LogIn, CircleUserRound, ShoppingBag, UserCircle, Settings, Sun, Moon, ChevronDown, ChevronRight } from "lucide-react";
import { useGetMyUser } from "@/api/MyUserApi";
import { useAuth0Login, useAuth0Logout } from "@/config/auth0";
import { useIsAdmin } from "@/api/AdminApi";
import { Link } from "react-router-dom";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { useLanguage } from '@/contexts/LanguageContext';
import { useCurrency } from '@/contexts/CurrencyContext';
import { useTheme } from '@/contexts/ThemeContext';
import { languages } from '@/config/language-config';
import { devises } from '@/config/devises-config';

const MobileNav = () => {
    const { isAuthenticated, user } = useAuth0();
    const { currentUser } = useGetMyUser(isAuthenticated);
    const { isAdmin, isLoading: isLoadingAdmin } = useIsAdmin();
    const login = useAuth0Login();
    const logout = useAuth0Logout();
    const [isOpen, setIsOpen] = useState(false);
    const [isSettingsExpanded, setIsSettingsExpanded] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const buttonRef = useRef<HTMLButtonElement>(null);
    
    // Hooks pour les paramètres
    const { selectedLanguage, setSelectedLanguage } = useLanguage();
    const { selectedCurrency, setSelectedCurrency } = useCurrency();
    const { theme, setTheme } = useTheme();

    const handleLanguageChange = (language: string) => {
        setSelectedLanguage(language);
    };

    const handleCurrencyChange = (currency: string) => {
        setSelectedCurrency(currency);
    };

    // Fermer le menu au clic extérieur
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (isOpen && 
                dropdownRef.current && 
                buttonRef.current &&
                !dropdownRef.current.contains(event.target as Node) &&
                !buttonRef.current.contains(event.target as Node)
            ) {
                setIsOpen(false);
            }
        };

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen]);

    return (
        <div className="relative">
            {/* Bouton Menu Mobile */}
            <Button
                ref={buttonRef}
                variant="ghost"
                size="lg"
                className="relative text-app-primary hover:text-accent transition-colors duration-200 p-2 rounded-lg"
                onClick={() => setIsOpen(!isOpen)}
            >
                <Menu className="h-6 w-6" />
            </Button>

            {/* Menu Mobile Dropdown */}
            {isOpen && (
                <div
                    ref={dropdownRef}
                    className="absolute right-0 top-full mt-4 w-80 max-w-[95vw] z-[60] modern-black-card rounded-2xl shadow-2xl border border-app animate-fade-in max-h-[80vh] overflow-y-auto bg-app-background"
                >
                        {/* Header du Menu - Design thème-aware */}
                        <div className="flex items-center justify-between p-4 border-b border-app-muted bg-app-surface/50 rounded-t-2xl">
                            <div className="flex items-center gap-3">
                                {isAuthenticated ? (
                                    <>
                                        <div className="w-10 h-10 bg-app-muted rounded-full flex items-center justify-center">
                                            <CircleUserRound className="h-6 w-6 text-app-primary" />
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="font-bold text-app-primary text-sm">
                                                {currentUser?.nickname || currentUser?.firstname || 'Utilisateur'}
                                            </span>
                                            <span className="text-xs text-app-secondary">
                                                {user?.email}
                                            </span>
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <div className="w-10 h-10 bg-app-muted rounded-full flex items-center justify-center">
                                            <UserCircle className="h-6 w-6 text-app-tertiary" />
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="font-bold text-app-primary text-sm">
                                                Bienvenue !
                                            </span>
                                            <span className="text-xs text-app-secondary">
                                                Connectez-vous pour plus d'options
                                            </span>
                                        </div>
                                    </>
                                )}
                            </div>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setIsOpen(false)}
                                className="rounded-full p-2 h-8 w-8 hover:bg-app-muted/50 text-app-secondary hover:text-app-primary transition-all duration-200"
                            >
                                <X size={16} />
                            </Button>
                        </div>

                        {/* Contenu du Menu */}
                        <div className="p-4 space-y-3">
                            {!isAuthenticated ? (
                                /* Mode Non Connecté */
                                <div className="space-y-3">
                                    <Button 
                                        onClick={() => {
                                            login();
                                            setIsOpen(false);
                                        }}
                                        className="w-full search-button rounded-lg py-3 flex items-center justify-center gap-2 font-medium"
                                    >
                                        <LogIn className="h-4 w-4" />
                                        Se connecter
                                    </Button>
                                    
                                    <div className="text-center">
                                        <p className="text-xs text-app-tertiary">
                                            Connectez-vous pour accéder à votre profil, vos commandes et plus encore
                                        </p>
                                    </div>

                                    <Separator className="my-3" />

                                    {/* Section Paramètres pour utilisateurs non connectés */}
                                    <div className="space-y-2">
                                        {/* Header Paramètres - Cliquable pour enrouler/dérouler */}
                                        <button
                                            onClick={() => setIsSettingsExpanded(!isSettingsExpanded)}
                                            className="flex items-center justify-between w-full p-3 rounded-xl hover:bg-app-muted/20 transition-all duration-200 text-app-primary group"
                                        >
                                            <div className="flex items-center gap-2">
                                                <Settings className="h-4 w-4 text-app-secondary" />
                                                <span className="text-sm font-semibold">Paramètres</span>
                                            </div>
                                            {isSettingsExpanded ? (
                                                <ChevronDown className="h-4 w-4 text-app-secondary group-hover:text-app-primary transition-colors duration-200" />
                                            ) : (
                                                <ChevronRight className="h-4 w-4 text-app-secondary group-hover:text-app-primary transition-colors duration-200" />
                                            )}
                                        </button>

                                        {/* Contenu des Paramètres pour non connectés */}
                                        {isSettingsExpanded && (
                                            <div className="space-y-2 pl-4 animate-fade-in">
                                                {/* Langue */}
                                                <div className="flex items-center justify-between py-2 px-3 bg-app-muted/10 rounded-lg">
                                                    <span className="text-sm font-medium text-app-primary min-w-0 flex-shrink-0">
                                                        Langue
                                                    </span>
                                                    <div className="w-32 ml-3">
                                                        <Select value={selectedLanguage} onValueChange={handleLanguageChange}>
                                                            <SelectTrigger className="h-8 bg-app-background/80 border-app-muted/50 text-app-primary text-xs">
                                                                <SelectValue placeholder="Langue" />
                                                            </SelectTrigger>
                                                            <SelectContent className="dropdown-menu z-[200]">
                                                                {languages.map((language) => (
                                                                    <SelectItem 
                                                                        key={language.value} 
                                                                        value={language.value} 
                                                                        className="text-app-primary text-xs"
                                                                    >
                                                                        {language.label}
                                                                    </SelectItem>
                                                                ))}
                                                            </SelectContent>
                                                        </Select>
                                                    </div>
                                                </div>

                                                {/* Devise */}
                                                <div className="flex items-center justify-between py-2 px-3 bg-app-muted/10 rounded-lg">
                                                    <span className="text-sm font-medium text-app-primary min-w-0 flex-shrink-0">
                                                        Devise
                                                    </span>
                                                    <div className="w-32 ml-3">
                                                        <Select value={selectedCurrency} onValueChange={handleCurrencyChange}>
                                                            <SelectTrigger className="h-8 bg-app-background/80 border-app-muted/50 text-app-primary text-xs">
                                                                <SelectValue placeholder="Devise" />
                                                            </SelectTrigger>
                                                            <SelectContent className="dropdown-menu z-[200]">
                                                                {devises.map((devise) => (
                                                                    <SelectItem 
                                                                        key={devise.value} 
                                                                        value={devise.value} 
                                                                        className="text-app-primary text-xs"
                                                                    >
                                                                        {devise.label}
                                                                    </SelectItem>
                                                                ))}
                                                            </SelectContent>
                                                        </Select>
                                                    </div>
                                                </div>

                                                {/* Thème */}
                                                <div className="flex items-center justify-between py-2 px-3 bg-app-muted/10 rounded-lg">
                                                    <span className="text-sm font-medium text-app-primary min-w-0 flex-shrink-0">
                                                        Thème
                                                    </span>
                                                    <div className="w-32 ml-3">
                                                        <Select value={theme} onValueChange={(value: 'light' | 'dark') => setTheme(value)}>
                                                            <SelectTrigger className="h-8 bg-app-background/80 border-app-muted/50 text-app-primary text-xs">
                                                                <SelectValue />
                                                            </SelectTrigger>
                                                            <SelectContent className="dropdown-menu z-[200]">
                                                                <SelectItem value="light" className="text-app-primary text-xs">
                                                                    <div className="flex items-center gap-2">
                                                                        <Sun className="h-3 w-3 text-amber-500" />
                                                                        Clair
                                                                    </div>
                                                                </SelectItem>
                                                                <SelectItem value="dark" className="text-app-primary text-xs">
                                                                    <div className="flex items-center gap-2">
                                                                        <Moon className="h-3 w-3 text-slate-400" />
                                                                        Sombre
                                                                    </div>
                                                                </SelectItem>
                                                            </SelectContent>
                                                        </Select>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ) : (
                                /* Mode Connecté */
                                <div className="space-y-2">
                                    {/* Navigation Utilisateur */}
                                    <Link 
                                        to="/user-profile" 
                                        onClick={() => setIsOpen(false)}
                                        className="flex items-center gap-3 w-full p-3 rounded-xl hover:bg-app-muted/30 transition-all duration-200 text-app-primary hover:text-accent group"
                                    >
                                        <div className="w-8 h-8 bg-app-muted/80 group-hover:bg-accent/20 rounded-xl flex items-center justify-center transition-all duration-200">
                                            <User className="h-4 w-4 group-hover:text-accent transition-colors duration-200" />
                                        </div>
                                        <div className="flex flex-col flex-1">
                                            <span className="font-medium text-sm">Profil Utilisateur</span>
                                            <span className="text-xs text-app-secondary">Gérer vos informations</span>
                                        </div>
                                    </Link>

                                    <Link 
                                        to="/order-status" 
                                        onClick={() => setIsOpen(false)}
                                        className="flex items-center gap-3 w-full p-3 rounded-xl hover:bg-app-muted/30 transition-all duration-200 text-app-primary hover:text-accent group"
                                    >
                                        <div className="w-8 h-8 bg-app-muted/80 group-hover:bg-accent/20 rounded-xl flex items-center justify-center transition-all duration-200">
                                            <ShoppingBag className="h-4 w-4 group-hover:text-accent transition-colors duration-200" />
                                        </div>
                                        <div className="flex flex-col flex-1">
                                            <span className="font-medium text-sm">Mes Commandes</span>
                                            <span className="text-xs text-app-secondary">Suivre vos achats</span>
                                        </div>
                                    </Link>

                                    {/* Menu Admin (si applicable) */}
                                    {!isLoadingAdmin && isAdmin && (
                                        <>
                                            <Separator className="my-3" />
                                            <Link 
                                                to="/manage-shop" 
                                                onClick={() => setIsOpen(false)}
                                                className="flex items-center gap-3 w-full p-3 rounded-xl hover:bg-accent/15 transition-all duration-200 text-accent hover:text-accent group border border-accent/30 bg-accent/5"
                                            >
                                                <div className="w-8 h-8 bg-accent/20 rounded-xl flex items-center justify-center transition-all duration-200">
                                                    <span className="text-xs font-bold text-accent">🔧</span>
                                                </div>
                                                <div className="flex flex-col flex-1">
                                                    <span className="font-bold text-sm text-accent">Gérer ma Boutique</span>
                                                    <span className="text-xs text-accent/70">Administration</span>
                                                </div>
                                            </Link>
                                        </>
                                    )}

                                    <Separator className="my-3" />

                                    {/* Section Paramètres Enroulable */}
                                    <div className="space-y-2">
                                        {/* Header Paramètres - Cliquable pour enrouler/dérouler */}
                                        <button
                                            onClick={() => setIsSettingsExpanded(!isSettingsExpanded)}
                                            className="flex items-center justify-between w-full p-3 rounded-xl hover:bg-app-muted/20 transition-all duration-200 text-app-primary group"
                                        >
                                            <div className="flex items-center gap-2">
                                                <Settings className="h-4 w-4 text-app-secondary" />
                                                <span className="text-sm font-semibold">Paramètres</span>
                                            </div>
                                            {isSettingsExpanded ? (
                                                <ChevronDown className="h-4 w-4 text-app-secondary group-hover:text-app-primary transition-colors duration-200" />
                                            ) : (
                                                <ChevronRight className="h-4 w-4 text-app-secondary group-hover:text-app-primary transition-colors duration-200" />
                                            )}
                                        </button>

                                        {/* Contenu des Paramètres - Conditionnel */}
                                        {isSettingsExpanded && (
                                            <div className="space-y-2 pl-4 animate-fade-in">
                                                {/* Langue - Compact sur une ligne */}
                                                <div className="flex items-center justify-between py-2 px-3 bg-app-muted/10 rounded-lg">
                                                    <span className="text-sm font-medium text-app-primary min-w-0 flex-shrink-0">
                                                        Langue
                                                    </span>
                                                    <div className="w-32 ml-3">
                                                        <Select value={selectedLanguage} onValueChange={handleLanguageChange}>
                                                            <SelectTrigger className="h-8 bg-app-background/80 border-app-muted/50 text-app-primary text-xs">
                                                                <SelectValue placeholder="Langue" />
                                                            </SelectTrigger>
                                                            <SelectContent className="dropdown-menu z-[200]">
                                                                {languages.map((language) => (
                                                                    <SelectItem 
                                                                        key={language.value} 
                                                                        value={language.value} 
                                                                        className="text-app-primary text-xs"
                                                                    >
                                                                        {language.label}
                                                                    </SelectItem>
                                                                ))}
                                                            </SelectContent>
                                                        </Select>
                                                    </div>
                                                </div>

                                                {/* Devise - Compact sur une ligne */}
                                                <div className="flex items-center justify-between py-2 px-3 bg-app-muted/10 rounded-lg">
                                                    <span className="text-sm font-medium text-app-primary min-w-0 flex-shrink-0">
                                                        Devise
                                                    </span>
                                                    <div className="w-32 ml-3">
                                                        <Select value={selectedCurrency} onValueChange={handleCurrencyChange}>
                                                            <SelectTrigger className="h-8 bg-app-background/80 border-app-muted/50 text-app-primary text-xs">
                                                                <SelectValue placeholder="Devise" />
                                                            </SelectTrigger>
                                                            <SelectContent className="dropdown-menu z-[200]">
                                                                {devises.map((devise) => (
                                                                    <SelectItem 
                                                                        key={devise.value} 
                                                                        value={devise.value} 
                                                                        className="text-app-primary text-xs"
                                                                    >
                                                                        {devise.label}
                                                                    </SelectItem>
                                                                ))}
                                                            </SelectContent>
                                                        </Select>
                                                    </div>
                                                </div>

                                                {/* Mode d'affichage - Compact sur une ligne */}
                                                <div className="flex items-center justify-between py-2 px-3 bg-app-muted/10 rounded-lg">
                                                    <span className="text-sm font-medium text-app-primary min-w-0 flex-shrink-0">
                                                        Thème
                                                    </span>
                                                    <div className="w-32 ml-3">
                                                        <Select value={theme} onValueChange={(value: 'light' | 'dark') => setTheme(value)}>
                                                            <SelectTrigger className="h-8 bg-app-background/80 border-app-muted/50 text-app-primary text-xs">
                                                                <SelectValue />
                                                            </SelectTrigger>
                                                            <SelectContent className="dropdown-menu z-[200]">
                                                                <SelectItem value="light" className="text-app-primary text-xs">
                                                                    <div className="flex items-center gap-2">
                                                                        <Sun className="h-3 w-3 text-amber-500" />
                                                                        Clair
                                                                    </div>
                                                                </SelectItem>
                                                                <SelectItem value="dark" className="text-app-primary text-xs">
                                                                    <div className="flex items-center gap-2">
                                                                        <Moon className="h-3 w-3 text-slate-400" />
                                                                        Sombre
                                                                    </div>
                                                                </SelectItem>
                                                            </SelectContent>
                                                        </Select>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    <Separator className="my-3" />

                                    {/* Bouton Déconnexion */}
                                    <Button 
                                        onClick={() => {
                                            logout();
                                            setIsOpen(false);
                                        }}
                                        variant="outline"
                                        className="w-full border-app-muted hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 dark:hover:text-red-400 hover:border-red-300 dark:hover:border-red-700 transition-all duration-200 py-3 rounded-xl"
                                    >
                                        Déconnexion
                                    </Button>
                                </div>
                            )}
                        </div>
                    </div>
            )}
        </div>
    );
};

export { MobileNav }; 