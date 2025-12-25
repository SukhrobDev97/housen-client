import React, { useState, useMemo } from 'react';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { Box, Stack, Typography, Button, IconButton, Rating, Select, MenuItem, FormControl } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import StarIcon from '@mui/icons-material/Star';
import Link from 'next/link';
import { useReactiveVar } from '@apollo/client';
import { userVar } from '../../apollo/store';
import withLayoutBasic from '../../libs/components/layout/LayoutBasic';
import { products, categories, featuredProduct, Product } from '../../libs/data/productsData';
import { useCart } from '../../libs/context/CartContext';
import { useCheckout } from '../../libs/context/CheckoutContext';
import { sweetMixinErrorAlert, sweetTopSmallSuccessAlert } from '../../libs/sweetAlert';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

export const getStaticProps = async ({ locale }: any) => ({
	props: {
		...(await serverSideTranslations(locale, ['common'])),
	},
});

/* ============================================
   PRODUCT CARD COMPONENT
============================================ */
interface ProductCardProps {
	product: Product;
	onFavorite?: (id: number) => void;
	isFavorite?: boolean;
	onAddToCart: (product: Product) => void;
}

const ProductCard = ({ product, onFavorite, isFavorite, onAddToCart }: ProductCardProps) => {
	return (
		<Box className="product-card">
			{/* Image Container */}
			<Box className="product-image-container">
				<img src={product.image} alt={product.name} className="product-image" />
				
				{/* Tag Badge */}
				{product.tag && (
					<span className={`product-tag tag-${product.tag.toLowerCase()}`}>
						{product.tag}
					</span>
				)}
				
				{/* Quick Actions */}
				<Box className="quick-actions">
					<IconButton 
						className="action-btn"
						onClick={() => onFavorite && onFavorite(product.id)}
					>
						{isFavorite ? <FavoriteIcon /> : <FavoriteBorderIcon />}
					</IconButton>
					<IconButton 
						className="action-btn cart-btn"
						onClick={() => onAddToCart(product)}
					>
						<AddShoppingCartIcon />
					</IconButton>
				</Box>
			</Box>
			
			{/* Product Info */}
			<Box className="product-info">
				<span className="product-category">{product.category}</span>
				<Typography className="product-name">{product.name}</Typography>
				
				{/* Rating */}
				<Box className="product-rating">
					<Rating 
						value={product.rating} 
						precision={0.1} 
						size="small" 
						readOnly 
						icon={<StarIcon fontSize="inherit" />}
						emptyIcon={<StarIcon fontSize="inherit" />}
					/>
					<span className="rating-value">{product.rating}</span>
				</Box>
				
				{/* Price */}
				<Box className="product-price">
					<span className="current-price">${product.price}</span>
					{product.originalPrice && (
						<span className="original-price">${product.originalPrice}</span>
					)}
				</Box>
				
			</Box>
		</Box>
	);
};

