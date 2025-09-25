import type { ArticleShop } from "@/types";
import { useCart } from "@/contexts/CartContext";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Plus, Minus } from "lucide-react";
import { useNavigate } from "react-router-dom";

type Props = {
    articleShop: ArticleShop;
}

const StarRating = ({ rating, reviewCount }: { rating: number, reviewCount: number }) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < 5; i++) {
        if (i < fullStars) {
            stars.push(
                <span key={i} className="text-yellow-400">★</span>
            );
        } else if (i === fullStars && hasHalfStar) {
            stars.push(
                <span key={i} className="text-yellow-400">☆</span>
            );
        } else {
            stars.push(
                <span key={i} className="text-gray-300">★</span>
            );
        }
    }

    return (
        <div className="flex items-center gap-1">
            <div className="flex">
                {stars}
            </div>
            <span className="text-sm text-gray-600">
                {rating.toFixed(1)} ({reviewCount} avis)
            </span>
        </div>
    );
};

const SearchArticleCards = ({ articleShop }: Props) => {
    const { addToCart, cartItems, updateQuantity, removeFromCart } = useCart();
    const [isAdding, setIsAdding] = useState(false);
    const navigate = useNavigate();

    // Trouver la quantité actuelle de cet article dans le panier
    const currentCartItem = cartItems.find(item => item.article._id === articleShop._id);
    const currentQuantity = currentCartItem?.quantity || 0;

    const handleCardClick = () => {
        navigate(`/article/${articleShop._id}`);
    };

    const handleAddToCart = async () => {
        if (articleShop.stock <= 0) {
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
        if (currentQuantity >= articleShop.stock) {
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
        if (currentQuantity > 1) {
            updateQuantity(articleShop._id, currentQuantity - 1);
        } else if (currentQuantity === 1) {
            removeFromCart(articleShop._id);
        }
    };
    return (
        <div 
            className="grid lg:grid-cols-[2fr_3fr] gap-5 group border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
            onClick={handleCardClick}
        >
            <img
                src={articleShop.imageUrl}
                className="w-full h-[200px] object-cover rounded-lg"
                alt={articleShop.name}
            />
            <div className="flex flex-col gap-2">
                <h2 className="text-2xl font-bold tracking-tight mb-2">
                    {articleShop.name}
                </h2>
                <div className="flex flex-row flex-wrap">
                    <span className="px-3 py-1 text-xs bg-green-100 text-green-800 rounded-full">
                        {articleShop.category}
                    </span>
                </div>
                <StarRating rating={articleShop.rating || 0} reviewCount={articleShop.reviewCount || 0} />
                <p className="text-sm text-gray-600 mt-2 line-clamp-3">
                    {articleShop.description}
                </p>
                <div className="flex items-center justify-between mt-4">
                    <div className="flex items-center gap-1">
                        <span className="text-lg font-bold">
                            CHF {(articleShop.price / 100).toFixed(2)}
                        </span>
                    </div>
                    <div className="text-sm text-gray-500">
                        {articleShop.stock > 0 ? `${articleShop.stock} articles en stock` : 'Rupture de stock'}
                    </div>
                    <div className="flex-shrink-0" onClick={(e) => e.stopPropagation()}>
                        {articleShop.stock <= 0 ? (
                            <div className="bg-gray-100 text-gray-500 px-3 py-1 rounded-md text-xs font-medium">
                                Épuisé
                            </div>
                        ) : currentQuantity === 0 ? (
                            <button 
                                onClick={handleIncrement}
                                disabled={isAdding}
                                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-xs font-medium transition-colors disabled:opacity-50"
                            >
                                {isAdding ? 'Ajout...' : 'Ajouter'}
                            </button>
                        ) : (
                            <div className="flex items-center gap-2 bg-gray-100 rounded-md p-1 border border-gray-200">
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={handleDecrement}
                                    className="h-8 w-8 p-0 hover:bg-white rounded-sm"
                                >
                                    <Minus className="h-4 w-4" />
                                </Button>
                                <span className="font-bold text-sm text-gray-800 min-w-[1.5rem] text-center">{currentQuantity}</span>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={handleIncrement}
                                    disabled={currentQuantity >= articleShop.stock}
                                    className="h-8 w-8 p-0 hover:bg-white rounded-sm disabled:opacity-50"
                                >
                                    <Plus className="h-4 w-4" />
                                </Button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SearchArticleCards;