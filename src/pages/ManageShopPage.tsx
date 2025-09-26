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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900">Panneau de contrôle administrateur</h1>
                <p className="text-gray-600 mt-2">Administration de la boutique</p>
            </div>

            <Tabs defaultValue="orders" className="w-full">
                <TabsList className="grid w-full grid-cols-4 bg-white rounded-lg shadow-sm border border-gray-200">
                    <TabsTrigger value="orders" className="rounded-lg">
                        Commandes ({orders?.length || 0})
                    </TabsTrigger>
                    <TabsTrigger value="create-article" className="rounded-lg">
                        Créer un article
                    </TabsTrigger>
                    <TabsTrigger value="manage-articles" className="rounded-lg">
                        Gérer les articles ({articles?.length || 0})
                    </TabsTrigger>
                    <TabsTrigger value="admin-users" className="rounded-lg">
                        Administrateurs
                    </TabsTrigger>
                </TabsList>

                {/* Onglet Commandes */}
                <TabsContent value="orders" className="space-y-6 mt-6">
                    <div className="bg-white rounded-2xl shadow-lg border border-gray-200">
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
                    <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8">
                        <AdminArticleForm 
                            onSave={handleCreateArticle}
                            isLoading={isCreatingArticle}
                        />
                    </div>
                </TabsContent>

                {/* Onglet Gestion des articles */}
                <TabsContent value="manage-articles" className="space-y-6 mt-6">
                    <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8">
                        <div className="flex justify-between items-center mb-8">
                            <h2 className="text-2xl font-bold text-gray-900">Tous les articles</h2>
                            <Button 
                                onClick={() => setShowCreateForm(true)}
                                className="bg-gray-700 hover:bg-gray-800 text-white rounded-lg shadow-sm"
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
                                            <div key={article._id} className="bg-gray-50 border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow">
                                                <div className="flex items-start gap-4">
                                                    <img 
                                                        src={article.imageUrl} 
                                                        alt={article.name}
                                                        className="w-16 h-16 object-cover rounded-lg shadow-sm"
                                                    />
                                                    <div className="flex-1">
                                                        <h3 className="font-semibold text-gray-900">{article.name}</h3>
                                                        <p className="text-sm text-gray-600 mb-2">{article.description}</p>
                                                        <div className="flex gap-4 text-sm text-gray-600">
                                                            <span>ID: <code className="bg-white px-2 py-1 rounded text-xs font-mono border">{article._id}</code></span>
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
                                                            className="border-gray-300 hover:bg-gray-50"
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
                                    <div className="text-center py-12 bg-gray-50 rounded-xl border border-gray-200">
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
                <TabsContent value="admin-users" className="space-y-6 mt-6">
                    <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8">
                        <h2 className="text-2xl font-bold text-gray-900 mb-6">Gestion des Administrateurs</h2>
                        
                        {/* Informations actuelles */}
                        <div className="mb-8">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Administrateurs actuels</h3>
                            {isLoadingAdmins ? (
                                <div className="text-center py-8">
                                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-900 mx-auto mb-2"></div>
                                    <p className="text-gray-600">Chargement...</p>
                                </div>
                            ) : adminData ? (
                                <div className="space-y-4">
                                    {adminData.adminUsers && adminData.adminUsers.length > 0 ? (
                                        adminData.adminUsers.map((admin: any) => (
                                            <div key={admin.auth0Id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-200">
                                                <div>
                                                    <p className="font-medium text-gray-900">{admin.name} {admin.firstname}</p>
                                                    <p className="text-sm text-gray-600">{admin.email}</p>
                                                    <p className="text-xs text-gray-500 font-mono">ID Auth0: {admin.auth0Id}</p>
                                                </div>
                                                <span className="px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full font-medium">
                                                    Admin
                                                </span>
                                            </div>
                                        ))
                                    ) : (
                                        <p className="text-gray-600">Aucun administrateur trouvé dans la base de données.</p>
                                    )}
                                    
                                    {/* Affichage des IDs configurés dans l'environnement */}
                                    {adminData.adminIds && adminData.adminIds.length > 0 && (
                                        <div className="mt-6 p-6 bg-blue-50 rounded-xl border border-blue-200">
                                            <h4 className="font-semibold text-blue-900 mb-3">
                                                IDs Admin configurés (variables d'environnement) :
                                            </h4>
                                            <div className="space-y-2">
                                                {adminData.adminIds.map((id: string, index: number) => (
                                                    <p key={index} className="text-sm text-blue-700 font-mono bg-blue-100 px-3 py-2 rounded-lg border border-blue-200">
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
                        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6">
                            <h3 className="text-lg font-semibold text-yellow-900 mb-3">
                                Configuration des Administrateurs
                            </h3>
                            <div className="text-sm text-yellow-800 space-y-3">
                                <p>
                                    <strong>Méthode actuelle :</strong> Les administrateurs sont configurés via la variable d'environnement 
                                    <code className="bg-yellow-200 px-2 py-1 rounded mx-1 font-mono">ADMIN_AUTH0_IDS</code> 
                                    dans le fichier <code className="bg-yellow-200 px-2 py-1 rounded font-mono">.env</code> du backend.
                                </p>
                                <p>
                                    <strong>Format :</strong> <code className="bg-yellow-200 px-2 py-1 rounded font-mono">ADMIN_AUTH0_IDS=id1,id2,id3</code>
                                </p>
                                <p>
                                    <strong>Pour ajouter un admin :</strong>
                                </p>
                                <ol className="list-decimal list-inside ml-4 space-y-2">
                                    <li>Récupérer l'ID Auth0 de l'utilisateur (visible ci-dessous)</li>
                                    <li>Ajouter l'ID dans la variable d'environnement (séparé par des virgules)</li>
                                    <li>Redémarrer le serveur backend</li>
                                </ol>
                            </div>
                        </div>

                        {/* Liste de tous les utilisateurs */}
                        <div className="mt-8">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Tous les Utilisateurs</h3>
                            {isLoadingAllUsers ? (
                                <div className="text-center py-8">
                                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-900 mx-auto mb-2"></div>
                                    <p className="text-gray-600">Chargement des utilisateurs...</p>
                                </div>
                            ) : allUsers && allUsers.length > 0 ? (
                                <div className="space-y-3 max-h-96 overflow-y-auto bg-gray-50 rounded-xl p-4 border border-gray-200">
                                    {allUsers.map((user: any) => {
                                        const isCurrentAdmin = adminData?.adminIds?.includes(user.auth0Id);
                                        return (
                                            <div key={user._id} className="flex items-center justify-between p-4 bg-white rounded-lg border border-gray-200 shadow-sm">
                                                <div>
                                                    <p className="font-medium text-gray-900">{user.name} {user.firstname}</p>
                                                    <p className="text-sm text-gray-600">{user.email}</p>
                                                    <p className="text-xs text-gray-500 font-mono">ID: {user.auth0Id}</p>
                                                </div>
                                                <div className="flex items-center space-x-3">
                                                    {isCurrentAdmin ? (
                                                        <span className="px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full font-medium">
                                                            Admin
                                                        </span>
                                                    ) : (
                                                        <span className="px-3 py-1 bg-gray-100 text-gray-800 text-sm rounded-full font-medium">
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
                                                        className="border-gray-300 hover:bg-gray-50 text-sm"
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