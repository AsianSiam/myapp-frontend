import { useParams, useNavigate } from "react-router-dom";
import { useCart } from "@/contexts/CartContext";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Plus, Minus, ArrowLeft, ShoppingCart, Star, MessageCircle, Send, CreditCard, User } from "lucide-react";
import * as ArticleShopApi from "@/api/ArticleShopApi";
import * as ReviewApi from "@/api/ReviewApi";
import { useCreateArticleCheckoutSession } from "@/api/ArticleCheckoutApi";
import { useGetMyUser } from "@/api/MyUserApi";
import { useQuery, useMutation, useQueryClient } from "react-query";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useAuth0 } from "@auth0/auth0-react";
import { Textarea } from "@/components/ui/textarea";
import UserProfileForm from "@/forms/user-profile-form/UserProfileForm";
import type { UserFormData } from "@/forms/user-profile-form/UserProfileForm";

const StarRating = ({ rating, reviewCount }: { rating: number, reviewCount: number }) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < 5; i++) {
        if (i < fullStars) {
            stars.push(
                <span key={i} className="text-yellow-400 text-xl">★</span>
            );
        } else if (i === fullStars && hasHalfStar) {
            stars.push(
                <span key={i} className="text-yellow-400 text-xl">☆</span>
            );
        } else {
            stars.push(
                <span key={i} className="text-gray-300 text-xl">★</span>
            );
        }
    }

    return (
        <div className="flex items-center gap-2">
            <div className="flex">
                {stars}
            </div>
            <span className="text-lg text-gray-600">
                {rating.toFixed(1)} ({reviewCount} avis)
            </span>
        </div>
    );
};

const InteractiveStarRating = ({ rating, onRatingChange }: { rating: number, onRatingChange: (rating: number) => void }) => {
    const [hoverRating, setHoverRating] = useState(0);

    return (
        <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
                <button
                    key={star}
                    type="button"
                    className="text-2xl transition-colors hover:scale-110"
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    onClick={() => onRatingChange(star)}
                >
                    <Star 
                        className={`h-6 w-6 ${
                            star <= (hoverRating || rating)
                                ? "text-yellow-400 fill-current" 
                                : "text-gray-300"
                        }`}
                    />
                </button>
            ))}
        </div>
    );
};

