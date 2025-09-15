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

export type RestaurantSearchResponse = {
    data: Restaurant[];
    pagination: {
        total: number;
        page: number;
        pages: number;
    };
};