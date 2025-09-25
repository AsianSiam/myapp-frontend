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

// Obtenir tous les avis d'un article
export const getArticleReviews = async (articleId: string): Promise<Review[]> => {
    const response = await fetch(`${API_BASE_URL}/api/reviews/${articleId}`);
    
    if (!response.ok) {
        throw new Error("Failed to fetch reviews");
    }
    
    return response.json();
};

// Vérifier si l'utilisateur a acheté le produit
export const checkUserPurchase = async (articleId: string): Promise<{ hasPurchased: boolean }> => {
    const accessToken = localStorage.getItem("accessToken");
    
    const response = await fetch(`${API_BASE_URL}/api/reviews/${articleId}/check-purchase`, {
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
    });
    
    if (!response.ok) {
        throw new Error("Failed to check purchase");
    }
    
    return response.json();
};

// Ajouter un avis
export const addReview = async (articleId: string, reviewData: AddReviewRequest): Promise<Review> => {
    const accessToken = localStorage.getItem("accessToken");
    
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
    
    return response.json();
};

// Supprimer un avis
export const deleteReview = async (reviewId: string): Promise<void> => {
    const accessToken = localStorage.getItem("accessToken");
    
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