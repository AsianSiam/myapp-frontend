import { useAuth0 } from "@auth0/auth0-react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { Loader2 } from "lucide-react";

/**
 * ROUTE PROTÉGÉE AVEC AUTHENTIFICATION AUTH0
 * 
 * Composant de protection des routes nécessitant une authentification.
 * Gère intelligemment les redirections et préserve la destination initiale.
 * 
 * 🔐 SÉCURITÉ :
 * - Vérification stricte de l'authentification
 * - Préservation de l'URL de destination
 * - Gestion des états de chargement
 * - Protection contre les accès non autorisés
 * 
 * 🔄 REDIRECTIONS :
 * - Si non authentifié : redirection vers accueil
 * - Préservation de l'URL pour retour post-connexion
 * - Interface de chargement pendant validation
 */
const ProtectedRoute = () => {
    const { isAuthenticated, isLoading, loginWithRedirect } = useAuth0();
    const location = useLocation();

    // Affichage du loader pendant la vérification Auth0
    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <Loader2 className="h-12 w-12 animate-spin text-blue-600 mx-auto mb-4" />
                    <h2 className="text-lg font-semibold text-gray-900 mb-2">Vérification...</h2>
                    <p className="text-gray-600">Validation de votre authentification</p>
                </div>
            </div>
        );
    }

    // Si non authentifié, déclenchement de la connexion avec préservation de l'URL
    if (!isAuthenticated) {
        console.log('🔒 Accès protégé refusé - Redirection vers Auth0');
        console.log('📍 URL de destination préservée:', location.pathname + location.search);
        
        // Redirection immédiate vers Auth0 avec paramètre returnTo encodé dans l'URL
        const returnToUrl = encodeURIComponent(location.pathname + location.search);
        loginWithRedirect({
            authorizationParams: {
                redirect_uri: `${window.location.origin}/auth-callback?returnTo=${returnToUrl}`
            }
        });

        // Affichage temporaire pendant la redirection
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <div className="animate-pulse">
                        <h2 className="text-lg font-semibold text-gray-900 mb-2">Authentification requise</h2>
                        <p className="text-gray-600">Redirection vers la connexion...</p>
                    </div>
                </div>
            </div>
        );
    }

    // Si authentifié, rendu du composant enfant
    console.log('✅ Accès autorisé - Utilisateur authentifié');
    return <Outlet />;
};

export default ProtectedRoute;