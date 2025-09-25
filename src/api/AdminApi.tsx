import type { ArticleShop, Order } from "@/types";
import { useAuth0 } from "@auth0/auth0-react";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { toast } from "sonner";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// Hook pour vérifier si l'utilisateur est admin
export const useIsAdmin = () => {
    const { getAccessTokenSilently, user } = useAuth0();

    const checkAdminRequest = async (): Promise<{ isAdmin: boolean }> => {
        try {
            const accessToken = await getAccessTokenSilently();
            const response = await fetch(`${API_BASE_URL}/api/admin/check`, {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });

            if (response.status === 403) {
                return { isAdmin: false };
            }

            if (!response.ok) {
                throw new Error("Failed to check admin status");
            }

            return { isAdmin: true };
        } catch (error) {
            return { isAdmin: false };
        }
    };

    const { data, isLoading } = useQuery(
        ["checkAdmin", user?.sub],
        checkAdminRequest,
        { enabled: !!user }
    );

    return { isAdmin: data?.isAdmin || false, isLoading };
};

// Hook pour récupérer tous les articles (admin)
export const useGetAllArticlesAdmin = () => {
    const { getAccessTokenSilently } = useAuth0();

    const getAllArticlesRequest = async (): Promise<ArticleShop[]> => {
        const accessToken = await getAccessTokenSilently();
        const response = await fetch(`${API_BASE_URL}/api/admin/articles`, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });

        if (!response.ok) {
            throw new Error("Failed to get all articles");
        }

        return response.json();
    };

    const { data: articles, isLoading, refetch } = useQuery(
        "fetchAllArticlesAdmin",
        getAllArticlesRequest
    );

    return { articles, isLoading, refetch };
};

