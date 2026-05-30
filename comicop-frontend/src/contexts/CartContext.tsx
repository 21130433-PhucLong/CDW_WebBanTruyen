// CartContext.tsx — placeholder tạm
// File đầy đủ sẽ làm ở Ngày 10 (khi có Cart API backend)
import React, { createContext, useContext, useState } from 'react'

interface CartContextType {
    cart: null
    isLoading: boolean
    error: string | null
    addToCart: (mangaId: number, quantity?: number) => Promise<void>
    updateQuantity: (itemId: number, quantity: number) => Promise<void>
    removeFromCart: (itemId: number) => Promise<void>
    clearCart: () => Promise<void>
    calculateShipping: (address: any) => Promise<number>
    checkout: (checkoutDetails: any) => Promise<void>
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [isLoading] = useState(false)

    // Các hàm placeholder — sẽ implement đầy đủ ở Ngày 10
    const addToCart = async () => {}
    const updateQuantity = async () => {}
    const removeFromCart = async () => {}
    const clearCart = async () => {}
    const calculateShipping = async () => 0
    const checkout = async () => {}

    return (
        <CartContext.Provider value={{
            cart: null,
            isLoading,
            error: null,
            addToCart,
            updateQuantity,
            removeFromCart,
            clearCart,
            calculateShipping,
            checkout,
        }}>
            {children}
        </CartContext.Provider>
    )
}

export const useCart = () => {
    const context = useContext(CartContext)
    if (context === undefined) {
        throw new Error('useCart must be used within a CartProvider')
    }
    return context
}