const ReviewSection = ({ articleId }: { articleId: string }) => {
    const { isAuthenticated } = useAuth0();
    const [userRating, setUserRating] = useState(0);
    const [userComment, setUserComment] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const queryClient = useQueryClient();
    
    // Récupérer les avis existants
    const { data: reviews = [] } = useQuery(
        ["articleReviews", articleId],
        () => ReviewApi.getArticleReviews(articleId)
    );

    // Vérifier si l'utilisateur a acheté le produit
    const { data: purchaseData } = useQuery(
        ["checkPurchase", articleId],
        () => ReviewApi.checkUserPurchase(articleId),
        { enabled: isAuthenticated }
    );

    const hasPurchased = purchaseData?.hasPurchased || false;

    // Mutation pour ajouter un avis
    const addReviewMutation = useMutation(
        (reviewData: ReviewApi.AddReviewRequest) => ReviewApi.addReview(articleId, reviewData),
        {
            onSuccess: () => {
                toast.success("Votre avis a été ajouté avec succès !");
                setUserRating(0);
                setUserComment("");
                // Recharger les avis et les données de l'article
                queryClient.invalidateQueries(["articleReviews", articleId]);
                queryClient.invalidateQueries(["fetchArticleShop", articleId]);
            },
            onError: (error: Error) => {
                toast.error(error.message || "Erreur lors de l'ajout de votre avis");
            }
        }
    );

    const handleSubmitReview = async () => {
        if (!isAuthenticated) {
            toast.error("Vous devez être connecté pour laisser un avis");
            return;
        }

        if (!hasPurchased) {
            toast.error("Vous devez avoir acheté ce produit pour laisser un avis");
            return;
        }

        if (userRating === 0) {
            toast.error("Veuillez sélectionner une note");
            return;
        }

        if (userComment.trim().length < 10) {
            toast.error("Le commentaire doit contenir au moins 10 caractères");
            return;
        }

        setIsSubmitting(true);
        try {
            await addReviewMutation.mutateAsync({
                rating: userRating,
                comment: userComment.trim()
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="space-y-6">
            {/* Formulaire d'avis */}
            {isAuthenticated ? (
                hasPurchased ? (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                        <h4 className="font-semibold text-gray-900 mb-4 flex items-center">
                            <MessageCircle className="mr-2 h-4 w-4" />
                            Laisser un avis
                        </h4>
                        
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Votre note
                                </label>
                                <InteractiveStarRating 
                                    rating={userRating} 
                                    onRatingChange={setUserRating}
                                />
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Votre commentaire
                                </label>
                                <Textarea
                                    value={userComment}
                                    onChange={(e) => setUserComment(e.target.value)}
                                    placeholder="Partagez votre expérience avec ce produit..."
                                    rows={4}
                                    className="w-full"
                                />
                            </div>
                            
                            <Button 
                                onClick={handleSubmitReview}
                                disabled={isSubmitting || userRating === 0}
                                className="bg-blue-600 hover:bg-blue-700"
                            >
                                <Send className="mr-2 h-4 w-4" />
                                {isSubmitting ? "Envoi..." : "Publier l'avis"}
                            </Button>
                        </div>
                    </div>
                ) : (
                    <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                        <p className="text-orange-800 text-sm">
                            Vous devez avoir acheté ce produit pour pouvoir laisser un avis.
                        </p>
                    </div>
                )
            ) : (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <p className="text-blue-800 text-sm">
                        Connectez-vous pour laisser un avis sur ce produit.
                    </p>
                </div>
            )}

            {/* Liste des avis */}
            <div className="space-y-4">
                <h4 className="font-semibold text-gray-900">Avis clients ({reviews.length})</h4>
                
                {reviews.length > 0 ? (
                    reviews.map((review) => (
                        <div key={review._id} className="border border-gray-200 rounded-lg p-4">
                            <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center gap-2">
                                    <span className="font-medium text-gray-900">{review.userName}</span>
                                    {review.verified && (
                                        <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">
                                            Achat vérifié
                                        </span>
                                    )}
                                </div>
                                <span className="text-sm text-gray-500">
                                    {new Date(review.createdAt).toLocaleDateString('fr-FR')}
                                </span>
                            </div>
                            
                            <div className="flex items-center gap-2 mb-2">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <Star
                                        key={star}
                                        className={`h-4 w-4 ${
                                            star <= review.rating
                                                ? "text-yellow-400 fill-current"
                                                : "text-gray-300"
                                        }`}
                                    />
                                ))}
                                <span className="text-sm text-gray-600">({review.rating}/5)</span>
                            </div>
                            
                            <p className="text-gray-700">{review.comment}</p>
                        </div>
                    ))
                ) : (
                    <p className="text-gray-500 text-center py-8">
                        Aucun avis pour le moment. Soyez le premier à laisser un commentaire !
                    </p>
                )}
            </div>
        </div>
    );
};

const ImageCarousel = ({ images, altText }: { images: string[], altText: string }) => {
    // Si une seule image, affichage simple
    if (images.length <= 1) {
        return (
            <img
                src={images[0] || "/placeholder-image.jpg"}
                alt={altText}
                className="w-full h-[500px] object-cover rounded-lg shadow-lg"
            />
        );
    }

    // Carousel pour plusieurs images
    return (
        <Carousel className="w-full">
            <CarouselContent>
                {images.map((image, index) => (
                    <CarouselItem key={index}>
                        <div className="relative">
                            <img
                                src={image}
                                alt={`${altText} - Image ${index + 1}`}
                                className="w-full h-[500px] object-cover rounded-lg shadow-lg"
                            />
                            <div className="absolute bottom-4 left-4 bg-black bg-opacity-60 text-white px-3 py-1 rounded-full text-sm">
                                {index + 1} / {images.length}
                            </div>
                        </div>
                    </CarouselItem>
                ))}
            </CarouselContent>
            <CarouselPrevious className="left-4" />
            <CarouselNext className="right-4" />
        </Carousel>
    );
};

