import type { Restaurant as RestaurantType} from "@/types";
import type { CartItem } from "../pages/DetailPage";
import { CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Separator } from "./ui/separator";
import { Trash } from "lucide-react";


type Props = {
    restaurant: RestaurantType;
    cartItems: CartItem[];
    removeFromCart: (cartItem: CartItem) => void;
};

const OrderSummary = ({ restaurant, cartItems, removeFromCart }: Props) => {

    const getTotalCost = () => {
        const totalInCent = cartItems.reduce(
            (total, item) => total + (item.price * item.quantity), 0);

        const totalWithDelivery = totalInCent + restaurant.deliveryPrice;

        return (totalWithDelivery / 100).toFixed(2);
    }

    return (
        <>
        <CardHeader>
            <CardTitle className="text-2xl font-bold tracking-tight flex justify-between">
                <span>Aperçu du panier:</span>
            </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col md:flex-col gap-4">
            {cartItems.map((item) => (
                <div className="flex justify-between" key={item._id}>
                    <span>
                        <Badge variant="outline" className="mr-2">
                            {item.quantity}
                        </Badge>
                    {item.name}
                    </span>
                    <span className="flex items-center gap-1">
                        <Trash className="cursor-pointer" size={20} onClick={() => removeFromCart(item)} />
                        {((item.price * item.quantity) / 100).toFixed(2)} CHF
                    </span>
                </div>
            ))}
            <Separator />
            <div className="flex justify-between">
                <span>Frais de livraison: </span>
                <span>
                    {((restaurant.deliveryPrice) / 100).toFixed(2)} CHF
                </span>
            </div>
            <Separator />
            <div className="flex justify-between font-bold">
                <span>Total</span>
                <span>{getTotalCost()} CHF</span>
            </div>
        </CardContent>
        </>
    );
}

export default OrderSummary;