import { useGetMyOrders } from "@/api/OrderApi";
import OrderAccordion from "../components/OrderAccordion";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { CheckCircle, ArrowLeft, LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useAuth0 } from "@auth0/auth0-react";

const OrderStatusPage = () => {
    const { orders, isLoading: ordersLoading } = useGetMyOrders();
    const { isAuthenticated, isLoading: authLoading, loginWithRedirect } = useAuth0();
    const [searchParams, setSearchParams] = useSearchParams();
    const navigate = useNavigate();
    const [showSuccessMessage, setShowSuccessMessage] = useState(false);
    
    const success = searchParams.get("success");
    const orderId = searchParams.get("orderId");
    const sessionId = searchParams.get("session_id");

    // Debug logs
    console.log("🔍 OrderStatusPage - Debug Info:");
    console.log("Success:", success);
    console.log("OrderId:", orderId);
    console.log("SessionId:", sessionId);
    console.log("IsAuthenticated:", isAuthenticated);
    console.log("AuthLoading:", authLoading);
    console.log("Orders:", orders);
    console.log("OrdersLoading:", ordersLoading);

    useEffect(() => {
        console.log("🔄 UseEffect déclenché - Success:", success, "OrderId:", orderId);
        if (success === "true" && orderId) {
            console.log("✅ Conditions remplies - Affichage message de succès");
            setShowSuccessMessage(true);
            toast.success("Paiement réussi ! Votre commande a été confirmée.", {
                duration: 5000,
            });
        }
    }, [success, orderId]);

    const handleDismissSuccess = () => {
        setShowSuccessMessage(false);
        // Nettoyer les paramètres d'URL
        const newSearchParams = new URLSearchParams(searchParams);
        newSearchParams.delete("success");
        newSearchParams.delete("orderId");
        setSearchParams(newSearchParams);
    };

    // Si Auth0 est en train de charger, afficher le loader
    if (authLoading) {
        return (
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="flex justify-center items-center min-h-[400px]">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
                </div>
            </div>
        );
    }

    // Si c'est une redirection Stripe avec succès mais pas authentifié
    if (success === "true" && orderId && !isAuthenticated) {
        return (
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Message de succès pour utilisateur non authentifié */}
                <Alert className="mb-8 border-green-200 bg-green-50 rounded-xl shadow-sm">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <AlertTitle className="text-green-800 text-lg font-semibold">Paiement réussi !</AlertTitle>
                    <AlertDescription className="text-green-700 mt-2">
                        Votre commande <strong>#{orderId}</strong> a été confirmée et est en cours de traitement.
                        Vous recevrez un email de confirmation sous peu.
                    </AlertDescription>
                </Alert>
                
                <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8 text-center">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <CheckCircle className="h-8 w-8 text-green-600" />
                    </div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-4">Paiement confirmé</h1>
                    <p className="text-gray-600 mb-8">
                        Pour voir toutes vos commandes, veuillez vous connecter.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Button 
                            onClick={() => loginWithRedirect({
                                appState: { returnTo: `/order-status?orderId=${orderId}` }
                            })}
                            className="bg-gray-700 hover:bg-gray-800 text-white rounded-lg shadow-sm"
                        >
                            <LogIn className="mr-2 h-4 w-4" />
                            Se connecter
                        </Button>
                        <Button 
                            variant="outline"
                            onClick={() => navigate("/")}
                            className="border-gray-300 hover:bg-gray-50 rounded-lg"
                        >
                            Retour à l'accueil
                        </Button>
                    </div>
                </div>
            </div>
        );
    }

    // Si pas authentifié et pas de redirection Stripe
    if (!isAuthenticated) {
        return (
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8 text-center">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <LogIn className="h-8 w-8 text-gray-400" />
                    </div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-4">Mes Commandes</h1>
                    <p className="text-gray-600 mb-8">
                        Veuillez vous connecter pour voir vos commandes.
                    </p>
                    <Button 
                        onClick={() => loginWithRedirect()}
                        className="bg-gray-700 hover:bg-gray-800 text-white rounded-lg shadow-sm"
                    >
                        <LogIn className="mr-2 h-4 w-4" />
                        Se connecter
                    </Button>
                </div>
            </div>
        );
    }

    // Si les commandes sont en cours de chargement
    if (ordersLoading) {
        return (
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="flex justify-center items-center min-h-[400px]">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
                </div>
            </div>
        );
    }

    if (!orders || !Array.isArray(orders) || orders.length === 0) {
        return (
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8 text-center">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <svg className="h-8 w-8 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 14v20c0 4.418 7.163 8 16 8 1.381 0 2.721-.087 4-.252M8 14c0 4.418 7.163 8 16 8s16-3.582 16-8M8 14c0-4.418 7.163-8 16-8s16 3.582 16 8m0 0v14m-46-4c0 4.418 7.163 8 16 8 1.381 0 2.721-.087 4-.252" />
                        </svg>
                    </div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-4">Mes Commandes</h1>
                    <p className="text-gray-600 mb-8">Aucune commande trouvée.</p>
                    <Button 
                        onClick={() => navigate("/shop")}
                        className="bg-gray-700 hover:bg-gray-800 text-white rounded-lg shadow-sm"
                    >
                        Découvrir nos articles
                    </Button>
                </div>
            </div>
        );
    }

    // Si on a un orderId spécifique, on trouve cette commande
    const targetOrder = orderId ? orders.find(order => order._id === orderId) : null;
    const ordersToDisplay = targetOrder ? [targetOrder] : orders;

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Message de succès après paiement */}
            {showSuccessMessage && targetOrder && (
                <Alert className="mb-8 border-green-200 bg-green-50 rounded-xl shadow-sm">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <AlertTitle className="text-green-800 text-lg font-semibold">Paiement réussi !</AlertTitle>
                    <AlertDescription className="text-green-700 mt-2">
                        Votre commande <strong>#{targetOrder._id}</strong> a été confirmée et est en cours de traitement.
                        Vous recevrez un email de confirmation sous peu.
                        <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={handleDismissSuccess}
                            className="ml-3 text-green-700 hover:text-green-900 hover:bg-green-100 rounded-lg"
                        >
                            ✕
                        </Button>
                    </AlertDescription>
                </Alert>
            )}

            <div className="space-y-8">
                <div className="flex items-center justify-between">
                    <h1 className="text-3xl font-bold text-gray-900">
                        {targetOrder ? "Détails de votre commande" : "Mes Commandes"}
                    </h1>
                    {targetOrder && (
                        <Button
                            variant="ghost"
                            onClick={() => {
                                // Nettoyer les paramètres et retourner à toutes les commandes
                                const newSearchParams = new URLSearchParams();
                                setSearchParams(newSearchParams);
                                setShowSuccessMessage(false);
                            }}
                            className="text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg"
                        >
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Voir toutes mes commandes
                        </Button>
                    )}
                </div>

                <div className="space-y-6">
                    {ordersToDisplay.map((order) => {
                        // Déterminer si la commande doit être déroulée par défaut
                        // - Commandes récentes (dernière commande ou ciblée par orderId) : déroulées
                        // - Commandes terminées (delivered) : enroulées par défaut
                        const isTargetOrder = orderId && order._id === orderId;
                        const isFirstOrder = !orderId && ordersToDisplay.indexOf(order) === 0;
                        const isCompleted = order.status === "livré";
                        const defaultExpanded = isTargetOrder || isFirstOrder || !isCompleted;

                        return (
                            <div key={order._id} className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
                                <OrderAccordion 
                                    order={order} 
                                    defaultExpanded={defaultExpanded}
                                />
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default OrderStatusPage;