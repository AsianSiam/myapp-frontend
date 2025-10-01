import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import AdminArticleForm from "@/forms/admin/AdminArticleForm";
import AdvancedArticleSearch from "@/components/AdvancedArticleSearch";
import OrderManagement from "@/components/OrderManagement/OrderManagement";
import { useGetAllArticlesAdmin, useCreateArticleAdmin, useUpdateArticleAdmin, useDeleteArticleAdmin, useGetAllOrdersAdmin, useUpdateOrderStatusAdmin, useGetAdminUsers, useGetAllUsers } from "@/api/AdminApi";
import type { ArticleShop } from "@/types";
import { useState } from "react";

/**
 * PAGE DE GESTION BOUTIQUE - ADMINISTRATEURS UNIQUEMENT
 * 
 * Cette page est protégée par AdminRoute et ne doit contenir aucune logique
 * de vérification d'accès supplémentaire. La sécurité est gérée en amont.
 * 
 * 🛡️ SÉCURITÉ :
 * - Accès contrôlé par AdminRoute (AUTH0_IDS)
 * - Double validation côté serveur pour toutes les APIs
 * - Middleware admin.ts pour validation Auth0 ID
 * 
 * 🎯 FONCTIONNALITÉS :
 * - Gestion des articles (création, modification, suppression)
 * - Gestion des commandes et statuts
 * - Panel administrateurs et utilisateurs
 * - Recherche avancée et statistiques
 */
