"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import type { CartContextValue, CartItem, Product, ProductVariant } from "@/types";

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children, slug }: { children: React.ReactNode; slug: string }) {
  const storageKey = `shopwus_cart_${slug}`;
  const [items, setItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        setItems(JSON.parse(saved));
      }
    } catch (_e) {}
    setIsMounted(true);
  }, [storageKey]);

  useEffect(() => {
    if (isMounted) {
      try {
        localStorage.setItem(storageKey, JSON.stringify(items));
      } catch (_e) {}
    }
  }, [items, isMounted, storageKey]);

  const addItem = (
    product: Product,
    quantity = 1,
    selectedOptions?: Record<string, string>,
    selectedVariant?: ProductVariant | null
  ) => {
    const variantId = selectedVariant?.id || null;
    const variantTitle = selectedVariant?.title || null;
    const itemKey = `${product.id}-${variantId || "base"}`;
    const price = selectedVariant ? Number(selectedVariant.price) : Number(product.price) || 0;

    setItems(prev => {
      const existingIndex = prev.findIndex(i => i.id === itemKey);
      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex].quantity += quantity;
        if (selectedOptions) updated[existingIndex].selectedOptions = selectedOptions;
        return updated;
      }
      return [
        ...prev,
        {
          id: itemKey,
          productId: product.id,
          variantId,
          variantTitle,
          product,
          selectedVariant,
          price,
          quantity,
          selectedOptions,
        },
      ];
    });
    setIsCartOpen(true);
  };

  const removeItem = (itemId: string) => {
    setItems(prev => prev.filter(i => (i.id ? i.id !== itemId : i.productId !== itemId)));
  };

  const updateQuantity = (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(itemId);
      return;
    }
    setItems(prev =>
      prev.map(i => ((i.id ? i.id === itemId : i.productId === itemId) ? { ...i, quantity } : i))
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  const cartCount = useMemo(() => {
    return items.reduce((acc, item) => acc + item.quantity, 0);
  }, [items]);

  const subtotal = useMemo(() => {
    return items.reduce((acc, item) => {
      const price = item.price !== undefined ? Number(item.price) : Number(item.product.price) || 0;
      return acc + price * item.quantity;
    }, 0);
  }, [items]);

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        cartCount,
        subtotal,
        isCartOpen,
        setIsCartOpen,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
