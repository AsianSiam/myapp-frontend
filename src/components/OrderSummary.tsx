import type { Order } from "@/types";

/**
 * Props pour le composant OrderSummary
 */
type OrderSummaryProps = {
    order: Order;
    showTitle?: boolean;
    className?: string;
};

/**
 * Composant réutilisable pour afficher le résumé d'une commande
 * Utilisé dans OrderStatusDetail, OrderItemCard, et autres composants
 * 
 * Fonctionnalités:
 * - Affichage des articles avec quantités et prix
 * - Calcul automatique des totaux
 * - Frais de livraison
 * - Formatage monétaire en CHF
 */
const OrderSummary = ({ order, showTitle = true, className = "" }: OrderSummaryProps) => {
    /**
     * Formate un prix en centimes vers CHF avec 2 décimales
     */
    const formatPrice = (priceInCents: number): string => {
        return (priceInCents / 100).toFixed(2);
    };

    /**
     * Calcule le nombre total d'articles dans la commande
     */
    const getTotalItemCount = (): number => {
        return order.cartItems.reduce((total, item) => total + item.quantity, 0);
    };

    return (
        <div className={`space-y-4 ${className}`}>
            {/* Titre optionnel */}
            {showTitle && (
                <h3 className="text-lg font-semibold text-gray-900">
                    Détail de la commande ({getTotalItemCount()} article{getTotalItemCount() > 1 ? 's' : ''})
                </h3>
            )}

            {/* En-tête du tableau */}
            <div className="grid grid-cols-4 gap-4 py-3 px-1 font-semibold text-sm text-gray-700 border-b-2 border-gray-200">
                <span>Article</span>
                <span className="text-center">Quantité</span>
                <span className="text-right">Prix unitaire</span>
                <span className="text-right">Total</span>
            </div>
            
            {/* Liste des articles */}
            <div className="space-y-2">
                {order.cartItems.map((item, index) => {
                    const totalItemPrice = item.price * item.quantity;
                    
                    return (
                        <div 
                            key={item.articleId || index}
                            className="grid grid-cols-4 gap-4 py-2 px-1 hover:bg-gray-50 rounded transition-colors"
                        >
                            <span className="font-medium text-gray-900 truncate" title={item.name}>
                                {item.name}
                            </span>
                            <span className="text-center text-gray-600">
                                {item.quantity}
                            </span>
                            <span className="text-right text-gray-600">
                                {formatPrice(item.price)} CHF
                            </span>
                            <span className="text-right font-semibold text-gray-900">
                                {formatPrice(totalItemPrice)} CHF
                            </span>
                        </div>
                    );
                })}
            </div>

            {/* Séparateur */}
            <div className="border-t border-gray-200 pt-4">
                {/* Frais de livraison */}
                <div className="grid grid-cols-4 gap-4 py-2 px-1 text-sm">
                    <span className="font-medium text-gray-700">Frais de livraison</span>
                    <span></span>
                    <span></span>
                    <span className="text-right text-gray-600">
                        {formatPrice(order.deliveryPrice)} CHF
                    </span>
                </div>

                {/* Total final */}
                <div className="grid grid-cols-4 gap-4 py-3 px-1 border-t-2 border-gray-300 mt-2">
                    <span className="font-bold text-lg text-gray-900">Total</span>
                    <span></span>
                    <span></span>
                    <span className="text-right font-bold text-lg text-gray-900">
                        {formatPrice(order.totalAmount)} CHF
                    </span>
                </div>
            </div>
        </div>
    );
};

export default OrderSummary;