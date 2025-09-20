export type User = {
_id: string;
email: string;
name: string;
addressLine1: string;
city: string;
state: string;
country: string;
zipCode: number;
phoneNumber: number;
}
export type MenuItem = {
_id: string;
name: string;
price: number;
};

export type Restaurant = {
_id: string;
user: string;
restaurantName: string;
addressLine1: string;
city: string;
zipCode: number;
state: string;
country: string;
phoneNumber: number;
emailRestaurant: string;
website: string;
cuisines: string[];
imageUrl: string;
deliveryPrice: number; 
estimatedDeliveryTime: number;
menuItems: MenuItem[];
lastUpdated: string;
};


export type CheckoutSessionRequest = {
    cartItems: {
        menuItemId: string;
        name: string;
        quantity: string;
    }[];
    deliveryDetails: {
        email: string;
        name: string;
        addressLine1: string;
        city: string;
        zipCode: string;
        state: string;
        country: string;
    };
    restaurantId: string;
};

export type OrderStatus = "placed" | "paid" | "outForDelivery" | "delivered";

export type Order = {
    _id: string;
    user: User;
    restaurant: Restaurant;
    cartItems: { menuItemId: string, quantity: number, name: string, price: number }[];
    deliveryDetails: {
        name: string;
        addressLine1: string;
        city: string;
        zipCode: string;
        state: string;
        country: string;
        email: string;
    };
    totalAmount: number;
    status: OrderStatus;
    createdAt: string;
    restaurantId: string;
    updatedAt: string;
    paymentIntentId: string;
    clientSecret: string;
    stripeSessionId: string;
    deliveryAddress: string;
    deliveryTime: string;
    specialInstructions?: string;
};

export type RestaurantSearchResponse = {
    data: Restaurant[];
    pagination: {
        total: number;
        page: number;
        pages: number;
    };
};