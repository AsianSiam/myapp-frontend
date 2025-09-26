import { useAuth0 } from "@auth0/auth0-react";
import { Navigate, Outlet } from "react-router-dom";
import { Loader2, Shield, AlertTriangle } from "lucide-react";
import { useIsAdmin } from "@/api/AdminApi";

/**
 * ROUTE PROTÉGÉE ADMIN
 * 
 * Composant de protection des routes nécessitant des privilèges administrateur.
 * Combine authentification Auth0 + vérification statut admin côté serveur.
 * 
 * 🔐 SÉCURITÉ DOUBLE NIVEAU :
 * - Vérification authentification Auth0
 * - Validation statut admin via API backend
 * - Protection contre accès non autorisé
 * - Interface utilisateur claire pour chaque état
 * 
 * 🎯 UTILISATION :
 * - Routes admin sensibles (gestion boutique, commandes)
 * - Validation côté serveur avec Auth0 ID
 * - Gestion gracieuse des erreurs et états
 */
const AdminRoute = () => {
    const { isAuthenticated, isLoading: auth0Loading, user } = useAuth0();
    const { isAdmin, isLoading: adminLoading } = useIsAdmin();

    // Attendre la vérification Auth0
    if (auth0Loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <Loader2 className="h-12 w-12 animate-spin text-blue-600 mx-auto mb-4" />
                    <h2 className="text-lg font-semibold text-gray-900 mb-2">Authentification...</h2>
                    <p className="text-gray-600">Vérification de votre identité</p>
                </div>
            </div>
        );
    }

    // Redirection si non authentifié
    if (!isAuthenticated) {
        console.log('🔒 AdminRoute: Utilisateur non authentifié');
        return <Navigate to="/" replace />;
    }

    // Attendre la vérification du statut admin
    if (adminLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <Shield className="h-12 w-12 animate-pulse text-amber-600 mx-auto mb-4" />
                    <h2 className="text-lg font-semibold text-gray-900 mb-2">Vérification des privilèges...</h2>
                    <p className="text-gray-600">Validation de vos autorisations administrateur</p>
                </div>
            </div>
        );
    }

    // Accès refusé si non admin
    if (!isAdmin) {
        console.log('🚫 AdminRoute: Accès admin refusé pour:', user?.email);
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center max-w-md mx-auto p-8">
                    <AlertTriangle className="h-16 w-16 text-red-500 mx-auto mb-6" />
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">Accès Restreint</h2>
                    <p className="text-gray-600 mb-6">
                        Cette page est réservée aux administrateurs. 
                        Vous n'avez pas les privilèges nécessaires pour accéder à cette section.
                    </p>
                    <div className="space-y-2">
                        <button 
                            onClick={() => window.location.href = '/'}
                            className="w-full bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            Retour à l'accueil
                        </button>
                        <p className="text-sm text-gray-500">
                            Connecté en tant que: {user?.email}
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    // Accès autorisé - rendu du composant enfant
    console.log('✅ AdminRoute: Accès administrateur autorisé pour:', user?.email);
    return <Outlet />;
};

export default AdminRoute;