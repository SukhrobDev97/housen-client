import type { AppProps } from 'next/app';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { light } from '../scss/MaterialTheme';
import { ApolloProvider } from '@apollo/client';
import { useApollo } from '../apollo/client';
import { appWithTranslation } from 'next-i18next';
import { CartProvider } from '../libs/context/CartContext';
import { CheckoutProvider } from '../libs/context/CheckoutContext';
import '../scss/app.scss';
import '../scss/pc/main.scss';
import '../scss/mobile/main.scss';

const App = ({ Component, pageProps }: AppProps) => {
	// @ts-ignore
	const [theme, setTheme] = useState(createTheme(light));
	const client = useApollo(pageProps.initialApolloState);

	// Fix body overflow and padding issues on mobile (Issue 1)
	useEffect(() => {
		if (typeof window !== 'undefined') {
			// Remove any runtime styles that might cause horizontal scroll
			const body = document.body;
			const html = document.documentElement;
			
			// Force remove padding-right and overflow styles
			body.style.paddingRight = '';
			body.style.overflow = '';
			html.style.overflowX = 'hidden';
			
			// Ensure body doesn't exceed viewport
			body.style.maxWidth = '100vw';
		}
	}, []);

	return (
		<ApolloProvider client={client}>
			<CartProvider>
				<CheckoutProvider>
					<ThemeProvider theme={theme}>
						<CssBaseline />
						<Head>
							<title>Housen</title>
							<meta name="title" content="Housen" />
						</Head>
						<Component {...pageProps} />
					</ThemeProvider>
				</CheckoutProvider>
			</CartProvider>
		</ApolloProvider>
	);
};

export default appWithTranslation(App);
