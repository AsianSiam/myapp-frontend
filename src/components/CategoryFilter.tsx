import { categoryList } from "@/config/article-option-config";
import { Label } from "./ui/label";
import { Check, ChevronDown, ChevronUp } from "lucide-react";
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
  const handleCategoryChange = (event: ChangeEvent<HTMLInputElement>) => {
    const clickedCategory = event.target.value;
    const isChecked = event.target.checked;

    const newCategoryList = isChecked
      ? [...selectedCategories, clickedCategory]
      : selectedCategories.filter((category) => category !== clickedCategory);

    onChange(newCategoryList);
  };

  const handleCategoryReset = () => onChange([]);

  return (
    <div className="w-full max-w-5xl mx-auto">
      {/* Container avec grille et bouton côte à côte */}
      <div className="flex items-start gap-6">
        {/* Grille de catégories */}
        <div className="flex-1">
          <div className="grid grid-cols-5 gap-3 justify-items-center">
            {categoryList
              .slice(0, isExpanded ? categoryList.length : 4)
              .map((category) => {
                const isSelected = selectedCategories.includes(category);
                return (
                  <div key={category} className="w-full max-w-[200px]">
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
                      className={`flex items-center justify-center cursor-pointer text-sm rounded-full px-4 py-2 font-semibold border transition-all duration-200 hover:shadow-md w-full text-center ${
                        isSelected
                          ? "border-green-600 text-green-600 bg-green-50"
                          : "border-slate-300 text-slate-700 hover:border-slate-400 bg-white"
                      }`}
                    >
                      {isSelected && <Check size={16} strokeWidth={3} className="mr-2" />}
                      {category}
                    </Label>
                  </div>
                );
              })}

            {/* Bouton Voir plus/moins avec même style que les filtres */}
            {categoryList.length > 6 && (
              <div className="w-full max-w-[200px]">
                <button
                  onClick={onExpandedClick}
                  className="flex items-center justify-center cursor-pointer text-sm rounded-full px-4 py-2 font-semibold border border-blue-300 text-blue-600 bg-blue-50 hover:bg-blue-100 hover:border-blue-400 transition-all duration-200 hover:shadow-md w-full"
                >
                  {isExpanded ? (
                    <>
                      Voir moins <ChevronUp size={16} className="ml-2" />
                    </>
                  ) : (
                    <>
                      Voir plus <ChevronDown size={16} className="ml-2" />
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Bouton réinitialiser à droite de la grille */}
        <div className="flex-shrink-0 pt-2">
          <button
            onClick={handleCategoryReset}
            className="text-sm font-semibold underline cursor-pointer text-blue-500 hover:text-blue-600 transition-colors px-3 py-2 rounded-lg hover:bg-blue-50"
          >
            Réinitialiser
          </button>
        </div>
      </div>
    </div>
  );
};

export default CategoryFilter;