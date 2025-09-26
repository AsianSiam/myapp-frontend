import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import type { Order } from "@/types";
import { Calendar, Filter, Search, X } from "lucide-react";
import { useState, useMemo } from "react";

interface OrderFiltersProps {
    orders: Order[];
    onFilteredOrdersChange: (filteredOrders: Order[]) => void;
    className?: string;
}

/**
 * Composant de filtrage et recherche pour les commandes
 */
const OrderFilters = ({ orders, onFilteredOrdersChange, className = "" }: OrderFiltersProps) => {
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState<string>("all");
    const [dateFilter, setDateFilter] = useState<string>("all");
    const [showFilters, setShowFilters] = useState(false);

    // Calculs des statistiques
    const statistics = useMemo(() => {
        const stats = {
            total: orders.length,
            "en attente": orders.filter(o => o.status === "en attente").length,
            payé: orders.filter(o => o.status === "payé").length,
            envoyé: orders.filter(o => o.status === "envoyé").length,
            livré: orders.filter(o => o.status === "livré").length,
            annulé: orders.filter(o => o.status === "annulé").length,
            totalRevenue: orders.reduce((sum, order) => sum + order.totalAmount, 0),
        };
        return stats;
    }, [orders]);

    // Filtrage des commandes
    const filteredOrders = useMemo(() => {
        let filtered = [...orders];

        // Recherche textuelle
        if (searchTerm.trim()) {
            const search = searchTerm.toLowerCase().trim();
            filtered = filtered.filter(order => 
                order._id.toLowerCase().includes(search) ||
                order.deliveryDetails.name.toLowerCase().includes(search) ||
                order.deliveryDetails.email.toLowerCase().includes(search) ||
                (order.user && order.user.name && order.user.name.toLowerCase().includes(search)) ||
                (order.user && order.user.firstname && order.user.firstname.toLowerCase().includes(search)) ||
                (order.user && order.user.phoneNumber && order.user.phoneNumber.toString().includes(search)) ||
                order.cartItems.some(item => item.name.toLowerCase().includes(search))
            );
        }

        // Filtre par statut
        if (statusFilter !== "all") {
            filtered = filtered.filter(order => order.status === statusFilter);
        }

        // Filtre par date
        if (dateFilter !== "all") {
            const now = new Date();
            const filterDate = new Date();
            
            switch (dateFilter) {
                case "today":
                    filterDate.setHours(0, 0, 0, 0);
                    filtered = filtered.filter(order => 
                        new Date(order.createdAt) >= filterDate
                    );
                    break;
                case "week":
                    filterDate.setDate(now.getDate() - 7);
                    filtered = filtered.filter(order => 
                        new Date(order.createdAt) >= filterDate
                    );
                    break;
                case "month":
                    filterDate.setMonth(now.getMonth() - 1);
                    filtered = filtered.filter(order => 
                        new Date(order.createdAt) >= filterDate
                    );
                    break;
            }
        }

        return filtered;
    }, [orders, searchTerm, statusFilter, dateFilter]);

    // Mettre à jour les résultats filtrés
    useMemo(() => {
        onFilteredOrdersChange(filteredOrders);
    }, [filteredOrders, onFilteredOrdersChange]);

    const clearFilters = () => {
        setSearchTerm("");
        setStatusFilter("all");
        setDateFilter("all");
    };

    const hasActiveFilters = searchTerm.trim() !== "" || statusFilter !== "all" || dateFilter !== "all";

    const formatRevenue = (amount: number) => {
        return `CHF ${(amount / 100).toFixed(2)}`;
    };

    return (
        <div className={`space-y-4 ${className}`}>
            {/* Statistiques rapides */}
            <Card className="modern-black-card border-0">
                <CardContent className="p-4">
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                        <div className="text-center">
                            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{statistics.total}</div>
                            <div className="text-xs text-app-secondary">Total</div>
                        </div>
                        <div className="text-center">
                            <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">{statistics["en attente"]}</div>
                            <div className="text-xs text-app-secondary">En attente</div>
                        </div>
                        <div className="text-center">
                            <div className="text-2xl font-bold text-green-600 dark:text-green-400">{statistics.payé}</div>
                            <div className="text-xs text-app-secondary">Payées</div>
                        </div>
                        <div className="text-center">
                            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{statistics.envoyé}</div>
                            <div className="text-xs text-app-secondary">Envoyées</div>
                        </div>
                        <div className="text-center">
                            <div className="text-2xl font-bold text-green-600 dark:text-green-400">{statistics.livré}</div>
                            <div className="text-xs text-app-secondary">Livrées</div>
                        </div>
                        <div className="text-center">
                            <div className="text-2xl font-bold text-red-600 dark:text-red-400">{statistics.annulé}</div>
                            <div className="text-xs text-app-secondary">Annulées</div>
                        </div>
                        <div className="text-center">
                            <div className="text-2xl font-bold text-app-primary">{formatRevenue(statistics.totalRevenue)}</div>
                            <div className="text-xs text-app-secondary">CA Total</div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Barre de recherche et bouton filtres */}
            <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
                <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-app-tertiary" />
                    <Input
                        placeholder="Rechercher par ID commande, nom, prénom, email, téléphone, ou article..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 pr-4 modern-black-card border-0 text-app-primary placeholder:text-app-tertiary"
                    />
                </div>
                
                <div className="flex gap-2 items-center">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setShowFilters(!showFilters)}
                        className="flex items-center gap-2 border-app hover:bg-app-muted"
                    >
                        <Filter className="h-4 w-4" />
                        Filtres
                        {hasActiveFilters && (
                            <Badge variant="secondary" className="ml-1 px-1 text-xs">
                                {[searchTerm.trim() && "recherche", statusFilter !== "all" && "statut", dateFilter !== "all" && "date"]
                                    .filter(Boolean).length}
                            </Badge>
                        )}
                    </Button>
                    
                    {hasActiveFilters && (
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={clearFilters}
                            className="text-app-secondary hover:text-app-primary hover:bg-app-muted"
                        >
                            <X className="h-4 w-4" />
                        </Button>
                    )}
                </div>
            </div>

            {/* Filtres avancés */}
            {showFilters && (
                <Card className="modern-black-card border-0">
                    <CardContent className="p-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="text-sm font-medium text-app-primary mb-2 block">
                                    Statut de commande
                                </label>
                                <Select value={statusFilter} onValueChange={setStatusFilter}>
                                    <SelectTrigger className="h-8 border-0 text-app-secondary select-trigger-enhanced">
                                        <SelectValue placeholder="Tous les statuts" />
                                    </SelectTrigger>
                                    <SelectContent className="dropdown-menu animate-fade-in">
                                        <SelectItem value="all" className="text-app-primary select-item-enhanced">Tous les statuts</SelectItem>
                                        <SelectItem value="en attente" className="text-app-primary select-item-enhanced">En attente ({statistics["en attente"]})</SelectItem>
                                        <SelectItem value="payé" className="text-app-primary select-item-enhanced">Payées ({statistics.payé})</SelectItem>
                                        <SelectItem value="envoyé" className="text-app-primary select-item-enhanced">Envoyées ({statistics.envoyé})</SelectItem>
                                        <SelectItem value="livré" className="text-app-primary select-item-enhanced">Livrées ({statistics.livré})</SelectItem>
                                        <SelectItem value="annulé" className="text-app-primary select-item-enhanced">Annulées ({statistics.annulé})</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div>
                                <label className="text-sm font-medium text-app-primary mb-2 block">
                                    Période
                                </label>
                                <Select value={dateFilter} onValueChange={setDateFilter}>
                                    <SelectTrigger className="h-8 border-0 text-app-secondary select-trigger-enhanced">
                                        <SelectValue placeholder="Toutes les dates" />
                                    </SelectTrigger>
                                    <SelectContent className="dropdown-menu animate-fade-in">
                                        <SelectItem value="all" className="text-app-primary select-item-enhanced">Toutes les dates</SelectItem>
                                        <SelectItem value="today" className="text-app-primary select-item-enhanced">Aujourd'hui</SelectItem>
                                        <SelectItem value="week" className="text-app-primary select-item-enhanced">Cette semaine</SelectItem>
                                        <SelectItem value="month" className="text-app-primary select-item-enhanced">Ce mois</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Résultats */}
            <div className="flex items-center justify-between text-sm text-app-secondary">
                <div className="flex items-center gap-2">
                    <span>
                        {filteredOrders.length} commande{filteredOrders.length !== 1 ? "s" : ""} 
                        {filteredOrders.length !== orders.length && ` sur ${orders.length}`}
                    </span>
                    {hasActiveFilters && (
                        <Badge variant="outline" className="text-xs border-app text-app-secondary">
                            Filtrées
                        </Badge>
                    )}
                </div>
                
                {filteredOrders.length > 0 && (
                    <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        <span>CA: {formatRevenue(filteredOrders.reduce((sum, order) => sum + order.totalAmount, 0))}</span>
                    </div>
                )}
            </div>
        </div>
    );
};

export default OrderFilters;