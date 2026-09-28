import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { ShoppingCart, User, LogOut, Menu, X, Search, Zap } from 'lucide-react';
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { useTryOn } from '@/contexts/TryOnContext';
import { useCart } from '@/contexts/CartContext';

export function Header() {
  const { user, signOut, isAuthenticated } = useAuth();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { resetAll } = useTryOn();
  const { cartCount } = useCart();

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/products', label: 'Products' },
    { href: '/tryon', label: 'Try-On' },
    { href: '/about', label: 'About Us' },
  ];

  const isActive = (href: string) =>
    href === '/' ? location.pathname === '/' : location.pathname.startsWith(href);

  return (
    <header className="sticky top-0 z-50 border-b border-gray-200 bg-white shadow-sm">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between gap-4">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 flex-shrink-0">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-600">
              <Zap className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold tracking-tight text-gray-900">AuraFit</span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${isActive(link.href)
                  ? 'text-blue-600 bg-blue-50'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Search + Actions */}
          <div className="hidden md:flex items-center gap-3 flex-1 max-w-xs ml-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search products..."
                className="pl-9 h-9 text-sm bg-gray-50 border-gray-200 focus:bg-white"
              />
            </div>
          </div>

          <div className="hidden md:flex items-center gap-2">
            <Button variant="ghost" size="sm" asChild>
              <Link to="/cart" className="relative">
                <ShoppingCart className="h-5 w-5" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-blue-600 text-[10px] font-bold text-white">
                    {cartCount}
                  </span>
                )}
              </Link>
            </Button>

            {isAuthenticated ? (
              <>
                <Link to="/profile">
                  <div className="h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center hover:bg-blue-700 transition-colors shadow-sm cursor-pointer border border-blue-500">
                    <User className="h-4.5 w-4.5 text-white" />
                  </div>
                </Link>
                <Button variant="ghost" size="sm" onClick={() => { signOut(); resetAll(); }} className="text-gray-500 hover:text-red-600">
                  <LogOut className="h-4 w-4" />
                </Button>
              </>
            ) : (
              <>
                <Button variant="ghost" size="sm" asChild>
                  <Link to="/auth">Sign In</Link>
                </Button>
                <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white" asChild>
                  <Link to="/auth?mode=signup">Sign Up</Link>
                </Button>
              </>
            )}
          </div>

          {/* Mobile toggle */}
          <button
            className="md:hidden p-2 rounded-lg hover:bg-gray-100"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <nav className="md:hidden py-4 border-t border-gray-100">
            <div className="flex flex-col gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`px-4 py-2 rounded-md text-sm font-medium ${isActive(link.href) ? 'text-blue-600 bg-blue-50' : 'text-gray-600 hover:bg-gray-50'
                    }`}
                >
                  {link.label}
                </Link>
              ))}
              <div className="pt-3 border-t border-gray-100 mt-2 flex gap-2 px-2">
                {isAuthenticated ? (
                  <Button variant="outline" size="sm" className="w-full" onClick={() => signOut()}>
                    <LogOut className="h-4 w-4 mr-2" /> Sign Out
                  </Button>
                ) : (
                  <>
                    <Button variant="outline" size="sm" className="flex-1" asChild>
                      <Link to="/auth" onClick={() => setMobileMenuOpen(false)}>Sign In</Link>
                    </Button>
                    <Button size="sm" className="flex-1 bg-blue-600 hover:bg-blue-700 text-white" asChild>
                      <Link to="/auth?mode=signup" onClick={() => setMobileMenuOpen(false)}>Sign Up</Link>
                    </Button>
                  </>
                )}
              </div>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}