/* ============================================
   MAIN PRODUCTS PAGE
============================================ */
const ProductsPage: NextPage = () => {
	const router = useRouter();
	const user = useReactiveVar(userVar);
	const { addToCart } = useCart();
	const { setDirectCheckoutItems, setCheckoutOpen } = useCheckout();
	const [selectedCategory, setSelectedCategory] = useState('All');
	const [sortBy, setSortBy] = useState('featured');
	const [searchQuery, setSearchQuery] = useState('');
	const [favorites, setFavorites] = useState<number[]>([]);

	// Toggle favorite
	const handleFavorite = (id: number) => {
		setFavorites(prev => 
			prev.includes(id) ? prev.filter(fid => fid !== id) : [...prev, id]
		);
	};

	// Add to cart handler with auth check
	const handleAddToCart = (product: Product) => {
		if (!user?._id) {
			sweetMixinErrorAlert('Please login to add items to cart');
			router.push('/account/join');
			return;
		}
		addToCart(product);
		sweetTopSmallSuccessAlert('Added to cart!', 800);
	};

	// Direct checkout handler for featured product
	const handleShopNow = (product: Product) => {
		if (!user?._id) {
			sweetMixinErrorAlert('Please login to checkout');
			router.push('/account/join');
			return;
		}
		setDirectCheckoutItems([{ product, quantity: 1 }]);
		setCheckoutOpen(true);
	};

	// Filter and sort products
	const filteredProducts = useMemo(() => {
		let result = [...products];

		// Filter by category
		if (selectedCategory !== 'All') {
			result = result.filter(product => product.category === selectedCategory);
		}

		// Filter by search query
		if (searchQuery.trim()) {
			const query = searchQuery.toLowerCase();
			result = result.filter(product => 
				product.name.toLowerCase().includes(query) ||
				product.category.toLowerCase().includes(query)
			);
		}

		// Sort products
		switch (sortBy) {
			case 'price-low':
				result.sort((a, b) => a.price - b.price);
				break;
			case 'price-high':
				result.sort((a, b) => b.price - a.price);
				break;
			case 'rating':
				result.sort((a, b) => b.rating - a.rating);
				break;
			case 'newest':
				result.sort((a, b) => b.id - a.id);
				break;
			default:
				// featured - keep original order
				break;
		}

		return result;
	}, [selectedCategory, searchQuery, sortBy]);

	// Get trending products (first 4 with highest rating)
	const trendingProducts = [...products].sort((a, b) => b.rating - a.rating).slice(0, 4);

	// Get recommended products (random 4)
	const recommendedProducts = products.slice(4, 8);

	return (
		<div id="products-page">
			{/* ==========================================
			    HERO SECTION - Same as Projects Page
			========================================== */}
			<Stack className={'products-hero'}>
				<Box component={'div'} className={'hero-banner'}>
					<img src="/img/projectsPage/products/Minimalist Scandinavian Interiors.jpeg" alt="Products Banner" />
					<Box component={'div'} className={'hero-overlay'}></Box>
					<Stack className={'hero-content'}>
						<Stack className={'container'}>
							<Stack className={'breadcrumb'}>
								<Link href={'/'}>
									<span>Home</span>
								</Link>
								<span className={'separator'}>Products</span>
							</Stack>
							<h1 className={'page-title'}>Products</h1>
						</Stack>
					</Stack>
				</Box>
			</Stack>

			{/* ==========================================
			    FILTER BAR
			========================================== */}
			<section className="filter-section">
				<div className="filter-container">
					{/* Category Filter */}
					<Box className="filter-group">
						<Typography className="filter-label">Category</Typography>
						<Box className="category-pills">
							{categories.map((cat) => (
								<button
									key={cat}
									className={`category-pill ${selectedCategory === cat ? 'active' : ''}`}
									onClick={() => setSelectedCategory(cat)}
								>
									{cat}
								</button>
							))}
						</Box>
					</Box>

					{/* Search & Sort */}
					<Box className="filter-actions">
						{/* Search Input */}
						<Box className="search-box">
							<SearchIcon className="search-icon" />
							<input
								type="text"
								placeholder="Search products..."
								value={searchQuery}
								onChange={(e) => setSearchQuery(e.target.value)}
							/>
						</Box>

						{/* Sort Select */}
						<FormControl className="sort-select">
							<Select
								value={sortBy}
								onChange={(e) => setSortBy(e.target.value)}
								displayEmpty
							>
								<MenuItem value="featured">Featured</MenuItem>
								<MenuItem value="price-low">Price: Low to High</MenuItem>
								<MenuItem value="price-high">Price: High to Low</MenuItem>
								<MenuItem value="rating">Top Rated</MenuItem>
								<MenuItem value="newest">Newest</MenuItem>
							</Select>
						</FormControl>
					</Box>
				</div>
			</section>

			{/* ==========================================
			    FEATURED COLLECTION
			========================================== */}
			<section className="featured-section">
				<div className="featured-container">
					<Box className="featured-card">
						<Box className="featured-image">
							<img src={featuredProduct.image} alt={featuredProduct.name} />
							<span className="featured-badge">
								<LocalOfferIcon /> Limited Edition
							</span>
						</Box>
						<Box className="featured-content">
							<span className="featured-label">Featured Collection</span>
							<Typography className="featured-title">{featuredProduct.name}</Typography>
							<Typography className="featured-description">
								{featuredProduct.description}
							</Typography>
							<Box className="featured-price-row">
								<Box className="featured-price">
									<span className="current">${featuredProduct.price}</span>
									{featuredProduct.originalPrice && (
										<span className="original">${featuredProduct.originalPrice}</span>
									)}
								</Box>
								<Box className="featured-rating">
									<StarIcon />
									<span>{featuredProduct.rating}</span>
								</Box>
							</Box>
							<Button className="featured-cta" onClick={() => handleShopNow(featuredProduct)}>
								Shop Now
								<ArrowForwardIcon />
							</Button>
						</Box>
					</Box>
				</div>
			</section>

			{/* ==========================================
			    PRODUCTS GRID
			========================================== */}
			<section className="products-section">
				<div className="products-container">
					<Box className="section-header">
						<Typography className="section-title">
							{selectedCategory === 'All' ? 'All Products' : selectedCategory}
						</Typography>
						<Typography className="section-count">{filteredProducts.length} items</Typography>
					</Box>
					
					<Box className="products-grid">
						{filteredProducts.length > 0 ? (
							filteredProducts.map((product) => (
								<ProductCard 
									key={product.id} 
									product={product}
									onFavorite={handleFavorite}
									isFavorite={favorites.includes(product.id)}
									onAddToCart={handleAddToCart}
								/>
							))
						) : (
							<Box className="no-products">
								<Typography>No products found</Typography>
							</Box>
						)}
					</Box>
				</div>
			</section>

			{/* ==========================================
			    TRENDING NOW
			========================================== */}
			<section className="trending-section">
				<div className="trending-container">
					<Box className="section-header">
						<Box>
							<Typography className="section-title">Trending Now</Typography>
							<Typography className="section-subtitle">Most popular picks this week</Typography>
						</Box>
						<Button className="view-all-btn">
							View All
							<ArrowForwardIcon />
						</Button>
					</Box>
					
					<Box className="trending-grid">
						{trendingProducts.map((product) => (
							<ProductCard 
								key={product.id} 
								product={product}
								onFavorite={handleFavorite}
								isFavorite={favorites.includes(product.id)}
								onAddToCart={handleAddToCart}
							/>
						))}
					</Box>
				</div>
			</section>

			{/* ==========================================
			    RECOMMENDED FOR YOU
			========================================== */}
			<section className="recommended-section">
				<div className="recommended-container">
					<Box className="section-header">
						<Box>
							<Typography className="section-title">Recommended For You</Typography>
							<Typography className="section-subtitle">Handpicked based on trends</Typography>
						</Box>
						<Button className="view-all-btn">
							View All
							<ArrowForwardIcon />
						</Button>
					</Box>
					
					<Box className="recommended-grid">
						{recommendedProducts.map((product) => (
							<ProductCard 
								key={product.id} 
								product={product}
								onFavorite={handleFavorite}
								isFavorite={favorites.includes(product.id)}
								onAddToCart={handleAddToCart}
							/>
						))}
					</Box>
				</div>
			</section>

		</div>
	);
};

export default withLayoutBasic(ProductsPage);

