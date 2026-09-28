import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/hooks/useAuth';
import { 
  Search, 
  ShoppingCart, 
  User, 
  Sparkles,
  Menu,
  X 
} from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';

interface GalleryHeaderProps {
  onSearch?: (query: string) => void;
}

export function GalleryHeader({ onSearch }: GalleryHeaderProps) {
  const { isAuthenticated } = useAuth();
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/products', label: 'Products' },
    { href: '/gallery', label: 'Try-On', active: true },
    { href: '/about', label: 'About' },
  ];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch?.(searchQuery);
  };

  return (
    <header className="sticky top-0 z-50 bg-background border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 shrink-0">
            <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center border border-border">
              <Sparkles className="h-5 w-5 text-muted-foreground" />
            </div>
            <span className="font-bold text-lg hidden sm:inline">LOGO</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className={cn(
                  'px-4 py-2 text-sm font-medium rounded-lg transition-colors',
                  link.active || location.pathname === link.href
                    ? 'text-primary'
                    : 'text-muted-foreground hover:text-foreground'
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="hidden md:flex items-center flex-1 max-w-xs mx-6">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 pr-4 h-9 bg-muted/50 border-border"
              />
            </div>
          </form>

          {/* Right Side Actions */}
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="hidden md:flex">
              <ShoppingCart className="h-5 w-5" />
            </Button>
            
            {isAuthenticated ? (
              <Button variant="ghost" size="icon" asChild>
                <Link to="/auth">
                  <User className="h-5 w-5" />
                </Link>
              </Button>
            ) : (
              <Button size="sm" className="bg-primary hover:bg-primary/90 hidden md:flex">
                Sign In
              </Button>
            )}

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-border">
            <nav className="flex flex-col gap-2">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={cn(
                    'px-4 py-2 text-sm font-medium rounded-lg transition-colors',
                    link.active || location.pathname === link.href
                      ? 'bg-primary/10 text-primary'
                      : 'text-muted-foreground hover:bg-muted'
                  )}
                >
                  {link.label}
                </Link>
              ))}
            </nav>
            <form onSubmit={handleSearch} className="mt-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
            </form>
          </div>
        )}
      </div>
    </header>
  );
}
