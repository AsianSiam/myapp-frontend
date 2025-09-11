export type User = {
_id: string;
email: string;
name: string;
adresseLine1: string;
city: string;
state: string;
country: string;
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
state: string;
country: string;
cuisines: string[];
imageUrl: string;
deliveryPrice: number; 
estimatedDeliveryTime: number;
menuItems: MenuItem[];
lastUpdated: string;

}