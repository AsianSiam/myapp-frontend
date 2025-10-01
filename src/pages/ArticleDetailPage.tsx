import { useParams, useNavigate } from "react-router-dom";
import { useCart } from "@/contexts/CartContext";
import * as ArticleShopApi from "@/api/ArticleShopApi";
import * as ReviewApi from "@/api/ReviewApi";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { ShoppingCart, ArrowLeft, Plus, Minus, ChevronLeft, ChevronRight, Package, FileText, CreditCard } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import ArticleCheckoutButton from "@/components/ArticleCheckoutButton";
import ReviewSection, { StarRating } from "@/components/ReviewSection";

// Composants utilitaires pour éviter la répétition
const ArticleLoadingSkeleton = () => (
    <div className="app-container p-6">
        <div className="animate-pulse space-y-8">
            <div className="h-6 bg-app-muted rounded w-24"></div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="aspect-square bg-app-muted rounded-2xl"></div>
                <div className="space-y-6">
                    <div className="h-8 bg-app-muted rounded w-3/4"></div>
                    <div className="h-4 bg-app-muted rounded w-full"></div>
                    <div className="h-6 bg-app-muted rounded w-1/3"></div>
                    <div className="h-12 bg-app-muted rounded"></div>
                </div>
            </div>
        </div>
    </div>
);

const ArticleNotFound = ({ onBackClick }: { onBackClick: () => void }) => (
    <div className="app-container p-6 text-center">
        <div className="py-20">
            <h1 className="text-3xl font-bold text-app-primary mb-4">Article non trouvé</h1>
            <p className="text-app-secondary mb-8">L'article que vous recherchez n'existe pas ou a été supprimé.</p>
            <Button onClick={onBackClick} size="lg" className="rounded-full">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Retour à la boutique
            </Button>
        </div>
    </div>
);

// Composant carrousel d'images
const ImageCarousel = ({ images, name }: { images: string[], name: string }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    
    // Pour l'instant, on utilise une seule image répétée, mais la structure est prête pour plusieurs images
    const imageList = images && images.length > 0 ? images : [images[0], images[0], images[0]];

    const nextImage = () => {
        setCurrentIndex((prev) => (prev + 1) % imageList.length);
    };

    const prevImage = () => {
        setCurrentIndex((prev) => (prev - 1 + imageList.length) % imageList.length);
    };

    return (
        <div className="relative group">
            <div className="aspect-square rounded-2xl overflow-hidden bg-app-muted">
                <img 
                    src={imageList[currentIndex]} 
                    alt={`${name} - Image ${currentIndex + 1}`}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
            </div>
            
            {imageList.length > 1 && (
                <>
                    <button
                        onClick={prevImage}
                        className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 hover:bg-white dark:bg-black/80 dark:hover:bg-black rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-200 flex items-center justify-center"
                    >
                        <ChevronLeft className="h-5 w-5 text-gray-700 dark:text-white" />
                    </button>
                    <button
                        onClick={nextImage}
                        className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 hover:bg-white dark:bg-black/80 dark:hover:bg-black rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-200 flex items-center justify-center"
                    >
                        <ChevronRight className="h-5 w-5 text-gray-700 dark:text-white" />
                    </button>
                    
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                        {imageList.map((_, index) => (
                            <button
                                key={index}
                                onClick={() => setCurrentIndex(index)}
                                className={`w-2 h-2 rounded-full transition-colors ${
                                    index === currentIndex ? 'bg-white' : 'bg-white/50'
                                }`}
                            />
                        ))}
                    </div>
                </>
            )}
        </div>
    );
};

// Composant bouton de quantité (style panier) avec gestion stock et checkout
const QuantityButton = ({ currentQuantity, maxStock, onQuantityChange }: {
    currentQuantity: number;
    maxStock: number;
    onQuantityChange: (quantity: number) => void;
}) => {
    // Article en rupture de stock
    if (maxStock === 0) {
        return (
            <div className="space-y-3">
                <Button 
                    disabled
                    size="lg"
                    className="w-full rounded-full bg-gray-400 text-white font-semibold py-3 cursor-not-allowed"
                >
                    <ShoppingCart className="mr-2 h-5 w-5" />
                    Rupture de stock
                </Button>
                <p className="text-center text-sm text-red-600 font-medium">
                    Cet article n'est actuellement pas disponible
                </p>
            </div>
        );
    }

    // Article pas encore dans le panier
    if (currentQuantity === 0) {
        return (
            <Button 
                onClick={() => onQuantityChange(1)}
                size="lg"
                className="w-full rounded-full search-button font-semibold py-3 shadow-lg hover:shadow-xl transition-all duration-200"
            >
                <ShoppingCart className="mr-2 h-5 w-5" />
                Ajouter au panier
            </Button>
        );
    }

    // Article déjà dans le panier
    return (
            <div className="space-y-4">
            {/* Contrôles de quantité */}
            <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 bg-app-muted rounded-full p-1 shadow-inner">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onQuantityChange(Math.max(0, currentQuantity - 1))}
                        className="h-10 w-10 p-0 hover:bg-app-background rounded-full shadow-sm"
                    >
                        <Minus className="h-4 w-4" />
                    </Button>
                    <span className="w-12 text-center font-bold text-lg text-app-primary">
                        {currentQuantity}
                    </span>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onQuantityChange(Math.min(maxStock, currentQuantity + 1))}
                        disabled={currentQuantity >= maxStock}
                        className="h-10 w-10 p-0 hover:bg-app-background rounded-full shadow-sm disabled:opacity-50"
                    >
                        <Plus className="h-4 w-4" />
                    </Button>
                </div>                {/* Bouton Procéder au paiement aligné avec les contrôles */}
                <div className="flex-1">
                    <ArticleCheckoutButton>
                        <Button 
                            className="h-12 w-full bg-green-600 hover:bg-green-700 text-white font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-200"
                        >
                            <CreditCard className="mr-2 h-4 w-4" />
                            Procéder au paiement
                        </Button>
                    </ArticleCheckoutButton>
                </div>
            </div>

            <div className="text-center">
                <span className="text-sm text-app-secondary">
                    {currentQuantity} article{currentQuantity > 1 ? 's' : ''} dans le panier
                </span>
            </div>
        </div>
    );
};



