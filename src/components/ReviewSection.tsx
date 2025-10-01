import { useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { Star } from "lucide-react";
import { toast } from "sonner";
import * as ReviewApi from "@/api/ReviewApi";
import type { Review } from "@/api/ReviewApi";

// Composant pour les étoiles réutilisable
const StarRating = ({ 
    rating, 
    interactive = false, 
    onRate 
}: { 
    rating: number; 
    interactive?: boolean; 
    onRate?: (rating: number) => void; 
}) => (
    <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
            <Star
                key={star}
                className={`h-5 w-5 ${
                    star <= rating 
                        ? "text-yellow-400 fill-yellow-400" 
                        : "text-app-muted-foreground"
                } ${interactive ? "cursor-pointer hover:text-yellow-400" : ""}`}
                onClick={() => interactive && onRate?.(star)}
            />
        ))}
    </div>
);

interface ReviewSectionProps {
    articleId: string;
    className?: string;
    showTitle?: boolean;
    compact?: boolean;
}

export default function ReviewSection({ 
    articleId, 
    className = "", 
    showTitle = true, 
    compact = false 
}: ReviewSectionProps) {
    const { isAuthenticated, loginWithRedirect } = useAuth0();
    const [userRating, setUserRating] = useState(0);
    const [userComment, setUserComment] = useState("");
    const [isSubmittingReview, setIsSubmittingReview] = useState(false);

    // Queries
    const { reviews, isLoading: reviewsLoading } = ReviewApi.useGetArticleReviews(articleId);
    const { purchaseData, isLoading: checkingPurchase } = ReviewApi.useCheckUserPurchase(articleId);
    const { addReview } = ReviewApi.useAddReview();

    const canReview = isAuthenticated && (purchaseData?.hasPurchased || false);

    const handleSubmitReview = async () => {
        if (!isAuthenticated) {
            loginWithRedirect();
            return;
        }

        if (userRating === 0) {
            toast.error("Veuillez sélectionner une note");
            return;
        }

        if (userComment.trim().length < 10) {
            toast.error("Votre commentaire doit contenir au moins 10 caractères");
            return;
        }

        setIsSubmittingReview(true);
        try {
            await addReview({
                articleId: articleId,
                reviewData: {
                    rating: userRating,
                    comment: userComment.trim()
                }
            });
            
            toast.success("Votre avis a été publié avec succès!");
            setUserRating(0);
            setUserComment("");
        } catch (error: any) {
            toast.error(error.message || "Erreur lors de la publication de l'avis");
        } finally {
            setIsSubmittingReview(false);
        }
    };

    const averageRating = reviews.length > 0 
        ? reviews.reduce((sum: number, review: Review) => sum + review.rating, 0) / reviews.length
        : 0;

    // Version compacte pour affichage dans des cartes ou sections réduites
    if (compact) {
        return (
            <div className={`space-y-3 ${className}`}>
                {/* Note moyenne compacte */}
                {reviews.length > 0 && (
                    <div className="flex items-center gap-2">
                        <StarRating rating={Math.round(averageRating)} />
                        <span className="text-sm font-medium text-app-primary">
                            {averageRating.toFixed(1)}
                        </span>
                        <span className="text-sm text-app-secondary">
                            ({reviews.length} avis)
                        </span>
                    </div>
                )}

                {/* Aperçu des derniers avis */}
                {reviews.length > 0 && (
                    <div className="space-y-2">
                        {reviews.slice(0, 2).map((review: Review) => (
                            <div key={review._id} className="p-3 bg-app-muted rounded-lg">
                                <div className="flex items-center gap-2 mb-1">
                                    <StarRating rating={review.rating} />
                                    <span className="text-sm font-medium text-app-primary">
                                        {review.userName}
                                    </span>
                                </div>
                                <p className="text-sm text-app-secondary line-clamp-2">
                                    {review.comment}
                                </p>
                            </div>
                        ))}
                    </div>
                )}

                {reviews.length === 0 && (
                    <div className="text-center py-4">
                        <p className="text-sm text-app-secondary">Aucun avis pour le moment</p>
                    </div>
                )}
            </div>
        );
    }

    // Version complète
    return (
        <div className={`space-y-6 ${className}`}>
            {/* Titre avec statistiques */}
            {showTitle && (
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-xl font-bold text-app-primary">
                            Avis clients ({reviews.length})
                        </h2>
                        {reviews.length > 0 && (
                            <div className="flex items-center gap-3 mt-2">
                                <StarRating rating={Math.round(averageRating)} />
                                <span className="text-lg font-semibold text-app-primary">
                                    {averageRating.toFixed(1)} / 5
                                </span>
                                <span className="text-app-secondary">
                                    sur {reviews.length} avis
                                </span>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Formulaire d'avis (si utilisateur connecté et a acheté) */}
            {isAuthenticated && canReview && !checkingPurchase && (
                <Card className="content-card border-2 border-blue-200 dark:border-blue-800">
                    <CardHeader>
                        <CardTitle className="text-app-primary">
                            Donnez votre avis
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div>
                            <label className="text-sm font-medium mb-2 block text-app-primary">
                                Note
                            </label>
                            <StarRating 
                                rating={userRating} 
                                interactive 
                                onRate={setUserRating} 
                            />
                        </div>
                        
                        <div>
                            <label className="text-sm font-medium mb-2 block text-app-primary">
                                Commentaire
                            </label>
                            <Textarea
                                placeholder="Partagez votre expérience avec ce produit..."
                                value={userComment}
                                onChange={(e) => setUserComment(e.target.value)}
                                rows={4}
                                className="rounded-xl"
                            />
                            <p className="text-xs text-app-secondary mt-1">
                                Minimum 10 caractères ({userComment.length}/1000)
                            </p>
                        </div>
                        
                        <Button 
                            onClick={handleSubmitReview}
                            disabled={isSubmittingReview || userRating === 0 || userComment.trim().length < 10}
                            className="rounded-full"
                        >
                            {isSubmittingReview ? "Publication..." : "Publier l'avis"}
                        </Button>
                    </CardContent>
                </Card>
            )}

            {/* Message si utilisateur non connecté */}
            {!isAuthenticated && (
                <Card className="content-card border-2 border-amber-200 dark:border-amber-800">
                    <CardContent className="pt-6">
                        <div className="text-center">
                            <p className="text-amber-800 dark:text-amber-400 mb-4">
                                Connectez-vous pour donner votre avis sur ce produit
                            </p>
                            <Button 
                                onClick={() => loginWithRedirect()}
                                variant="outline"
                                className="button-outline hover-amber-accent rounded-full"
                            >
                                Se connecter
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Message si utilisateur connecté mais n'a pas acheté */}
            {isAuthenticated && !canReview && !checkingPurchase && (
                <Card className="content-card border-2 border-blue-200 dark:border-blue-800">
                    <CardContent className="pt-6">
                        <p className="text-center text-blue-800 dark:text-blue-400">
                            Vous devez acheter ce produit pour pouvoir donner votre avis
                        </p>
                    </CardContent>
                </Card>
            )}

            <Separator />

            {/* Liste des avis */}
            <div className="space-y-4">
                {reviewsLoading ? (
                    <div className="space-y-4">
                        {[1, 2, 3].map((i) => (
                            <Card key={i} className="content-card rounded-xl">
                                <CardContent className="pt-6">
                                    <div className="animate-pulse space-y-3">
                                        <div className="flex gap-2">
                                            {[1,2,3,4,5].map((j) => (
                                                <div key={j} className="h-4 w-4 bg-app-muted rounded"></div>
                                            ))}
                                        </div>
                                        <div className="h-4 bg-app-muted rounded w-1/3"></div>
                                        <div className="h-4 bg-app-muted rounded w-full"></div>
                                        <div className="h-4 bg-app-muted rounded w-2/3"></div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                ) : reviews.length > 0 ? (
                    reviews.map((review: Review) => (
                        <Card key={review._id} className="content-card rounded-xl hover:shadow-lg smooth-transition">
                            <CardContent className="pt-6">
                                <div className="flex items-start justify-between mb-4">
                                    <div>
                                        <div className="flex items-center gap-3 mb-2">
                                            <StarRating rating={review.rating} />
                                            <Badge variant="outline" className="rounded-full">
                                                {review.verified ? "Achat vérifié" : "Avis"}
                                            </Badge>
                                        </div>
                                        <div className="flex items-center gap-2 text-sm text-app-secondary">
                                            <span className="font-medium">{review.userName}</span>
                                            <span>•</span>
                                            <span>
                                                {new Date(review.createdAt).toLocaleDateString('fr-FR', {
                                                    year: 'numeric',
                                                    month: 'long',
                                                    day: 'numeric'
                                                })}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <p className="text-app-secondary leading-relaxed">{review.comment}</p>
                            </CardContent>
                        </Card>
                    ))
                ) : (
                    <Card className="content-card rounded-xl">
                        <CardContent className="pt-12 pb-12">
                            <div className="text-center">
                                <div className="w-16 h-16 bg-app-muted rounded-full flex items-center justify-center mx-auto mb-4">
                                    <Star className="h-8 w-8 text-app-muted-foreground" />
                                </div>
                                <h3 className="text-lg font-semibold text-app-primary mb-2">
                                    Aucun avis pour le moment
                                </h3>
                                <p className="text-app-secondary">
                                    Soyez le premier à partager votre expérience avec ce produit !
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                )}
            </div>
        </div>
    );
}

// Export du composant StarRating pour réutilisation
export { StarRating };