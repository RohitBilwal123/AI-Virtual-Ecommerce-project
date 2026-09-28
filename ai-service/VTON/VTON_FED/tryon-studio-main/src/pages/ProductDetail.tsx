import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { ShoppingCart, Minus, Plus, ChevronRight, RefreshCw, Info, Truck, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';
import { useTryOn } from '@/contexts/TryOnContext';
import { useCart } from '@/contexts/CartContext';
import { buildProducts, buildProduct, Product } from '@/lib/products';
import { API_BASE } from '@/lib/api';

export default function ProductDetail() {
    const { index } = useParams<{ index: string }>();
    const navigate = useNavigate();
    const { userPreview, garmentUrls, garmentFilenames, tryOnResults, selectedCategory } = useTryOn();

    const idx = parseInt(index ?? '0', 10);
    const categoryName = selectedCategory?.name ?? 'Item';

    // Build product list
    const products: Product[] = buildProducts(
        garmentUrls, garmentFilenames, tryOnResults, categoryName
    );

    const product = products[idx];

    const [selectedSize, setSelectedSize] = useState('M');
    const [selectedColor, setSelectedColor] = useState(0);
    const [quantity, setQuantity] = useState(1);
    const [hover, setHover] = useState(false);
    const { addToCart } = useCart();

    if (!product) {
        return (
            <Layout>
                <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
                    <p className="text-gray-500 mb-4">Product not found. Please generate try-ons first.</p>
                    <Button className="bg-blue-600 hover:bg-blue-700 text-white" onClick={() => navigate('/tryon')}>
                        Go to Try-On Wizard
                    </Button>
                </div>
            </Layout>
        );
    }

    const isTryOn = !!product.tryOnUrl;
    const displayImage = product.tryOnUrl ?? product.garmentUrl;
    const relatedProducts = products.filter((_, i) => i !== idx).slice(0, 4);

    const handleAddToCart = async () => {
        const success = await addToCart({
            product_id: null,
            product_name: product.name,
            product_image_url: product.garmentUrl,
            tryon_image_url: product.tryOnUrl,
            price: product.price,
            quantity: quantity,
            selected_size: selectedSize,
            selected_color: product.colors[selectedColor]
        });
        if (success) {
            toast.success(`${product.name} (${selectedSize}) added to cart!`);
        }
    };

    return (
        <Layout>
            <div className="bg-gray-50 min-h-screen">
                <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">

                    {/* Breadcrumb */}
                    <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6">
                        <Link to="/products" className="hover:text-blue-600 flex items-center gap-1">
                            <ArrowLeft className="h-3.5 w-3.5" /> Gallery
                        </Link>
                        <ChevronRight className="h-3.5 w-3.5" />
                        <span className="text-gray-900 font-medium">{product.name}</span>
                    </nav>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

                        {/* ── LEFT: Try-On Preview ──────────────────────── */}
                        <div>
                            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                                <div className="bg-gray-50 px-4 py-3 border-b border-gray-100">
                                    <span className="text-sm font-medium text-gray-700">Virtual Try-On Preview</span>
                                </div>

                                <div
                                    className="relative overflow-hidden bg-gray-100 aspect-[3/4]"
                                    onMouseEnter={() => setHover(true)}
                                    onMouseLeave={() => setHover(false)}
                                >
                                    {!isTryOn && userPreview ? (
                                        <div className="w-full h-full relative">
                                            <img
                                                src={userPreview}
                                                alt="Background"
                                                className="w-full h-full object-cover blur-[8px] opacity-40 scale-110"
                                            />
                                            <div className="absolute inset-0 flex items-center justify-center p-8">
                                                <img
                                                    src={product.garmentUrl}
                                                    alt={product.name}
                                                    className="max-w-full max-h-full object-contain drop-shadow-2xl"
                                                />
                                            </div>
                                            <div className="absolute top-4 left-4 bg-gray-600/80 backdrop-blur-sm text-white text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider">
                                                Original Item
                                            </div>
                                        </div>
                                    ) : (
                                        <>
                                            <img
                                                src={hover && product.garmentUrl ? product.garmentUrl : displayImage}
                                                alt={product.name}
                                                className="w-full h-full object-cover transition-all duration-500"
                                            />
                                            {isTryOn && (
                                                <div className="absolute top-4 left-4 bg-blue-600/90 backdrop-blur-sm text-white text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider">
                                                    Try-On Ready
                                                </div>
                                            )}
                                            <div className={`absolute inset-0 flex items-end justify-end p-3 transition-opacity duration-200 ${hover ? 'opacity-100' : 'opacity-0'}`}>
                                                <span className="bg-black/50 text-white text-[10px] px-3 py-1.5 rounded-full backdrop-blur-sm">
                                                    {hover ? 'Showing Original' : 'Showing Try-On'}
                                                </span>
                                            </div>
                                        </>
                                    )}
                                </div>

                                {/* Current item info */}
                                <div className="p-4 text-sm space-y-2">
                                    <div className="flex justify-between items-center">
                                        <span className="text-gray-500">Current Item:</span>
                                        <Link to="/products" className="text-blue-600 font-medium hover:underline">{product.name}</Link>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-gray-500">Match Score:</span>
                                        <span className="bg-green-100 text-green-700 text-xs font-semibold px-2 py-0.5 rounded-full">
                                            {product.matchScore}% Match
                                        </span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-gray-500">Size:</span>
                                        <span className="text-gray-800 font-medium">{selectedSize}</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-gray-500">Fit:</span>
                                        <span className="text-green-600 font-medium">Good Match</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* ── RIGHT: Product Info ───────────────────────── */}
                        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 space-y-5">

                            {/* Name + Price */}
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900">{product.name}</h1>
                                <p className="text-sm text-gray-500 mt-1 leading-relaxed">{product.description}</p>
                                <div className="text-3xl font-bold text-gray-900 mt-3">₹{product.price.toFixed(2)}</div>
                            </div>

                            {/* Size */}
                            <div>
                                <div className="flex justify-between items-center mb-2">
                                    <span className="text-sm font-medium text-gray-700">Size</span>
                                    <button className="text-xs text-blue-600 hover:underline">Size Guide</button>
                                </div>
                                <div className="flex gap-2">
                                    {product.sizes.map(s => (
                                        <button
                                            key={s}
                                            onClick={() => setSelectedSize(s)}
                                            className={`w-10 h-10 rounded-lg border-2 text-sm font-medium transition-colors ${selectedSize === s
                                                ? 'border-blue-600 bg-blue-600 text-white'
                                                : 'border-gray-200 text-gray-700 hover:border-blue-400'
                                                }`}
                                        >
                                            {s}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Color */}
                            <div>
                                <span className="text-sm font-medium text-gray-700 block mb-2">Color</span>
                                <div className="flex gap-2">
                                    {product.colors.map((c, i) => (
                                        <button
                                            key={i}
                                            onClick={() => setSelectedColor(i)}
                                            className={`w-8 h-8 rounded-full border-2 transition-transform ${selectedColor === i ? 'border-gray-800 scale-110' : 'border-gray-200 hover:scale-105'
                                                }`}
                                            style={{ backgroundColor: c }}
                                        />
                                    ))}
                                </div>
                            </div>

                            {/* Quantity */}
                            <div>
                                <span className="text-sm font-medium text-gray-700 block mb-2">Quantity</span>
                                <div className="flex items-center gap-3">
                                    <button
                                        onClick={() => setQuantity(q => Math.max(1, q - 1))}
                                        className="w-9 h-9 rounded-lg border border-gray-200 flex items-center justify-center hover:bg-gray-50"
                                    >
                                        <Minus className="h-4 w-4" />
                                    </button>
                                    <span className="w-8 text-center font-semibold text-gray-900">{quantity}</span>
                                    <button
                                        onClick={() => setQuantity(q => q + 1)}
                                        className="w-9 h-9 rounded-lg border border-gray-200 flex items-center justify-center hover:bg-gray-50"
                                    >
                                        <Plus className="h-4 w-4" />
                                    </button>
                                </div>
                            </div>

                            {/* CTA */}
                            <div className="space-y-3 pt-2">
                                <Button
                                    className="w-full bg-blue-600 hover:bg-blue-700 text-white h-11"
                                    onClick={handleAddToCart}
                                >
                                    <ShoppingCart className="h-4 w-4 mr-2" /> Add to Cart
                                </Button>
                                <Link to="/products">
                                    <Button variant="outline" className="w-full h-11 border-gray-200">
                                        <RefreshCw className="h-4 w-4 mr-2" /> Try Another {categoryName.replace(/s$/, '')}
                                    </Button>
                                </Link>
                            </div>

                            {/* Product Details */}
                            <div className="border-t border-gray-100 pt-4">
                                <div className="flex items-center gap-2 mb-2">
                                    <Info className="h-4 w-4 text-gray-400" />
                                    <span className="text-sm font-medium text-gray-700">Product Details</span>
                                </div>
                                <ul className="text-sm text-gray-600 space-y-1 ml-6">
                                    <li>• 100% Premium Cotton</li>
                                    <li>• Machine Washable</li>
                                    <li>• Modern Fit</li>
                                    <li>• Imported</li>
                                </ul>
                            </div>

                            {/* Shipping */}
                            <div className="border-t border-gray-100 pt-4">
                                <div className="flex items-center gap-2 mb-2">
                                    <Truck className="h-4 w-4 text-gray-400" />
                                    <span className="text-sm font-medium text-gray-700">Shipping & Returns</span>
                                </div>
                                <ul className="text-sm text-gray-600 space-y-1 ml-6">
                                    <li>Free shipping on orders over ₹500</li>
                                    <li>30-day return policy</li>
                                    <li>Ships within 2–3 business days</li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    {/* ── You Might Also Like ───────────────────────── */}
                    {relatedProducts.length > 0 && (
                        <section className="mt-12">
                            <h2 className="text-xl font-bold text-gray-900 mb-5">You Might Also Like</h2>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                {relatedProducts.map((p) => (
                                    <Link
                                        key={p.id}
                                        to={`/product/${p.index}`}
                                        className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow overflow-hidden group"
                                    >
                                        <div className="aspect-square overflow-hidden bg-gray-100">
                                            <img
                                                src={p.tryOnUrl ?? p.garmentUrl}
                                                alt={p.name}
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                                loading="lazy"
                                            />
                                        </div>
                                        <div className="p-3">
                                            <p className="text-sm font-semibold text-gray-900 truncate">{p.name}</p>
                                            <p className="text-sm text-gray-700 font-bold mt-1">₹{p.price.toFixed(2)}</p>
                                            <div className="flex gap-1 mt-2">
                                                {p.colors.slice(0, 3).map((c, i) => (
                                                    <div key={i} className="w-3 h-3 rounded-full" style={{ backgroundColor: c }} />
                                                ))}
                                            </div>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </section>
                    )}
                </div>
            </div>
        </Layout>
    );
}
