import type { Order } from "@/types";
import { Separator } from "./ui/separator";
import OrderSummary from "./OrderSummary";

/**
 * Props pour le composant OrderStatusDetail
 */
type Props = {
    order: Order;
};

/**
 * Composant pour afficher les détails complets d'une commande
 * 
 * Fonctionnalités:
 * - Affichage de l'ID de commande (formaté)
 * - Détails de l'adresse de livraison
 * - Résumé détaillé de la commande (via OrderSummary)
 * - Interface claire et lisible
 */
const OrderStatusDetail = ({ order }: Props) => {
    /**
     * Formate l'ID de commande pour un affichage plus court
     * Prend les 8 derniers caractères pour la lisibilité
     */
    const formatOrderId = (orderId: string): string => {
        return orderId.length > 8 ? `#${orderId.slice(-8)}` : `#${orderId}`;
    };

    /**
     * Formate l'adresse de livraison en une chaîne lisible
     */
    const formatDeliveryAddress = () => {
        const { deliveryDetails } = order;
        return {
            name: deliveryDetails.name,
            line1: deliveryDetails.addressLine1,
            cityLine: `${deliveryDetails.zipCode} ${deliveryDetails.city}`,
            countryLine: `${deliveryDetails.state}, ${deliveryDetails.country}`
        };
    };

    const address = formatDeliveryAddress();

    return (
        <div className="space-y-6">
            {/* En-tête avec ID de commande */}
            <div className="bg-app-surface p-4 rounded-lg">
                <h2 className="text-xl font-semibold text-app-primary flex items-center">
                    <span className="text-blue-600 dark:text-blue-400 mr-2">📋</span>
                    Commande {formatOrderId(order._id)}
                </h2>
                <p className="text-sm text-app-secondary mt-1">
                    Créée le {new Date(order.createdAt).toLocaleDateString('fr-CH', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                    })}
                </p>
            </div>

            {/* Séparateur */}
            <Separator />

            {/* Adresse de livraison */}
            <div className="space-y-3">
                <h3 className="text-lg font-semibold text-app-primary flex items-center">
                    <span className="text-green-600 dark:text-green-400 mr-2">🚚</span>
                    Adresse de livraison
                </h3>
                <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg border border-green-200 dark:border-green-800">
                    <address className="not-italic text-green-800 dark:text-green-200 leading-relaxed">
                        <div className="font-semibold text-green-900 dark:text-green-100">{address.name}</div>
                        <div className="text-green-800 dark:text-green-200">{address.line1}</div>
                        <div className="text-green-800 dark:text-green-200">{address.cityLine}</div>
                        <div className="text-green-800 dark:text-green-200">{address.countryLine}</div>
                        {/* Email de contact */}
                        {order.deliveryDetails.email && (
                            <div className="mt-2 pt-2 border-t border-green-300 dark:border-green-700">
                                <span className="text-sm text-green-700 dark:text-green-300">Contact: </span>
                                <span className="text-sm font-medium text-green-900 dark:text-green-100">{order.deliveryDetails.email}</span>
                            </div>
                        )}
                    </address>
                </div>
            </div>

            {/* Séparateur */}
            <Separator />

            {/* Détails de la commande - utilise le composant OrderSummary */}
            <OrderSummary 
                order={order} 
                showTitle={true}
                className="bg-app-surface p-4 rounded-lg"
            />
        </div>
    );
};

export default OrderStatusDetail;