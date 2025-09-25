import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import { toast } from "sonner";
import { CheckCircle, LogIn, ArrowLeft, RefreshCw, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

/**
 * PAGE DE CONFIRMATION DE PAIEMENT STRIPE
 * 
 * Cette page est affichée après un paiement Stripe réussi.
 * Elle gère différents scénarios d'authentification et affiche
 * les détails de la commande de manière optimale.
 * 
 * 🔄 FONCTIONNALITÉS :
 * - Confirmation immédiate du paiement Stripe
 * - Vérification automatique du statut de commande
 * - Support des utilisateurs non-authentifiés
 * - Retry intelligent en cas de délai de traitement
 * - Interface responsive et accessible
 * 
 * 🔐 GESTION AUTH0 :
 * - Fonctionne avec et sans authentification
 * - Proposition de reconnexion pour les détails
 * - Redirection post-authentification
 */
const StripeSuccessPage = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const { isAuthenticated, isLoading, loginWithRedirect, getAccessTokenSilently } = useAuth0();
    
    // État de la vérification de commande
    const [orderDetails, setOrderDetails] = useState<any>(null);
    const [verificationStatus, setVerificationStatus] = useState<'checking' | 'success' | 'pending' | 'error'>('checking');
    const [retryCount, setRetryCount] = useState(0);
    
    // Paramètres URL de Stripe
    const success = searchParams.get("success");
    const orderId = searchParams.get("orderId");
    const sessionId = searchParams.get("session_id");

    /**
     * VÉRIFICATION DU STATUT DE COMMANDE
     * 
     * Vérifie le statut de la commande avec retry automatique
     * pour gérer les délais de traitement des webhooks
     */
    const checkOrderStatus = async () => {
        if (!isAuthenticated || !orderId) {
            setVerificationStatus('pending');
            return;
        }

        try {
            console.log(`🔍 Vérification commande ${orderId} (tentative ${retryCount + 1})...`);
            
            const accessToken = await getAccessTokenSilently();
            const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/order/${orderId}`, {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });

            if (response.ok) {
                const order = await response.json();
                console.log('📋 Statut commande reçu:', order.status);
                setOrderDetails(order);
                
                if (order.status === 'paid') {
                    setVerificationStatus('success');
                    toast.success("✅ Commande confirmée et payée !", {
                        duration: 4000,
                        description: `Commande #${orderId.slice(-8)} - ${(order.totalAmount / 100).toFixed(2)} CHF`
                    });
                } else if (order.status === 'placed' && retryCount < 5) {
                    // Retry automatique avec délai progressif
                    setVerificationStatus('pending');
                    const delay = Math.min(3000 * (retryCount + 1), 10000); // Max 10s
                    console.log(`⏳ Commande en traitement, retry dans ${delay/1000}s...`);
                    
                    setTimeout(() => {
                        setRetryCount(prev => prev + 1);
                        checkOrderStatus();
                    }, delay);
                } else {
                    // Accepter les autres statuts comme valides
                    setVerificationStatus('success');
                }
            } else {
                console.error('❌ Erreur API statut commande:', response.status);
                setVerificationStatus('error');
            }
        } catch (error) {
            console.error('❌ Erreur vérification commande:', error);
            setVerificationStatus('error');
        }
    };

    /**
     * EFFET D'INITIALISATION
     * 
     * Lance la vérification du statut de commande dès que possible
     * Gère les délais de chargement Auth0 et affiche les notifications
     */
    useEffect(() => {
        console.log('🎯 StripeSuccessPage montée:', {
            success,
            orderId,
            sessionId: sessionId?.substring(0, 20) + '...',
            isAuthenticated,
            isLoading
        });

        // Confirmation immédiate du succès Stripe
        if (success === "true" && orderId) {
            toast.success("✅ Paiement Stripe réussi !", {
                duration: 4000,
                description: "Votre paiement a été traité avec succès"
            });

            // Vérification des détails si authentifié
            if (isAuthenticated && !isLoading) {
                console.log('✅ Utilisateur authentifié - Vérification commande...');
                checkOrderStatus();
            } else if (!isLoading && !isAuthenticated) {
                console.log('⚠️ Utilisateur non authentifié - Mode limité');
                setVerificationStatus('pending');
                toast.info("💡 Connectez-vous pour voir les détails de votre commande", {
                    duration: 3000
                });
            }
        } else {
            console.error('❌ Paramètres Stripe invalides:', { success, orderId });
            setVerificationStatus('error');
        }
    }, [success, orderId, isAuthenticated, isLoading]);

    /**
     * GESTION DE LA CONNEXION AUTH0
     */
    const handleLogin = async () => {
        try {
            await loginWithRedirect({
                appState: { 
                    returnTo: `/stripe-success?success=true&orderId=${orderId}&session_id=${sessionId}` 
                }
            });
        } catch (error) {
            console.error('❌ Erreur connexion:', error);
            toast.error("Erreur de connexion");
        }
    };

    /**
     * RETRY MANUEL DE VÉRIFICATION
     */
    const handleRetry = () => {
        setRetryCount(0);
        setVerificationStatus('checking');
        checkOrderStatus();
    };

    // AFFICHAGE DE CHARGEMENT AUTH0
    if (isLoading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 flex items-center justify-center p-4">
                <Card className="w-full max-w-md text-center">
                    <CardContent className="pt-6">
                        <RefreshCw className="h-12 w-12 text-blue-600 animate-spin mx-auto mb-4" />
                        <h2 className="text-xl font-semibold mb-2">Chargement...</h2>
                        <p className="text-muted-foreground">Vérification de l'authentification</p>
                    </CardContent>
                </Card>
            </div>
        );
    }

    // GESTION D'ERREUR - Paramètres invalides
    if (success !== "true" || !orderId) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50 flex items-center justify-center p-4">
                <Card className="w-full max-w-md text-center border-red-200">
                    <CardHeader>
                        <AlertCircle className="h-12 w-12 text-red-600 mx-auto mb-4" />
                        <CardTitle className="text-red-800">Erreur de redirection</CardTitle>
                        <CardDescription>
                            Les paramètres de paiement sont invalides ou manquants.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Button onClick={() => navigate("/")} className="bg-red-600 hover:bg-red-700">
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            Retour à l'accueil
                        </Button>
                    </CardContent>
                </Card>
            </div>
        );
    }

    // PAGE PRINCIPALE DE SUCCÈS
    return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 py-8">
            <div className="container mx-auto px-4 max-w-2xl">
                <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
                    <CardHeader className="text-center pb-2">
                        <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-4 animate-pulse" />
                        <CardTitle className="text-2xl font-bold text-green-800 mb-2">
                            🎉 Paiement Réussi !
                        </CardTitle>
                        <CardDescription className="text-base">
                            Votre commande <span className="font-mono font-semibold">#{orderId?.slice(-8)}</span> a été payée avec succès
                        </CardDescription>
                    </CardHeader>

                    <CardContent className="space-y-6">
                        {/* Statut de vérification */}
                        {verificationStatus === 'checking' && (
                            <div className="text-center p-4 bg-blue-50 rounded-lg border border-blue-200">
                                <RefreshCw className="h-6 w-6 text-blue-600 animate-spin mx-auto mb-2" />
                                <p className="text-blue-800 font-medium">Vérification en cours...</p>
                            </div>
                        )}

                        {verificationStatus === 'success' && orderDetails && (
                            <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                                <h3 className="font-semibold text-green-800 mb-2">✅ Commande Confirmée</h3>
                                <div className="space-y-1 text-sm text-green-700">
                                    <p><span className="font-medium">Total:</span> {(orderDetails.totalAmount / 100).toFixed(2)} CHF</p>
                                    <p><span className="font-medium">Statut:</span> {orderDetails.status === 'paid' ? 'Payée' : 'En cours'}</p>
                                    <p><span className="font-medium">Articles:</span> {orderDetails.cartItems?.length || 0} article(s)</p>
                                </div>
                            </div>
                        )}

                        {verificationStatus === 'pending' && !isAuthenticated && (
                            <div className="text-center p-6 bg-amber-50 rounded-lg border border-amber-200">
                                <LogIn className="h-8 w-8 text-amber-600 mx-auto mb-3" />
                                <h3 className="font-semibold text-amber-800 mb-2">Connectez-vous pour plus de détails</h3>
                                <p className="text-amber-700 mb-4 text-sm">
                                    Votre paiement a été traité, mais vous devez être connecté pour voir les détails de votre commande.
                                </p>
                                <Button onClick={handleLogin} className="bg-amber-600 hover:bg-amber-700">
                                    <LogIn className="h-4 w-4 mr-2" />
                                    Se connecter
                                </Button>
                            </div>
                        )}

                        {verificationStatus === 'error' && (
                            <div className="text-center p-6 bg-red-50 rounded-lg border border-red-200">
                                <AlertCircle className="h-8 w-8 text-red-600 mx-auto mb-3" />
                                <h3 className="font-semibold text-red-800 mb-2">Erreur de vérification</h3>
                                <p className="text-red-700 mb-4 text-sm">
                                    Impossible de vérifier les détails de la commande pour le moment.
                                </p>
                                <Button onClick={handleRetry} variant="outline" className="mr-2">
                                    <RefreshCw className="h-4 w-4 mr-2" />
                                    Réessayer
                                </Button>
                            </div>
                        )}

                        {/* Actions */}
                        <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t">
                            <Button 
                                onClick={() => navigate("/order-status")} 
                                className="flex-1"
                            >
                                Voir mes commandes
                            </Button>
                            <Button 
                                onClick={() => navigate("/shop")} 
                                variant="outline"
                                className="flex-1"
                            >
                                Continuer mes achats
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default StripeSuccessPage;