const ManageShopPage = () => {
    const { articles, isLoading: isLoadingArticles, refetch: refetchArticles } = useGetAllArticlesAdmin();
    const { createArticle, isLoading: isCreatingArticle } = useCreateArticleAdmin();
    const { updateArticle, isLoading: isUpdatingArticle } = useUpdateArticleAdmin();
    const { deleteArticle, isLoading: isDeletingArticle } = useDeleteArticleAdmin();
    const { orders, isLoading: isLoadingOrders, refetch: refetchOrders } = useGetAllOrdersAdmin();
    const { updateOrderStatus, isLoading: isUpdatingOrderStatus } = useUpdateOrderStatusAdmin();
    const { data: adminData, isLoading: isLoadingAdmins } = useGetAdminUsers();
    const { data: allUsers, isLoading: isLoadingAllUsers } = useGetAllUsers();
    
    const [editingArticle, setEditingArticle] = useState<ArticleShop | null>(null);
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [filteredArticles, setFilteredArticles] = useState<ArticleShop[]>([]);

    const handleCreateArticle = (formData: FormData) => {
        createArticle(formData, {
            onSuccess: () => {
                setShowCreateForm(false);
                refetchArticles();
            },
        });
    };

    const handleUpdateArticle = (formData: FormData) => {
        if (!editingArticle) return;
        
        updateArticle({ 
            articleId: editingArticle._id, 
            articleFormData: formData 
        }, {
            onSuccess: () => {
                setEditingArticle(null);
                refetchArticles();
            },
        });
    };

    const handleDeleteArticle = (articleId: string) => {
        if (window.confirm("Êtes-vous sûr de vouloir supprimer cet article ?")) {
            deleteArticle(articleId);
        }
    };

    const handleUpdateOrderStatus = (orderId: string, status: string) => {
        updateOrderStatus({ orderId, status }, {
            onSuccess: () => {
                // Refresh automatique des commandes après mise à jour
                refetchOrders();
            }
        });
    };

    const handleSearchResults = (results: ArticleShop[]) => {
        setFilteredArticles(results);
    };

    return (
        <div className="admin-layout">
            <div className="app-container py-8">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-app-primary">Panneau de contrôle administrateur</h1>
                    <p className="text-app-secondary mt-2">Administration de la boutique</p>
                </div>

            <Tabs defaultValue="orders" className="w-full">
                <TabsList className="grid w-full grid-cols-4 content-card rounded-lg border-0">
                    <TabsTrigger value="orders" className="rounded-lg hover-blue-accent color-transition">
                        Commandes ({orders?.length || 0})
                    </TabsTrigger>
                    <TabsTrigger value="create-article" className="rounded-lg hover-blue-accent color-transition">
                        Créer un article
                    </TabsTrigger>
                    <TabsTrigger value="manage-articles" className="rounded-lg hover-blue-accent color-transition">
                        Gérer les articles ({articles?.length || 0})
                    </TabsTrigger>
                    <TabsTrigger value="admin-users" className="rounded-lg hover-blue-accent color-transition">
                        Administrateurs
                    </TabsTrigger>
                </TabsList>

                {/* Onglet Commandes */}
                <TabsContent value="orders" className="space-y-6 mt-6">
                    <div className="content-card rounded-2xl border-0">
                        <OrderManagement
                            orders={orders}
                            isLoading={isLoadingOrders}
                            onUpdateOrderStatus={handleUpdateOrderStatus}
                            isUpdatingStatus={isUpdatingOrderStatus}
                            onRefresh={refetchOrders}
                        />
                    </div>
                </TabsContent>

                {/* Onglet Création d'article */}
                <TabsContent value="create-article" className="space-y-6 mt-6">
                    <div className="content-card rounded-2xl border-0 p-8">
                        <AdminArticleForm 
                            onSave={handleCreateArticle}
                            isLoading={isCreatingArticle}
                        />
                    </div>
                </TabsContent>

                {/* Onglet Gestion des articles */}
                <TabsContent value="manage-articles" className="space-y-6 mt-6">
                    <div className="content-card rounded-2xl border-0 p-8">
                        <div className="flex justify-between items-center mb-8">
                            <h2 className="text-2xl font-bold text-app-primary">Tous les articles</h2>
                            <Button 
                                onClick={() => setShowCreateForm(true)}
                                className="search-button rounded-lg"
                            >
                                Ajouter un article
                            </Button>
                        </div>

                        {/* Composant de recherche avancée */}
                        <AdvancedArticleSearch 
                            articles={articles || []}
                            isLoading={isLoadingArticles}
                            onSearchResults={handleSearchResults}
                            searchPlaceholder="Rechercher par nom, description, catégorie ou ID d'article"
                            showResultInfo={true}
                            resultInfoCategory="Articles"
                            resultInfoId="admin"
                        />

                        {/* Liste des articles filtrés */}
                        {!isLoadingArticles && (
                            <div className="mt-8">
                                {filteredArticles && filteredArticles.length > 0 ? (
                                    <div className="grid gap-4">
                                        {filteredArticles.map((article: ArticleShop) => (
                                            <div key={article._id} className="content-card rounded-xl hover:shadow-md smooth-transition">
                                                <div className="flex flex-col md:flex-row items-start gap-4">
                                                    <img 
                                                        src={article.imageUrl} 
                                                        alt={article.name}
                                                        className="w-full h-32 md:w-16 md:h-16 object-cover rounded-lg shadow-sm"
                                                    />
                                                    <div className="flex-1 min-w-0">
                                                        <h3 className="font-semibold text-app-primary text-lg md:text-base truncate">{article.name}</h3>
                                                        <p className="text-sm text-app-secondary mb-2 line-clamp-2">{article.description}</p>
                                                        <div className="flex flex-wrap gap-2 md:gap-4 text-xs md:text-sm text-app-secondary">
                                                            <span className="info-badge">{article.category}</span>
                                                            <span className="font-medium text-app-primary">CHF {(article.price / 100).toFixed(2)}</span>
                                                            <span>Stock: {article.stock}</span>
                                                            <span className="hidden md:inline">Note: {article.rating || 0}/5</span>
                                                        </div>
                                                        <div className="mt-2 md:hidden">
                                                            <span className="text-xs text-app-tertiary">ID: {article._id}</span>
                                                        </div>
                                                        <div className="hidden md:block mt-1">
                                                            <span className="text-xs text-app-tertiary">ID: <code className="code-snippet">{article._id}</code></span>
                                                        </div>
                                                    </div>
                                                    <div className="flex flex-row md:flex-col gap-2 w-full md:w-auto">
                                                        <Button 
                                                            size="sm" 
                                                            variant="outline"
                                                            onClick={() => setEditingArticle(article)}
                                                            className="flex-1 md:flex-none text-xs md:text-sm button-outline hover-blue-accent"
                                                        >
                                                            Modifier
                                                        </Button>
                                                        <Button 
                                                            size="sm" 
                                                            variant="destructive"
                                                            onClick={() => handleDeleteArticle(article._id)}
                                                            disabled={isDeletingArticle}
                                                            className="flex-1 md:flex-none text-xs md:text-sm hover:bg-red-600 smooth-transition"
                                                        >
                                                            Supprimer
                                                        </Button>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-12 bg-app-surface rounded-xl border border-app">
                                        <div className="text-app-tertiary">
                                            <svg className="mx-auto h-12 w-12 text-app-muted-foreground mb-4" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 14v20c0 4.418 7.163 8 16 8 1.381 0 2.721-.087 4-.252M8 14c0 4.418 7.163 8 16 8s16-3.582 16-8M8 14c0-4.418 7.163-8 16-8s16 3.582 16 8m0 0v14m-46-4c0 4.418 7.163 8 16 8 1.381 0 2.721-.087 4-.252" />
                                            </svg>
                                            <h3 className="text-lg font-medium text-app-primary mb-2">Aucun article trouvé</h3>
                                            <p className="text-sm text-app-secondary">
                                                {articles && articles.length > 0 
                                                    ? "Essayez de modifier vos critères de recherche ou filtres."
                                                    : "Commencez par créer votre premier article."
                                                }
                                            </p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Modal d'édition */}
                    {editingArticle && (
                        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                            <div className="content-card rounded-2xl max-w-4xl w-full mx-4 max-h-[95vh] overflow-y-auto border-0">
                                <AdminArticleForm 
                                    article={editingArticle}
                                    onSave={handleUpdateArticle}
                                    isLoading={isUpdatingArticle}
                                    onCancel={() => setEditingArticle(null)}
                                />
                            </div>
                        </div>
                    )}

                    {/* Modal de création */}
                    {showCreateForm && (
                        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                            <div className="content-card rounded-2xl max-w-4xl w-full mx-4 max-h-[95vh] overflow-y-auto border-0">
                                <AdminArticleForm 
                                    onSave={handleCreateArticle}
                                    isLoading={isCreatingArticle}
                                    onCancel={() => setShowCreateForm(false)}
                                />
                            </div>
                        </div>
                    )}
                </TabsContent>

                {/* Onglet Gestion des Administrateurs */}
                <TabsContent value="admin-users" className="space-y-6 mt-6">
                    <div className="content-card rounded-2xl border-0 p-8">
                        <h2 className="text-2xl font-bold text-app-primary mb-6">Gestion des Administrateurs</h2>
                        
                        {/* Informations actuelles */}
                        <div className="mb-8">
                            <h3 className="text-lg font-semibold text-app-primary mb-4">Administrateurs actuels</h3>
                            {isLoadingAdmins ? (
                                <div className="text-center py-8">
                                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-app-primary mx-auto mb-2"></div>
                                    <p className="text-app-secondary">Chargement...</p>
                                </div>
                            ) : adminData ? (
                                <div className="space-y-4">
                                    {adminData.adminUsers && adminData.adminUsers.length > 0 ? (
                                        adminData.adminUsers.map((admin: any) => (
                                            <div key={admin.auth0Id} className="flex items-center justify-between p-4 bg-app-surface rounded-xl border border-app">
                                                <div>
                                                    <p className="font-medium text-app-primary">{admin.name} {admin.firstname}</p>
                                                    <p className="text-sm text-app-secondary">{admin.email}</p>
                                                    <p className="text-xs text-app-tertiary font-mono">ID Auth0: {admin.auth0Id}</p>
                                                </div>
                                                <span className="px-3 py-1 bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-400 text-sm rounded-full font-medium">
                                                    Admin
                                                </span>
                                            </div>
                                        ))
                                    ) : (
                                        <p className="text-app-secondary">Aucun administrateur trouvé dans la base de données.</p>
                                    )}
                                    
                                    {/* Affichage des IDs configurés dans l'environnement */}
                                    {adminData.adminIds && adminData.adminIds.length > 0 && (
                                        <div className="mt-6 p-6 content-card border-0 rounded-xl hover:bg-app-surface smooth-transition">
                                            <h4 className="font-semibold text-blue-600 dark:text-blue-400 mb-3 hover-blue-accent">
                                                IDs Admin configurés (variables d'environnement) :
                                            </h4>
                                            <div className="space-y-2">
                                                {adminData.adminIds.map((id: string, index: number) => (
                                                    <p key={index} className="text-sm text-app-secondary font-mono code-snippet cursor-pointer">
                                                        {id}
                                                    </p>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <p className="text-app-secondary">Impossible de charger les informations des administrateurs.</p>
                            )}
                        </div>

                        {/* Instructions de configuration */}
                        <div className="content-card border-0 rounded-xl p-6 hover:bg-app-surface smooth-transition">
                            <h3 className="text-lg font-semibold text-yellow-600 dark:text-yellow-400 mb-3 hover-accent">
                                Configuration des Administrateurs
                            </h3>
                            <div className="text-sm text-app-secondary space-y-3">
                                <p>
                                    <strong className="text-app-primary">Méthode actuelle :</strong> Les administrateurs sont configurés via la variable d'environnement 
                                    <code className="code-snippet">ADMIN_AUTH0_IDS</code> 
                                    dans le fichier <code className="code-snippet">.env</code> du backend.
                                </p>
                                <p>
                                    <strong className="text-app-primary">Format :</strong> <code className="code-snippet">ADMIN_AUTH0_IDS=id1,id2,id3</code>
                                </p>
                                <p>
                                    <strong className="text-app-primary">Pour ajouter un admin :</strong>
                                </p>
                                <ol className="list-decimal list-inside ml-4 space-y-2 text-app-secondary">
                                    <li className="hover:text-app-primary transition-colors">Récupérer l'ID Auth0 de l'utilisateur (visible ci-dessous)</li>
                                    <li className="hover:text-app-primary transition-colors">Ajouter l'ID dans la variable d'environnement (séparé par des virgules)</li>
                                    <li className="hover:text-app-primary transition-colors">Redémarrer le serveur backend</li>
                                </ol>
                            </div>
                        </div>

                        {/* Liste de tous les utilisateurs */}
                        <div className="mt-8">
                            <h3 className="text-lg font-semibold text-app-primary mb-4">Tous les Utilisateurs</h3>
                            {isLoadingAllUsers ? (
                                <div className="text-center py-8">
                                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-app-primary mx-auto mb-2"></div>
                                    <p className="text-app-secondary">Chargement des utilisateurs...</p>
                                </div>
                            ) : allUsers && allUsers.length > 0 ? (
                                <div className="space-y-3 max-h-96 overflow-y-auto bg-app-surface rounded-xl p-4 border border-app">
                                    {allUsers.map((user: any) => {
                                        const isCurrentAdmin = adminData?.adminIds?.includes(user.auth0Id);
                                        return (
                                            <div key={user._id} className="flex items-center justify-between p-4 content-card rounded-lg border-0">
                                                <div>
                                                    <p className="font-medium text-app-primary">{user.name} {user.firstname}</p>
                                                    <p className="text-sm text-app-secondary">{user.email}</p>
                                                    <p className="text-xs text-app-tertiary font-mono">ID: {user.auth0Id}</p>
                                                </div>
                                                <div className="flex items-center space-x-3">
                                                    {isCurrentAdmin ? (
                                                        <span className="px-3 py-1 bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-400 text-sm rounded-full font-medium">
                                                            Admin
                                                        </span>
                                                    ) : (
                                                        <span className="px-3 py-1 bg-app-muted text-app-secondary text-sm rounded-full font-medium">
                                                            Utilisateur
                                                        </span>
                                                    )}
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        onClick={() => {
                                                            navigator.clipboard.writeText(user.auth0Id);
                                                            alert("ID copié dans le presse-papier !");
                                                        }}
                                                        className="button-outline hover-blue-accent text-sm"
                                                    >
                                                        Copier ID
                                                    </Button>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            ) : (
                                <p className="text-app-secondary">Aucun utilisateur trouvé.</p>
                            )}
                        </div>
                    </div>
                </TabsContent>
            </Tabs>
            </div>
        </div>
    );
};

export default ManageShopPage;