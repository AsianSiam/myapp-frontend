import type { OrderStatus } from "@/types";

/**
 * Configuration des statuts de commande avec leurs propriétés d'affichage
 */
export const ORDER_STATUS_CONFIG = {
    placed: {
        label: "Commande passée",
        color: "text-gray-600",
        bgColor: "bg-gray-100",
        borderColor: "border-gray-200",
        description: "Votre commande a été reçue et est en attente de paiement",
        progressValue: 10
    },
    paid: {
        label: "Payée",
        color: "text-blue-600",
        bgColor: "bg-blue-100",
        borderColor: "border-blue-200",
        description: "Paiement confirmé, préparation en cours",
        progressValue: 25
    },
    inProgress: {
        label: "En préparation",
        color: "text-orange-600",
        bgColor: "bg-orange-100",
        borderColor: "border-orange-200",
        description: "Votre commande est en cours de préparation",
        progressValue: 50
    },
    outForDelivery: {
        label: "En livraison",
        color: "text-purple-600",
        bgColor: "bg-purple-100",
        borderColor: "border-purple-200",
        description: "Votre commande est en route",
        progressValue: 75
    },
    delivered: {
        label: "Livrée",
        color: "text-green-600",
        bgColor: "bg-green-100",
        borderColor: "border-green-200",
        description: "Commande livrée avec succès",
        progressValue: 100
    }
};

/**
 * Props pour le composant OrderStatusBadge
 */
type OrderStatusBadgeProps = {
    status: OrderStatus;
    size?: "sm" | "md" | "lg";
    showDescription?: boolean;
    className?: string;
};

/**
 * Composant réutilisable pour afficher le statut d'une commande
 * 
 * Fonctionnalités:
 * - Badge coloré selon le statut
 * - Tailles multiples (sm, md, lg)
 * - Description optionnelle
 * - Cohérence visuelle dans toute l'application
 */
const OrderStatusBadge = ({ 
    status, 
    size = "md", 
    showDescription = false, 
    className = "" 
}: OrderStatusBadgeProps) => {
    
    const config = ORDER_STATUS_CONFIG[status] || ORDER_STATUS_CONFIG.placed;
    
    /**
     * Détermine les classes CSS selon la taille
     */
    const getSizeClasses = () => {
        switch (size) {
            case "sm":
                return "px-2 py-1 text-xs";
            case "lg":
                return "px-4 py-2 text-base";
            default: // md
                return "px-3 py-1.5 text-sm";
        }
    };

    /**
     * Détermine si le statut indique une commande terminée
     */
    const isCompleted = status === "delivered";

    return (
        <div className={`inline-flex items-center space-x-2 ${className}`}>
            {/* Badge principal */}
            <span className={`
                inline-flex items-center rounded-full font-medium
                ${config.color} ${config.bgColor} ${config.borderColor}
                ${getSizeClasses()}
                border transition-all duration-200
                ${isCompleted ? 'shadow-sm' : ''}
            `}>
                {/* Indicateur visuel pour les commandes terminées */}
                {isCompleted && (
                    <svg 
                        className="w-3 h-3 mr-1 fill-current" 
                        viewBox="0 0 20 20"
                        aria-hidden="true"
                    >
                        <path 
                            fillRule="evenodd" 
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" 
                            clipRule="evenodd" 
                        />
                    </svg>
                )}
                {config.label}
            </span>

            {/* Description optionnelle */}
            {showDescription && (
                <span className="text-sm text-gray-600">
                    {config.description}
                </span>
            )}
        </div>
    );
};

/**
 * Composant pour afficher la barre de progression du statut
 */
type OrderProgressBarProps = {
    status: OrderStatus;
    className?: string;
};

export const OrderProgressBar = ({ status, className = "" }: OrderProgressBarProps) => {
    const config = ORDER_STATUS_CONFIG[status] || ORDER_STATUS_CONFIG.placed;
    
    /**
     * Détermine la couleur de la barre de progression
     */
    const getProgressColor = () => {
        if (config.progressValue === 100) {
            return "bg-gradient-to-r from-green-500 to-green-600";
        } else if (config.progressValue >= 75) {
            return "bg-gradient-to-r from-purple-500 to-purple-600";
        } else if (config.progressValue >= 50) {
            return "bg-gradient-to-r from-orange-500 to-orange-600";
        } else if (config.progressValue >= 25) {
            return "bg-gradient-to-r from-blue-500 to-blue-600";
        } else {
            return "bg-gradient-to-r from-gray-400 to-gray-500";
        }
    };

    return (
        <div className={`w-full ${className}`}>
            {/* Container de la barre de progression */}
            <div className="w-full bg-gray-200 rounded-full h-3 shadow-inner">
                {/* Barre de progression remplie */}
                <div 
                    className={`h-3 rounded-full transition-all duration-700 ease-out ${getProgressColor()}`}
                    style={{ width: `${config.progressValue}%` }}
                />
            </div>
            
            {/* Informations sous la barre */}
            <div className="flex justify-between items-center mt-2">
                <span className="text-xs text-gray-600">
                    Progression: {config.progressValue}%
                </span>
                <span className="text-xs font-medium text-gray-800">
                    {config.label}
                </span>
            </div>
        </div>
    );
};

export default OrderStatusBadge;