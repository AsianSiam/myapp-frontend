import { useQuery } from "react-query";
import type { ArticleShopSearchResponse, ArticleShop } from "../types";
import type { SearchState } from "../pages/ShopPage";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const useGetArticleShop = (articleShopId: string) => {
    const getArticleShopByIdRequest = async (): Promise<ArticleShop> => {
        const response = await fetch(`${API_BASE_URL}/api/articleShop/${articleShopId}`);
        if (!response.ok) {
            throw new Error("Failed to fetch article shop");
        }
        return response.json();
    };

    const { data: articleShop, isLoading } = useQuery(
        ["fetchArticleShop", articleShopId],
        getArticleShopByIdRequest, {
            enabled: !!articleShopId
        }
    );
    return { articleShop, isLoading };
};

export const useGetAllArticleShops = (searchState: SearchState) => {
    const params = new URLSearchParams();
    // Paramètres uniformisés avec le backend
    params.set("searchQuery", searchState.searchQuery);
    params.set("page", searchState.page.toString());
    params.set("selectedCategories", searchState.selectedCategories.join(","));
    params.set("sortOption", searchState.sortOption);

    const createSearchRequest = async (): Promise<ArticleShopSearchResponse> => {
        const response = await fetch(
            `${API_BASE_URL}/api/articleShop?${params.toString()}`
        );

        if (!response.ok) {
            throw new Error("Failed to fetch articles");
        }

        return response.json();
    };
    
    const { data: results, isLoading } = useQuery(
        ["search-all-articles", searchState],
        createSearchRequest
    );
    return { results, isLoading };
};