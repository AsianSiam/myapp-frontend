import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import AdminArticleForm from "@/forms/admin/AdminArticleForm";
import AdvancedArticleSearch from "@/components/AdvancedArticleSearch";
import OrderManagement from "@/components/OrderManagement/OrderManagement";
import OrderFlowDemo from "@/components/OrderFlowDemo";
import { useIsAdmin, useGetAllArticlesAdmin, useCreateArticleAdmin, useUpdateArticleAdmin, useDeleteArticleAdmin, useGetAllOrdersAdmin, useUpdateOrderStatusAdmin, useGetAdminUsers, useGetAllUsers } from "@/api/AdminApi";
import type { ArticleShop } from "@/types";
import { useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";

const ManageShopPage = () => {
    const { user } = useAuth0();
    const { isAdmin, isLoading: isCheckingAdmin } = useIsAdmin();
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

    // Vérification d'authentification et d'autorisation admin
    if (isCheckingAdmin) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-4"></div>
                    <p>Vérification des autorisations...</p>
                </div>
            </div>
        );
    }

    if (!user) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">
                        Accès restreint
                    </h2>
                    <p className="text-gray-600 mb-8">
                        Vous devez être connecté pour accéder à cette page.
                    </p>
                    <Button onClick={() => window.location.href = '/auth/login'}>
                        Se connecter
                    </Button>
                </div>
            </div>
        );
    }

    if (!isAdmin) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-red-600 mb-4">
                        Accès non autorisé
                    </h2>
                    <p className="text-gray-600 mb-8">
                        Seuls les administrateurs peuvent accéder à cette page.
                    </p>
                    <Button onClick={() => window.location.href = '/'} variant="outline">
                        Retour à l'accueil
                    </Button>
                </div>
            </div>
        );
    }

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
        <div className="container mx-auto px-4 py-8">
            <div className="mb-6">
                <h1 className="text-3xl font-bold text-gray-900">Panneau de contrôle administrateur</h1>
                <p className="text-gray-600 mt-2">Administration de la boutique</p>
            </div>

            <Tabs defaultValue="orders" className="w-full">
                <TabsList className="grid w-full grid-cols-5">
                    <TabsTrigger value="orders">
                        Commandes ({orders?.length || 0})
                    </TabsTrigger>
                    <TabsTrigger value="create-article">
                        Créer un article
                    </TabsTrigger>
                    <TabsTrigger value="manage-articles">
                        Gérer les articles ({articles?.length || 0})
                    </TabsTrigger>
                    <TabsTrigger value="webhook-test">
                        Tests Stripe
                    </TabsTrigger>
                    <TabsTrigger value="admin-users">
                        Administrateurs
                    </TabsTrigger>
                </TabsList>

                {/* Onglet Commandes */}
                <TabsContent value="orders" className="space-y-6">
                    <OrderManagement
                        orders={orders}
                        isLoading={isLoadingOrders}
                        onUpdateOrderStatus={handleUpdateOrderStatus}
                        isUpdatingStatus={isUpdatingOrderStatus}
                        onRefresh={refetchOrders}
                    />
                </TabsContent>

                {/* Onglet Tests Webhook */}
                <TabsContent value="webhook-test" className="space-y-6">
                    <div className="bg-white p-6 rounded-lg shadow">
                        <h2 className="text-xl font-semibold mb-4">Démonstration du Processus de Commande</h2>
                        <p className="text-gray-600 mb-6">
                            Visualisation du processus de commande et des différentes étapes de traitement.
                        </p>
                        <div className="flex justify-center">
                            <OrderFlowDemo />
                        </div>
                    </div>
                </TabsContent>

                {/* Onglet Création d'article */}
                <TabsContent value="create-article" className="space-y-6">
                    <AdminArticleForm 
                        onSave={handleCreateArticle}
                        isLoading={isCreatingArticle}
                    />
                </TabsContent>

                {/* Onglet Gestion des articles */}
                <TabsContent value="manage-articles" className="space-y-6">
                    <div className="bg-white p-6 rounded-lg shadow">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-semibold">Tous les articles</h2>
                            <Button onClick={() => setShowCreateForm(true)}>
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
                            <div className="mt-6">
                                {filteredArticles && filteredArticles.length > 0 ? (
                                    <div className="grid gap-4">
                                        {filteredArticles.map((article: ArticleShop) => (
                                            <div key={article._id} className="border rounded-lg p-4 bg-gray-50">
                                                <div className="flex items-start gap-4">
                                                    <img 
                                                        src={article.imageUrl} 
                                                        alt={article.name}
                                                        className="w-16 h-16 object-cover rounded-lg"
                                                    />
                                                    <div className="flex-1">
                                                        <h3 className="font-semibold">{article.name}</h3>
                                                        <p className="text-sm text-gray-600 mb-1">{article.description}</p>
                                                        <div className="flex gap-4 text-sm text-gray-600">
                                                            <span>ID: <code className="bg-gray-100 px-1 rounded text-xs font-mono">{article._id}</code></span>
                                                            <span>Catégorie: {article.category}</span>
                                                            <span>Prix: CHF {(article.price / 100).toFixed(2)}</span>
                                                            <span>Stock: {article.stock}</span>
                                                            <span>Note: {article.rating || 0}/5</span>
                                                        </div>
                                                    </div>
                                                    <div className="flex gap-2">
                                                        <Button 
                                                            size="sm" 
                                                            variant="outline"
                                                            onClick={() => setEditingArticle(article)}
                                                        >
                                                            Modifier
                                                        </Button>
                                                        <Button 
                                                            size="sm" 
                                                            variant="destructive"
                                                            onClick={() => handleDeleteArticle(article._id)}
                                                            disabled={isDeletingArticle}
                                                        >
                                                            Supprimer
                                                        </Button>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-12 bg-gray-50 rounded-lg border border-gray-200">
                                        <div className="text-gray-500">
                                            <svg className="mx-auto h-12 w-12 text-gray-400 mb-4" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 14v20c0 4.418 7.163 8 16 8 1.381 0 2.721-.087 4-.252M8 14c0 4.418 7.163 8 16 8s16-3.582 16-8M8 14c0-4.418 7.163-8 16-8s16 3.582 16 8m0 0v14m-46-4c0 4.418 7.163 8 16 8 1.381 0 2.721-.087 4-.252" />
                                            </svg>
                                            <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun article trouvé</h3>
                                            <p className="text-sm text-gray-500">
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
                            <div className="bg-white rounded-2xl max-w-4xl w-full mx-4 max-h-[95vh] overflow-y-auto shadow-2xl">
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
                            <div className="bg-white rounded-2xl max-w-4xl w-full mx-4 max-h-[95vh] overflow-y-auto shadow-2xl">
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
                <TabsContent value="admin-users" className="space-y-6">
                    <div className="bg-white p-6 rounded-lg shadow">
                        <h2 className="text-xl font-semibold mb-4">Gestion des Administrateurs</h2>
                        
                        {/* Informations actuelles */}
                        <div className="mb-8">
                            <h3 className="text-lg font-medium mb-3">Administrateurs actuels</h3>
                            {isLoadingAdmins ? (
                                <div className="text-center py-4">
                                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-900 mx-auto mb-2"></div>
                                    <p>Chargement...</p>
                                </div>
                            ) : adminData ? (
                                <div className="space-y-3">
                                    {adminData.adminUsers && adminData.adminUsers.length > 0 ? (
                                        adminData.adminUsers.map((admin: any) => (
                                            <div key={admin.auth0Id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                                <div>
                                                    <p className="font-medium">{admin.name} {admin.firstname}</p>
                                                    <p className="text-sm text-gray-600">{admin.email}</p>
                                                    <p className="text-xs text-gray-500">ID Auth0: {admin.auth0Id}</p>
                                                </div>
                                                <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                                                    Admin
                                                </span>
                                            </div>
                                        ))
                                    ) : (
                                        <p className="text-gray-600">Aucun administrateur trouvé dans la base de données.</p>
                                    )}
                                    
                                    {/* Affichage des IDs configurés dans l'environnement */}
                                    {adminData.adminIds && adminData.adminIds.length > 0 && (
                                        <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                                            <h4 className="font-medium text-blue-900 mb-2">
                                                IDs Admin configurés (variables d'environnement) :
                                            </h4>
                                            <div className="space-y-1">
                                                {adminData.adminIds.map((id: string, index: number) => (
                                                    <p key={index} className="text-sm text-blue-700 font-mono bg-blue-100 px-2 py-1 rounded">
                                                        {id}
                                                    </p>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <p className="text-gray-600">Impossible de charger les informations des administrateurs.</p>
                            )}
                        </div>

                        {/* Instructions de configuration */}
                        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                            <h3 className="text-lg font-medium text-yellow-900 mb-2">
                                Configuration des Administrateurs
                            </h3>
                            <div className="text-sm text-yellow-800 space-y-2">
                                <p>
                                    <strong>Méthode actuelle :</strong> Les administrateurs sont configurés via la variable d'environnement 
                                    <code className="bg-yellow-200 px-1 rounded mx-1">ADMIN_AUTH0_IDS</code> 
                                    dans le fichier <code className="bg-yellow-200 px-1 rounded">.env</code> du backend.
                                </p>
                                <p>
                                    <strong>Format :</strong> <code className="bg-yellow-200 px-1 rounded">ADMIN_AUTH0_IDS=id1,id2,id3</code>
                                </p>
                                <p>
                                    <strong>Pour ajouter un admin :</strong>
                                </p>
                                <ol className="list-decimal list-inside ml-4 space-y-1">
                                    <li>Récupérer l'ID Auth0 de l'utilisateur (visible ci-dessous)</li>
                                    <li>Ajouter l'ID dans la variable d'environnement (séparé par des virgules)</li>
                                    <li>Redémarrer le serveur backend</li>
                                </ol>
                            </div>
                        </div>

                        {/* Liste de tous les utilisateurs */}
                        <div className="mt-8">
                            <h3 className="text-lg font-medium mb-3">Tous les Utilisateurs</h3>
                            {isLoadingAllUsers ? (
                                <div className="text-center py-4">
                                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-900 mx-auto mb-2"></div>
                                    <p>Chargement des utilisateurs...</p>
                                </div>
                            ) : allUsers && allUsers.length > 0 ? (
                                <div className="space-y-2 max-h-96 overflow-y-auto">
                                    {allUsers.map((user: any) => {
                                        const isCurrentAdmin = adminData?.adminIds?.includes(user.auth0Id);
                                        return (
                                            <div key={user._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                                <div>
                                                    <p className="font-medium">{user.name} {user.firstname}</p>
                                                    <p className="text-sm text-gray-600">{user.email}</p>
                                                    <p className="text-xs text-gray-500 font-mono">ID: {user.auth0Id}</p>
                                                </div>
                                                <div className="flex items-center space-x-2">
                                                    {isCurrentAdmin ? (
                                                        <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                                                            Admin
                                                        </span>
                                                    ) : (
                                                        <span className="px-2 py-1 bg-gray-100 text-gray-800 text-xs rounded-full">
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
                                                    >
                                                        Copier ID
                                                    </Button>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            ) : (
                                <p className="text-gray-600">Aucun utilisateur trouvé.</p>
                            )}
                        </div>
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    );
};

export default ManageShopPage;