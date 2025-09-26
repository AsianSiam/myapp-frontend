import type { Order } from "@/types";
import OrderStatusBadge, { OrderProgressBar } from "./OrderStatusBadge";

/**
 * Props pour le composant OrderStatusHeader
 */
type Props = {
    order: Order;
    showProgressBar?: boolean;
};

/**
 * Composant pour afficher l'en-tête du statut d'une commande
 * 
 * Fonctionnalités:
 * - Badge de statut avec couleurs appropriées
 * - Barre de progression visuelle
 * - Date de livraison estimée
 * - Interface responsive et moderne
 */
const OrderStatusHeader = ({ order, showProgressBar = true }: Props) => {
    
    /**
     * Calcule la date de livraison estimée
     * Ajoute 7 jours à partir de la date de création de la commande
     */
    const getExpectedDelivery = (): string => {
        const createdDate = new Date(order.createdAt);
        const deliveryDate = new Date(createdDate);
        deliveryDate.setDate(deliveryDate.getDate() + 7); // Ajouter 7 jours
        
        return deliveryDate.toLocaleDateString('fr-CH', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    /**
     * Formate la date de création de la commande
     */
    const getOrderDate = (): string => {
        return new Date(order.createdAt).toLocaleDateString('fr-CH', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    /**
     * Détermine si la commande est livrée
     */
    const isDelivered = order.status === "livré";

    return (
        <div className="space-y-6">
            {/* En-tête principal */}
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
                {/* Statut de la commande */}
                <div className="flex flex-col space-y-2">
                    <div className="flex items-center space-x-3">
                        <h2 className="text-2xl font-bold text-app-primary">
                            Statut de la commande
                        </h2>
                        <OrderStatusBadge 
                            status={order.status} 
                            size="lg" 
                            showDescription={false}
                        />
                    </div>
                    <p className="text-sm text-app-secondary">
                        Commande passée le {getOrderDate()}
                    </p>
                </div>

                {/* Date de livraison */}
                <div className="text-right lg:text-left">
                    <div className="flex flex-col space-y-1">
                        <span className="text-sm font-medium text-app-secondary">
                            {isDelivered ? "Livrée le :" : "Livraison prévue :"}
                        </span>
                        <span className={`text-lg font-bold ${
                            isDelivered ? "text-green-600 dark:text-green-400" : "text-blue-600 dark:text-blue-400"
                        }`}>
                            {isDelivered ? 
                                new Date(order.createdAt).toLocaleDateString('fr-CH', {
                                    weekday: 'long',
                                    year: 'numeric', 
                                    month: 'long',
                                    day: 'numeric'
                                }) : 
                                getExpectedDelivery()
                            }
                        </span>
                    </div>
                </div>
            </div>

            {/* Barre de progression (optionnelle) */}
            {showProgressBar && (
                <div className="space-y-2">
                    <OrderProgressBar status={order.status} />
                    
                    {/* Description du statut actuel */}
                    <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg border border-blue-200 dark:border-blue-800">
                        <OrderStatusBadge 
                            status={order.status} 
                            size="sm" 
                            showDescription={true}
                            className="justify-start"
                        />
                    </div>
                </div>
            )}

            {/* Messages spéciaux selon le statut */}
            {order.status === "en attente" && (
                <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
                    <div className="flex items-center">
                        <span className="text-yellow-600 dark:text-yellow-400 mr-2">⏳</span>
                        <span className="text-yellow-800 dark:text-yellow-300 font-medium">
                            Commande reçue ! En attente de confirmation de paiement.
                        </span>
                    </div>
                </div>
            )}

            {order.status === "payé" && (
                <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
                    <div className="flex items-center">
                        <span className="text-green-600 dark:text-green-400 mr-2">✅</span>
                        <span className="text-green-800 dark:text-green-300 font-medium">
                            Paiement confirmé ! Votre commande va être préparée.
                        </span>
                    </div>
                </div>
            )}

            {order.status === "livré" && (
                <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
                    <div className="flex items-center">
                        <span className="text-green-600 dark:text-green-400 mr-2">🎉</span>
                        <span className="text-green-800 dark:text-green-300 font-medium">
                            Commande livrée avec succès ! Merci pour votre achat.
                        </span>
                    </div>
                </div>
            )}
        </div>
    );
};

export default OrderStatusHeader;