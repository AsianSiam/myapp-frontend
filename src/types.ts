export type User = {
_id: string;
email: string;
name: string;
firstname: string;
nickname: string;
birthdate: string;
addressLine1: string;
city: string;
state: string;
country: string;
zipCode: number;
phoneNumber: number;
indicatifTel: string;
language: string;
}

export type CheckoutSessionRequest = {
    cartItems: {
        articleId: string;
        name: string;
        quantity: string;
        price: number;
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
    articleShopId: string;
};

export type CartItem = {
    articleId: string;
    name: string;
    quantity: number;
    price: number;
};

export type OrderStatus = "en attente" | "payé" | "envoyé" | "livré" | "annulé";

export type Order = {
    _id: string;
    user: User;
    cartItems: CartItem[];
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
    deliveryPrice: number;
    status: OrderStatus;
    createdAt: string;
    paymentIntentId?: string;
    clientSecret?: string;
    stripeSessionId?: string;
};

export type ArticleShop = {
    _id: string;
    name: string;
    description: string;
    category: string;
    price: number;
    stock: number;
    imageUrl: string;
    images: string[]; // Nouvelles images multiples
    rating: number;
    reviewCount: number;
    lastUpdate: string;
};

export type ArticleShopSearchResponse = {
    data: ArticleShop[];
    pagination: {
        total: number;
        page: number;
        pages: number;
    };
};

export type Review = {
    _id: string;
    user: string;
    userName: string;
    articleId: string;
    rating: number;
    comment: string;
    verified: boolean;
    createdAt: string;
};
