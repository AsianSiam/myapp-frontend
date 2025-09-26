import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import ImageSection from "@/components/ImageSection";
import type { ArticleShop } from "@/types";
import { useEffect, useState } from "react";
import { categoryList } from "@/config/article-option-config";
import { Package, DollarSign, Layers, FileText, Tag, Warehouse } from "lucide-react";
import { useDeleteArticleImage } from "@/api/AdminApi";

type Props = {
    article?: ArticleShop;
    onSave: (articleFormData: FormData) => void;
    isLoading: boolean;
    onCancel?: () => void;
};
const CATEGORIES = categoryList;

const AdminArticleForm = ({ article, onSave, isLoading, onCancel }: Props) => {
    const [formData, setFormData] = useState({
        name: "",
        description: "",
        category: "",
        price: "0",
        stock: "0",
    });
    const [imageFiles, setImageFiles] = useState<File[]>([]);
    const [existingImages, setExistingImages] = useState<string[]>([]);
    const { mutate: deleteImage } = useDeleteArticleImage();

    useEffect(() => {
        if (article) {
            setFormData({
                name: article.name,
                description: article.description,
                category: article.category,
                price: (article.price / 100).toString(),
                stock: article.stock.toString(),
            });
            
            // Initialiser les images existantes
            if (article.images && article.images.length > 0) {
                setExistingImages(article.images);
            } else if (article.imageUrl) {
                // Rétrocompatibilité avec l'ancien système d'image unique
                setExistingImages([article.imageUrl]);
            }
        }
    }, [article]);

    const handleImagesChange = (newImageFiles: File[], currentExistingImages: string[]) => {
        setImageFiles(newImageFiles);
        setExistingImages(currentExistingImages);
    };

    const handlePermanentDelete = (imageUrl: string) => {
        if (article?._id) {
            deleteImage({ 
                articleId: article._id, 
                imageUrl: imageUrl 
            });
            // Mettre à jour l'état local immédiatement pour l'UI
            setExistingImages(prev => prev.filter(img => img !== imageUrl));
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const submitFormData = new FormData();
        submitFormData.append("name", formData.name);
        submitFormData.append("description", formData.description);
        submitFormData.append("category", formData.category);
        submitFormData.append("price", (parseFloat(formData.price) * 100).toString());
        submitFormData.append("stock", formData.stock);

        // Ajouter les nouvelles images
        imageFiles.forEach((file) => {
            submitFormData.append(`imageFiles`, file);
        });

        // Envoyer les images existantes à conserver
        existingImages.forEach((imageUrl) => {
            submitFormData.append(`existingImages`, imageUrl);
        });

        if (article) {
            submitFormData.append("articleId", article._id);
        }

        onSave(submitFormData);
    };

    return (
        <div className="modern-black-card rounded-2xl border-0 overflow-hidden">
            {/* Header */}
            <div className="bg-app-surface px-8 py-6 border-b border-app">
                <h2 className="text-2xl font-bold text-app-primary flex items-center gap-3">
                    <Package className="h-6 w-6 text-blue-600" />
                    {article ? "Modifier l'article" : "Créer un nouvel article"}
                </h2>
                <p className="text-app-secondary mt-1">
                    {article ? "Modifiez les informations de votre article" : "Ajoutez un nouvel article à votre catalogue"}
                </p>
            </div>

            {/* Form Content */}
            <div className="p-8">
                <form onSubmit={handleSubmit} className="space-y-8">
                    {/* Informations de base */}
                    <div className="space-y-6">
                        <div className="flex items-center gap-2 mb-4">
                            <FileText className="h-5 w-5 text-app-secondary" />
                            <h3 className="text-lg font-semibold text-app-primary">Informations générales</h3>
                        </div>
                        
                        <div className="grid grid-cols-1 gap-6">
                            <div>
                                <label className="block text-sm font-semibold text-app-primary mb-3">
                                    Nom de l'article
                                </label>
                                <Input
                                    value={formData.name}
                                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                                    required
                                    className="h-12 text-base modern-black-card border-0 text-app-primary placeholder:text-app-tertiary hover:bg-app-surface transition-colors"
                                    placeholder="Ex: iPhone 15 Pro Max"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-app-primary mb-3">
                                    Description détaillée
                                </label>
                                <Textarea
                                    value={formData.description}
                                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                                    rows={4}
                                    required
                                    className="text-base modern-black-card border-0 text-app-primary placeholder:text-app-tertiary resize-none"
                                    placeholder="Décrivez les caractéristiques principales de l'article..."
                                />
                            </div>
                        </div>
                    </div>

                    {/* Détails commerciaux */}
                    <div className="space-y-6">
                        <div className="flex items-center gap-2 mb-4">
                            <Tag className="h-5 w-5 text-app-secondary" />
                            <h3 className="text-lg font-semibold text-app-primary">Détails commerciaux</h3>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-semibold text-app-primary mb-3">
                                    Catégorie
                                </label>
                                <Select 
                                    onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))} 
                                    value={formData.category}
                                >
                                    <SelectTrigger className="h-12 text-base h-8 border-0 text-app-secondary select-trigger-enhanced">
                                        <SelectValue placeholder="Sélectionner une catégorie" />
                                    </SelectTrigger>
                                    <SelectContent className="dropdown-menu animate-fade-in max-h-60">
                                        {CATEGORIES.map((category) => (
                                            <SelectItem 
                                                key={category} 
                                                value={category}
                                                className="text-app-primary select-item-enhanced cursor-pointer py-3 px-4"
                                            >
                                                <div className="flex items-center gap-2">
                                                    <Layers className="h-4 w-4 text-app-tertiary" />
                                                    {category}
                                                </div>
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-app-primary mb-3">
                                    Prix (CHF)
                                </label>
                                <div className="relative">
                                    <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-app-tertiary" />
                                    <Input
                                        type="number"
                                        step="0.01"
                                        min="0"
                                        value={formData.price}
                                        onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                                        required
                                        className="h-12 pl-10 text-base modern-black-card border-0 text-app-primary placeholder:text-app-tertiary hover:bg-app-surface transition-colors"
                                        placeholder="0.00"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-semibold text-app-primary mb-3">
                                    Stock disponible
                                </label>
                                <div className="relative">
                                    <Warehouse className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-app-tertiary" />
                                    <Input
                                        type="number"
                                        min="0"
                                        value={formData.stock}
                                        onChange={(e) => setFormData(prev => ({ ...prev, stock: e.target.value }))}
                                        required
                                        className="h-12 pl-10 text-base modern-black-card border-0 text-app-primary placeholder:text-app-tertiary hover:bg-app-surface transition-colors"
                                        placeholder="0"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Section Images */}
                    <div className="border-t border-app pt-8">
                        <ImageSection
                            existingImages={existingImages}
                            onImagesChange={handleImagesChange}
                            onPermanentDelete={handlePermanentDelete}
                            articleId={article?._id}
                            maxImages={3}
                        />
                    </div>

                    {/* Actions */}
                    <div className="border-t border-app pt-8">
                        <div className="flex gap-4">
                            <Button 
                                type="submit" 
                                disabled={isLoading} 
                                className="flex-1 h-12 text-base font-semibold search-button rounded-lg shadow-lg hover:shadow-xl transition-all duration-200"
                            >
                                {isLoading ? (
                                    <div className="flex items-center gap-2">
                                        <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></div>
                                        Sauvegarde...
                                    </div>
                                ) : (
                                    article ? "Mettre à jour l'article" : "Créer l'article"
                                )}
                            </Button>
                            {onCancel && (
                                <Button 
                                    type="button" 
                                    variant="outline" 
                                    onClick={onCancel}
                                    className="h-12 px-8 text-base font-semibold border-app text-app-primary hover:bg-app-muted rounded-lg transition-all duration-200"
                                >
                                    Annuler
                                </Button>
                            )}
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AdminArticleForm;