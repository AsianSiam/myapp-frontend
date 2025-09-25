import { useState, useRef } from 'react';
import { useCart } from '@/contexts/CartContext';
import { useAuth0 } from '@auth0/auth0-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Trash2, Plus, Minus, ShoppingCart, User, LogIn, CreditCard, X } from 'lucide-react';
import ArticleCheckoutButton from '@/components/ArticleCheckoutButton';
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from '@/components/ui/accordion';

const CartDropdown = () => {
    const { cartItems, removeFromCart, updateQuantity, getTotalItems, getTotalPrice } = useCart();
    const { isAuthenticated, loginWithRedirect, user } = useAuth0();
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const buttonRef = useRef<HTMLButtonElement>(null);

    const handleQuantityChange = (articleId: string, newQuantity: number) => {
        updateQuantity(articleId, newQuantity);
    };

    const handleLogin = () => {
        loginWithRedirect();
    };

    const totalItems = getTotalItems();

    // Plus de fermeture automatique - seulement sur clic du bouton X
    // Le panier reste ouvert même quand on clique à côté

    return (
        <div className="relative">
            {/* Bouton du panier */}
            <Button
                ref={buttonRef}
                variant="outline"
                size="lg"
                className="relative bg-white hover:bg-gray-50 border-2 border-blue-200 hover:border-blue-300 transition-all duration-200 shadow-md hover:shadow-lg"
                onClick={() => setIsOpen(!isOpen)}
            >
                <ShoppingCart className="h-5 w-5 text-blue-600" />
                {totalItems > 0 && (
                    <Badge variant="destructive" className="absolute -top-2 -right-2 h-6 w-6 flex items-center justify-center text-xs p-0 bg-red-500 hover:bg-red-600 animate-pulse">
                        {totalItems > 99 ? '99+' : totalItems}
                    </Badge>
                )}
            </Button>

            {/* Dropdown du panier fixe - reste ouvert */}
            {isOpen && (
                <div
                    ref={dropdownRef}
                    className="fixed top-20 right-6 w-96 z-50 transform origin-top-right animate-in slide-in-from-top-2 duration-200"
                    style={{ maxHeight: 'calc(100vh - 6rem)' }}
                >
                    <div className="bg-gradient-to-br from-gray-50 to-blue-50 rounded-2xl backdrop-blur-sm border border-gray-200/50 shadow-2xl overflow-hidden">
                        {/* En-tête fixe avec bouton de fermeture */}
                        <div className="px-6 pt-6 pb-4 flex-shrink-0">
                            <div className="flex items-center justify-between mb-3">
                                <div className="flex items-center gap-3">
                                    <div className="p-3 bg-blue-100 rounded-xl">
                                        <ShoppingCart className="h-6 w-6 text-blue-600" />
                                    </div>
                                    <div>
                                        <h2 className="text-2xl font-bold text-gray-800">
                                            Mon Panier
                                        </h2>
                                        <p className="text-gray-600">
                                            {totalItems} article{totalItems !== 1 ? 's' : ''} • CHF {(getTotalPrice() / 100).toFixed(2)}
                                        </p>
                                    </div>
                                </div>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => setIsOpen(false)}
                                    className="h-8 w-8 p-0 hover:bg-gray-200 rounded-lg"
                                >
                                    <X className="h-4 w-4" />
                                </Button>
                            </div>
                            
                            {/* Status utilisateur */}
                            <div className="p-4 bg-white/80 rounded-xl border border-gray-200 backdrop-blur-sm">
                                <div className="flex items-center gap-3">
                                    {isAuthenticated ? (
                                        <>
                                            <div className="p-1.5 bg-green-100 rounded-lg">
                                                <User className="h-4 w-4 text-green-600" />
                                            </div>
                                            <span className="text-sm text-green-700 font-medium">
                                                Connecté • {user?.name || user?.email}
                                            </span>
                                        </>
                                    ) : (
                                        <>
                                            <div className="p-1.5 bg-amber-100 rounded-lg">
                                                <LogIn className="h-4 w-4 text-amber-600" />
                                            </div>
                                            <span className="text-sm text-amber-700 font-medium">
                                                Connexion requise pour commander
                                            </span>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Contenu avec Accordion */}
                        <Accordion type="single" collapsible defaultValue="cart-content">
                            <AccordionItem value="cart-content" className="border-none">
                                <AccordionTrigger className="px-6 py-2 hover:no-underline">
                                    <span className="text-lg font-semibold text-gray-800">
                                        Contenu du panier ({totalItems} articles)
                                    </span>
                                </AccordionTrigger>
                                <AccordionContent className="pb-0">{cartItems.length === 0 ? (
                                    <div className="flex items-center justify-center flex-col gap-6 px-6 py-12">
                                        <div className="relative">
                                            <div className="p-6 bg-white/80 rounded-full shadow-lg">
                                                <ShoppingCart className="h-16 w-16 text-gray-400" />
                                            </div>
                                            <div className="absolute -bottom-2 -right-2 p-1 bg-blue-500 rounded-full">
                                                <Plus className="h-4 w-4 text-white" />
                                            </div>
                                        </div>
                                        <div className="text-center space-y-2">
                                            <h3 className="text-lg font-semibold text-gray-700">Votre panier est vide</h3>
                                            <p className="text-gray-500 text-sm">Découvrez nos articles et ajoutez vos favoris !</p>
                                        </div>
                                        <Button 
                                            variant="outline" 
                                            onClick={() => setIsOpen(false)}
                                            className="bg-white hover:bg-blue-50 text-blue-600 border-blue-200 hover:border-blue-300"
                                        >
                                            Découvrir nos articles
                                        </Button>
                                    </div>
                                ) : (
                                    <div className="flex flex-col h-full">{/* Articles du panier */}
                                        <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent px-6 max-h-80">
                                            <div className="space-y-3 pb-4">
                                                {cartItems.map((item, index) => (
                                                    <div key={item.article._id} 
                                                         className="bg-white/90 backdrop-blur-sm border border-gray-200/50 rounded-xl p-4 shadow-sm hover:shadow-md hover:bg-white transition-all duration-200"
                                                         style={{ animationDelay: `${index * 50}ms` }}>
                                                        <div className="flex gap-4">
                                                            <div className="relative">
                                                                <img
                                                                    src={item.article.imageUrl}
                                                                    alt={item.article.name}
                                                                    className="w-18 h-18 object-cover rounded-lg shadow-sm"
                                                                />
                                                                <div className="absolute -top-2 -right-2 bg-blue-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center font-bold shadow-lg">
                                                                    {item.quantity}
                                                                </div>
                                                            </div>
                                                            <div className="flex-1 min-w-0 space-y-2">
                                                                <h4 className="font-semibold text-gray-900 truncate">{item.article.name}</h4>
                                                                <div className="flex items-center gap-2">
                                                                    <span className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded-full font-medium">
                                                                        {item.article.category}
                                                                    </span>
                                                                    <span className="text-xs text-gray-500">
                                                                        Stock: {item.article.stock}
                                                                    </span>
                                                                </div>
                                                                <p className="font-bold text-blue-600">
                                                                    CHF {(item.article.price / 100).toFixed(2)} / unité
                                                                </p>
                                                            </div>
                                                            <Button
                                                                variant="ghost"
                                                                size="sm"
                                                                onClick={() => removeFromCart(item.article._id)}
                                                                className="text-red-400 hover:text-red-600 hover:bg-red-50 self-start h-8 w-8 p-0 rounded-lg"
                                                            >
                                                                <Trash2 className="h-4 w-4" />
                                                            </Button>
                                                        </div>
                                                        
                                                        {/* Contrôles de quantité */}
                                                        <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-200">
                                                            <div className="flex items-center gap-3 bg-gray-100 rounded-xl p-2">
                                                                <Button
                                                                    variant="ghost"
                                                                    size="sm"
                                                                    onClick={() => handleQuantityChange(item.article._id, item.quantity - 1)}
                                                                    disabled={item.quantity <= 1}
                                                                    className="h-8 w-8 p-0 hover:bg-white disabled:opacity-50 rounded-lg"
                                                                >
                                                                    <Minus className="h-4 w-4" />
                                                                </Button>
                                                                <span className="w-12 text-center font-bold text-gray-900">
                                                                    {item.quantity}
                                                                </span>
                                                                <Button
                                                                    variant="ghost"
                                                                    size="sm"
                                                                    onClick={() => handleQuantityChange(item.article._id, item.quantity + 1)}
                                                                    disabled={item.quantity >= item.article.stock}
                                                                    className="h-8 w-8 p-0 hover:bg-white disabled:opacity-50 rounded-lg"
                                                                >
                                                                    <Plus className="h-4 w-4" />
                                                                </Button>
                                                            </div>
                                                            <div className="text-right">
                                                                <p className="font-bold text-gray-900 text-lg">
                                                                    CHF {((item.article.price * item.quantity) / 100).toFixed(2)}
                                                                </p>
                                                                <p className="text-xs text-gray-500">
                                                                    {item.quantity} × CHF {(item.article.price / 100).toFixed(2)}
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Section récapitulatif simplifiée */}
                                        <div className="bg-white/90 backdrop-blur-sm border-t border-gray-200 rounded-b-2xl mt-0 flex-shrink-0">
                                            <div className="p-6">
                                                {/* En-tête du récapitulatif */}
                                                <div className="flex items-center gap-3 mb-4">
                                                    <div className="p-2 bg-blue-100 rounded-xl">
                                                        <CreditCard className="h-5 w-5 text-blue-600" />
                                                    </div>
                                                    <h4 className="text-lg font-semibold text-gray-900">Récapitulatif</h4>
                                                </div>
                                                
                                                {/* Détails de prix */}
                                                <div className="space-y-3 text-sm">
                                                    <div className="flex items-center justify-between">
                                                        <span className="text-gray-600">Sous-total ({totalItems} articles)</span>
                                                        <span className="font-semibold text-gray-900">CHF {(getTotalPrice() / 100).toFixed(2)}</span>
                                                    </div>
                                                    <div className="flex items-center justify-between">
                                                        <span className="text-gray-600">Frais de livraison</span>
                                                        <span className="font-semibold text-green-600">Gratuit</span>
                                                    </div>
                                                    <Separator className="bg-gradient-to-r from-transparent via-gray-300 to-transparent" />
                                                    <div className="flex items-center justify-between text-xl font-bold pt-2">
                                                        <span className="text-gray-900">Total</span>
                                                        <span className="text-blue-600">CHF {(getTotalPrice() / 100).toFixed(2)}</span>
                                                    </div>
                                                </div>
                                                
                                                {/* Bouton de paiement uniquement */}
                                                <div className="mt-6">
                                                    {isAuthenticated ? (
                                                        <ArticleCheckoutButton disabled={cartItems.length === 0}>
                                                            <Button 
                                                                className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white py-4 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 rounded-xl"
                                                                disabled={cartItems.length === 0}
                                                            >
                                                                <CreditCard className="h-5 w-5 mr-2" />
                                                                Procéder au paiement
                                                            </Button>
                                                        </ArticleCheckoutButton>
                                                    ) : (
                                                        <Button 
                                                            onClick={handleLogin}
                                                            className="w-full bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white py-4 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 rounded-xl"
                                                        >
                                                            <LogIn className="h-5 w-5 mr-2" />
                                                            Se connecter pour commander
                                                        </Button>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                                </AccordionContent>
                            </AccordionItem>
                        </Accordion>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CartDropdown;