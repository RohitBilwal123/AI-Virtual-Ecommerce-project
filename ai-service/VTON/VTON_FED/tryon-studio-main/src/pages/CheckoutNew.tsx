import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Check, ShoppingBag, Truck, CreditCard } from 'lucide-react';
import { useTryOn } from '@/contexts/TryOnContext';
import { useCart } from '@/contexts/CartContext';
import { useOrders } from '@/hooks/useOrders';
import { useAuth } from '@/hooks/useAuth';
import { buildProducts } from '@/lib/products';
import { Trash2 } from 'lucide-react';

// ─── Checkout Page ────────────────────────────────────────────────

type Step = 'cart' | 'shipping' | 'payment' | 'confirm';

export default function CheckoutPage() {
    const navigate = useNavigate();
    const { cartItems, getCartTotal, updateQuantity, removeFromCart, clearCart } = useCart();
    const { createOrder } = useOrders();
    const { user } = useAuth();
    const [step, setStep] = useState<Step>('cart');
    const [orderNum, setOrderNum] = useState('');

    const [form, setForm] = useState({
        name: '', email: '', address: '', city: '', state: '', zip: '', country: 'India',
        card: '', expiry: '', cvv: '',
    });

    const subtotal = getCartTotal();
    const shipping = subtotal > 500 ? 0 : 50;
    const total = subtotal + shipping;

    const onChange = (k: string) => (e: React.ChangeEvent<HTMLInputElement>) =>
        setForm(f => ({ ...f, [k]: e.target.value }));

    const StepBar = () => (
        <div className="flex items-center gap-0 mb-8">
            {(['cart', 'shipping', 'payment', 'confirm'] as Step[]).map((s, i) => {
                const labels = ['Cart', 'Shipping', 'Payment', 'Confirm'];
                const icons = [ShoppingBag, Truck, CreditCard, Check];
                const Icon = icons[i];
                const done = ['cart', 'shipping', 'payment', 'confirm'].indexOf(step) > i;
                const active = step === s;
                return (
                    <div key={s} className="flex items-center flex-1">
                        <div className={`flex flex-col items-center gap-1 min-w-[60px] ${i > 0 ? 'flex-1' : ''}`}>
                            <div className={`w-9 h-9 rounded-full flex items-center justify-center border-2 transition-colors ${done ? 'bg-blue-600 border-blue-600 text-white'
                                : active ? 'border-blue-600 text-blue-600'
                                    : 'border-gray-300 text-gray-400'
                                }`}>
                                {done ? <Check className="h-4 w-4" /> : <Icon className="h-4 w-4" />}
                            </div>
                            <span className={`text-xs font-medium ${active ? 'text-blue-600' : done ? 'text-gray-700' : 'text-gray-400'}`}>
                                {labels[i]}
                            </span>
                        </div>
                        {i < 3 && <div className={`h-0.5 flex-1 mb-5 transition-colors ${done ? 'bg-blue-600' : 'bg-gray-200'}`} />}
                    </div>
                );
            })}
        </div>
    );

    return (
        <Layout>
            <div className="min-h-screen bg-gray-50 py-10 px-4">
                <div className="mx-auto max-w-5xl">
                    <h1 className="text-2xl font-bold text-gray-900 mb-6">Checkout</h1>
                    <StepBar />

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* ── Left: Step content ─── */}
                        <div className="lg:col-span-2">
                            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">

                                {/* CART */}
                                {step === 'cart' && (
                                    <div>
                                        <h2 className="text-lg font-semibold text-gray-900 mb-4">Your Cart</h2>
                                        {cartItems.length === 0 ? (
                                            <div className="text-center py-12 text-gray-500">
                                                <ShoppingBag className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                                                <p>Your cart is empty.</p>
                                                <Button className="mt-4 bg-blue-600 hover:bg-blue-700 text-white" onClick={() => navigate('/products')}>
                                                    Browse Products
                                                </Button>
                                            </div>
                                        ) : (
                                            <div className="space-y-4">
                                                {cartItems.map(p => (
                                                    <div key={p.id} className="flex gap-4 p-3 border border-gray-100 rounded-xl">
                                                        <img
                                                            src={p.tryon_image_url ?? p.product_image_url}
                                                            alt={p.product_name}
                                                            className="w-20 h-20 object-cover rounded-lg bg-gray-100 flex-shrink-0"
                                                        />
                                                        <div className="flex-1 min-w-0">
                                                            <p className="font-semibold text-gray-900 truncate">{p.product_name}</p>
                                                            <div className="flex items-center gap-2 mt-1 text-xs text-gray-500">
                                                                Size: {p.selected_size} · Qty: {p.quantity}
                                                                <button onClick={() => updateQuantity(p.id, p.quantity + 1)} className="p-1 hover:bg-gray-100 rounded">+</button>
                                                                <button onClick={() => updateQuantity(p.id, p.quantity - 1)} className="p-1 hover:bg-gray-100 rounded">-</button>
                                                            </div>
                                                            <div className="flex gap-1 mt-2">
                                                                {p.selected_color && (
                                                                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: p.selected_color }} />
                                                                )}
                                                            </div>
                                                        </div>
                                                        <div className="flex flex-col items-end justify-between">
                                                            <span className="font-bold text-gray-900 text-sm flex-shrink-0">₹{p.price.toFixed(2)}</span>
                                                            <button
                                                                onClick={() => removeFromCart(p.id)}
                                                                className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors mt-2"
                                                                title="Remove item"
                                                            >
                                                                <Trash2 className="h-4 w-4" />
                                                            </button>
                                                        </div>
                                                    </div>
                                                ))}
                                                <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white mt-2" onClick={() => setStep('shipping')}>
                                                    Continue to Shipping →
                                                </Button>
                                            </div>
                                        )}
                                    </div>
                                )}

                                {/* SHIPPING */}
                                {step === 'shipping' && (
                                    <div>
                                        <h2 className="text-lg font-semibold text-gray-900 mb-4">Shipping Address</h2>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            <div className="sm:col-span-2">
                                                <Label className="text-sm text-gray-600">Full Name</Label>
                                                <Input className="mt-1" placeholder="John Doe" value={form.name} onChange={onChange('name')} />
                                            </div>
                                            <div className="sm:col-span-2">
                                                <Label className="text-sm text-gray-600">Email</Label>
                                                <Input className="mt-1" type="email" placeholder="you@example.com" value={form.email} onChange={onChange('email')} />
                                            </div>
                                            <div className="sm:col-span-2">
                                                <Label className="text-sm text-gray-600">Address</Label>
                                                <Input className="mt-1" placeholder="123 Main Street" value={form.address} onChange={onChange('address')} />
                                            </div>
                                            <div>
                                                <Label className="text-sm text-gray-600">City</Label>
                                                <Input className="mt-1" placeholder="Chennai" value={form.city} onChange={onChange('city')} />
                                            </div>
                                            <div>
                                                <Label className="text-sm text-gray-600">State</Label>
                                                <Input className="mt-1" placeholder="Tamil Nadu" value={form.state} onChange={onChange('state')} />
                                            </div>
                                            <div>
                                                <Label className="text-sm text-gray-600">Postal Code</Label>
                                                <Input className="mt-1" placeholder="600001" value={form.zip} onChange={onChange('zip')} />
                                            </div>
                                            <div>
                                                <Label className="text-sm text-gray-600">Country</Label>
                                                <Input className="mt-1" value={form.country} onChange={onChange('country')} />
                                            </div>
                                        </div>
                                        <div className="flex gap-3 mt-6">
                                            <Button variant="outline" className="flex-1" onClick={() => setStep('cart')}>← Back</Button>
                                            <Button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white" onClick={() => setStep('payment')}>
                                                Continue to Payment →
                                            </Button>
                                        </div>
                                    </div>
                                )}

                                {/* PAYMENT */}
                                {step === 'payment' && (
                                    <div>
                                        <h2 className="text-lg font-semibold text-gray-900 mb-4">Payment Details</h2>
                                        <div className="space-y-4">
                                            <div>
                                                <Label className="text-sm text-gray-600">Card Number</Label>
                                                <Input className="mt-1" placeholder="4242 4242 4242 4242" maxLength={19} value={form.card} onChange={onChange('card')} />
                                            </div>
                                            <div className="grid grid-cols-2 gap-4">
                                                <div>
                                                    <Label className="text-sm text-gray-600">Expiry</Label>
                                                    <Input className="mt-1" placeholder="MM / YY" maxLength={7} value={form.expiry} onChange={onChange('expiry')} />
                                                </div>
                                                <div>
                                                    <Label className="text-sm text-gray-600">CVV</Label>
                                                    <Input className="mt-1" placeholder="•••" maxLength={3} type="password" value={form.cvv} onChange={onChange('cvv')} />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex gap-3 mt-6">
                                            <Button variant="outline" className="flex-1" onClick={() => setStep('shipping')}>← Back</Button>
                                            <Button
                                                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
                                                onClick={async () => {
                                                    const newOrder = await createOrder({
                                                        total_amount: total,
                                                        shipping_address: `${form.address}, ${form.city}, ${form.state} - ${form.zip}`,
                                                        payment_method: 'card',
                                                    }, cartItems);

                                                    if (newOrder) {
                                                        setOrderNum(newOrder.order_number);
                                                        await clearCart();
                                                        setStep('confirm');
                                                    }
                                                }}
                                            >
                                                Place Order →
                                            </Button>
                                        </div>
                                    </div>
                                )}

                                {/* CONFIRM */}
                                {step === 'confirm' && (
                                    <div className="text-center py-10">
                                        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-5">
                                            <Check className="h-10 w-10 text-green-600" />
                                        </div>
                                        <h2 className="text-2xl font-bold text-gray-900 mb-2">Order Placed!</h2>
                                        <p className="text-gray-500 text-sm mb-2">
                                            Thank you for your order. Your items will ship within 2–3 business days.
                                        </p>
                                        <p className="text-gray-400 text-xs mb-6 font-mono">
                                            Order #{orderNum}
                                        </p>
                                        <div className="flex gap-3 justify-center">
                                            <Button variant="outline" onClick={() => navigate('/')}>Go Home</Button>
                                            <Button className="bg-blue-600 hover:bg-blue-700 text-white" onClick={() => navigate('/products')}>
                                                Continue Shopping
                                            </Button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* ── Right: Order Summary ─── */}
                        {step !== 'confirm' && (
                            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5 h-fit">
                                <h3 className="text-base font-semibold text-gray-900 mb-4">Order Summary</h3>
                                <div className="space-y-2 text-sm mb-4">
                                    {cartItems.map(p => (
                                        <div key={p.id} className="flex justify-between text-gray-700">
                                            <span className="truncate mr-2">{p.product_name} x {p.quantity}</span>
                                            <span className="flex-shrink-0 font-medium">₹{(p.price * p.quantity).toFixed(2)}</span>
                                        </div>
                                    ))}
                                </div>
                                <div className="border-t border-gray-100 pt-3 space-y-2 text-sm">
                                    <div className="flex justify-between text-gray-600">
                                        <span>Subtotal</span>
                                        <span>₹{subtotal.toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between text-gray-600">
                                        <span>Shipping</span>
                                        <span>{shipping === 0 ? 'Free' : `₹${shipping.toFixed(2)}`}</span>
                                    </div>
                                    <div className="flex justify-between font-bold text-gray-900 text-base border-t border-gray-100 pt-2">
                                        <span>Total</span>
                                        <span>₹{total.toFixed(2)}</span>
                                    </div>
                                </div>
                                {subtotal < 500 && (
                                    <p className="text-xs text-blue-600 mt-2 bg-blue-50 rounded-lg p-2">
                                        Add ₹{(500 - subtotal).toFixed(2)} more for free shipping!
                                    </p>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </Layout>
    );
}
