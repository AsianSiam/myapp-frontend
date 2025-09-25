import { useAuth0 } from "@auth0/auth0-react";
import { useMutation } from "react-query";
import { toast } from "sonner";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export type ArticleCheckoutSessionRequest = {
    cartItems: {
        articleId: string;
        name: string;
        quantity: number;
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
};

export const useCreateArticleCheckoutSession = () => {
    const { getAccessTokenSilently } = useAuth0();

    const createArticleCheckoutSessionRequest = async (checkoutSessionRequest: ArticleCheckoutSessionRequest) => {
        const accessToken = await getAccessTokenSilently();
        const response = await fetch(`${API_BASE_URL}/api/order/checkout/create-article-checkout-session`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${accessToken}`,
            },
            body: JSON.stringify(checkoutSessionRequest),
        });
        
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || "Erreur lors de la création de la session de paiement");
        }
        
        return response.json();
    };

    const { mutateAsync: createArticleCheckoutSession, isLoading, reset } = useMutation(
        createArticleCheckoutSessionRequest,
        {
            onError: (error: any) => {
                toast.error(error.message || "Erreur lors du paiement");
                reset();
            }
        }
    );

    return { createArticleCheckoutSession, isLoading };
};