const ArticleDetailPage = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { addToCart, cartItems, updateQuantity, removeFromCart } = useCart();
    const [isAdding, setIsAdding] = useState(false);
    const [isCheckoutDialogOpen, setIsCheckoutDialogOpen] = useState(false);
    const { isAuthenticated, loginWithRedirect, user } = useAuth0();
    const { createArticleCheckoutSession, isLoading: isCheckoutLoading } = useCreateArticleCheckoutSession();
    const { currentUser, isLoading: isGetUserLoading } = useGetMyUser();

    const { articleShop, isLoading } = ArticleShopApi.useGetArticleShop(id || "");

    // Trouver la quantité actuelle de cet article dans le panier
    const currentCartItem = cartItems.find(item => item.article._id === id);
    const currentQuantity = currentCartItem?.quantity || 0;

    const handleAddToCart = async () => {
        if (!articleShop || articleShop.stock <= 0) {
            toast.error("Cet article n'est plus en stock");
            return;
        }

        setIsAdding(true);
        try {
            addToCart(articleShop, 1);
            toast.success(`${articleShop.name} ajouté au panier`);
        } catch (error) {
            toast.error("Erreur lors de l'ajout au panier");
        } finally {
            setIsAdding(false);
        }
    };

    const handleIncrement = () => {
        if (!articleShop || currentQuantity >= articleShop.stock) {
            toast.error("Stock insuffisant");
            return;
        }
        
        if (currentQuantity === 0) {
            handleAddToCart();
        } else {
            updateQuantity(articleShop._id, currentQuantity + 1);
        }
    };

    const handleDecrement = () => {
        if (!articleShop) return;
        
        if (currentQuantity > 1) {
            updateQuantity(articleShop._id, currentQuantity - 1);
        } else if (currentQuantity === 1) {
            removeFromCart(articleShop._id);
        }
    };

    const handleCheckout = () => {
        if (!articleShop || currentQuantity === 0) {
            toast.error("Aucun article sélectionné pour le paiement");
            return;
        }

        if (!isAuthenticated) {
            toast.info("Connexion requise pour procéder au paiement");
            loginWithRedirect();
            return;
        }
        
        // Ouvrir le dialog de checkout
        setIsCheckoutDialogOpen(true);
    };

    const onDirectCheckout = async (userFormData: UserFormData) => {
        if (!articleShop || currentQuantity === 0) {
            toast.error("Aucun article sélectionné");
            return;
        }

        try {
            const checkoutData = {
                cartItems: [{
                    articleId: articleShop._id,
                    name: articleShop.name,
                    quantity: currentQuantity,
                    price: articleShop.price,
                }],
                deliveryDetails: {
                    email: userFormData.email as string,
                    name: userFormData.name,
                    addressLine1: userFormData.addressLine1,
                    city: userFormData.city,
                    zipCode: userFormData.zipCode.toString(),
                    state: userFormData.state,
                    country: userFormData.country,
                },
            };

            toast.loading("Préparation du paiement...", { id: "direct-checkout" });
            const data = await createArticleCheckoutSession(checkoutData);
            
            // Rediriger vers Stripe Checkout
            if (data.url) {
                toast.success("Redirection vers le paiement", { id: "direct-checkout" });
                // Retirer l'article du panier local puisqu'on va le payer directement
                if (currentCartItem) {
                    removeFromCart(articleShop._id);
                }
                // Fermer le dialog
                setIsCheckoutDialogOpen(false);
                // Redirection vers Stripe
                window.location.href = data.url;
            } else {
                toast.error("Erreur lors de la création de la session de paiement", { id: "direct-checkout" });
            }
        } catch (error) {
            console.error("Erreur checkout direct:", error);
            toast.error("Erreur lors du processus de paiement", { id: "direct-checkout" });
        }
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center min-h-[400px]">
                <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    if (!articleShop) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-gray-900 mb-4">Article non trouvé</h1>
                    <p className="text-gray-600 mb-6">L'article que vous recherchez n'existe pas ou a été supprimé.</p>
                    <Button onClick={() => navigate("/shop")} className="bg-blue-600 hover:bg-blue-700">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Retour à la boutique
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            {/* Bouton retour */}
            <Button
                variant="ghost"
                onClick={() => navigate(-1)}
                className="mb-6 text-gray-600 hover:text-gray-900"
            >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Retour
            </Button>

            <div className="grid lg:grid-cols-2 gap-12">
                {/* Images avec Carousel */}
                <div className="space-y-4">
                    <ImageCarousel 
                        images={articleShop.images && articleShop.images.length > 0 ? articleShop.images : [articleShop.imageUrl]} 
                        altText={articleShop.name} 
                    />
                </div>

                {/* Détails */}
                <div className="space-y-6">
                    <div>
                        <span className="px-3 py-1 text-sm bg-green-100 text-green-800 rounded-full font-medium">
                            {articleShop.category}
                        </span>
                    </div>
                    
                    <h1 className="text-4xl font-bold text-gray-900">
                        {articleShop.name}
                    </h1>

                    <StarRating 
                        rating={articleShop.rating || 0} 
                        reviewCount={articleShop.reviewCount || 0} 
                    />

                    <p className="text-lg text-gray-700 leading-relaxed">
                        {articleShop.description}
                    </p>

                    <div className="bg-gray-50 p-6 rounded-lg">
                        <div className="flex items-center justify-between mb-4">
                            <span className="text-3xl font-bold text-gray-900">
                                CHF {(articleShop.price / 100).toFixed(2)}
                            </span>
                            <div className="text-right">
                                <div className="text-sm text-gray-500">
                                    {articleShop.stock > 0 
                                        ? `${articleShop.stock} articles en stock` 
                                        : 'Rupture de stock'
                                    }
                                </div>
                                <div className="text-xs text-gray-400 mt-1">
                                    Dernière mise à jour: {new Date(articleShop.lastUpdate).toLocaleDateString('fr-FR')}
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                {articleShop.stock <= 0 ? (
                                    <div className="flex-1 bg-gray-200 text-gray-500 px-6 py-3 rounded-lg text-center font-medium">
                                        <ShoppingCart className="inline mr-2 h-4 w-4" />
                                        Article épuisé
                                    </div>
                                ) : currentQuantity === 0 ? (
                                    <button 
                                        onClick={handleIncrement}
                                        disabled={isAdding}
                                        className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors disabled:opacity-50 flex items-center justify-center"
                                    >
                                        <ShoppingCart className="mr-2 h-4 w-4" />
                                        {isAdding ? 'Ajout en cours...' : 'Ajouter au panier'}
                                    </button>
                                ) : (
                                    <>
                                        <div className="flex items-center gap-3 bg-white border-2 border-gray-200 rounded-lg p-2">
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={handleDecrement}
                                                className="h-10 w-10 p-0 hover:bg-gray-100"
                                            >
                                                <Minus className="h-4 w-4" />
                                            </Button>
                                            <div className="text-center min-w-[3rem]">
                                                <div className="font-bold text-xl text-gray-800">{currentQuantity}</div>                                            
                                            </div>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={handleIncrement}
                                                disabled={currentQuantity >= articleShop.stock}
                                                className="h-10 w-10 p-0 hover:bg-gray-100 disabled:opacity-50"
                                            >
                                                <Plus className="h-4 w-4" />
                                            </Button>
                                        </div>
                                        <div className="text-sm text-gray-600">
                                            <div className="font-medium">Total: CHF {((articleShop.price * currentQuantity) / 100).toFixed(2)}</div>
                                        </div>
                                    </>
                                )}
                            </div>
                            
                            {/* Bouton de paiement aligné avec la fin de "stock" */}
                            {currentQuantity > 0 && (
                                <Button 
                                    onClick={handleCheckout}
                                    className="bg-blue-600 hover:bg-blue-700 text-white h-[52px] w-[140px] flex items-center justify-center gap-2"
                                >
                                    <CreditCard className="h-4 w-4" />
                                    <span className="text-sm">Payer</span>
                                </Button>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Sections Accordion */}
            <div className="mt-12">
                <Accordion type="single" collapsible className="w-full">
                    <AccordionItem value="description">
                        <AccordionTrigger className="text-xl font-semibold">
                            Description détaillée
                        </AccordionTrigger>
                        <AccordionContent>
                            <div className="prose prose-gray max-w-none">
                                <p className="text-gray-700 leading-relaxed mb-4">
                                    {articleShop.description}
                                </p>
                                <div className="bg-gray-50 p-4 rounded-lg mt-6">
                                    <h4 className="font-semibold text-gray-900 mb-2">Caractéristiques:</h4>
                                    <ul className="space-y-1 text-gray-700">
                                        <li>• <strong>Numéro d'article:</strong> <code className="bg-gray-200 px-2 py-1 rounded text-xs font-mono">{articleShop._id}</code></li>
                                        <li>• Catégorie: {articleShop.category}</li>
                                        <li>• Prix: CHF {(articleShop.price / 100).toFixed(2)}</li>
                                        <li>• Stock disponible: {articleShop.stock} unités</li>
                                        <li>• Note moyenne: {(articleShop.rating || 0).toFixed(1)}/5 ({articleShop.reviewCount || 0} avis)</li>
                                        <li>• Dernière mise à jour: {new Date(articleShop.lastUpdate).toLocaleDateString('fr-FR')}</li>
                                    </ul>
                                </div>
                            </div>
                        </AccordionContent>
                    </AccordionItem>
                    
                    <AccordionItem value="reviews">
                        <AccordionTrigger className="text-xl font-semibold">
                            Avis et commentaires
                        </AccordionTrigger>
                        <AccordionContent>
                            <ReviewSection articleId={articleShop._id} />
                        </AccordionContent>
                    </AccordionItem>
                </Accordion>
            </div>

            {/* Dialog de paiement direct */}
            <Dialog open={isCheckoutDialogOpen} onOpenChange={setIsCheckoutDialogOpen}>
                <DialogContent className="max-w-[500px] md:max-w-[700px] bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
                    <DialogHeader>
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-blue-100 rounded-full">
                                <CreditCard className="h-6 w-6 text-blue-600" />
                            </div>
                            <div>
                                <DialogTitle className="text-2xl text-blue-800">Paiement direct</DialogTitle>
                                <DialogDescription className="text-blue-700">
                                    Vérifiez vos informations de livraison avant de procéder au paiement sécurisé
                                </DialogDescription>
                            </div>
                        </div>
                    </DialogHeader>
                    
                    <div className="space-y-4">
                        {/* Informations utilisateur */}
                        {user && (
                            <div className="border border-blue-200 bg-blue-50 rounded-lg p-4 flex items-start gap-3">
                                <User className="h-4 w-4 text-blue-600 mt-0.5" />
                                <p className="text-blue-700 text-sm">
                                    Connecté en tant que <strong>{user?.name || user?.email}</strong>
                                </p>
                            </div>
                        )}

                        {/* Récapitulatif article */}
                        {articleShop && (
                            <div className="bg-white/70 rounded-lg p-4 border border-blue-200">
                                <h4 className="font-semibold text-gray-800 mb-2">Récapitulatif de votre commande</h4>
                                <div className="flex items-center gap-3 mb-3">
                                    <img 
                                        src={articleShop.imageUrl} 
                                        alt={articleShop.name}
                                        className="w-12 h-12 object-cover rounded"
                                    />
                                    <div className="flex-1">
                                        <h5 className="font-medium text-sm">{articleShop.name}</h5>
                                        <p className="text-gray-600 text-xs">{articleShop.category}</p>
                                    </div>
                                </div>
                                <div className="space-y-1 text-sm">
                                    <div className="flex justify-between">
                                        <span>{currentQuantity}x {articleShop.name}</span>
                                        <span className="font-medium">CHF {((articleShop.price * currentQuantity) / 100).toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between text-gray-500">
                                        <span>Frais de livraison</span>
                                        <span>CHF 5.00</span>
                                    </div>
                                    <div className="border-t pt-2 flex justify-between font-bold">
                                        <span>Total</span>
                                        <span className="text-blue-600">CHF {((articleShop.price * currentQuantity + 500) / 100).toFixed(2)}</span>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Formulaire */}
                        {currentUser && (
                            <div className="bg-white/70 rounded-lg p-1">
                                <UserProfileForm 
                                    currentUser={currentUser} 
                                    onSave={onDirectCheckout} 
                                    isLoading={isGetUserLoading || isCheckoutLoading} 
                                    buttonText={isCheckoutLoading ? "Redirection..." : "Procéder au paiement sécurisé"} 
                                    title=""
                                />
                            </div>
                        )}
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default ArticleDetailPage;