import { useState, useMemo } from 'react';
import SearchBar, { type SearchForm } from '@/components/SearchBar';
import CategoryFilter from '@/components/CategoryFilter';
import SortOptionDropDown from '@/components/SortOptionDropDown';
import SearchResultInfo from '@/components/SearchResultInfo';
import type { ArticleShop } from '@/types';

export interface AdvancedSearchProps {
    articles: ArticleShop[];
    isLoading: boolean;
    onSearchResults: (filteredArticles: ArticleShop[]) => void;
    searchPlaceholder?: string;
    showResultInfo?: boolean;
    resultInfoCategory?: string;
    resultInfoId?: string;
}

export interface SearchState {
    searchQuery: string;
    selectedCategories: string[];
    sortOption: string;
    isFilterExpanded: boolean;
}

const AdvancedArticleSearch = ({
    articles,
    isLoading,
    onSearchResults,
    searchPlaceholder = "Rechercher par nom, description, catégorie ou ID d'article",
    showResultInfo = true,
    resultInfoCategory = "Articles",
    resultInfoId = "search"
}: AdvancedSearchProps) => {
    const [searchState, setSearchState] = useState<SearchState>({
        searchQuery: "",
        selectedCategories: [],
        sortOption: "lastUpdate",
        isFilterExpanded: false
    });

    // Filtrage et tri des articles
    const filteredAndSortedArticles = useMemo(() => {
        if (!articles) return [];

        let filtered = articles.filter((article: ArticleShop) => {
            // Filtre par recherche (nom, description, catégorie, ou ID)
            const searchLower = searchState.searchQuery.toLowerCase();
            const matchesSearch = searchState.searchQuery === "" || 
                article.name.toLowerCase().includes(searchLower) ||
                article.description.toLowerCase().includes(searchLower) ||
                article.category.toLowerCase().includes(searchLower) ||
                article._id.toLowerCase().includes(searchLower);

            // Filtre par catégorie
            const matchesCategory = searchState.selectedCategories.length === 0 || 
                searchState.selectedCategories.includes(article.category);

            return matchesSearch && matchesCategory;
        });

        // Tri des articles
        filtered.sort((a: ArticleShop, b: ArticleShop) => {
            switch (searchState.sortOption) {
                case "bestMatch":
                    return 0; // Garder l'ordre original
                case "priceAsc":
                    return a.price - b.price;
                case "priceDesc":
                    return b.price - a.price;
                case "lastUpdate":
                default:
                    return new Date(b.lastUpdate).getTime() - new Date(a.lastUpdate).getTime();
            }
        });

        return filtered;
    }, [articles, searchState]);

    // Notifier le parent quand les résultats changent
    useMemo(() => {
        onSearchResults(filteredAndSortedArticles);
    }, [filteredAndSortedArticles, onSearchResults]);

    const handleSearchSubmit = (searchFormData: SearchForm) => {
        setSearchState(prev => ({ ...prev, searchQuery: searchFormData.searchQuery }));
    };

    const handleSearchReset = () => {
        setSearchState(prev => ({ ...prev, searchQuery: "" }));
    };

    const handleCategoryChange = (categories: string[]) => {
        setSearchState(prev => ({ ...prev, selectedCategories: categories }));
    };

    const handleSortChange = (newSortOption: string) => {
        setSearchState(prev => ({ ...prev, sortOption: newSortOption }));
    };

    const toggleFilterExpanded = () => {
        setSearchState(prev => ({ ...prev, isFilterExpanded: !prev.isFilterExpanded }));
    };

    return (
        <div className="space-y-4">
            {/* Barre de recherche */}
            <SearchBar 
                searchQuery={searchState.searchQuery}
                onSubmit={handleSearchSubmit}
                placeholder={searchPlaceholder}
                onReset={handleSearchReset}
            />

            {/* Filtre de catégories */}
            <div className="dropdown-menu rounded-lg border p-4">
                <CategoryFilter 
                    onChange={handleCategoryChange}
                    selectedCategories={searchState.selectedCategories}
                    isExpanded={searchState.isFilterExpanded}
                    onExpandedClick={toggleFilterExpanded}
                />
            </div>

            {/* Informations des résultats et options de tri */}
            {showResultInfo && (
                <div className="flex justify-between items-center gap-2">
                    <SearchResultInfo 
                        total={filteredAndSortedArticles?.length || 0}
                        category={resultInfoCategory}
                        articleShopId={resultInfoId}
                    />
                    <SortOptionDropDown 
                        sortOption={searchState.sortOption}
                        onChange={handleSortChange}
                    />
                </div>
            )}

            {isLoading && (
                <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent mx-auto mb-4"></div>
                    <p className="text-app-primary">Chargement des articles...</p>
                </div>
            )}
        </div>
    );
};

export default AdvancedArticleSearch;