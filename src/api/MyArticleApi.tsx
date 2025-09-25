import type { ArticleShop } from "@/types";
import { useAuth0 } from "@auth0/auth0-react";
import { useMutation, useQuery } from "react-query";
import { toast } from "sonner";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const useGetMyArticles = () => {
    const { getAccessTokenSilently } = useAuth0();

    const getMyArticlesRequest = async (): Promise<ArticleShop[]> => {
        const accessToken = await getAccessTokenSilently();

        const response = await fetch(`${API_BASE_URL}/api/my/article`, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });

        if (!response.ok) {
            throw new Error("Failed to get articles");
        }

        return response.json();
    };

    const { data: myArticles, isLoading } = useQuery(
        "fetchMyArticles",
        getMyArticlesRequest
    );

    return { myArticles, isLoading };
};

export const useCreateMyArticle = () => {
    const { getAccessTokenSilently } = useAuth0();

    const createMyArticleRequest = async (
        articleFormData: FormData
    ): Promise<ArticleShop> => {
        const accessToken = await getAccessTokenSilently();

        const response = await fetch(`${API_BASE_URL}/api/my/article`, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
            body: articleFormData,
        });

        if (!response.ok) {
            throw new Error("Failed to create article");
        }

        return response.json();
    };

    const {
        mutate: createArticle,
        isLoading,
        isSuccess,
        error,
    } = useMutation(createMyArticleRequest);

    if (isSuccess) {
        toast.success("Article créé !");
    }

    if (error) {
        toast.error("Impossible de sauvegarder l'article");
    }

    return { createArticle, isLoading };
};

export const useUpdateMyArticle = () => {
    const { getAccessTokenSilently } = useAuth0();

    const updateMyArticleRequest = async (
        articleFormData: FormData
    ): Promise<ArticleShop> => {
        const accessToken = await getAccessTokenSilently();

        const response = await fetch(`${API_BASE_URL}/api/my/article`, {
            method: "PUT",
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
            body: articleFormData,
        });

        if (!response.ok) {
            throw new Error("Failed to update article");
        }

        return response.json();
    };

    const {
        mutate: updateArticle,
        isLoading,
        isSuccess,
        error,
    } = useMutation(updateMyArticleRequest);

    if (isSuccess) {
        toast.success("Article mis à jour !");
    }

    if (error) {
        toast.error("Impossible de sauvegarder l'article");
    }

    return { updateArticle, isLoading };
};

export const useGetMyOrders = () => {
    const { getAccessTokenSilently } = useAuth0();

    const getMyOrdersRequest = async () => {
        const accessToken = await getAccessTokenSilently();

        const response = await fetch(`${API_BASE_URL}/api/my/article/orders`, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });

        if (!response.ok) {
            throw new Error("Failed to get orders");
        }

        return response.json();
    };

    const { data: orders, isLoading } = useQuery(
        "fetchMyOrders",
        getMyOrdersRequest
    );

    return { orders, isLoading };
};

type UpdateOrderStatusRequest = {
    orderId: string;
    status: string;
};

export const useUpdateMyOrderStatus = () => {
    const { getAccessTokenSilently } = useAuth0();

    const updateOrderStatusRequest = async (updateStatusOrderRequest: UpdateOrderStatusRequest) => {
        const accessToken = await getAccessTokenSilently();

        const response = await fetch(`${API_BASE_URL}/api/my/article/order/${updateStatusOrderRequest.orderId}/status`, {
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