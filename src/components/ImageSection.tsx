import { Button } from "@/components/ui/button";
import { X, Upload, Image as ImageIcon, Trash2 } from "lucide-react";
import { useState, useEffect } from "react";

type Props = {
    existingImages?: string[];
    onImagesChange: (images: File[], existingImages: string[]) => void;
    onPermanentDelete?: (imageUrl: string) => void;
    maxImages?: number;
    articleId?: string;
};

const ImageSection = ({ existingImages = [], onImagesChange, onPermanentDelete, maxImages = 3, articleId }: Props) => {
    const [imageFiles, setImageFiles] = useState<File[]>([]);
    const [imagePreviews, setImagePreviews] = useState<string[]>([]);
    const [currentExistingImages, setCurrentExistingImages] = useState<string[]>(existingImages);

    useEffect(() => {
        setCurrentExistingImages(existingImages);
    }, [existingImages]);

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        const totalImages = currentExistingImages.length + imageFiles.length + files.length;
        
        if (totalImages > maxImages) {
            alert(`Vous ne pouvez ajouter que ${maxImages} images maximum. Actuellement: ${currentExistingImages.length + imageFiles.length} image(s).`);
            return;
        }

        const newImageFiles = [...imageFiles, ...files];
        setImageFiles(newImageFiles);

        // Créer les previews pour les nouveaux fichiers
        const newPreviews = [...imagePreviews];
        files.forEach((file) => {
            const reader = new FileReader();
            reader.onloadend = () => {
                newPreviews.push(reader.result as string);
                if (newPreviews.length === imagePreviews.length + files.length) {
                    setImagePreviews(newPreviews);
                }
            };
            reader.readAsDataURL(file);
        });

        // Notifier le parent des changements
        onImagesChange(newImageFiles, currentExistingImages);
    };

    const removeNewImage = (index: number) => {
        const newImageFiles = imageFiles.filter((_, i) => i !== index);
        const newPreviews = imagePreviews.filter((_, i) => i !== index);
        
        setImageFiles(newImageFiles);
        setImagePreviews(newPreviews);
        onImagesChange(newImageFiles, currentExistingImages);
    };

    const removeExistingImage = (index: number) => {
        const newExistingImages = currentExistingImages.filter((_, i) => i !== index);
        setCurrentExistingImages(newExistingImages);
        onImagesChange(imageFiles, newExistingImages);
    };

    const handlePermanentDelete = (imageUrl: string) => {
        if (onPermanentDelete && articleId) {
            if (window.confirm("Êtes-vous sûr de vouloir supprimer définitivement cette image ? Cette action est irréversible.")) {
                onPermanentDelete(imageUrl);
            }
        }
    };

    const totalImages = currentExistingImages.length + imageFiles.length;
    const canAddMore = totalImages < maxImages;

    return (
        <div className="space-y-4">
            <div className="flex items-center gap-2">
                <ImageIcon className="h-5 w-5 text-slate-600" />
                <label className="text-base font-semibold text-slate-800">
                    Images de l'article
                </label>
                <span className="text-sm text-slate-500 bg-slate-100 px-2 py-1 rounded-full">
                    {totalImages}/{maxImages}
                </span>
            </div>
            
            {/* Grille d'aperçu des images */}
            {(currentExistingImages.length > 0 || imageFiles.length > 0) && (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-6 mb-6">
                    {/* Images existantes */}
                    {currentExistingImages.map((imageUrl, index) => (
                        <div key={`existing-${index}`} className="relative group">
                            <div className="relative overflow-hidden rounded-xl border-2 border-slate-200 bg-slate-50 shadow-sm hover:shadow-md transition-all duration-200">
                                <img
                                    src={imageUrl}
                                    alt={`Image ${index + 1}`}
                                    className="w-full h-32 object-cover group-hover:scale-105 transition-transform duration-200"
                                />
                                {/* Bouton de suppression temporaire (retirer de la sélection) */}
                                <Button
                                    type="button"
                                    size="sm"
                                    className="absolute -top-2 -right-2 h-7 w-7 rounded-full p-0 bg-orange-500 hover:bg-orange-600 text-white shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-200 transform hover:scale-110"
                                    onClick={() => removeExistingImage(index)}
                                    title="Retirer de la sélection"
                                >
                                    <X className="h-4 w-4" />
                                </Button>
                                {/* Bouton de suppression définitive (si article existe) */}
                                {onPermanentDelete && articleId && (
                                    <Button
                                        type="button"
                                        size="sm"
                                        className="absolute -top-2 -left-2 h-7 w-7 rounded-full p-0 bg-red-500 hover:bg-red-600 text-white shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-200 transform hover:scale-110"
                                        onClick={() => handlePermanentDelete(imageUrl)}
                                        title="Supprimer définitivement"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                )}
                                <div className="absolute bottom-2 left-2 bg-slate-800 bg-opacity-80 text-white text-xs px-2 py-1 rounded-md font-medium">
                                    #{index + 1}
                                </div>
                            </div>
                        </div>
                    ))}
                    
                    {/* Nouvelles images */}
                    {imagePreviews.map((preview, index) => (
                        <div key={`new-${index}`} className="relative group">
                            <div className="relative overflow-hidden rounded-xl border-2 border-blue-300 bg-blue-50 shadow-sm hover:shadow-md transition-all duration-200">
                                <img
                                    src={preview}
                                    alt={`Nouvelle image ${index + 1}`}
                                    className="w-full h-32 object-cover group-hover:scale-105 transition-transform duration-200"
                                />
                                <Button
                                    type="button"
                                    size="sm"
                                    className="absolute -top-2 -right-2 h-7 w-7 rounded-full p-0 bg-red-500 hover:bg-red-600 text-white shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-200 transform hover:scale-110"
                                    onClick={() => removeNewImage(index)}
                                >
                                    <X className="h-4 w-4" />
                                </Button>
                                <div className="absolute bottom-2 left-2 bg-blue-600 bg-opacity-90 text-white text-xs px-2 py-1 rounded-md font-medium">
                                    Nouveau #{currentExistingImages.length + index + 1}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Zone d'upload */}
            {canAddMore && (
                <div className="space-y-3">
                    <div className="relative">
                        <input
                            type="file"
                            accept="image/*"
                            multiple
                            onChange={handleFileSelect}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                        />
                        <div className="border-2 border-dashed border-slate-300 rounded-xl p-6 bg-slate-50 hover:bg-slate-100 hover:border-blue-400 transition-all duration-200 text-center">
                            <div className="flex flex-col items-center gap-3">
                                <div className="bg-blue-100 p-3 rounded-full">
                                    <Upload className="h-6 w-6 text-blue-600" />
                                </div>
                                <div>
                                    <p className="text-base font-medium text-slate-700">
                                        Cliquez pour ajouter des images
                                    </p>
                                    <p className="text-sm text-slate-500 mt-1">
                                        Formats supportés: JPG, PNG, WEBP (max 5MB par image)
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    {totalImages > 0 && (
                        <div className="flex items-center justify-between bg-blue-50 border border-blue-200 rounded-lg px-4 py-3">
                            <div className="flex items-center gap-2">
                                <div className="h-2 w-2 bg-blue-500 rounded-full"></div>
                                <span className="text-sm font-medium text-blue-800">
                                    {totalImages}/{maxImages} images sélectionnées
                                </span>
                            </div>
                            {canAddMore && (
                                <span className="text-xs text-blue-600 bg-blue-100 px-2 py-1 rounded-full">
                                    {maxImages - totalImages} restante(s)
                                </span>
                            )}
                        </div>
                    )}
                </div>
            )}

            {!canAddMore && totalImages > 0 && (
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                    <div className="flex items-center gap-2">
                        <div className="h-2 w-2 bg-amber-500 rounded-full"></div>
                        <span className="text-sm font-medium text-amber-800">
                            Limite de {maxImages} images atteinte
                        </span>
                    </div>
                    <p className="text-xs text-amber-700 mt-1">
                        Supprimez une image existante pour en ajouter une nouvelle.
                    </p>
                </div>
            )}
        </div>
    );
};

export default ImageSection;