import type { Order, Restaurant } from "@/types";
import { Separator } from "./ui/separator";

type Props = {
    order: Order;
    restaurant: Restaurant;
};

const OrderStatusDetail = ({ order, restaurant }: Props) => {
    return (
        <div className="space-y-5">
            <>
                <div className="text-lg font-semibold">Commande : {order._id}</div>
                <span className="text-lg font-semibold">Adresse de livraison :</span>< br />
                <span>
                    {order.deliveryDetails.name}<br />
                    {order.deliveryDetails.addressLine1}<br />
                    {order.deliveryDetails.city}  {order.deliveryDetails.zipCode}<br />
                    {order.deliveryDetails.state}  {order.deliveryDetails.country}<br />
                </span>
            </>
            <Separator />
            <>
                <span className="text-lg font-semibold">Detail de la commande:</span>
                <div className="grid grid-cols-4 gap-4 py-2 font-bold border-b">
                    <span>Article</span>
                    <span>Quantité</span>
                    <span>Prix unitaire</span>
                    <span>Total</span>
                </div>
                
                {/* Items */}
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
                    <span>{(restaurant.deliveryPrice / 100).toFixed(2)} CHF</span>                   
                </div>
                <div className="font-bold grid grid-cols-4 gap-4 py-2 mt-4 pt-4 border-t">
                    <span>Total: </span>
                    <span></span>
                    <span></span>
                    <span>{(order.totalAmount / 100).toFixed(2)} CHF</span>
                </div>
            </>
        </div>
    );
};    

export default OrderStatusDetail;