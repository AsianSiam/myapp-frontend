import { categoryList } from "@/config/article-option-config";
import { Label } from "./ui/label";
import { Check, ChevronDown, ChevronUp } from "lucide-react";
import { useState, useEffect } from "react";
import type { ChangeEvent } from "react";

type Props = {
  onChange: (categories: string[]) => void;
  selectedCategories: string[];
  isExpanded: boolean;
  onExpandedClick: () => void;
};

const CategoryFilter = ({
  onChange,
  selectedCategories,
  isExpanded,
  onExpandedClick,
}: Props) => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    // Vérification initiale
    checkIsMobile();

    // Écouter les changements de taille d'écran
    window.addEventListener('resize', checkIsMobile);

    return () => window.removeEventListener('resize', checkIsMobile);
  }, []);

  const handleCategoryChange = (event: ChangeEvent<HTMLInputElement>) => {
    const clickedCategory = event.target.value;
    const isChecked = event.target.checked;

    const newCategoryList = isChecked
      ? [...selectedCategories, clickedCategory]
      : selectedCategories.filter((category) => category !== clickedCategory);

    onChange(newCategoryList);
  };

  const handleCategoryReset = () => onChange([]);

  // Nombre d'éléments à afficher par défaut
  const defaultItemsToShow = isMobile ? 2 : 4;
  const minItemsForButton = isMobile ? 3 : 6;

  return (
    <div className="w-full max-w-5xl mx-auto">
      {/* Container avec grille et bouton côte à côte */}
      <div className="flex flex-col md:flex-row md:items-start gap-4 md:gap-6">
        {/* Grille de catégories */}
        <div className="flex-1">
          <div className="grid grid-cols-3 md:grid-cols-5 gap-3 justify-items-center">
            {categoryList
              .slice(0, isExpanded ? categoryList.length : defaultItemsToShow)
              .map((category) => {
                const isSelected = selectedCategories.includes(category);
                return (
                  <div key={category} className="w-full max-w-[120px] md:max-w-[200px]">
                    <input
                      id={`category_${category}`}
                      type="checkbox"
                      className="hidden"
                      value={category}
                      checked={isSelected}
                      onChange={handleCategoryChange}
                    />
                    <Label
                      htmlFor={`category_${category}`}
                      className={`flex items-center justify-center cursor-pointer text-xs md:text-sm rounded-full px-2 md:px-4 py-2 font-semibold border transition-all duration-200 hover:shadow-md w-full text-center leading-tight ${
                        isSelected
                          ? "border-green-600 text-green-600 bg-green-50 dark:bg-green-900/20 dark:border-green-400 dark:text-green-400"
                          : "border-app-muted text-app-primary hover:border-app-accent bg-app-background hover:bg-app-muted/30"
                      }`}
                    >
                      {isSelected && <Check size={14} strokeWidth={3} className="mr-1 md:mr-2 flex-shrink-0" />}
                      <span className="truncate">{category}</span>
                    </Label>
                  </div>
                );
              })}

            {/* Bouton Voir plus/moins avec même style que les filtres */}
            {categoryList.length > minItemsForButton && (
              <div className="w-full max-w-[120px] md:max-w-[200px]">
                <button
                  onClick={onExpandedClick}
                  className="flex items-center justify-center cursor-pointer text-xs md:text-sm rounded-full px-2 md:px-4 py-2 font-semibold border border-accent text-accent bg-accent/10 hover:bg-accent/20 hover:border-accent transition-all duration-200 hover:shadow-md w-full"
                >
                  {isExpanded ? (
                    <>
                      <span className="hidden md:inline">Voir moins</span>
                      <span className="md:hidden">Moins</span>
                      <ChevronUp size={14} className="ml-1 md:ml-2 flex-shrink-0" />
                    </>
                  ) : (
                    <>
                      <span className="hidden md:inline">Voir plus</span>
                      <span className="md:hidden">Plus</span>
                      <ChevronDown size={14} className="ml-1 md:ml-2 flex-shrink-0" />
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Bouton réinitialiser à droite de la grille */}
        <div className="flex-shrink-0 md:pt-2">
          <button
            onClick={handleCategoryReset}
            className="text-xs md:text-sm font-semibold underline cursor-pointer text-accent hover:text-accent/80 transition-colors px-3 py-2 rounded-lg hover:bg-accent/10 w-full md:w-auto text-center"
          >
            Réinitialiser
          </button>
        </div>
      </div>
    </div>
  );
};

export default CategoryFilter;