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
            <div className="flex justify-center items-center min-h-[400px]">
                <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    // Si c'est une redirection Stripe avec succès mais pas authentifié
    if (success === "true" && orderId && !isAuthenticated) {
        return (
            <div className="container mx-auto px-4 py-8">
                {/* Message de succès pour utilisateur non authentifié */}
                <Alert className="mb-6 border-green-200 bg-green-50">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <AlertTitle className="text-green-800">Paiement réussi !</AlertTitle>
                    <AlertDescription className="text-green-700">
                        Votre commande <strong>#{orderId}</strong> a été confirmée et est en cours de traitement.
                        Vous recevrez un email de confirmation sous peu.
                    </AlertDescription>
                </Alert>
                
                <div className="text-center space-y-4">
                    <h1 className="text-3xl font-bold">Paiement confirmé</h1>
                    <p className="text-gray-600">
                        Pour voir tous vos commandes, veuillez vous connecter.
                    </p>
                    <Button 
                        onClick={() => loginWithRedirect({
                            appState: { returnTo: `/order-status?orderId=${orderId}` }
                        })}
                        className="mt-4"
                    >
                        <LogIn className="mr-2 h-4 w-4" />
                        Se connecter
                    </Button>
                    <Button 
                        variant="outline"
                        onClick={() => navigate("/")}
                        className="mt-2 ml-2"
                    >
                        Retour à l'accueil
                    </Button>
                </div>
            </div>
        );
    }

    // Si pas authentifié et pas de redirection Stripe
    if (!isAuthenticated) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="text-center space-y-4">
                    <h1 className="text-3xl font-bold">Mes Commandes</h1>
                    <p className="text-gray-600">
                        Veuillez vous connecter pour voir vos commandes.
                    </p>
                    <Button 
                        onClick={() => loginWithRedirect()}
                        className="mt-4"
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
            <div className="flex justify-center items-center min-h-[400px]">
                <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    if (!orders || !Array.isArray(orders) || orders.length === 0) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="text-center space-y-4">
                    <h1 className="text-3xl font-bold">Mes Commandes</h1>
                    <p className="text-gray-600">Aucune commande trouvée.</p>
                    <Button 
                        onClick={() => navigate("/shop")}
                        className="mt-4"
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
        <div className="container mx-auto px-4 py-8">
            {/* Message de succès après paiement */}
            {showSuccessMessage && targetOrder && (
                <Alert className="mb-6 border-green-200 bg-green-50">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <AlertTitle className="text-green-800">Paiement réussi !</AlertTitle>
                    <AlertDescription className="text-green-700">
                        Votre commande <strong>#{targetOrder._id}</strong> a été confirmée et est en cours de traitement.
                        Vous recevrez un email de confirmation sous peu.
                        <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={handleDismissSuccess}
                            className="ml-2 text-green-700 hover:text-green-900"
                        >
                            ✕
                        </Button>
                    </AlertDescription>
                </Alert>
            )}

            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <h1 className="text-3xl font-bold">
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
                            className="text-gray-600 hover:text-gray-900"
                        >
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Voir toutes mes commandes
                        </Button>
                    )}
                </div>

                <div className="space-y-4">
                    {ordersToDisplay.map((order) => {
                        // Déterminer si la commande doit être déroulée par défaut
                        // - Commandes récentes (dernière commande ou ciblée par orderId) : déroulées
                        // - Commandes terminées (delivered) : enroulées par défaut
                        const isTargetOrder = orderId && order._id === orderId;
                        const isFirstOrder = !orderId && ordersToDisplay.indexOf(order) === 0;
                        const isCompleted = order.status === "delivered";
                        const defaultExpanded = isTargetOrder || isFirstOrder || !isCompleted;

                        return (
                            <OrderAccordion 
                                key={order._id} 
                                order={order} 
                                defaultExpanded={defaultExpanded}
                            />
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default OrderStatusPage;