// Hook pour créer un nouvel article (admin)
export const useCreateArticleAdmin = () => {
    const { getAccessTokenSilently } = useAuth0();
    const queryClient = useQueryClient();

    const createArticleRequest = async (articleFormData: FormData): Promise<ArticleShop> => {
        const accessToken = await getAccessTokenSilently();
        const response = await fetch(`${API_BASE_URL}/api/admin/articles`, {
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

    const { mutate: createArticle, isLoading } = useMutation(
        createArticleRequest,
        {
            onSuccess: () => {
                queryClient.invalidateQueries("fetchAllArticlesAdmin");
                toast.success("Article créé avec succès !");
            },
            onError: () => {
                toast.error("Erreur lors de la création de l'article");
            },
        }
    );

    return { createArticle, isLoading };
};

// Hook pour mettre à jour un article (admin)
export const useUpdateArticleAdmin = () => {
    const { getAccessTokenSilently } = useAuth0();
    const queryClient = useQueryClient();

    const updateArticleRequest = async ({ 
        articleId, 
        articleFormData 
    }: { 
        articleId: string; 
        articleFormData: FormData 
    }): Promise<ArticleShop> => {
        const accessToken = await getAccessTokenSilently();
        const response = await fetch(`${API_BASE_URL}/api/admin/articles/${articleId}`, {
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

    const { mutate: updateArticle, isLoading } = useMutation(
        updateArticleRequest,
        {
            onSuccess: () => {
                queryClient.invalidateQueries("fetchAllArticlesAdmin");
                toast.success("Article mis à jour avec succès !");
            },
            onError: () => {
                toast.error("Erreur lors de la mise à jour de l'article");
            },
        }
    );

    return { updateArticle, isLoading };
};

// Hook pour supprimer un article (admin)
export const useDeleteArticleAdmin = () => {
    const { getAccessTokenSilently } = useAuth0();
    const queryClient = useQueryClient();

    const deleteArticleRequest = async (articleId: string): Promise<void> => {
        const accessToken = await getAccessTokenSilently();
        const response = await fetch(`${API_BASE_URL}/api/admin/articles/${articleId}`, {
            method: "DELETE",
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });

        if (!response.ok) {
            throw new Error("Failed to delete article");
        }
    };

    const { mutate: deleteArticle, isLoading } = useMutation(
        deleteArticleRequest,
        {
            onSuccess: () => {
                queryClient.invalidateQueries("fetchAllArticlesAdmin");
                toast.success("Article supprimé avec succès !");
            },
            onError: () => {
                toast.error("Erreur lors de la suppression de l'article");
            },
        }
    );

    return { deleteArticle, isLoading };
};

// Hook pour récupérer toutes les commandes (admin)
export const useGetAllOrdersAdmin = () => {
    const { getAccessTokenSilently } = useAuth0();

    const getAllOrdersRequest = async (): Promise<Order[]> => {
        const accessToken = await getAccessTokenSilently();
        const response = await fetch(`${API_BASE_URL}/api/admin/orders`, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });

        if (!response.ok) {
            throw new Error("Failed to get all orders");
        }

        return response.json();
    };

    const { data: orders, isLoading, refetch } = useQuery(
        "fetchAllOrdersAdmin",
        getAllOrdersRequest
    );

    return { orders, isLoading, refetch };
};

// Hook pour mettre à jour le statut d'une commande (admin)
export const useUpdateOrderStatusAdmin = () => {
    const { getAccessTokenSilently } = useAuth0();
    const queryClient = useQueryClient();

    const updateOrderStatusRequest = async ({ 
        orderId, 
        status 
    }: { 
        orderId: string; 
        status: string 
    }): Promise<Order> => {
        const accessToken = await getAccessTokenSilently();
        const response = await fetch(`${API_BASE_URL}/api/admin/orders/${orderId}/status`, {
            method: "PATCH",
            headers: {
                Authorization: `Bearer ${accessToken}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ status }),
        });

        if (!response.ok) {
            throw new Error("Failed to update order status");
        }

        return response.json();
    };

    const { mutate: updateOrderStatus, isLoading } = useMutation(
        updateOrderStatusRequest,
        {
            onSuccess: () => {
                queryClient.invalidateQueries("fetchAllOrdersAdmin");
                toast.success("Statut de la commande mis à jour !");
            },
            onError: () => {
                toast.error("Erreur lors de la mise à jour du statut");
            },
        }
    );

    return { updateOrderStatus, isLoading };
};

export const useGetAdminUsers = () => {
    const { getAccessTokenSilently } = useAuth0();
    
    return useQuery({
        queryKey: ["getAdminUsers"],
        queryFn: async () => {
            const accessToken = await getAccessTokenSilently();
            const response = await fetch(`${API_BASE_URL}/api/admin/admins`, {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    "Content-Type": "application/json",
                },
            });

            if (!response.ok) {
                throw new Error("Failed to fetch admin users");
            }

            return response.json();
        },
    });
};

export const useGetAllUsers = () => {
    const { getAccessTokenSilently } = useAuth0();
    
    return useQuery({
        queryKey: ["getAllUsers"],
        queryFn: async () => {
            const accessToken = await getAccessTokenSilently();
            const response = await fetch(`${API_BASE_URL}/api/admin/users`, {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    "Content-Type": "application/json",
                },
            });

            if (!response.ok) {
                throw new Error("Failed to fetch users");
            }

            return response.json();
        },
    });
};

export const useDeleteArticleImage = () => {
    const { getAccessTokenSilently } = useAuth0();
    const queryClient = useQueryClient();

    const deleteImageRequest = async ({ articleId, imageUrl }: { articleId: string; imageUrl: string }) => {
        const accessToken = await getAccessTokenSilently();
        const response = await fetch(`${API_BASE_URL}/api/admin/articles/${articleId}/image`, {
            method: "DELETE",
            headers: {
                Authorization: `Bearer ${accessToken}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ imageUrl }),
        });

        if (!response.ok) {
            throw new Error("Failed to delete image");
        }

        return response.json();
    };

    return useMutation(deleteImageRequest, {
        onSuccess: () => {
            queryClient.invalidateQueries(["getAllArticlesAdmin"]);
            toast.success("Image supprimée avec succès");
        },
        onError: (error: any) => {
            toast.error("Erreur lors de la suppression de l'image");
            console.error(error);
        },
    });
};