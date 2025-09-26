import { useState, useEffect } from "react";
import type { Order } from "@/types";
import OrderCard from "./OrderCard";
import OrderFilters from "./OrderFilters";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { RefreshCw, AlertCircle, TrendingUp, Clock } from "lucide-react";

interface OrderManagementProps {
    orders?: Order[];
    isLoading: boolean;
    onUpdateOrderStatus: (orderId: string, newStatus: string) => void;
    isUpdatingStatus?: boolean;
    onRefresh?: () => void;
}

/**
 * Composant principal de gestion des commandes
 * Intègre le filtrage, la recherche et l'affichage des commandes
 */
const OrderManagement = ({
    orders = [],
    isLoading,
    onUpdateOrderStatus,
    isUpdatingStatus = false,
    onRefresh
}: OrderManagementProps) => {
    const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
    const [expandedOrders, setExpandedOrders] = useState<Set<string>>(new Set());
    const [lastRefresh, setLastRefresh] = useState<Date>(new Date());

    // Auto-refresh toutes les 30 secondes si des commandes sont en attente
    useEffect(() => {
        if (!onRefresh) return;

        const hasPendingOrders = orders.some(order => 
            order.status === "en attente" || order.status === "payé" || order.status === "envoyé"
        );

        if (!hasPendingOrders) return;

        const interval = setInterval(() => {
            console.log("🔄 Refresh automatique des commandes en attente");
            onRefresh();
            setLastRefresh(new Date());
        }, 30000); // 30 secondes

        return () => clearInterval(interval);
    }, [orders, onRefresh]);

    const handleToggleExpanded = (orderId: string) => {
        setExpandedOrders(prev => {
            const newSet = new Set(prev);
            if (newSet.has(orderId)) {
                newSet.delete(orderId);
            } else {
                newSet.add(orderId);
            }
            return newSet;
        });
    };

    const handleExpandAll = () => {
        if (expandedOrders.size === filteredOrders.length) {
            setExpandedOrders(new Set());
        } else {
            setExpandedOrders(new Set(filteredOrders.map(order => order._id)));
        }
    };

    const handleManualRefresh = () => {
        if (onRefresh) {
            onRefresh();
            setLastRefresh(new Date());
        }
    };

    // Grouper les commandes par statut prioritaire
    const priorityOrders = filteredOrders.filter(order => 
        order.status === "en attente" || order.status === "payé"
    );
    const otherOrders = filteredOrders.filter(order => 
        order.status !== "en attente" && order.status !== "payé"
    );

    const formatLastRefresh = (date: Date) => {
        const now = new Date();
        const diffMs = now.getTime() - date.getTime();
        const diffSecs = Math.floor(diffMs / 1000);
        
        if (diffSecs < 60) return "À l'instant";
        if (diffSecs < 3600) return `Il y a ${Math.floor(diffSecs / 60)} min`;
        return date.toLocaleTimeString('fr-CH', { hour: '2-digit', minute: '2-digit' });
    };

    if (isLoading) {
        return (
            <div className="text-center py-12">
                <RefreshCw className="animate-spin h-8 w-8 text-blue-600 mx-auto mb-4" />
                <p className="text-app-secondary">Chargement des commandes...</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* En-tête avec actions */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-app-primary">Gestion des Commandes</h2>
                    <p className="text-app-secondary mt-1">
                        Suivi et gestion de toutes les commandes
                    </p>
                </div>
                
                <div className="flex items-center gap-3">
                    {onRefresh && (
                        <div className="flex items-center gap-2 text-sm text-app-tertiary">
                            <Clock className="h-4 w-4" />
                            <span>Dernière MAJ: {formatLastRefresh(lastRefresh)}</span>
                        </div>
                    )}
                    
                    {onRefresh && (
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={handleManualRefresh}
                            disabled={isLoading}
                            className="flex items-center gap-2 border-app hover:bg-app-muted"
                        >
                            <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
                            Actualiser
                        </Button>
                    )}
                </div>
            </div>

            {/* Alerte pour commandes prioritaires */}
            {priorityOrders.length > 0 && (
                <Alert className="border-orange-200 bg-orange-50 dark:bg-orange-900/20 dark:border-orange-800">
                    <AlertCircle className="h-4 w-4 text-orange-600 dark:text-orange-400" />
                    <AlertDescription className="text-orange-800 dark:text-orange-300">
                        <span className="font-medium">
                            {priorityOrders.length} commande{priorityOrders.length > 1 ? 's' : ''} 
                            {" "}nécessite{priorityOrders.length > 1 ? 'nt' : ''} votre attention
                        </span>
                        <span className="ml-2 text-sm">
                            (Nouvelles commandes ou paiements confirmés)
                        </span>
                    </AlertDescription>
                </Alert>
            )}

            {/* Filtres et statistiques */}
            <OrderFilters
                orders={orders}
                onFilteredOrdersChange={setFilteredOrders}
            />

            {/* Actions groupées */}
            {filteredOrders.length > 0 && (
                <div className="flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={handleExpandAll}
                            className="border-app hover:bg-app-muted"
                        >
                            {expandedOrders.size === filteredOrders.length ? "Réduire tout" : "Étendre tout"}
                        </Button>
                        
                        {priorityOrders.length > 0 && (
                            <Badge variant="outline" className="text-orange-600 border-orange-300 dark:text-orange-400 dark:border-orange-600">
                                <TrendingUp className="w-3 h-3 mr-1" />
                                {priorityOrders.length} prioritaire{priorityOrders.length > 1 ? 's' : ''}
                            </Badge>
                        )}
                    </div>

                    {isUpdatingStatus && (
                        <div className="flex items-center gap-2 text-sm text-blue-600 dark:text-blue-400">
                            <RefreshCw className="animate-spin h-4 w-4" />
                            <span>Mise à jour en cours...</span>
                        </div>
                    )}
                </div>
            )}

            {/* Liste des commandes */}
            {filteredOrders.length > 0 ? (
                <div className="space-y-4">
                    {/* Commandes prioritaires en premier */}
                    {priorityOrders.length > 0 && (
                        <div className="space-y-3">
                            <div className="flex items-center gap-2">
                                <AlertCircle className="h-4 w-4 text-orange-600 dark:text-orange-400" />
                                <h3 className="font-medium text-orange-900 dark:text-orange-300">Commandes Prioritaires</h3>
                            </div>
                            {priorityOrders.map(order => (
                                <div key={order._id} className="ring-2 ring-orange-200 rounded-lg">
                                    <OrderCard
                                        order={order}
                                        onStatusChange={onUpdateOrderStatus}
                                        isUpdatingStatus={isUpdatingStatus}
                                        expanded={expandedOrders.has(order._id)}
                                        onToggleExpanded={() => handleToggleExpanded(order._id)}
                                    />
                                </div>
                            ))}
                        </div>
                    )}
                    
                    {/* Autres commandes */}
                    {otherOrders.length > 0 && (
                        <div className="space-y-3">
                            {priorityOrders.length > 0 && (
                                <div className="flex items-center gap-2 mt-6">
                                    <h3 className="font-medium text-app-secondary">Autres Commandes</h3>
                                </div>
                            )}
                            {otherOrders.map(order => (
                                <OrderCard
                                    key={order._id}
                                    order={order}
                                    onStatusChange={onUpdateOrderStatus}
                                    isUpdatingStatus={isUpdatingStatus}
                                    expanded={expandedOrders.has(order._id)}
                                    onToggleExpanded={() => handleToggleExpanded(order._id)}
                                />
                            ))}
                        </div>
                    )}
                </div>
            ) : (
                <div className="text-center py-12 bg-app-surface rounded-lg border border-app">
                    <div className="text-app-tertiary">
                        <TrendingUp className="mx-auto h-12 w-12 text-app-muted-foreground mb-4" />
                        <h3 className="text-lg font-medium text-app-primary mb-2">
                            {orders.length === 0 ? "Aucune commande" : "Aucune commande correspondante"}
                        </h3>
                        <p className="text-sm text-app-secondary">
                            {orders.length === 0 
                                ? "Les nouvelles commandes apparaîtront ici."
                                : "Essayez de modifier vos filtres de recherche."
                            }
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default OrderManagement;