import { useParams } from "react-router-dom";
import { useGetRestaurant } from "../api/RestaurantApi";
import { AspectRatio } from "@radix-ui/react-aspect-ratio";
import RestaurantInfo from "../components/RestaurantInfo";
import MenuItem from "../components/MenuItem";
import { useState } from "react";
import { Card, CardFooter } from "@/components/ui/card";
import OrderSummary from "../components/OrderSummary";
import type { MenuItem as MenuItemType } from "../types";
import CheckoutButton from "../components/CheckoutButton";
import type { UserFormData } from "@/forms/user-profile-form/UserProfileForm";
import { useCreateCheckoutSession } from "@/api/OrderApi";

export type CartItem = {
    _id: string;
    quantity: number;
    name: string;
    price: number;
};

const DetailPage = () => {
    const restaurantId = useParams().restaurantId;
    const { restaurant, isLoading } = useGetRestaurant(restaurantId!);
    const { createCheckoutSession, isLoading: isCheckoutLoading } = useCreateCheckoutSession();

    const [cartItems, setCartItems] = useState<CartItem[]>(() => {
        const storedCartItems = sessionStorage.getItem(`cartItems-${restaurantId}`);
        return storedCartItems ? JSON.parse(storedCartItems) : [];
    });

    const addToCart = (menuItem: MenuItemType) => {
        setCartItems((prevCartItems) => {
            const existingCartItem = prevCartItems.find((item) => item._id === menuItem._id
            );
            let updatedCartItems;
            if (existingCartItem) {
                updatedCartItems = prevCartItems.map((cartItem) =>
                    cartItem._id === menuItem._id
                        ? { ...cartItem, quantity: cartItem.quantity + 1 }
                        : cartItem
                );
            } else {
                updatedCartItems = [
                    ...prevCartItems,
                    {
                        _id: menuItem._id,
                        quantity: 1,
                        name: menuItem.name,
                        price: menuItem.price,
                    },
                ];
            }
            sessionStorage.setItem(`cartItems-${restaurantId}`, JSON.stringify(updatedCartItems));
            return updatedCartItems;
        });
    };

    const removeFromCart = (cartItem: CartItem) => {
        setCartItems((prevCartItems) => {
            const updatedCartItems = prevCartItems
                .map((item) =>
                    item._id === cartItem._id
                        ? { ...item, quantity: item.quantity - 1 }
                        : item
                )
                .filter((item) => item.quantity > 0);
            sessionStorage.setItem(`cartItems-${restaurantId}`, JSON.stringify(updatedCartItems));
            return updatedCartItems;
        });
    };

    const onCheckout = async (userFormData: UserFormData) => {
        console.log("Checkout with user data:", userFormData);
        console.log("Cart items:", cartItems);
        if (!restaurant) {
            console.error("Restaurant data is not available");
            return;
        }
        const checkoutData = {
            cartItems: cartItems.map((cartItem) => ({
                menuItemId: cartItem._id,
                name: cartItem.name,
                quantity: cartItem.quantity.toString(),
            })),
            restaurantId: restaurant._id,
            deliveryDetails: {
                name: userFormData.name,
                email: userFormData.email as string,
                addressLine1: userFormData.addressLine1,
                city: userFormData.city,
                zipCode: userFormData.zipCode.toString(),
                state: userFormData.state,
                country: userFormData.country
            },
        };

        const data = await createCheckoutSession(checkoutData);
        window.location.href = data.url;
    };



    if (isLoading || !restaurant) {
        return "Loading...";
    }
    if (!restaurant) {
        return "Restaurant not found";
    }
    return (
        <div className="flex flex-col gap-10">
            <AspectRatio ratio={16 / 9}>
                <img
                    src={restaurant.imageUrl}
                    className="rounded-md object-cover h-full w-full"
                />
            </AspectRatio>
            <div className="grid md:grid-cols-[4fr_2fr] gap-5 md:px-32">                
                <div className="flex flex-col gap-4">
                    <RestaurantInfo restaurant={restaurant} />
                    {restaurant.menuItems.map((menuItem) => (
                        <MenuItem key={menuItem._id} menuItem={menuItem} addToCart={() => addToCart(menuItem)} />
                    ))}
                </div>
                <div>
                    <Card>
                        <OrderSummary restaurant={restaurant} cartItems={cartItems} removeFromCart={removeFromCart} />

                        <CardFooter>
                            <CheckoutButton disabled={cartItems.length === 0} onCheckout={onCheckout} isLoading={isLoading} />
                        </CardFooter>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default DetailPage;