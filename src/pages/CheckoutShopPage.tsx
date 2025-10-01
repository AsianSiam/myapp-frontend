import { useAuth0 } from '@auth0/auth0-react';
import { useCart } from '@/contexts/CartContext';
import { useCreateArticleCheckoutSession } from '@/api/ArticleCheckoutApi';
import { useGetMyUser } from '@/api/MyUserApi';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import UserProfileForm from '@/forms/user-profile-form/UserProfileForm';
import type { UserFormData } from '@/forms/user-profile-form/UserProfileForm';
import { toast } from 'sonner';
import { 
    CreditCard, 
    User, 
    ArrowLeft, 
    ShoppingBag, 
    Package, 
    Truck, 
    Shield,
    ChevronRight
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

const CheckoutShopPage = () => {
    const { isAuthenticated, user } = useAuth0();
    const { cartItems, clearCart } = useCart();
    const { createArticleCheckoutSession, isLoading: isCheckoutLoading } = useCreateArticleCheckoutSession();
    const { currentUser, isLoading: isGetUserLoading } = useGetMyUser(isAuthenticated);
    const navigate = useNavigate();

    // Calculer le total
    const getTotalPrice = () => {
        return cartItems.reduce((total, item) => total + (item.article.price * item.quantity), 0);
    };

    // Calculer le nombre total d'articles
    const getTotalItems = () => {
        return cartItems.reduce((total, item) => total + item.quantity, 0);
    };

    // Rediriger si non authentifié ou panier vide
    useEffect(() => {
        if (!isAuthenticated) {
            navigate('/');
            return;
        }
        if (cartItems.length === 0) {
            navigate('/shop');
            return;
        }
    }, [isAuthenticated, cartItems.length, navigate]);

    const onCheckout = async (userFormData: UserFormData) => {
        if (!cartItems.length) {
            toast.error("Votre panier est vide");
            return;
        }

        try {
            const checkoutData = {
                cartItems: cartItems.map((item) => ({
                    articleId: item.article._id,
                    name: item.article.name,
                    quantity: item.quantity,
                    price: item.article.price,
                })),
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

            toast.loading("Préparation du paiement...", { id: "checkout" });
            const data = await createArticleCheckoutSession(checkoutData);
            
            // Rediriger vers Stripe Checkout
            if (data.url) {
                toast.success("Redirection vers le paiement", { id: "checkout" });
                // Vider le panier avant la redirection
                clearCart();
                // Redirection
                window.location.href = data.url;
            } else {
                toast.error("Erreur lors de la création de la session de paiement", { id: "checkout" });
            }
        } catch (error) {
            console.error("Erreur checkout:", error);
            toast.error("Erreur lors du processus de paiement", { id: "checkout" });
        }
    };

    if (!isAuthenticated || cartItems.length === 0) {
        return null; // Le useEffect redirige
    }

    return (
        <div className="container mx-auto px-4 py-8 max-w-6xl">
            {/* En-tête */}
            <div className="mb-8">
                <Button
                    variant="ghost"
                    onClick={() => navigate('/shop')}
                    className="mb-4 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Retour à la boutique
                </Button>
                
                <div className="flex items-center gap-4 mb-2">
                    <div className="p-3 bg-blue-100 rounded-xl">
                        <CreditCard className="h-8 w-8 text-blue-600" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Finaliser ma commande</h1>
                        <p className="text-gray-600">Vérifiez vos informations de livraison avant de procéder au paiement sécurisé</p>
                    </div>
                </div>

                {/* Étapes du processus */}
                <div className="flex items-center gap-4 mt-6 text-sm">
                    <div className="flex items-center gap-2 text-blue-600 font-medium">
                        <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs">1</div>
                        Informations
                    </div>
                    <ChevronRight className="h-4 w-4 text-gray-400" />
                    <div className="flex items-center gap-2 text-gray-400">
                        <div className="w-6 h-6 border-2 border-gray-300 rounded-full flex items-center justify-center text-xs">2</div>
                        Paiement
                    </div>
                    <ChevronRight className="h-4 w-4 text-gray-400" />
                    <div className="flex items-center gap-2 text-gray-400">
                        <div className="w-6 h-6 border-2 border-gray-300 rounded-full flex items-center justify-center text-xs">3</div>
                        Confirmation
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Colonne gauche - Formulaire */}
                <div className="space-y-6">
                    {/* Informations utilisateur */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <User className="h-5 w-5 text-blue-600" />
                                Compte connecté
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="bg-blue-50 rounded-lg p-4">
                                <p className="text-blue-700">
                                    Connecté en tant que <strong>{user?.name || user?.email}</strong>
                                </p>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Formulaire de livraison */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Truck className="h-5 w-5 text-blue-600" />
                                Informations de livraison
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            {currentUser && (
                                <UserProfileForm 
                                    currentUser={currentUser} 
                                    onSave={onCheckout} 
                                    isLoading={isGetUserLoading || isCheckoutLoading} 
                                    buttonText={isCheckoutLoading ? "Redirection..." : "Procéder au paiement sécurisé"} 
                                    title=""
                                />
                            )}
                        </CardContent>
                    </Card>

                    {/* Sécurité */}
                    <Card>
                        <CardContent className="pt-6">
                            <div className="flex items-center gap-3 text-green-600">
                                <Shield className="h-5 w-5" />
                                <span className="font-medium">Paiement 100% sécurisé par Stripe</span>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Colonne droite - Récapitulatif */}
                <div className="space-y-6">
                    {/* Récapitulatif de la commande */}
                    <Card className="sticky top-6">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <ShoppingBag className="h-5 w-5 text-blue-600" />
                                Récapitulatif de votre commande
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {/* Articles */}
                            <div className="space-y-3">
                                {cartItems.map((item) => (
                                    <div key={item.article._id} className="flex items-center gap-3">
                                        <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                                            <Package className="h-6 w-6 text-gray-500" />
                                        </div>
                                        <div className="flex-1">
                                            <h4 className="font-medium text-gray-900 truncate">{item.article.name}</h4>
                                            <p className="text-sm text-gray-500">Quantité: {item.quantity}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-bold text-gray-900">
                                                CHF {((item.article.price * item.quantity) / 100).toFixed(2)}
                                            </p>
                                            <p className="text-xs text-gray-500">
                                                CHF {(item.article.price / 100).toFixed(2)} × {item.quantity}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <Separator />

                            {/* Totaux */}
                            <div className="space-y-2">
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-600">Sous-total ({getTotalItems()} articles)</span>
                                    <span className="font-medium">CHF {(getTotalPrice() / 100).toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-600">Frais de livraison</span>
                                    <span className="font-medium text-green-600">Gratuit</span>
                                </div>
                                <Separator />
                                <div className="flex justify-between text-lg font-bold">
                                    <span>Total</span>
                                    <span className="text-blue-600">CHF {(getTotalPrice() / 100).toFixed(2)}</span>
                                </div>
                            </div>

                            {/* Note livraison */}
                            <div className="bg-green-50 rounded-lg p-3 mt-4">
                                <div className="flex items-center gap-2 text-green-700">
                                    <Truck className="h-4 w-4" />
                                    <span className="text-sm font-medium">Livraison gratuite</span>
                                </div>
                                <p className="text-xs text-green-600 mt-1">
                                    Votre commande sera livrée dans 3-5 jours ouvrés
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default CheckoutShopPage;
