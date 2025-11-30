import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Product } from '../data/productsData';

export interface CartItem {
	product: Product;
	quantity: number;
}

interface CartContextType {
	cartItems: CartItem[];
	addToCart: (product: Product) => void;
	removeFromCart: (productId: number) => void;
	updateQuantity: (productId: number, quantity: number) => void;
	clearCart: () => void;
	getCartTotal: () => number;
	getCartCount: () => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
	const [cartItems, setCartItems] = useState<CartItem[]>([]);

	const addToCart = (product: Product) => {
		setCartItems(prev => {
			const existingItem = prev.find(item => item.product.id === product.id);
			if (existingItem) {
				return prev.map(item =>
					item.product.id === product.id
						? { ...item, quantity: item.quantity + 1 }
						: item
				);
			}
			return [...prev, { product, quantity: 1 }];
		});
	};

	const removeFromCart = (productId: number) => {
		setCartItems(prev => prev.filter(item => item.product.id !== productId));
	};

	const updateQuantity = (productId: number, quantity: number) => {
		if (quantity <= 0) {
			removeFromCart(productId);
			return;
		}
		setCartItems(prev =>
			prev.map(item =>
				item.product.id === productId
					? { ...item, quantity }
					: item
			)
		);
	};

	const clearCart = () => {
		setCartItems([]);
	};

	const getCartTotal = () => {
		return cartItems.reduce((total, item) => total + item.product.price * item.quantity, 0);
	};

	const getCartCount = () => {
		return cartItems.reduce((count, item) => count + item.quantity, 0);
	};

	return (
		<CartContext.Provider
			value={{
				cartItems,
				addToCart,
				removeFromCart,
				updateQuantity,
				clearCart,
				getCartTotal,
				getCartCount,
			}}
		>
			{children}
		</CartContext.Provider>
	);
};

export const useCart = () => {
	const context = useContext(CartContext);
	if (!context) {
		throw new Error('useCart must be used within a CartProvider');
	}
	return context;
};
