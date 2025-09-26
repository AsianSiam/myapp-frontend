import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import type { Order } from "@/types";
import { Calendar, Clock, CreditCard, MapPin, Package, Phone, User } from "lucide-react";
import { useState } from "react";

/**
 * Configuration des statuts de commande avec couleurs et libellés
 */
const ORDER_STATUS_CONFIG = {
    "en attente": { 
        label: "En attente", 
        color: "bg-yellow-100 text-yellow-800 border-yellow-200",
        icon: Clock
    },
    payé: { 
        label: "Payé", 
        color: "bg-green-100 text-green-800 border-green-200",
        icon: CreditCard
    },
    envoyé: { 
        label: "Envoyé", 
        color: "bg-blue-100 text-blue-800 border-blue-200",
        icon: Package
    },
    livré: { 
        label: "Livré", 
        color: "bg-green-100 text-green-800 border-green-200",
        icon: Package
    },
    annulé: { 
        label: "Annulé", 
        color: "bg-red-100 text-red-800 border-red-200",
        icon: Package
    }
} as const;

interface OrderCardProps {
    order: Order;
    onStatusChange: (orderId: string, newStatus: string) => void;
    isUpdatingStatus?: boolean;
    expanded?: boolean;
    onToggleExpanded?: () => void;
}

/**
 * Composant carte pour afficher et gérer une commande
 */
