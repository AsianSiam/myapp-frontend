import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Order } from "@/types";
import OrderStatusHeader from "./OrderStatusHeader";
import OrderStatusDetail from "./OrderStatusDetail";
import OrderStatusBadge from "./OrderStatusBadge";

/**
 * Props pour le composant OrderAccordion
 */
type Props = {
    order: Order;
    defaultExpanded?: boolean;
};

/**
 * Composant accordion pour afficher une commande de manière pliable
 * 
 * Fonctionnalités:
 * - En-tête cliquable avec résumé de la commande
 * - Contenu déroulable avec détails complets
 * - État par défaut intelligent (terminées = enroulées)
 * - Animations fluides
 * - Interface responsive
 */
const OrderAccordion = ({ order, defaultExpanded = true }: Props) => {
    const [isExpanded, setIsExpanded] = useState(defaultExpanded);

    /**
     * Détermine si une commande est terminée (delivered)
     */
    const isCompleted = order.status === "delivered";

    /**
     * Formate un ID de commande pour affichage court
     */
    const formatOrderId = (orderId: string): string => {
        return orderId.length > 8 ? orderId.slice(-8) : orderId;
    };

    /**
     * Formate une date pour affichage compact
     */
    const formatDate = (dateString: string): string => {
        return new Date(dateString).toLocaleDateString('fr-CH', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    /**
     * Formate un prix en centimes vers CHF
     */
    const formatPrice = (priceInCents: number): string => {
        return (priceInCents / 100).toFixed(2);
    };

    /**
     * Compte le nombre total d'articles dans la commande
     */
    const getTotalItemCount = (): number => {
        return order.cartItems.reduce((total, item) => total + item.quantity, 0);
    };

    /**
     * Bascule l'état d'expansion de l'accordion
     */
    const toggleExpanded = () => {
        setIsExpanded(!isExpanded);
    };

    return (
        <div className={`rounded-lg border transition-all duration-200 overflow-hidden ${
            isCompleted 
                ? 'bg-green-50 border-green-200 hover:border-green-300' 
                : 'bg-white border-gray-200 hover:border-gray-300 hover:shadow-md'
        }`}>
            
            {/* En-tête cliquable */}
            <div 
                className="p-5 cursor-pointer hover:bg-gray-50 transition-colors"
                onClick={toggleExpanded}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        toggleExpanded();
                    }
                }}
                aria-expanded={isExpanded}
                aria-controls={`order-content-${order._id}`}
            >
                <div className="flex items-center justify-between">
                    {/* Informations principales de la commande */}
                    <div className="flex-1 space-y-2">
                        {/* Ligne 1: ID et Badge statut */}
                        <div className="flex items-center space-x-3 flex-wrap">
                            <h3 className="text-lg font-semibold text-gray-900">
                                Commande #{formatOrderId(order._id)}
                            </h3>
                            <OrderStatusBadge status={order.status} size="sm" />
                            
                            {/* Indicateur paiement confirmé */}
                            {order.status === "payé" && (
                                <div className="flex items-center space-x-1 text-green-600 bg-green-100 px-2 py-1 rounded-full">
                                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                    </svg>
                                    <span className="text-xs font-medium">Paiement confirmé</span>
                                </div>
                            )}
                        </div>

                        {/* Ligne 2: Date et nombre d'articles */}
                        <div className="flex items-center space-x-4 text-sm text-gray-600">
                            <span>📅 {formatDate(order.createdAt)}</span>
                            <span>📦 {getTotalItemCount()} article{getTotalItemCount() > 1 ? 's' : ''}</span>
                        </div>

                        {/* Ligne 3: Total */}
                        <div className="flex items-center">
                            <span className="text-lg font-bold text-gray-900">
                                {formatPrice(order.totalAmount)} CHF
                            </span>
                        </div>
                    </div>
                    
                    {/* Contrôles à droite */}
                    <div className="flex items-center space-x-3 ml-4">
                        {/* Badge "Terminée" pour les commandes livrées */}
                        {isCompleted && (
                            <span className="text-green-600 text-sm font-medium bg-green-100 px-2 py-1 rounded-full">
                                ✅ Terminée
                            </span>
                        )}
                        
                        {/* Bouton d'expansion */}
                        <Button
                            variant="ghost"
                            size="sm"
                            className="p-2 hover:bg-gray-200"
                            aria-label={isExpanded ? "Réduire les détails" : "Voir les détails"}
                        >
                            {isExpanded ? (
                                <ChevronUp className="h-5 w-5 text-gray-600" />
                            ) : (
                                <ChevronDown className="h-5 w-5 text-gray-600" />
                            )}
                        </Button>
                    </div>
                </div>
            </div>

            {/* Contenu déroulable */}
            {isExpanded && (
                <div 
                    id={`order-content-${order._id}`}
                    className="border-t border-gray-200 bg-gray-50 px-6 py-6 space-y-6 animate-in slide-in-from-top-2 duration-200"
                >
                    {/* En-tête détaillé avec barre de progression */}
                    <OrderStatusHeader order={order} showProgressBar={true} />
                    
                    {/* Détails complets de la commande */}
                    <OrderStatusDetail order={order} />
                </div>
            )}
        </div>
    );
};

export default OrderAccordion;