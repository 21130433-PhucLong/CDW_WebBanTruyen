import React, { createContext, useContext, useState, useEffect } from 'react';
import type { Cart, CheckoutDetails } from '../models/Cart';
import { cartService } from '../services/cartService';
import { useAuth } from './AuthContext';

interface CartContextType {
  cart: Cart | null;
  isLoading: boolean;
  error: string | null;
  addToCart: (mangaId: number, quantity?: number) => Promise<void>;
  updateQuantity: (itemId: number, quantity: number) => Promise<void>;
  removeFromCart: (itemId: number) => Promise<void>;
  clearCart: () => Promise<void>;
  calculateShipping: (address: CheckoutDetails['shippingAddress']) => Promise<number>;
  checkout: (checkoutDetails: CheckoutDetails) => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<Cart | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  // Lấy user từ AuthContext — nếu có user thì fetch cart từ API
  // nếu chưa đăng nhập thì dùng localStorage
  const { user } = useAuth();

  // Fetch cart khi user thay đổi (đăng nhập/đăng xuất)
  useEffect(() => {
    const fetchCart = async () => {
      if (user) {
        try {
          const response = await cartService.getCart();
          setCart(response.data);
        } catch (error) {
          console.error('Lỗi khi lấy giỏ hàng:', error);
        } finally {
          setIsLoading(false);
        }
      } else {
        // Chưa đăng nhập — load cart từ localStorage
        const savedCart = localStorage.getItem('cart');
        if (savedCart) {
          setCart(JSON.parse(savedCart));
        }
        setIsLoading(false);
      }
    };
    fetchCart();
  }, [user]);

  // Lưu cart vào localStorage khi chưa đăng nhập
  useEffect(() => {
    if (!user && cart) {
      localStorage.setItem('cart', JSON.stringify(cart));
    }
  }, [cart, user]);

  const addToCart = async (mangaId: number, quantity: number = 1) => {
    try {
      setError(null);
      if (user) {
        // Đã đăng nhập → gọi API
        const response = await cartService.addToCart(mangaId, quantity);
        setCart(response.data);
      } else {
        // Chưa đăng nhập → cập nhật local state
        setCart(prevCart => {
          const existingItem = prevCart?.items.find(item => item.manga.id === mangaId);
          if (existingItem) {
            return {
              ...prevCart!,
              items: prevCart!.items.map(item =>
                item.manga.id === mangaId
                  ? { ...item, quantity: item.quantity + quantity }
                  : item
              )
            };
          }
          return prevCart;
        });
      }
    } catch (error: any) {
      setError(error.response?.data?.message || 'Không thể thêm vào giỏ hàng');
      throw error;
    }
  };

  const updateQuantity = async (itemId: number, quantity: number) => {
    try {
      setError(null);
      if (user) {
        const response = await cartService.updateQuantity(itemId, quantity);
        setCart(response.data);
      } else {
        setCart(prevCart => ({
          ...prevCart!,
          items: prevCart!.items.map(item =>
            item.id === itemId ? { ...item, quantity } : item
          )
        }));
      }
    } catch (error: any) {
      setError(error.response?.data?.message || 'Không thể cập nhật số lượng');
      throw error;
    }
  };

  const removeFromCart = async (itemId: number) => {
    try {
      setError(null);
      if (user) {
        await cartService.removeFromCart(itemId);
      }
      setCart(prevCart => ({
        ...prevCart!,
        items: prevCart!.items.filter(item => item.id !== itemId)
      }));
    } catch (error: any) {
      setError(error.response?.data?.message || 'Không thể xóa sản phẩm');
      throw error;
    }
  };

  const clearCart = async () => {
    try {
      setError(null);
      if (user) {
        await cartService.clearCart();
      }
      setCart(null);
      if (!user) {
        localStorage.removeItem('cart');
      }
    } catch (error: any) {
      setError(error.response?.data?.message || 'Không thể xóa giỏ hàng');
      throw error;
    }
  };

  const calculateShipping = async (address: CheckoutDetails['shippingAddress']) => {
    try {
      setError(null);
      const response = await cartService.calculateShipping(address);
      return response.data.shippingFee;
    } catch (error: any) {
      setError(error.response?.data?.message || 'Không thể tính phí vận chuyển');
      throw error;
    }
  };

  const checkout = async (checkoutDetails: CheckoutDetails) => {
    try {
      setError(null);
      if (!user) {
        throw new Error('Vui lòng đăng nhập để thanh toán');
      }
      await cartService.checkout(checkoutDetails);
      setCart(null);
    } catch (error: any) {
      setError(error.response?.data?.message || 'Thanh toán thất bại');
      throw error;
    }
  };

  return (
    <CartContext.Provider value={{
      cart,
      isLoading,
      error,
      addToCart,
      updateQuantity,
      removeFromCart,
      clearCart,
      calculateShipping,
      checkout,
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart phải được dùng trong CartProvider');
  }
  return context;
};