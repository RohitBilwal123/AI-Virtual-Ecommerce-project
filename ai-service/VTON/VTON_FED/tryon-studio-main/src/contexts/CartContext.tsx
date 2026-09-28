import React, { createContext, useContext, ReactNode } from 'react';
import { useCart as useCartHook } from '@/hooks/useCart';
import { CartItem } from '@/types/ecommerce';

interface CartContextType {
    cartItems: CartItem[];
    cartCount: number;
    loading: boolean;
    addToCart: (item: any) => Promise<boolean>;
    updateQuantity: (itemId: string, quantity: number) => Promise<void>;
    removeFromCart: (itemId: string) => Promise<void>;
    clearCart: () => Promise<void>;
    getCartTotal: () => number;
    refetch: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const cart = useCartHook();

    return (
        <CartContext.Provider value={cart}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => {
    const context = useContext(CartContext);
    if (context === undefined) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
};
