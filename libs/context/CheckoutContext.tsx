import React, { createContext, useContext, useState, ReactNode } from 'react';
import { CartItem } from './CartContext';

interface CheckoutContextType {
	directCheckoutItems: CartItem[] | null;
	setDirectCheckoutItems: (items: CartItem[] | null) => void;
	checkoutOpen: boolean;
	setCheckoutOpen: (open: boolean) => void;
}

const CheckoutContext = createContext<CheckoutContextType | undefined>(undefined);

export const CheckoutProvider = ({ children }: { children: ReactNode }) => {
	const [directCheckoutItems, setDirectCheckoutItems] = useState<CartItem[] | null>(null);
	const [checkoutOpen, setCheckoutOpen] = useState<boolean>(false);

	return (
		<CheckoutContext.Provider
			value={{
				directCheckoutItems,
				setDirectCheckoutItems,
				checkoutOpen,
				setCheckoutOpen,
			}}
		>
			{children}
		</CheckoutContext.Provider>
	);
};

export const useCheckout = () => {
	const context = useContext(CheckoutContext);
	if (!context) {
		throw new Error('useCheckout must be used within a CheckoutProvider');
	}
	return context;
};
