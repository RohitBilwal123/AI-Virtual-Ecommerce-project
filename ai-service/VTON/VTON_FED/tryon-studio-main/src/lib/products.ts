import { API_BASE } from './api';

export interface Product {
    id: string;
    index: number;
    name: string;
    description: string;
    price: number;
    category: string;
    garmentUrl: string;  // full URL
    tryOnUrl: string | null; // full URL
    sizes: string[];
    colors: string[];
    matchScore: number;
    filename: string;
}

// Per-category product name banks
const NAME_BANKS: Record<string, string[]> = {
    'Hoodies': ['Classic Hoodie', 'Zip-Up Hoodie', 'Pullover Hoodie', 'Oversized Hoodie', 'Slim-Fit Hoodie', 'Graphic Hoodie', 'Sport Hoodie', 'Fleece Hoodie', 'Contrast Hoodie', 'Basic Hoodie'],
    'T-Shirts': ['Classic Tee', 'V-Neck Tee', 'Crew Neck Tee', 'Striped Tee', 'Pocket Tee', 'Longline Tee', 'Essential Tee', 'Relaxed Tee', 'Fitted Tee', 'Premium Cotton Tee'],
    'Shirts': ['Oxford Shirt', 'Linen Shirt', 'Formal Shirt', 'Slim-Fit Shirt', 'Check Shirt', 'Flannel Shirt', 'Casual Shirt', 'Poplin Shirt', 'Chambray Shirt', 'Stretch Shirt'],
    'Jackets': ['Denim Jacket', 'Bomber Jacket', 'Windbreaker', 'Puffer Jacket', 'Leather Jacket', 'Track Jacket', 'Field Jacket', 'Coach Jacket', 'Utility Jacket', 'Double Breasted Jacket'],
    'Sweatshirts': ['Crewneck Sweatshirt', 'Oversized Sweatshirt', 'Graphic Sweatshirt', 'Quarter-Zip Sweatshirt', 'Fleece Sweatshirt', 'Athletic Sweatshirt', 'Vintage Sweatshirt', 'Pullover Sweatshirt', 'Classic Sweatshirt', 'Sport Sweatshirt'],
    'Tops': ['Flowy Top', 'Crop Top', 'Cami Top', 'Peplum Top', 'Off-Shoulder Top', 'Wrap Top', 'Ribbed Top', 'Lace Top', 'Tie-Front Top', 'Ruffle Top'],
    'Kurtis': ['Printed Kurti', 'Anarkali Kurti', 'Straight Kurti', 'A-Line Kurti', 'High-Low Kurti', 'Collar Kurti', 'Embroidered Kurti', 'Cotton Kurti', 'Silk Kurti', 'Palazzo Kurti'],
    'Festival Dress': ['Festive Anarkali', 'Bridal Lehenga', 'Designer Gown', 'Silk Dress', 'Embellished Dress', 'Kaftan Dress', 'Chanderi Dress', 'Georgette Dress', 'Floral Dress', 'Ethnic Maxi'],
    'Blazers': ['Slim Blazer', 'Double-Breasted Blazer', 'Casual Blazer', 'Plaid Blazer', 'Linen Blazer', 'Stretch Blazer', 'Notch-Lapel Blazer', 'Check Blazer', 'Sport Blazer', 'Classic Blazer'],
    'Hoodies and SweatShirts': ['Pullover Hoodie', 'Zip Hoodie', 'Crewneck Sweatshirt', 'Graphic Hoodie', 'Sport Hoodie', 'Oversized Hoodie', 'Fleece Hoodie', 'Slim Hoodie', 'Vintage Hoodie', 'Tech Hoodie'],
    'Kurtas': ['Printed Kurta', 'Solid Kurta', 'Embroidered Kurta', 'Pathani Kurta', 'Nehru Kurta', 'A-Line Kurta', 'Casual Kurta', 'Festive Kurta', 'Short Kurta', 'Long Kurta'],
    'Birthday Dresses': ['Party Frock', 'Tutu Dress', 'Floral Dress', 'Princess Dress', 'Sequin Dress', 'Bow Dress', 'Lace Dress', 'Maxi Dress', 'Tiered Dress', 'Velvet Dress'],
};

const FALLBACK_NAMES = Array.from({ length: 10 }, (_, i) => `Style ${i + 1}`);

const PRICES = [899, 1299, 1599, 1999, 2499, 2999, 3499, 3999, 4499, 4999];

const DESCRIPTIONS = [
    'Premium quality fabric with modern fit. Perfect for casual and semi-formal occasions.',
    'Crafted with 100% premium cotton for all-day comfort and style.',
    'Contemporary design with superior craftsmanship and breathable material.',
    'Versatile piece that pairs well with any outfit. Machine washable.',
    'Elevated essentials made from high-quality fabric with a flattering silhouette.',
    'Designed for the modern wardrobe — comfortable, stylish, and durable.',
    'Classic styling meets modern comfort. A wardrobe must-have.',
    'Soft touch fabric with a relaxed fit ideal for every day wear.',
    'Premium blend fabric with clean lines and a timeless aesthetic.',
    'Carefully crafted for a perfect fit and maximum comfort throughout the day.',
];

const COLOR_SETS = [
    ['#3B82F6', '#D97706', '#10B981', '#1F2937'],
    ['#EF4444', '#3B82F6', '#6B7280'],
    ['#8B5CF6', '#10B981', '#1F2937'],
    ['#F59E0B', '#3B82F6', '#10B981', '#EF4444'],
    ['#1F2937', '#6B7280', '#D1D5DB'],
];

export function buildProduct(
    index: number,
    filename: string,
    category: string,
    garmentUrlPath: string,
    tryOnUrlPath: string | null,
): Product {
    const names = NAME_BANKS[category] ?? FALLBACK_NAMES;
    return {
        id: `${category.replace(/\s+/g, '-')}-${index}`,
        index,
        name: names[index % names.length],
        description: DESCRIPTIONS[index % DESCRIPTIONS.length],
        price: PRICES[index % PRICES.length],
        category,
        garmentUrl: `${API_BASE}${garmentUrlPath}`,
        tryOnUrl: tryOnUrlPath ? `${API_BASE}${tryOnUrlPath}` : null,
        sizes: ['XS', 'S', 'M', 'L', 'XL'],
        colors: COLOR_SETS[index % COLOR_SETS.length],
        matchScore: 90 + (index % 10),
        filename,
    };
}

export function buildProducts(
    garmentUrls: string[],
    garmentFilenames: string[],
    tryOnResults: (string | null)[],
    category: string,
): Product[] {
    return garmentUrls.map((url, i) => {
        // Extract path part (strip API_BASE if already prefixed)
        const urlPath = url.startsWith(API_BASE) ? url.slice(API_BASE.length) : url;
        const resultPath = tryOnResults[i];
        const resPath = resultPath && resultPath.startsWith(API_BASE) ? resultPath.slice(API_BASE.length) : resultPath || null;
        return buildProduct(i, garmentFilenames[i] ?? `${i + 1}.jpg`, category, urlPath, resPath);
    });
}
