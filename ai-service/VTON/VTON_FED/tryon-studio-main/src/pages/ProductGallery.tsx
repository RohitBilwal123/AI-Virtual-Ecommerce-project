import { useState, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Heart, ShoppingCart, SlidersHorizontal, X, RefreshCw, ChevronLeft, ChevronRight } from 'lucide-react';
import { toast } from 'sonner';
import { useTryOn } from '@/contexts/TryOnContext';
import { buildProducts, Product } from '@/lib/products';
import { useCart } from '@/contexts/CartContext';

const SIZES = ['XS', 'S', 'M', 'L', 'XL'];
const COLORS_LABEL = ['All Colors', 'Blue', 'Green', 'Black', 'White', 'Red'];
const STYLES_LABEL = ['All Styles', 'Casual', 'Formal', 'Sport', 'Classic'];
const PRICES_LABEL = ['All Prices', 'Under ₹500', '₹500–₹1000', '₹1000–₹2000', 'Over ₹2000'];

export default function ProductGallery() {
    const navigate = useNavigate();
    const { userPreview, garmentUrls, garmentFilenames, tryOnResults, selectedCategory } = useTryOn();

    // filters
    const [filterSize, setFilterSize] = useState('');
    const [filterColor, setFilterColor] = useState('All Colors');
    const [filterStyle, setFilterStyle] = useState('All Styles');
    const [filterPrice, setFilterPrice] = useState('All Prices');
    const [favorites, setFavorites] = useState<Set<string>>(new Set());
    const [page, setPage] = useState(1);

    const categoryName = selectedCategory?.name ?? 'Products';
    const { addToCart } = useCart();

    const products = useMemo(
        () => buildProducts(garmentUrls, garmentFilenames, tryOnResults, categoryName)
            .filter(p => !!p.tryOnUrl),
        [garmentUrls, garmentFilenames, tryOnResults, categoryName]
    );

    const hasResults = products.length > 0;

    const toggleFav = (id: string) =>
        setFavorites(prev => {
            const n = new Set(prev);
            n.has(id) ? n.delete(id) : n.add(id);
            return n;
        });

    const clearFilters = () => {
        setFilterSize('');
        setFilterColor('All Colors');
        setFilterStyle('All Styles');
        setFilterPrice('All Prices');
    };

    return (
        <Layout>
            <div className="min-h-screen bg-gray-50">
                <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
                    <div className="flex gap-6">

                        {/* ── LEFT SIDEBAR ────────────────────────────── */}
                        <aside className="w-52 flex-shrink-0 hidden lg:block">
                            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5 sticky top-24">
                                <p className="text-sm font-semibold text-gray-700 mb-3">Your Image</p>

                                {userPreview ? (
                                    <div className="flex flex-col items-center gap-3">
                                        <div className="w-28 h-28 rounded-full overflow-hidden border-2 border-blue-200 shadow-sm">
                                            <img src={userPreview} alt="You" className="w-full h-full object-cover" />
                                        </div>
                                        <p className="text-xs text-blue-600 font-medium text-center">Preview</p>
                                    </div>
                                ) : (
                                    <div className="w-28 h-28 rounded-full bg-gray-100 flex items-center justify-center mx-auto">
                                        <span className="text-gray-400 text-xs">No photo</span>
                                    </div>
                                )}

                                <div className="mt-4 space-y-2 text-xs">
                                    <div className="flex justify-between">
                                        <span className="text-gray-500">Current Item:</span>
                                        <span className="text-blue-600 font-medium truncate ml-2">{categoryName}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-500">Category:</span>
                                        <span className="text-gray-800 font-medium">{selectedCategory?.section ?? '—'}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-500">Fit:</span>
                                        <span className="text-green-600 font-medium">Good Match</span>
                                    </div>
                                </div>

                                <Button
                                    size="sm"
                                    variant="outline"
                                    className="w-full mt-4 text-xs"
                                    onClick={() => navigate('/tryon')}
                                >
                                    <RefreshCw className="h-3 w-3 mr-1" /> Change Photo
                                </Button>
                            </div>
                        </aside>

                        {/* ── MAIN CONTENT ────────────────────────────── */}
                        <div className="flex-1 min-w-0">
                            {/* Header row */}
                            <div className="flex items-center justify-between mb-5">
                                <div>
                                    <h1 className="text-2xl font-bold text-gray-900">Virtual Try-On Gallery</h1>
                                    <p className="text-sm text-gray-500 mt-0.5">
                                        See how different {categoryName.toLowerCase()} look on you with our virtual try-on technology
                                    </p>
                                </div>
                                <Button
                                    className="bg-blue-600 hover:bg-blue-700 text-white text-sm"
                                    onClick={() => navigate('/tryon')}
                                >
                                    Try Your Own Outfit
                                </Button>
                            </div>

                            {/* Filters */}
                            <div className="bg-white rounded-xl border border-gray-200 p-4 mb-5">
                                <div className="flex items-center gap-2 mb-3">
                                    <SlidersHorizontal className="h-4 w-4 text-gray-500" />
                                    <span className="text-sm font-medium text-gray-700">Filter Options</span>
                                </div>
                                <div className="flex flex-wrap gap-3">
                                    {/* Size */}
                                    <div className="flex flex-col gap-1">
                                        <label className="text-xs text-gray-500">Size</label>
                                        <select
                                            value={filterSize}
                                            onChange={e => setFilterSize(e.target.value)}
                                            className="text-sm border border-gray-200 rounded-lg px-3 py-1.5 bg-white focus:outline-none focus:border-blue-400"
                                        >
                                            <option value="">All Sizes</option>
                                            {SIZES.map(s => <option key={s}>{s}</option>)}
                                        </select>
                                    </div>

                                    <div className="flex flex-col gap-1">
                                        <label className="text-xs text-gray-500">Color</label>
                                        <select value={filterColor} onChange={e => setFilterColor(e.target.value)} className="text-sm border border-gray-200 rounded-lg px-3 py-1.5 bg-white focus:outline-none focus:border-blue-400">
                                            {COLORS_LABEL.map(c => <option key={c}>{c}</option>)}
                                        </select>
                                    </div>

                                    <div className="flex flex-col gap-1">
                                        <label className="text-xs text-gray-500">Style</label>
                                        <select value={filterStyle} onChange={e => setFilterStyle(e.target.value)} className="text-sm border border-gray-200 rounded-lg px-3 py-1.5 bg-white focus:outline-none focus:border-blue-400">
                                            {STYLES_LABEL.map(s => <option key={s}>{s}</option>)}
                                        </select>
                                    </div>

                                    <div className="flex flex-col gap-1">
                                        <label className="text-xs text-gray-500">Price Range</label>
                                        <select value={filterPrice} onChange={e => setFilterPrice(e.target.value)} className="text-sm border border-gray-200 rounded-lg px-3 py-1.5 bg-white focus:outline-none focus:border-blue-400">
                                            {PRICES_LABEL.map(p => <option key={p}>{p}</option>)}
                                        </select>
                                    </div>
                                </div>

                                <div className="flex justify-between items-center mt-3 pt-3 border-t border-gray-100">
                                    <span className="text-xs text-gray-500">{products.length} products found</span>
                                    <button onClick={clearFilters} className="text-xs text-blue-600 hover:underline flex items-center gap-1">
                                        <X className="h-3 w-3" /> Clear Filters
                                    </button>
                                </div>
                            </div>

                            {/* Grid */}
                            {!hasResults ? (
                                <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-16 text-center">
                                    <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <ShoppingCart className="h-8 w-8 text-blue-400" />
                                    </div>
                                    <h3 className="text-lg font-semibold text-gray-800 mb-2">No try-ons yet</h3>
                                    <p className="text-gray-500 text-sm mb-5">
                                        Upload your photo and generate try-ons to see products here
                                    </p>
                                    <Button className="bg-blue-600 hover:bg-blue-700 text-white" onClick={() => navigate('/tryon')}>
                                        Start Try-On Wizard
                                    </Button>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                                    {products.map((product) => (
                                        <ProductCard
                                            key={product.id}
                                            product={product}
                                            isFav={favorites.has(product.id)}
                                            onToggleFav={() => toggleFav(product.id)}
                                            onAddToCart={() => addToCart({
                                                product_id: null,
                                                product_name: product.name,
                                                product_image_url: product.garmentUrl,
                                                tryon_image_url: product.tryOnUrl,
                                                price: product.price,
                                                quantity: 1,
                                                selected_size: 'M'
                                            })}
                                        />
                                    ))}
                                </div>
                            )}

                            {/* Pagination */}
                            {hasResults && (
                                <div className="flex items-center justify-center gap-2 mt-8">
                                    <button
                                        className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-40"
                                        onClick={() => setPage(p => Math.max(1, p - 1))}
                                        disabled={page === 1}
                                    >
                                        <ChevronLeft className="h-4 w-4" />
                                    </button>
                                    {[1, 2, 3].map(p => (
                                        <button
                                            key={p}
                                            onClick={() => setPage(p)}
                                            className={`w-9 h-9 rounded-lg text-sm font-medium border transition-colors ${page === p ? 'bg-blue-600 border-blue-600 text-white' : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                                                }`}
                                        >
                                            {p}
                                        </button>
                                    ))}
                                    <span className="text-gray-400 text-sm">…</span>
                                    <button
                                        className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50"
                                        onClick={() => setPage(p => p + 1)}
                                    >
                                        <ChevronRight className="h-4 w-4" />
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
}

// ── Product Card ───────────────────────────────────────────────

interface ProductCardProps {
    product: Product;
    isFav: boolean;
    onToggleFav: () => void;
    onAddToCart: () => void;
}

function ProductCard({ product, isFav, onToggleFav, onAddToCart }: ProductCardProps) {
    const { userPreview } = useTryOn();
    const isTryOn = !!product.tryOnUrl;
    const displayImage = product.tryOnUrl ?? product.garmentUrl;

    return (
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden group flex flex-col h-full">
            {/* Image Container */}
            <div className="relative overflow-hidden bg-gray-100 aspect-[3/4] w-full">
                {!isTryOn && userPreview ? (
                    // Fallback visual: Garment overlaid on blurred user photo for consistency
                    <div className="w-full h-full relative">
                        <img
                            src={userPreview}
                            alt="Background"
                            className="w-full h-full object-cover blur-[4px] opacity-40 scale-110"
                        />
                        <div className="absolute inset-0 flex items-center justify-center p-6">
                            <img
                                src={product.garmentUrl}
                                alt={product.name}
                                className="max-w-full max-h-full object-contain drop-shadow-xl"
                            />
                        </div>
                        <div className="absolute top-3 left-3 bg-gray-600/80 backdrop-blur-sm text-white text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider">
                            Original Item
                        </div>
                    </div>
                ) : (
                    // Regular Try-On Result
                    <>
                        <img
                            src={displayImage}
                            alt={product.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            loading="lazy"
                        />
                        <div className="absolute top-3 left-3 bg-blue-600/90 backdrop-blur-sm text-white text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider">
                            Try-On Ready
                        </div>
                    </>
                )}

                {/* Heart Button */}
                <button
                    onClick={(e) => {
                        e.preventDefault();
                        onToggleFav();
                    }}
                    className="absolute top-3 right-3 p-1.5 rounded-full bg-white/90 shadow hover:bg-white transition-colors z-10"
                >
                    <Heart className={`h-4 w-4 ${isFav ? 'fill-red-500 text-red-500' : 'text-gray-400'}`} />
                </button>

                {/* Match badge */}
                <div className="absolute bottom-3 right-3 bg-green-500/90 backdrop-blur-sm text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm">
                    {product.matchScore}% Match
                </div>
            </div>

            {/* Info */}
            <div className="p-4 flex flex-col flex-1">
                <h3 className="font-semibold text-gray-900 text-sm mb-1 truncate">{product.name}</h3>
                <p className="text-[11px] text-gray-500 mb-3 line-clamp-2 min-h-[32px]">{product.description}</p>

                <div className="mt-auto">
                    <div className="flex items-center justify-between mb-3">
                        <span className="text-base font-bold text-gray-900">₹{product.price.toFixed(2)}</span>
                        <div className="flex -space-x-1">
                            {product.colors.map((c, i) => (
                                <div key={i} className="w-3.5 h-3.5 rounded-full border border-white shadow-sm" style={{ backgroundColor: c }} />
                            ))}
                        </div>
                    </div>

                    <div className="flex gap-2">
                        <Link to={`/product/${product.index}`} className="flex-1">
                            <Button size="sm" className="w-full bg-blue-600 hover:bg-blue-700 text-white text-[11px] h-8">
                                View Details
                            </Button>
                        </Link>
                        <Button
                            size="sm"
                            variant="outline"
                            className="border-gray-200 h-8 w-8 p-0 shrink-0"
                            onClick={(e) => {
                                e.preventDefault();
                                onAddToCart();
                            }}
                        >
                            <ShoppingCart className="h-3.5 w-3.5" />
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
