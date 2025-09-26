import SearchResultInfo from '@/components/SearchResultInfo';
import SearchArticleCards from '@/components/SearchArticleCards';
import { useState, useEffect } from 'react';
import SearchBar, { type SearchForm } from '@/components/SearchBar';
import PaginationSelector from '@/components/PaginationSelector';
import CategoryFilter from '@/components/CategoryFilter';
import SortOptionDropDown from '@/components/SortOptionDropDown';
import { useGetAllArticleShops } from '@/api/ArticleShopApi';
import { useSearchParams } from 'react-router-dom';

export type SearchState = {
    searchQuery: string;
    page: number;
    selectedCategories: string[];
    sortOption: string;
};

const ShopPage = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    
    const [searchState, setSearchState] = useState<SearchState>({
        searchQuery: '',
        page: 1,
        selectedCategories: [],
        sortOption: 'lastUpdate',
    });

    const [isExpanded, setIsExpanded] = useState<boolean>(false);

    // ✅ Initialiser la recherche à partir des paramètres URL
    useEffect(() => {
        const queryFromUrl = searchParams.get('q') || '';
        if (queryFromUrl && queryFromUrl !== searchState.searchQuery) {
            setSearchState(prev => ({ ...prev, searchQuery: queryFromUrl, page: 1 }));
        }
    }, [searchParams, searchState.searchQuery]);

    // ✅ Utiliser la nouvelle fonction pour récupérer tous les articles
    const { results, isLoading } = useGetAllArticleShops(searchState);

    const setSortOption = (sortOption: string) => {
        setSearchState((prevState) => ({ ...prevState, sortOption, page: 1 }));
    };
    const setSelectedCategories = (selectedCategories: string[]) => {
        setSearchState((prevState) => ({ ...prevState, selectedCategories, page: 1 }));
    };

    const setPage = (page: number) => {
        setSearchState((prevState) => ({ ...prevState, page }));
    };
    const setSearchQuery = (searchFormData: SearchForm) => {
        const newQuery = searchFormData.searchQuery;
        setSearchState((prevState) => ({ ...prevState, searchQuery: newQuery, page: 1 }));
        
        // Mise à jour de l'URL avec le nouveau terme de recherche
        if (newQuery.trim()) {
            setSearchParams({ q: newQuery });
        } else {
            setSearchParams({});
        }
    };

    const resetSearch = () => {
        setSearchState((prevState) => ({ ...prevState, searchQuery: '', page: 1 }));
        setSearchParams({}); // Supprime le paramètre de recherche de l'URL
    };

    if (isLoading) {
        return <span>Loading...</span>
    }

    return (
        <div className='app-container py-8 space-y-8 modern-black-bg'>
            {/* Barre de recherche */}
            <SearchBar 
                searchQuery={searchState.searchQuery} 
                onSubmit={setSearchQuery} 
                placeholder='Rechercher par nom, description, catégorie ou ID' 
                onReset={resetSearch} 
            />
            
            {/* Filtre de catégories */}
            <div className='modern-black-card p-6'>
                <CategoryFilter 
                    onChange={setSelectedCategories} 
                    selectedCategories={searchState.selectedCategories} 
                    isExpanded={isExpanded} 
                    onExpandedClick={() => setIsExpanded(prevIsExpanded => !prevIsExpanded)} 
                />
            </div>
            
            {/* Informations des résultats et options de tri */}
            <div className='flex justify-between items-center gap-2'>
                <SearchResultInfo 
                    total={results?.pagination?.total || 0} 
                    category="Articles" 
                    articleShopId="all"
                />
                <SortOptionDropDown 
                    sortOption={searchState.sortOption} 
                    onChange={(value) => setSortOption(value)} 
                />
            </div>
            
            {/* Articles */}
            <div className='grid gap-6'>
                {results?.data && results.data.length > 0 ? (
                    results.data.map((articleShop) => (
                        <SearchArticleCards key={articleShop._id} articleShop={articleShop} />
                    ))
                ) : (
                    <div className="text-center py-12 modern-black-card">
                        <div className="text-app-tertiary">
                            <svg className="mx-auto h-12 w-12 mb-4" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 14v20c0 4.418 7.163 8 16 8 1.381 0 2.721-.087 4-.252M8 14c0 4.418 7.163 8 16 8s16-3.582 16-8M8 14c0-4.418 7.163-8 16-8s16 3.582 16 8m0 0v14m-46-4c0 4.418 7.163 8 16 8 1.381 0 2.721-.087 4-.252" />
                            </svg>
                            <h3 className="text-lg font-medium text-app-primary mb-2">Aucun article trouvé</h3>
                            <p className="text-sm text-app-secondary">Essayez de modifier vos critères de recherche ou explorez d'autres catégories.</p>
                        </div>
                    </div>
                )}
            </div>
            
            {/* Pagination */}
            {results?.pagination && results.pagination.pages > 1 && (
                <div className='flex justify-center'>
                    <PaginationSelector 
                        page={results.pagination.page} 
                        pages={results.pagination.pages} 
                        onPageChange={setPage} 
                    />
                </div>
            )}
        </div>
    );
};

export default ShopPage;