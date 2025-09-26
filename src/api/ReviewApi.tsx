import { useAuth0 } from "@auth0/auth0-react";
import { useMutation, useQuery } from "react-query";
import { toast } from "sonner";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

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

export type AddReviewRequest = {
    rating: number;
    comment: string;
};

// Hook pour obtenir tous les avis d'un article
export const useGetArticleReviews = (articleId: string) => {
    const getArticleReviewsRequest = async (): Promise<Review[]> => {
        const response = await fetch(`${API_BASE_URL}/api/reviews/${articleId}`);
        
        if (!response.ok) {
            throw new Error("Failed to fetch reviews");
        }
        
        return response.json();
    };

    const { data: reviews = [], isLoading, error } = useQuery(
        ["articleReviews", articleId],
        getArticleReviewsRequest,
        { enabled: !!articleId }
    );

    return { reviews, isLoading, error };
};

// Hook pour vérifier si l'utilisateur a acheté le produit
export const useCheckUserPurchase = (articleId: string) => {
    const { getAccessTokenSilently, isAuthenticated } = useAuth0();

    const checkUserPurchaseRequest = async (): Promise<{ hasPurchased: boolean }> => {
        if (!isAuthenticated) {
            return { hasPurchased: false };
        }
        
        try {
            const accessToken = await getAccessTokenSilently();
            
            const response = await fetch(`${API_BASE_URL}/api/reviews/${articleId}/check-purchase`, {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });
            
            if (!response.ok) {
                throw new Error("Failed to check purchase");
            }
            
            return response.json();
        } catch (error) {
            console.warn('Erreur lors de la vérification d\'achat:', error);
            return { hasPurchased: false };
        }
    };

    const { data: purchaseData, isLoading, error } = useQuery(
        ["checkPurchase", articleId, isAuthenticated],
        checkUserPurchaseRequest,
        { 
            enabled: !!articleId && isAuthenticated,
            // Éviter les requêtes répétées si l'utilisateur n'est pas connecté
            retry: false,
            refetchOnWindowFocus: false
        }
    );

    return { purchaseData, isLoading, error };
};

// Hook pour ajouter un avis
export const useAddReview = () => {
    const { getAccessTokenSilently, isAuthenticated } = useAuth0();

    const addReviewRequest = async ({ articleId, reviewData }: { articleId: string, reviewData: AddReviewRequest }): Promise<Review> => {
        if (!isAuthenticated) {
            throw new Error("Vous devez être connecté pour ajouter un avis");
        }
        
        const accessToken = await getAccessTokenSilently();
        
        const response = await fetch(`${API_BASE_URL}/api/reviews/${articleId}`, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${accessToken}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify(reviewData),
        });
        
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || "Failed to add review");
        }
        
        const result = await response.json();
        return result.review || result;
    };

    const { mutateAsync: addReview, isLoading, error, reset } = useMutation(
        addReviewRequest,
        {
            onSuccess: () => {
                toast.success("Votre avis a été ajouté avec succès !");
            },
            onError: (error: Error) => {
                toast.error(error.message || "Erreur lors de l'ajout de votre avis");
            }
        }
    );

    return { addReview, isLoading, error, reset };
};

// Hook pour supprimer un avis
export const useDeleteReview = () => {
    const { getAccessTokenSilently } = useAuth0();

    const deleteReviewRequest = async (reviewId: string): Promise<void> => {
        const accessToken = await getAccessTokenSilently();
        
        const response = await fetch(`${API_BASE_URL}/api/reviews/review/${reviewId}`, {
            method: "DELETE",
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });
        
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || "Failed to delete review");
        }
    };

    const { mutateAsync: deleteReview, isLoading, error } = useMutation(
        deleteReviewRequest,
        {
            onSuccess: () => {
                toast.success("Avis supprimé avec succès");
            },
            onError: (error: Error) => {
                toast.error(error.message || "Erreur lors de la suppression");
            }
        }
    );

    return { deleteReview, isLoading, error };
};

// Fonctions utilitaires pour compatibilité (deprecated - utiliser les hooks)
export const getArticleReviews = async (articleId: string): Promise<Review[]> => {
    const response = await fetch(`${API_BASE_URL}/api/reviews/${articleId}`);
    
    if (!response.ok) {
        throw new Error("Failed to fetch reviews");
    }
    
    return response.json();
};