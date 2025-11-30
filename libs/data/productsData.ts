export interface Product {
	id: number;
	name: string;
	price: number;
	originalPrice?: number;
	category: string;
	image: string;
	tag?: 'NEW' | 'SALE' | 'LIMITED' | 'TRENDING';
	rating: number;
	description?: string;
}

export const products: Product[] = [
	{
		id: 1,
		name: 'Minimal Wooden Chair',
		price: 129,
		category: 'Furniture',
		image: '/img/projectsPage/products/chair.jpeg',
		tag: 'NEW',
		rating: 4.8,
		description: 'Elegant minimalist design for modern spaces',
	},
	{
		id: 2,
		name: 'Vienna Comfort Sofa',
		price: 899,
		originalPrice: 1199,
		category: 'Furniture',
		image: '/img/projectsPage/products/viennaSofa.jpeg',
		tag: 'SALE',
		rating: 4.9,
		description: 'Premium comfort with timeless design',
	},
	{
		id: 3,
		name: 'Modern Floor Lamp',
		price: 189,
		category: 'Lighting',
		image: '/img/projectsPage/products/floorLamp.jpeg',
		tag: 'TRENDING',
		rating: 4.7,
		description: 'Contemporary lighting for any room',
	},
	{
		id: 4,
		name: 'Feathers Sectional Sofa',
		price: 1450,
		category: 'Furniture',
		image: '/img/projectsPage/products/Feathers Sectional Sofa from 25Home.jpeg',
		tag: 'LIMITED',
		rating: 4.9,
		description: 'Luxurious sectional for spacious living',
	},
	{
		id: 5,
		name: 'Elegant Dining Chair',
		price: 79,
		category: 'Furniture',
		image: '/img/projectsPage/products/diningChair.jpeg',
		tag: 'NEW',
		rating: 4.6,
		description: 'Perfect for modern dining spaces',
	},
	{
		id: 6,
		name: 'Premium Dining Table',
		price: 599,
		originalPrice: 750,
		category: 'Furniture',
		image: '/img/projectsPage/products/diningTables.jpeg',
		tag: 'SALE',
		rating: 4.8,
		description: 'Solid wood dining table for 6',
	},
	{
		id: 7,
		name: 'Floating Wall Shelf',
		price: 49,
		category: 'Decor',
		image: '/img/projectsPage/products/floatingShelf.jpeg',
		rating: 4.5,
		description: 'Minimalist storage solution',
	},
	{
		id: 8,
		name: 'Luxury Queen Bed',
		price: 1299,
		category: 'Furniture',
		image: '/img/projectsPage/products/QueenBed.jpeg',
		tag: 'TRENDING',
		rating: 4.9,
		description: 'Premium bedroom centerpiece',
	},
	{
		id: 9,
		name: 'Decorative Accent Sofa',
		price: 649,
		category: 'Furniture',
		image: '/img/projectsPage/products/decorativeSofa.jpeg',
		rating: 4.7,
		description: 'Statement piece for any living room',
	},
	{
		id: 10,
		name: 'Scandinavian Interior Set',
		price: 2499,
		originalPrice: 2999,
		category: 'Interior',
		image: '/img/projectsPage/products/Minimalist Scandinavian Interiors.jpeg',
		tag: 'LIMITED',
		rating: 5.0,
		description: 'Complete Scandinavian design package',
	},
	{
		id: 11,
		name: 'Home Office Setup',
		price: 799,
		category: 'Office',
		image: '/img/projectsPage/products/Minimalist Home Office Achieve a Clutter-Free and Calm Workspace.jpeg',
		tag: 'NEW',
		rating: 4.8,
		description: 'Clutter-free workspace essentials',
	},
	{
		id: 12,
		name: 'Modern Living Room Set',
		price: 1899,
		category: 'Interior',
		image: '/img/projectsPage/products/_ (1).jpeg',
		rating: 4.6,
		description: 'Contemporary living room package',
	},
];

export const categories = ['All', 'Furniture', 'Decor', 'Lighting', 'Interior', 'Office'];

export const featuredProduct: Product = {
	id: 100,
	name: 'Exclusive Designer Collection',
	price: 3499,
	originalPrice: 4299,
	category: 'Interior',
	image: '/img/projectsPage/products/_ (2).jpeg',
	tag: 'LIMITED',
	rating: 5.0,
	description: 'A curated collection of premium designer pieces that transform any space into a masterpiece of modern elegance.',
};

