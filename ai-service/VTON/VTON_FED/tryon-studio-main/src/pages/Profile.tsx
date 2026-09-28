import { Layout } from '@/components/layout/Layout';
import { useAuth } from '@/hooks/useAuth';
import { useOrders } from '@/hooks/useOrders';
import { Button } from '@/components/ui/button';
import { User, Package, Calendar, CheckCircle, Clock, ArrowRight, ShoppingBag } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Profile() {
    const { user, signOut } = useAuth();
    const { orders, loading } = useOrders();
    const navigate = useNavigate();

    if (!user) {
        return (
            <Layout>
                <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
                    <User className="h-16 w-16 text-gray-300 mb-4" />
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Please sign in</h2>
                    <p className="text-gray-500 mb-6 text-sm">You need to be signed in to view your profile and orders.</p>
                    <Button className="bg-blue-600 hover:bg-blue-700 text-white" onClick={() => navigate('/auth')}>
                        Sign In / Sign Up
                    </Button>
                </div>
            </Layout>
        );
    }

    const getStatusInfo = (status: string, createdAt: string) => {
        const orderDate = new Date(createdAt);
        const now = new Date();
        const diffDays = Math.floor((now.getTime() - orderDate.getTime()) / (1000 * 3600 * 24));

        // Simulating "Arrived" after 7 days
        if (diffDays >= 7) {
            return {
                label: 'Arrived',
                icon: CheckCircle,
                class: 'bg-green-100 text-green-700',
                details: 'Delivered successfully'
            };
        }
        return {
            label: 'On the way',
            icon: Clock,
            class: 'bg-blue-100 text-blue-700',
            details: `Arriving in ${7 - diffDays} days`
        };
    };

    return (
        <Layout>
            <div className="min-h-screen bg-gray-50 py-10 px-4 sm:px-6 lg:px-8">
                <div className="max-w-4xl mx-auto space-y-8">

                    {/* User Header */}
                    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8 flex flex-col md:flex-row items-center gap-6">
                        <div className="w-24 h-24 rounded-full bg-blue-600 flex items-center justify-center text-white text-3xl font-bold shadow-lg">
                            {user.full_name?.[0]?.toUpperCase() || user.email[0].toUpperCase()}
                        </div>
                        <div className="flex-1 text-center md:text-left">
                            <h1 className="text-2xl font-bold text-gray-900">{user.full_name || 'Valued Customer'}</h1>
                            <p className="text-gray-500 text-sm mt-1">{user.email}</p>
                            <div className="mt-4 flex flex-wrap justify-center md:justify-start gap-2">
                                <span className="bg-blue-50 text-blue-700 text-[10px] font-bold px-2 py-1 rounded-full uppercase border border-blue-100">Verified Member</span>
                                <span className="bg-blue-50 text-blue-700 text-[10px] font-bold px-2 py-1 rounded-full uppercase border border-blue-100 italic">AuraFit Enthusiast</span>
                            </div>
                        </div>
                        <Button variant="outline" className="border-red-200 text-red-600 hover:bg-red-50" onClick={signOut}>
                            Sign Out
                        </Button>
                    </div>

                    {/* Orders Section */}
                    <div>
                        <div className="flex items-center gap-2 mb-6 ml-2">
                            <Package className="h-5 w-5 text-gray-400" />
                            <h2 className="text-xl font-bold text-gray-900">Your Orders</h2>
                        </div>

                        {loading ? (
                            <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center">
                                <p className="text-gray-400">Loading orders...</p>
                            </div>
                        ) : orders.length === 0 ? (
                            <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center space-y-4">
                                <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto">
                                    <ShoppingBag className="h-8 w-8 text-gray-300" />
                                </div>
                                <h3 className="text-lg font-semibold text-gray-800">No orders yet</h3>
                                <p className="text-gray-500 text-sm">Experience fashion with AuraFit's AI try-on and place your first order!</p>
                                <Button className="bg-blue-600 hover:bg-blue-700 text-white" onClick={() => navigate('/products')}>
                                    Explore Products
                                </Button>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {orders.map((order) => {
                                    const status = getStatusInfo(order.status || 'placed', order.created_at);
                                    const StatusIcon = status.icon;

                                    return (
                                        <div key={order.id} className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                                            <div className="p-6">
                                                <div className="flex flex-col sm:flex-row justify-between gap-4 mb-6 pb-6 border-b border-gray-100">
                                                    <div>
                                                        <p className="text-xs text-gray-400 uppercase font-bold tracking-wider mb-1">Order Number</p>
                                                        <p className="text-sm font-bold text-gray-900">{order.order_number}</p>
                                                    </div>
                                                    <div className="flex items-center gap-8">
                                                        <div>
                                                            <p className="text-xs text-gray-400 uppercase font-bold tracking-wider mb-1">Date</p>
                                                            <p className="text-sm font-semibold text-gray-700 flex items-center gap-1.5">
                                                                <Calendar className="h-3.5 w-3.5" />
                                                                {new Date(order.created_at).toLocaleDateString()}
                                                            </p>
                                                        </div>
                                                        <div>
                                                            <p className="text-xs text-gray-400 uppercase font-bold tracking-wider mb-1">Status</p>
                                                            <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1 ${status.class}`}>
                                                                <StatusIcon className="h-3 w-3" />
                                                                {status.label}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Items */}
                                                <div className="space-y-4">
                                                    {order.items.map((item: any, idx: number) => (
                                                        <div key={idx} className="flex items-center gap-4">
                                                            <img
                                                                src={item.tryon_image_url || item.product_image_url}
                                                                alt={item.product_name}
                                                                className="w-16 h-16 rounded-lg object-cover bg-gray-50"
                                                            />
                                                            <div className="flex-1">
                                                                <p className="text-sm font-bold text-gray-900">{item.product_name}</p>
                                                                <p className="text-xs text-gray-500 mt-0.5">Size: {item.selected_size} · Qty: {item.quantity}</p>
                                                                <p className="text-sm font-bold text-blue-600 mt-1">₹{item.price.toFixed(2)}</p>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>

                                                <div className="mt-8 flex items-center justify-between pt-6 border-t border-gray-100">
                                                    <p className="text-sm text-gray-500">
                                                        <span className="font-bold text-gray-900">Total: ₹{order.total_amount?.toFixed(2)}</span>
                                                        <span className="mx-2">·</span>
                                                        {status.details}
                                                    </p>
                                                    <Button variant="ghost" size="sm" className="text-blue-600 hover:bg-blue-50 gap-2 h-8">
                                                        Track Order <ArrowRight className="h-3.5 w-3.5" />
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </Layout>
    );
}
