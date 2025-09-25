import type { Order, OrderStatus } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Separator } from "@radix-ui/react-separator";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { ORDER_STATUS } from "@/config/order-status-config";
import { useUpdateMyOrderStatus } from "@/api/MyArticleApi";
import { useEffect, useState } from "react";

type Props = {
    order: Order;
};  

const OrderItemCard = ({ order }: Props) => {
    const { updateOrderStatus, isLoading } = useUpdateMyOrderStatus();
    const [status, setStatus] = useState<OrderStatus>(order.status);

    useEffect(() => {
        setStatus(order.status);
    }, [order.status]);

    const handleStatusChange = async(newStatus: OrderStatus) => {
        await updateOrderStatus({ orderId: order._id, status: newStatus });
        setStatus(newStatus);
    }

    const getTime = () => {
        const orderDateTime = new Date(order.createdAt);
        return orderDateTime.toLocaleString();
    }

    return (
        <Card>
            <CardHeader>
                <h4 className="text-lg font-semibold">Commande {order._id}</h4><br />
               <CardTitle className="grid md:grid-cols-4 justify-between mb-3">                
                    <div>
                        <span>Client:</span><br />
                        <span></span><br />
                        <span className="ml-2 font-normal">{order.deliveryDetails.name}</span>
                    </div>
                    <div>
                        <span>Adresse de livraison:</span><br />
                        <span></span><br />
                        <span className="ml-2 font-normal">
                            {order.deliveryDetails.addressLine1}<br />
                            {order.deliveryDetails.zipCode} {order.deliveryDetails.city}<br />
                            {order.deliveryDetails.state}, {order.deliveryDetails.country}
                        </span>
                    </div>
                    <div>
                        <span>Commande le:</span><br />
                        <span></span><br />
                        <span className="ml-2 font-normal">{getTime()}</span>
                    </div>
                    <div className="flex flex-col space-y-1.5">
                    <Label htmlFor="status">Statut de la commande:</Label><br />
                    <Select onValueChange={(value) => handleStatusChange(value as OrderStatus)} disabled={isLoading} defaultValue={status}>
                        <SelectTrigger id="status">
                            <SelectValue placeholder="Statut" />
                        </SelectTrigger>
                        <SelectContent position="popper" className="bg-white w-100%">
                            {ORDER_STATUS.map((status) => (
                                <SelectItem key={status.value} value={status.value}>
                                    {status.label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
               </CardTitle>
               <Separator />
            </CardHeader>
            <CardContent className="flex flex-col gap-6">                
                <>                
                <div className="grid grid-cols-4 gap-4 py-2 font-bold border-b">
                    <span>Article</span>
                    <span>Quantité</span>
                    <span>Prix unitaire</span>
                    <span>Total</span>
                </div>
                
                {order.cartItems.map((item) => {
                    const totalPrice = item.price * item.quantity;
                    return (
                        <div className="grid grid-cols-4 gap-4 py-2" key={item.menuItemId}>
                            <span className="font-semibold">{item.name}</span>
                            <span>{item.quantity}</span>
                            <span>{(item.price / 100).toFixed(2)} CHF</span>
                            <span className="font-semibold">{(totalPrice / 100).toFixed(2)} CHF</span>
                        </div>
                    );
                })}
                <div className="font-semibold grid grid-cols-4 gap-4 py-2">
                    <span>Frais de livraison:</span>
                    <span></span>
                    <span></span>
                    <span>{(order.deliveryPrice / 100).toFixed(2)} CHF</span>                   
                </div>
                <div className="font-bold grid grid-cols-4 gap-4 py-2 mt-4 pt-4 border-t">
                    <span>Total: </span>
                    <span></span>
                    <span></span>
                    <span>{(order.totalAmount / 100).toFixed(2)} CHF</span>
                </div>
                </>
            </CardContent>
        </Card>
    );
};

export default OrderItemCard;