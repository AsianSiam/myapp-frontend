import React, { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import type { ArticleShop } from '@/types';

export type CartItem = {
    article: ArticleShop;
    quantity: number;
};

type CartContextType = {
    cartItems: CartItem[];
    addToCart: (article: ArticleShop, quantity?: number) => void;
    removeFromCart: (articleId: string) => void;
    updateQuantity: (articleId: string, quantity: number) => void;
    clearCart: () => void;
    getTotalItems: () => number;
    getTotalPrice: () => number;
    isInCart: (articleId: string) => boolean;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
};

type CartProviderProps = {
    children: ReactNode;
};

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
    const [cartItems, setCartItems] = useState<CartItem[]>([]);
    const [isHydrated, setIsHydrated] = useState(false);

    // Charger le panier depuis localStorage au démarrage
    useEffect(() => {
        const savedCart = localStorage.getItem('shopping-cart');
        if (savedCart) {
            try {
                const parsedCart = JSON.parse(savedCart);
                // Valider que les données sont correctes
                if (Array.isArray(parsedCart) && parsedCart.every(item => 
                    item.article && typeof item.quantity === 'number'
                )) {
                    setCartItems(parsedCart);
                }
            } catch (error) {
                console.error('Error loading cart from localStorage:', error);
                localStorage.removeItem('shopping-cart');
            }
        }
        setIsHydrated(true);
    }, []);

    // Sauvegarder le panier dans localStorage à chaque changement (seulement après hydratation)
    useEffect(() => {
        if (isHydrated) {
            localStorage.setItem('shopping-cart', JSON.stringify(cartItems));
        }
    }, [cartItems, isHydrated]);

    const addToCart = (article: ArticleShop, quantity: number = 1) => {
        setCartItems(prevItems => {
            const existingItem = prevItems.find(item => item.article._id === article._id);
            
            if (existingItem) {
                // Si l'article existe, augmenter la quantité
                return prevItems.map(item =>
                    item.article._id === article._id
                        ? { ...item, quantity: item.quantity + quantity }
                        : item
                );
            } else {
                // Ajouter un nouvel article
                return [...prevItems, { article, quantity }];
            }
        });
    };

    const removeFromCart = (articleId: string) => {
        setCartItems(prevItems => prevItems.filter(item => item.article._id !== articleId));
    };

    const updateQuantity = (articleId: string, quantity: number) => {
        if (quantity <= 0) {
            removeFromCart(articleId);
            return;
        }

        setCartItems(prevItems =>
            prevItems.map(item =>
                item.article._id === articleId
                    ? { ...item, quantity }
                    : item
            )
        );
    };

    const clearCart = () => {
        setCartItems([]);
    };

    const getTotalItems = () => {
        return cartItems.reduce((total, item) => total + item.quantity, 0);
    };

    const getTotalPrice = () => {
        return cartItems.reduce((total, item) => total + (item.article.price * item.quantity), 0);
    };

    const isInCart = (articleId: string) => {
        return cartItems.some(item => item.article._id === articleId);
    };

    const value: CartContextType = {
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getTotalItems,
        getTotalPrice,
        isInCart,
    };

    return (
        <CartContext.Provider value={value}>
            {children}
        </CartContext.Provider>
    );
};