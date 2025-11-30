import React, { useState } from 'react';
import { NextPage } from 'next';
import { Stack, Box, Typography, Button, IconButton, Rating, Select, MenuItem, FormControl } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import StarIcon from '@mui/icons-material/Star';
import withLayoutBasic from '../../libs/components/layout/LayoutBasic';
import { products, categories, featuredProduct, Product } from '../../libs/data/productsData';
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
}

const ProductCard = ({ product, onFavorite, isFavorite }: ProductCardProps) => {
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
					<IconButton className="action-btn">
						<ShoppingCartOutlinedIcon />
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

	// Get trending products (first 4 with highest rating)
	const trendingProducts = [...products].sort((a, b) => b.rating - a.rating).slice(0, 4);

	// Get recommended products (random 4)
	const recommendedProducts = products.slice(4, 8);

	return (
		<div id="products-page">
			{/* ==========================================
			    HERO SECTION
			========================================== */}
			<section className="hero-section">
				<div className="hero-overlay" />
				<div className="hero-content">
					<span className="hero-label">Premium Collection</span>
					<h1 className="hero-title">Our Products</h1>
					<p className="hero-subtitle">Quality. Design. Inspiration.</p>
				</div>
			</section>

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
							<Button className="featured-cta">
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
						<Typography className="section-title">All Products</Typography>
						<Typography className="section-count">{products.length} items</Typography>
					</Box>
					
					<Box className="products-grid">
						{products.map((product) => (
							<ProductCard 
								key={product.id} 
								product={product}
								onFavorite={handleFavorite}
								isFavorite={favorites.includes(product.id)}
							/>
						))}
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
							/>
						))}
					</Box>
				</div>
			</section>

		</div>
	);
};

export default withLayoutBasic(ProductsPage);

