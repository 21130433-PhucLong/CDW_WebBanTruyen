import React, { createContext, useContext, useState, useEffect } from 'react';
import type { CartDto, CheckoutDetails } from '../models/Cart';
import { cartService } from '../services/cartService';
import { useAuth } from './AuthContext';

interface CartContextType {
  cart: CartDto | null;
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

// Cart trống mặc định — dùng khi chưa đăng nhập hoặc logout
const EMPTY_CART: CartDto = {
  cartId: 0,
  items: [],
  subtotal: 0,
  shippingFee: 0,
  total: 0,
};

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartDto | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  // Fetch cart khi user thay đổi (đăng nhập/đăng xuất)
  useEffect(() => {
    const fetchCart = async () => {
      setIsLoading(true);
      setError(null);

      if (user) {
        // Đã đăng nhập → fetch cart từ API
        try {
          const response = await cartService.getCart();
          setCart(response.data ?? EMPTY_CART);
        } catch (err: any) {
          // 401/403 → token hết hạn hoặc không hợp lệ
          // Không crash trang — chỉ set cart rỗng
          console.error('Lỗi khi lấy giỏ hàng:', err);
          setCart(EMPTY_CART);
          setError(null); // Không hiển thị lỗi lên UI
        } finally {
          setIsLoading(false);
        }
      } else {
        // Chưa đăng nhập → load cart từ localStorage
        try {
          const savedCart = localStorage.getItem('cart');
          if (savedCart) {
            setCart(JSON.parse(savedCart));
          } else {
            setCart(EMPTY_CART);
          }
        } catch {
          // localStorage bị corrupt → reset
          localStorage.removeItem('cart');
          setCart(EMPTY_CART);
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchCart();
  }, [user]);

  // Lưu cart vào localStorage khi chưa đăng nhập
  useEffect(() => {
    if (!user && cart) {
      try {
        localStorage.setItem('cart', JSON.stringify(cart));
      } catch {
        // localStorage đầy hoặc lỗi — bỏ qua
      }
    }
  }, [cart, user]);

  // Tính lại subtotal, shippingFee, total
  const recalculate = (items: CartDto['items']): CartDto => {
    const subtotal = items.reduce((sum, item) => sum + (item.totalPrice || 0), 0);
    const shippingFee = subtotal >= 150000 || subtotal === 0 ? 0 : 30000;
    return { cartId: 0, items, subtotal, shippingFee, total: subtotal + shippingFee };
  };

  const addToCart = async (mangaId: number, quantity: number = 1) => {
    try {
      setError(null);
      if (user) {
        // Đã đăng nhập → gọi API
        const response = await cartService.addToCart(mangaId, quantity);
        setCart(response.data ?? EMPTY_CART);
      } else {
        // Chưa đăng nhập → cập nhật localStorage
        setCart(prevCart => {
          const currentCart = prevCart ?? EMPTY_CART;
          const existingItem = currentCart.items.find(item => item.mangaId === mangaId);

          let updatedItems;
          if (existingItem) {
            // Đã có trong giỏ → tăng số lượng
            updatedItems = currentCart.items.map(item =>
              item.mangaId === mangaId
                ? {
                    ...item,
                    quantity: item.quantity + quantity,
                    totalPrice: (item.price || 0) * (item.quantity + quantity),
                  }
                : item
            );
          } else {
            // Chưa có → thêm mới với id tạm
            updatedItems = [
              ...currentCart.items,
              {
                id: Date.now(),
                mangaId,
                title: 'Sách Manga',
                coverImage: '',
                price: 0,
                authorName: '',
                quantity,
                totalPrice: 0,
              },
            ];
          }

          return recalculate(updatedItems);
        });
      }
    } catch (err: any) {
      const msg = err.response?.data?.message || err.message || 'Không thể thêm vào giỏ hàng';
      setError(msg);
      throw err;
    }
  };

  const updateQuantity = async (itemId: number, quantity: number) => {
    try {
      setError(null);
      if (user) {
        const response = await cartService.updateQuantity(itemId, quantity);
        setCart(response.data ?? EMPTY_CART);
      } else {
        setCart(prevCart => {
          if (!prevCart) return EMPTY_CART;
          const updatedItems = prevCart.items.map(item =>
            item.id === itemId
              ? { ...item, quantity, totalPrice: (item.price || 0) * quantity }
              : item
          );
          return recalculate(updatedItems);
        });
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Không thể cập nhật số lượng');
      throw err;
    }
  };

  const removeFromCart = async (itemId: number) => {
    try {
      setError(null);
      if (user) {
        await cartService.removeFromCart(itemId);
      }
      setCart(prevCart => {
        if (!prevCart) return EMPTY_CART;
        const updatedItems = prevCart.items.filter(item => item.id !== itemId);
        return recalculate(updatedItems);
      });
    } catch (err: any) {
      setError(err.response?.data?.message || 'Không thể xóa sản phẩm');
      throw err;
    }
  };

  const clearCart = async () => {
    try {
      setError(null);
      if (user) {
        await cartService.clearCart();
      }
      setCart(EMPTY_CART);
      localStorage.removeItem('cart');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Không thể xóa giỏ hàng');
      throw err;
    }
  };

  const calculateShipping = async (address: CheckoutDetails['shippingAddress']) => {
    try {
      setError(null);
      const response = await cartService.calculateShipping(address);
      return response.data.shippingFee;
    } catch (err: any) {
      setError(err.response?.data?.message || 'Không thể tính phí vận chuyển');
      throw err;
    }
  };

  const checkout = async (checkoutDetails: CheckoutDetails) => {
    try {
      setError(null);
      if (!user) {
        throw new Error('Vui lòng đăng nhập để thanh toán');
      }
      await cartService.checkout(checkoutDetails);
      setCart(EMPTY_CART);
      localStorage.removeItem('cart');
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Thanh toán thất bại');
      throw err;
    }
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        isLoading,
        error,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        calculateShipping,
        checkout,
      }}
    >
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
