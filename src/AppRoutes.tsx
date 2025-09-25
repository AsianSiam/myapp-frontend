import { Navigate, Route, Routes } from "react-router-dom";
import Layout from "./layout/layout";
import HomePage from "./pages/HomePage";
import AuthCallbackPage from "./pages/AuthCallbackPage";
import UserProfilePage from "./pages/UserProfilePage";
import ProtectedRoute from "./auth/ProtectedRoute";
import ManageShopPage from "./pages/ManageShopPage";
import OrderStatusPage from "./pages/OrderStatusPage";
import ShopPage from "./pages/ShopPage";
import ArticleDetailPage from "./pages/ArticleDetailPage";
import StripeSuccessPage from "./pages/StripeSuccessPage";

/**
 * Configuration des routes de l'application
 * Gère la navigation entre les différentes pages et la protection des routes
 */
const AppRoutes = () => {
    return (
        <Routes>
            {/* Page d'accueil avec Hero */}
            <Route path="/" element={<Layout showHero><HomePage/></Layout>} />
            
            {/* Callback Auth0 pour l'authentification */}
            <Route path="/auth-callback" element={<AuthCallbackPage/>} />            
            
            {/* Pages publiques - Boutique */}
            <Route path="/shop" element={<Layout showHero={false}><ShopPage /></Layout>} />
            <Route path="/article/:id" element={<Layout showHero={false}><ArticleDetailPage /></Layout>} />
            
            {/* Pages de statut des commandes - Accessibles sans authentification pour les redirections Stripe */}
            <Route path="/order-status" element={<Layout><OrderStatusPage /></Layout>} />
            <Route path="/stripe-success" element={<Layout showHero={false}><StripeSuccessPage /></Layout>} />
            
            {/* Routes protégées - Nécessitent une authentification */}
            <Route element={<ProtectedRoute /> }>
                <Route path="/user-profile" element={<Layout><UserProfilePage /></Layout>} />
                <Route path="/manage-shop" element={<Layout><ManageShopPage /></Layout>} />
            </Route>                        
            
            {/* Route de fallback - Redirige vers l'accueil */}
            <Route path="*" element={<Navigate to="/" />} />
        </Routes>
    );
}

export default AppRoutes;