export default function ArticleDetailPage() {
    const { id: articleId } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { addToCart, cartItems, updateQuantity, removeFromCart } = useCart();

    // Queries - Seulement si on a un articleId valide
    const { articleShop: article, isLoading: articleLoading } = ArticleShopApi.useGetArticleShop(articleId || "");
    const { reviews } = ReviewApi.useGetArticleReviews(articleId || "");

    // Trouver la quantité actuelle dans le panier
    const currentCartItem = cartItems.find(item => item.article._id === articleId);
    const currentQuantity = currentCartItem?.quantity || 0;

    // Pas d'articleId dans l'URL
    if (!articleId) {
        return (
            <div className="app-container p-6 text-center">
                <div className="py-20">
                    <h1 className="text-3xl font-bold text-app-primary mb-4">URL invalide</h1>
                    <Button onClick={() => navigate("/shop")} size="lg" className="rounded-full">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Retour à la boutique
                    </Button>
                </div>
            </div>
        );
    }

    // Loading state
    if (articleLoading) {
        return <ArticleLoadingSkeleton />;
    }

    // Article not found
    if (!article) {
        return <ArticleNotFound onBackClick={() => navigate("/shop")} />;
    }

    const handleQuantityChange = (newQuantity: number) => {
        if (newQuantity === 0) {
            if (currentQuantity > 0) {
                removeFromCart(articleId);
                toast.success("Article retiré du panier");
            }
        } else if (currentQuantity === 0) {
            addToCart(article, newQuantity);
            toast.success(`${article.name} ajouté au panier`);
        } else {
            updateQuantity(articleId, newQuantity);
        }
    };

    const averageRating = reviews.length > 0 
        ? reviews.reduce((sum: number, review: any) => sum + review.rating, 0) / reviews.length
        : 0;

    return (
        <div className="min-h-screen admin-layout">
            {/* Bouton retour fixe */}
            <div className="sticky top-0 z-10 bg-app-background/80 backdrop-blur-sm border-b border-app">
                <div className="app-container p-6">
                    <Button 
                        variant="ghost" 
                        onClick={() => navigate(-1)}
                        className="rounded-full hover:bg-app-muted"
                    >
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Retour
                    </Button>
                </div>
            </div>

            <div className="app-container p-6 space-y-8">
                {/* SECTION 1: Fiche produit principale */}
                <div className="content-card rounded-3xl overflow-hidden border-0">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-8">
                        {/* Carrousel d'images */}
                        <div>
                            <ImageCarousel 
                                images={article.images || [article.imageUrl]} 
                                name={article.name} 
                            />
                        </div>

                        {/* Informations produit */}
                        <div className="space-y-6">
                            {/* Titre et catégorie */}
                            <div>
                                <div className="flex items-center gap-3 mb-2">
                                    <Badge variant="secondary" className="rounded-full px-3 py-1">
                                        {article.category}
                                    </Badge>
                                    {article.stock <= 5 && article.stock > 0 && (
                                        <Badge variant="outline" className="rounded-full px-3 py-1 text-orange-600 border-orange-300">
                                            Plus que {article.stock} en stock
                                        </Badge>
                                    )}
                                </div>
                                <h1 className="text-3xl lg:text-4xl font-bold text-app-primary mb-3">
                                    {article.name}
                                </h1>
                                <p className="text-lg text-app-secondary leading-relaxed">
                                    {article.description?.substring(0, 150)}...
                                </p>
                            </div>

                            {/* Note moyenne */}
                            {reviews.length > 0 && (
                                <div className="flex items-center gap-3 p-4 bg-yellow-50 dark:bg-transparent rounded-xl">
                                    <StarRating rating={Math.round(averageRating)} />
                                    <div>
                                        <div className="font-semibold text-app-primary">
                                            {averageRating.toFixed(1)} / 5
                                        </div>
                                        <div className="text-sm text-app-secondary">
                                            {reviews.length} avis client{reviews.length > 1 ? 's' : ''}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Prix */}
                            <div className="p-6">
                                <div className="text-4xl font-bold text-app-primary mb-2">
                                    {(article.price / 100).toFixed(2)} CHF
                                </div>
                                <div className="text-sm-semibold text-app-secondary">
                                    Prix unitaire • Livraison gratuite
                                </div>
                            </div>

                            {/* Bouton panier */}
                            <div className="pt-4">
                                <QuantityButton
                                    currentQuantity={currentQuantity}
                                    maxStock={article.stock}
                                    onQuantityChange={handleQuantityChange}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* SECTIONS 2 & 3: Accordéons */}
                <div className="space-y-4">
                    <Accordion type="multiple" className="space-y-4">
                        {/* SECTION 2: Informations détaillées */}
                        <AccordionItem value="details" className="content-card rounded-2xl overflow-hidden border-0">
                            <AccordionTrigger className="px-8 py-6 hover:bg-app-muted hover:no-underline">
                                <div className="flex items-center gap-4">
                                    <div className="p-3 bg-blue-100 dark:bg-blue-900/20 rounded-full">
                                        <Package className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                                    </div>
                                    <div className="text-left">
                                        <h2 className="text-xl font-bold text-app-primary">
                                            Informations détaillées
                                        </h2>
                                        <p className="text-app-secondary">
                                            Description complète et caractéristiques du produit
                                        </p>
                                    </div>
                                </div>
                            </AccordionTrigger>
                            <AccordionContent className="px-8 pb-8">
                                <div className="space-y-6">
                                    {/* Description complète */}
                                    <div>
                                        <h3 className="text-lg font-semibold text-app-primary mb-3">Description</h3>
                                        <p className="text-app-secondary leading-relaxed">
                                            {article.description}
                                        </p>
                                    </div>

                                    <Separator />

                                    {/* Caractéristiques */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-3">
                                            <h3 className="text-lg font-semibold text-app-primary">Caractéristiques</h3>
                                            <div className="space-y-2">
                                                <div className="flex justify-between py-2 border-b border-app">
                                                    <span className="text-app-secondary">Référence</span>
                                                    <span className="font-medium text-app-primary font-mono text-sm">{articleId}</span>
                                                </div>
                                                <div className="flex justify-between py-2 border-b border-app">
                                                    <span className="text-app-secondary">Catégorie</span>
                                                    <span className="font-medium text-app-primary">{article.category}</span>
                                                </div>
                                                <div className="flex justify-between py-2 border-b border-app">
                                                    <span className="text-app-secondary">Stock disponible</span>
                                                    <span className="font-medium text-app-primary">{article.stock} unités</span>
                                                </div>
                                                <div className="flex justify-between py-2">
                                                    <span className="text-app-secondary">Prix unitaire</span>
                                                    <span className="font-medium text-blue-600 dark:text-blue-400">{article.price.toFixed(2)} €</span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="space-y-3">
                                            <h3 className="text-lg font-semibold text-app-primary">Livraison & Retours</h3>
                                            <div className="space-y-3">
                                                <div className="flex items-start gap-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                                                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                                                    <div>
                                                        <div className="font-medium text-green-800 dark:text-green-400">Livraison gratuite</div>
                                                        <div className="text-sm text-green-700 dark:text-green-300">Expédition sous 24-48h</div>
                                                    </div>
                                                </div>
                                                <div className="flex items-start gap-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                                                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                                                    <div>
                                                        <div className="font-medium text-blue-800 dark:text-blue-400">Retours gratuits</div>
                                                        <div className="text-sm text-blue-700 dark:text-blue-300">30 jours pour changer d'avis</div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </AccordionContent>
                        </AccordionItem>

                        {/* SECTION 3: Avis clients */}
                        <AccordionItem value="reviews" className="content-card rounded-2xl overflow-hidden border-0">
                            <AccordionTrigger className="px-8 py-6 hover:bg-app-muted hover:no-underline">
                                <div className="flex items-center gap-4">
                                    <div className="p-3 bg-yellow-100 dark:bg-yellow-900/20 rounded-full">
                                        <FileText className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
                                    </div>
                                    <div className="text-left">
                                        <h2 className="text-xl font-bold text-app-primary">
                                            Avis clients ({reviews.length})
                                        </h2>
                                        <p className="text-app-secondary">
                                            {reviews.length > 0 
                                                ? `Note moyenne: ${averageRating.toFixed(1)}/5 étoiles`
                                                : "Soyez le premier à donner votre avis"
                                            }
                                        </p>
                                    </div>
                                </div>
                            </AccordionTrigger>
                            <AccordionContent className="px-8 pb-8">
                                <ReviewSection 
                                    articleId={articleId!} 
                                    showTitle={false}
                                />
                            </AccordionContent>
                        </AccordionItem>
                    </Accordion>
                </div>
            </div>
        </div>
    );
}