const OrderCard = ({ 
    order, 
    onStatusChange, 
    isUpdatingStatus = false,
    expanded = false,
    onToggleExpanded 
}: OrderCardProps) => {
    const [selectedStatus, setSelectedStatus] = useState<string>(order.status);
    
    const statusConfig = ORDER_STATUS_CONFIG[order.status as keyof typeof ORDER_STATUS_CONFIG] || {
        label: order.status,
        color: "bg-gray-100 text-gray-800 border-gray-200",
        icon: Package
    };

    const StatusIcon = statusConfig.icon;

    const handleStatusChange = (newStatus: string) => {
        setSelectedStatus(newStatus);
        onStatusChange(order._id, newStatus);
    };

    const formatPrice = (priceInCents: number) => {
        return `CHF ${(priceInCents / 100).toFixed(2)}`;
    };

    const formatDate = (date: string | Date) => {
        return new Date(date).toLocaleString('fr-CH', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getTotalItems = () => {
        return order.cartItems.reduce((total, item) => total + item.quantity, 0);
    };

    return (
        <Card className="w-full hover:shadow-md transition-shadow modern-black-card border-0">
            <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                        <StatusIcon className="w-5 h-5 text-app-secondary" />
                        <CardTitle className="text-lg text-app-primary">
                            Commande #{order._id.slice(-8).toUpperCase()}
                        </CardTitle>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                        <Badge 
                            variant="outline" 
                            className={`${statusConfig.color} font-medium`}
                        >
                            {statusConfig.label}
                        </Badge>
                        
                        {onToggleExpanded && (
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={onToggleExpanded}
                                className="text-app-primary hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                            >
                                {expanded ? "Réduire" : "Voir détails"}
                            </Button>
                        )}
                    </div>
                </div>
                
                <div className="flex items-center justify-between text-sm text-app-secondary mt-2">
                    <div className="flex items-center space-x-1">
                        <Calendar className="w-4 h-4" />
                        <span>{formatDate(order.createdAt)}</span>
                    </div>
                    <div className="font-semibold text-lg text-app-primary">
                        {formatPrice(order.totalAmount)}
                    </div>
                </div>
            </CardHeader>

            <CardContent className="pt-0">
                {/* Informations client - toujours visibles */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div className="space-y-2">
                        <div className="flex items-center space-x-2 text-sm">
                            <User className="w-4 h-4 text-app-tertiary" />
                            <span className="font-medium text-app-primary">
                                {order.user ? `${order.user.firstname} ${order.user.name}` : order.deliveryDetails.name}
                            </span>
                        </div>
                        
                        <div className="flex items-center space-x-2 text-sm text-app-secondary">
                            <Phone className="w-4 h-4 text-app-tertiary" />
                            <span>
                                {order.user && order.user.phoneNumber && order.user.indicatifTel 
                                    ? `${order.user.indicatifTel} ${order.user.phoneNumber}`
                                    : "Numéro non disponible"
                                }
                            </span>
                        </div>
                    </div>
                    
                    <div className="space-y-2">
                        <div className="text-sm">
                            <span className="font-medium text-app-primary">{getTotalItems()} article(s)</span>
                        </div>
                        
                        <div className="text-sm text-app-secondary">
                            {order.deliveryDetails.email}
                        </div>
                    </div>
                </div>

                {/* Gestion du statut */}
                <div className="flex items-center justify-between p-3 bg-app-surface rounded-lg mb-4">
                    <span className="text-sm font-medium text-app-primary">Statut de la commande :</span>
                    <Select 
                        value={selectedStatus}
                        onValueChange={handleStatusChange}
                        disabled={isUpdatingStatus}
                    >
                        <SelectTrigger className="w-[180px] h-8 border-0 text-app-secondary select-trigger-enhanced">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="dropdown-menu animate-fade-in">
                            <SelectItem value="en attente" className="text-app-primary select-item-enhanced">En attente</SelectItem>
                            <SelectItem value="payé" className="text-app-primary select-item-enhanced">Payé</SelectItem>
                            <SelectItem value="envoyé" className="text-app-primary select-item-enhanced">Envoyé</SelectItem>
                            <SelectItem value="livré" className="text-app-primary select-item-enhanced">Livré</SelectItem>
                            <SelectItem value="annulé" className="text-app-primary select-item-enhanced">Annulé</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                {/* Détails étendus */}
                {expanded && (
                    <div className="space-y-4 mt-4">
                        <Separator />
                        
                        {/* Adresse de livraison */}
                        <div className="p-3 modern-black-card border-0 rounded-lg hover:bg-app-surface transition-colors cursor-pointer">
                            <div className="flex items-center space-x-2 mb-2">
                                <MapPin className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                                <span className="font-medium text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300 transition-colors">Adresse de livraison</span>
                            </div>
                            <div className="text-sm space-y-1 text-app-secondary">
                                <p>{order.deliveryDetails.addressLine1}</p>
                                <p>{order.deliveryDetails.zipCode} {order.deliveryDetails.city}</p>
                                <p>{order.deliveryDetails.state} - {order.deliveryDetails.country}</p>
                            </div>
                        </div>

                        {/* Articles commandés */}
                        <div>
                            <h4 className="font-medium text-app-primary mb-3">Articles commandés</h4>
                            <div className="space-y-2">
                                {order.cartItems.map((item, index) => (
                                    <div key={index} className="flex justify-between items-center p-2 bg-app-surface rounded hover:bg-app-muted transition-colors">
                                        <div>
                                            <span className="font-medium text-app-primary">{item.name}</span>
                                            <span className="text-app-secondary text-sm ml-2">x{item.quantity}</span>
                                        </div>
                                        <span className="font-medium text-app-primary">
                                            {formatPrice(item.price * item.quantity)}
                                        </span>
                                    </div>
                                ))}
                                
                                <Separator className="my-2" />
                                
                                {/* Total avec frais de livraison */}
                                <div className="flex justify-between items-center p-2 bg-app-muted rounded font-medium text-app-primary hover:bg-app-surface transition-colors">
                                    <span>Sous-total</span>
                                    <span>{formatPrice(order.totalAmount - (order.deliveryPrice || 500))}</span>
                                </div>
                                
                                <div className="flex justify-between items-center p-2 text-sm text-app-secondary hover:text-app-primary transition-colors">
                                    <span>Frais de livraison</span>
                                    <span>{formatPrice(order.deliveryPrice || 500)}</span>
                                </div>
                                
                                <div className="flex justify-between items-center p-2 modern-black-card text-app-primary rounded font-bold border-0 hover:bg-app-surface transition-colors">
                                    <span>Total</span>
                                    <span>{formatPrice(order.totalAmount)}</span>
                                </div>
                            </div>
                        </div>

                        {/* Informations de paiement */}
                        {order.paymentIntentId && (
                            <div className="p-3 modern-black-card border-0 rounded-lg hover:bg-app-surface transition-colors cursor-pointer">
                                <div className="flex items-center space-x-2 mb-2">
                                    <CreditCard className="w-4 h-4 text-green-600 dark:text-green-400" />
                                    <span className="font-medium text-green-600 dark:text-green-400 hover:text-green-500 dark:hover:text-green-300 transition-colors">Paiement confirmé</span>
                                </div>
                                <p className="text-sm text-app-secondary font-mono hover:text-app-primary transition-colors">
                                    ID: {order.paymentIntentId.slice(-12)}
                                </p>
                            </div>
                        )}
                    </div>
                )}
            </CardContent>
        </Card>
    );
};

export default OrderCard;