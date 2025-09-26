import { useAuth0 } from "@auth0/auth0-react";
import { useMutation, useQuery } from "react-query";
import { toast } from "sonner";
import type { Order } from "@/types";
import type { CheckoutSessionRequest } from "@/types";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const useGetMyOrders = () => {
    const { getAccessTokenSilently } = useAuth0();

    const getMyOrdersRequest = async (): Promise<Order[]> => {
        const accessToken = await getAccessTokenSilently();
        const response = await fetch(`${API_BASE_URL}/api/order`, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });
        if (!response.ok) {
            throw new Error("Failed to fetch orders");
        }
        return response.json();
    };

    const { data: orders, isLoading } = useQuery("fetchMyOrders", getMyOrdersRequest, {refetchInterval: 5000});

    return { orders, isLoading };
};

export const useCreateCheckoutSession = () => {
    const { getAccessTokenSilently } = useAuth0();

    const createCheckoutSessionRequest = async (checkoutSessionRequest: CheckoutSessionRequest) => {
        const accessToken = await getAccessTokenSilently();
        const response = await fetch(`${API_BASE_URL}/api/order/checkout/create-checkout-session`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${accessToken}`,
            },
            body: JSON.stringify(checkoutSessionRequest),
        });
        if (!response.ok) {
            throw new Error("Failed to create checkout session");
        }
        return response.json();
    };

    const { mutateAsync: createCheckoutSession, isLoading, error, reset } = useMutation(createCheckoutSessionRequest);

        if (error) {
            toast.error(error.toString());
            reset();
        }  
        return { createCheckoutSession, isLoading };
};

type UpdateOrderStatusRequest = {
    orderId: string;
    status: string;
};

export const useUpdateOrderStatus = () => {
    const { getAccessTokenSilently } = useAuth0();

    const updateOrderStatusRequest = async (updateStatusOrderRequest: UpdateOrderStatusRequest) => {
        const accessToken = await getAccessTokenSilently();

        const response = await fetch(`${API_BASE_URL}/api/order/${updateStatusOrderRequest.orderId}/status`, {
            method: "PATCH",
            headers: {
                Authorization: `Bearer ${accessToken}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ status: updateStatusOrderRequest.status }),
        });

        if (!response.ok) {
            throw new Error("Failed to update status");
        }

        return response.json();
    };

    const { mutateAsync: updateOrderStatus, isLoading, isError, isSuccess, reset } = useMutation(updateOrderStatusRequest);

    if (isError) {
        toast.error("Impossible de mettre à jour le statut de la commande");
        reset();
    }

    if (isSuccess) {
        toast.success("Statut de la commande mis à jour !");
    }

    return { updateOrderStatus, isLoading };
};