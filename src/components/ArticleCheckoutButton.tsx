import { useState } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { useCart } from '@/contexts/CartContext';
import { useCreateArticleCheckoutSession } from '@/api/ArticleCheckoutApi';
import { useGetMyUser } from '@/api/MyUserApi';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import UserProfileForm from '@/forms/user-profile-form/UserProfileForm';
import type { UserFormData } from '@/forms/user-profile-form/UserProfileForm';
import { toast } from 'sonner';
import { CreditCard, User, AlertCircle } from 'lucide-react';

type Props = {
    children: React.ReactNode;
    disabled?: boolean;
};

const ArticleCheckoutButton = ({ children, disabled }: Props) => {
    const { isAuthenticated, loginWithRedirect, user } = useAuth0();
    const { cartItems, clearCart } = useCart();
    const { createArticleCheckoutSession, isLoading: isCheckoutLoading } = useCreateArticleCheckoutSession();
    // Seulement récupérer les données utilisateur s'il est authentifié
    const { currentUser, isLoading: isGetUserLoading } = useGetMyUser(isAuthenticated);
    const [isDialogOpen, setIsDialogOpen] = useState(false);

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
                // Fermer le dialog
                setIsDialogOpen(false);
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

    if (!isAuthenticated) {
        return (
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild disabled={disabled}>
                    {children}
                </DialogTrigger>
                <DialogContent className="max-w-md bg-gradient-to-br from-amber-50 to-orange-50 border-amber-200">
                    <DialogHeader>
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-amber-100 rounded-full">
                                <AlertCircle className="h-6 w-6 text-amber-600" />
                            </div>
                            <div>
                                <DialogTitle className="text-xl text-amber-800">Connexion requise</DialogTitle>
                                <DialogDescription className="text-amber-700">
                                    Vous devez être connecté pour procéder au paiement
                                </DialogDescription>
                            </div>
                        </div>
                    </DialogHeader>
                    <div className="space-y-4 pt-4">
                        <div className="border border-amber-200 bg-amber-50 rounded-lg p-4 flex items-start gap-3">
                            <User className="h-4 w-4 text-amber-600 mt-0.5" />
                            <p className="text-amber-700 text-sm">
                                La connexion vous permet de suivre vos commandes et de sauvegarder vos informations de livraison.
                            </p>
                        </div>
                        <div className="flex gap-3">
                            <Button 
                                onClick={() => loginWithRedirect()}
                                className="flex-1 bg-amber-600 hover:bg-amber-700 text-white"
                            >
                                Se connecter
                            </Button>
                            <Button 
                                variant="outline" 
                                onClick={() => setIsDialogOpen(false)}
                                className="flex-1"
                            >
                                Annuler
                            </Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        );
    }

    return (
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild disabled={disabled || !currentUser}>
                {children}
            </DialogTrigger>
            <DialogContent className="max-w-[500px] md:max-w-[700px] bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
                <DialogHeader>
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-100 rounded-full">
                            <CreditCard className="h-6 w-6 text-blue-600" />
                        </div>
                        <div>
                            <DialogTitle className="text-2xl text-blue-800">Finaliser ma commande</DialogTitle>
                            <DialogDescription className="text-blue-700">
                                Vérifiez vos informations de livraison avant de procéder au paiement sécurisé
                            </DialogDescription>
                        </div>
                    </div>
                </DialogHeader>
                
                <div className="space-y-4">
                    {/* Informations utilisateur */}
                    <div className="border border-blue-200 bg-blue-50 rounded-lg p-4 flex items-start gap-3">
                        <User className="h-4 w-4 text-blue-600 mt-0.5" />
                        <p className="text-blue-700 text-sm">
                            Connecté en tant que <strong>{user?.name || user?.email}</strong>
                        </p>
                    </div>

                    {/* Récapitulatif panier */}
                    <div className="bg-white/70 rounded-lg p-4 border border-blue-200">
                        <h4 className="font-semibold text-gray-800 mb-2">Récapitulatif de votre commande</h4>
                        <div className="space-y-1 text-sm">
                            {cartItems.slice(0, 3).map((item) => (
                                <div key={item.article._id} className="flex justify-between">
                                    <span className="truncate">{item.quantity}x {item.article.name}</span>
                                    <span className="font-medium">CHF {((item.article.price * item.quantity) / 100).toFixed(2)}</span>
                                </div>
                            ))}
                            {cartItems.length > 3 && (
                                <div className="text-gray-500">... et {cartItems.length - 3} autres articles</div>
                            )}
                            <div className="border-t pt-2 flex justify-between font-bold">
                                <span>Total (frais de livraison inclus)</span>
                                <span className="text-blue-600">CHF {((cartItems.reduce((total, item) => total + (item.article.price * item.quantity), 0) + 500) / 100).toFixed(2)}</span>
                            </div>
                        </div>
                    </div>

                    {/* Formulaire */}
                    {currentUser && (
                        <div className="bg-white/70 rounded-lg p-1">
                            <UserProfileForm 
                                currentUser={currentUser} 
                                onSave={onCheckout} 
                                isLoading={isGetUserLoading || isCheckoutLoading} 
                                buttonText={isCheckoutLoading ? "Redirection..." : "Procéder au paiement sécurisé"} 
                                title=""
                            />
                        </div>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default ArticleCheckoutButton;