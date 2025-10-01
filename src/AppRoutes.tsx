import { Navigate, Route, Routes } from "react-router-dom";
import { lazy, Suspense } from "react";
import Layout from "./layout/layout";
import HomePage from "./pages/HomePage";
import AuthCallbackPage from "./pages/AuthCallbackPage";
import ShopPage from "./pages/ShopPage";
import ArticleDetailPage from "./pages/ArticleDetailPage";
import ProtectedRoute from "./auth/ProtectedRoute";
import AdminRoute from "./auth/AdminRoute";

// Lazy loading pour les pages moins critiques
const UserProfilePage = lazy(() => import("./pages/UserProfilePage"));
const ManageShopPage = lazy(() => import("./pages/ManageShopPage"));
const OrderStatusPage = lazy(() => import("./pages/OrderStatusPage"));
const StripeSuccessPage = lazy(() => import("./pages/StripeSuccessPage"));
const CheckoutShopPage = lazy(() => import("./pages/CheckoutShopPage"));

// Composant de loading
const PageLoader = () => (
    <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
    </div>
);

/**
 * CONFIGURATION DES ROUTES APPLICATION
 * 
 * Organisation hiérarchique des routes avec sécurité multi-niveaux :
 * 
 * 🌐 ROUTES PUBLIQUES :
 * - Accueil, boutique, détails articles
 * - Pages de statut commandes (accessibles via Stripe)
 * 
 * 🔐 ROUTES PROTÉGÉES (Authentification) :
 * - Profil utilisateur
 * 
 * 🛡️ ROUTES ADMIN (Authentification + Privilèges) :
 * - Gestion boutique, commandes, utilisateurs
 * 
 * 🎯 CALLBACK AUTH0 :
 * - Route unique sécurisée pour traitement authentification
 */
const AppRoutes = () => {
    return (
        <Routes>
            {/* Page d'accueil avec Hero */}
            <Route path="/" element={<Layout showHero><HomePage/></Layout>} />
            
            {/* Callback Auth0 unique - Route sécurisée pour authentification */}
            <Route path="/auth-callback" element={<AuthCallbackPage/>} />            
            
            {/* Pages publiques - Boutique et navigation */}
            <Route path="/shop" element={<Layout showHero={false}><ShopPage /></Layout>} />
            <Route path="/article/:id" element={<Layout showHero={false}><ArticleDetailPage /></Layout>} />
            
            {/* Pages de statut commandes - Publiques pour redirections Stripe */}
            <Route path="/order-status" element={
                <Layout>
                    <Suspense fallback={<PageLoader />}>
                        <OrderStatusPage />
                    </Suspense>
                </Layout>
            } />
            <Route path="/stripe-success" element={
                <Layout showHero={false}>
                    <Suspense fallback={<PageLoader />}>
                        <StripeSuccessPage />
                    </Suspense>
                </Layout>
            } />
            
            {/* Routes protégées - Authentification requise */}
            <Route element={<ProtectedRoute />}>
                <Route path="/user-profile" element={
                    <Layout>
                        <Suspense fallback={<PageLoader />}>
                            <UserProfilePage />
                        </Suspense>
                    </Layout>
                } />
                <Route path="/checkout" element={
                    <Layout showHero={false}>
                        <Suspense fallback={<PageLoader />}>
                            <CheckoutShopPage />
                        </Suspense>
                    </Layout>
                } />
            </Route>
            
            {/* Routes administrateur - Authentification + Privilèges admin */}
            <Route element={<AdminRoute />}>
                <Route path="/manage-shop" element={
                    <Layout>
                        <Suspense fallback={<PageLoader />}>
                            <ManageShopPage />
                        </Suspense>
                    </Layout>
                } />
            </Route>                        
            
            {/* Route de fallback - Redirige vers l'accueil */}
            <Route path="*" element={<Navigate to="/" />} />
        </Routes>
    );
}

export default AppRoutes;