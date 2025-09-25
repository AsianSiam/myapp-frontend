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
    placed: { 
        label: "Placée", 
        color: "bg-yellow-100 text-yellow-800 border-yellow-200",
        icon: Package 
    },
    paid: { 
        label: "Payée", 
        color: "bg-blue-100 text-blue-800 border-blue-200",
        icon: CreditCard
    },
    inProgress: { 
        label: "En préparation", 
        color: "bg-orange-100 text-orange-800 border-orange-200",
        icon: Clock
    },
    outForDelivery: { 
        label: "En livraison", 
        color: "bg-purple-100 text-purple-800 border-purple-200",
        icon: MapPin
    },
    delivered: { 
        label: "Livrée", 
        color: "bg-green-100 text-green-800 border-green-200",
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
        <Card className="w-full hover:shadow-md transition-shadow">
            <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                        <StatusIcon className="w-5 h-5 text-gray-600" />
                        <CardTitle className="text-lg">
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
                                className="text-blue-600 hover:text-blue-800"
                            >
                                {expanded ? "Réduire" : "Voir détails"}
                            </Button>
                        )}
                    </div>
                </div>
                
                <div className="flex items-center justify-between text-sm text-gray-600 mt-2">
                    <div className="flex items-center space-x-1">
                        <Calendar className="w-4 h-4" />
                        <span>{formatDate(order.createdAt)}</span>
                    </div>
                    <div className="font-semibold text-lg text-gray-900">
                        {formatPrice(order.totalAmount)}
                    </div>
                </div>
            </CardHeader>

            <CardContent className="pt-0">
                {/* Informations client - toujours visibles */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div className="space-y-2">
                        <div className="flex items-center space-x-2 text-sm">
                            <User className="w-4 h-4 text-gray-500" />
                            <span className="font-medium">{order.deliveryDetails.name}</span>
                        </div>
                        
                        <div className="flex items-center space-x-2 text-sm text-gray-600">
                            <Phone className="w-4 h-4 text-gray-500" />
                            <span>{order.deliveryDetails.zipCode || "N/A"}</span>
                        </div>
                    </div>
                    
                    <div className="space-y-2">
                        <div className="text-sm">
                            <span className="font-medium">{getTotalItems()} article(s)</span>
                        </div>
                        
                        <div className="text-sm text-gray-600">
                            {order.deliveryDetails.email}
                        </div>
                    </div>
                </div>

                {/* Gestion du statut */}
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg mb-4">
                    <span className="text-sm font-medium text-gray-700">Statut de la commande :</span>
                    <Select 
                        value={selectedStatus}
                        onValueChange={handleStatusChange}
                        disabled={isUpdatingStatus}
                    >
                        <SelectTrigger className="w-[180px]">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="placed">Placée</SelectItem>
                            <SelectItem value="paid">Payée</SelectItem>
                            <SelectItem value="inProgress">En préparation</SelectItem>
                            <SelectItem value="outForDelivery">En livraison</SelectItem>
                            <SelectItem value="delivered">Livrée</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                {/* Détails étendus */}
                {expanded && (
                    <div className="space-y-4 mt-4">
                        <Separator />
                        
                        {/* Adresse de livraison */}
                        <div className="p-3 bg-blue-50 rounded-lg">
                            <div className="flex items-center space-x-2 mb-2">
                                <MapPin className="w-4 h-4 text-blue-600" />
                                <span className="font-medium text-blue-900">Adresse de livraison</span>
                            </div>
                            <div className="text-sm space-y-1 text-blue-800">
                                <p>{order.deliveryDetails.addressLine1}</p>
                                <p>{order.deliveryDetails.zipCode} {order.deliveryDetails.city}</p>
                                <p>{order.deliveryDetails.state} - {order.deliveryDetails.country}</p>
                            </div>
                        </div>

                        {/* Articles commandés */}
                        <div>
                            <h4 className="font-medium text-gray-900 mb-3">Articles commandés</h4>
                            <div className="space-y-2">
                                {order.cartItems.map((item, index) => (
                                    <div key={index} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                                        <div>
                                            <span className="font-medium">{item.name}</span>
                                            <span className="text-gray-600 text-sm ml-2">x{item.quantity}</span>
                                        </div>
                                        <span className="font-medium">
                                            {formatPrice(item.price * item.quantity)}
                                        </span>
                                    </div>
                                ))}
                                
                                <Separator className="my-2" />
                                
                                {/* Total avec frais de livraison */}
                                <div className="flex justify-between items-center p-2 bg-gray-100 rounded font-medium">
                                    <span>Sous-total</span>
                                    <span>{formatPrice(order.totalAmount - (order.deliveryPrice || 500))}</span>
                                </div>
                                
                                <div className="flex justify-between items-center p-2 text-sm text-gray-600">
                                    <span>Frais de livraison</span>
                                    <span>{formatPrice(order.deliveryPrice || 500)}</span>
                                </div>
                                
                                <div className="flex justify-between items-center p-2 bg-gray-900 text-white rounded font-bold">
                                    <span>Total</span>
                                    <span>{formatPrice(order.totalAmount)}</span>
                                </div>
                            </div>
                        </div>

                        {/* Informations de paiement */}
                        {order.paymentIntentId && (
                            <div className="p-3 bg-green-50 rounded-lg">
                                <div className="flex items-center space-x-2 mb-2">
                                    <CreditCard className="w-4 h-4 text-green-600" />
                                    <span className="font-medium text-green-900">Paiement confirmé</span>
                                </div>
                                <p className="text-sm text-green-800 font-mono">
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