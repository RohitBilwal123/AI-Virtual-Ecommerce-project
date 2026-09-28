import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Heart, ShoppingBag, Eye } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Garment } from '@/types';
import { useCart } from '@/contexts/CartContext';

interface ProductCardProps {
  product: Garment;
  matchScore?: number;
  onTryOn: (product: Garment) => void;
  onViewDetails: (product: Garment) => void;
  isFavorite?: boolean;
  onToggleFavorite?: (product: Garment) => void;
}

export function ProductCard({
  product,
  matchScore = Math.floor(Math.random() * 10) + 90,
  onTryOn,
  onViewDetails,
  isFavorite = false,
  onToggleFavorite,
}: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [localFavorite, setLocalFavorite] = useState(isFavorite);
  const { addToCart } = useCart();

  const getMatchColor = (score: number) => {
    if (score >= 95) return 'bg-green-500/10 text-green-600 border-green-500/20';
    if (score >= 90) return 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20';
    if (score >= 80) return 'bg-orange-500/10 text-orange-600 border-orange-500/20';
    return 'bg-yellow-500/10 text-yellow-600 border-yellow-500/20';
  };

  const handleFavoriteClick = () => {
    setLocalFavorite(!localFavorite);
    onToggleFavorite?.(product);
  };

  // Generate color swatches from product or default
  const colorSwatches = [
    { color: '#3b82f6', name: 'Blue' },
    { color: '#ef4444', name: 'Red' },
    { color: '#22c55e', name: 'Green' },
  ];

  return (
    <div
      className={cn(
        'group relative bg-card rounded-xl border border-border overflow-hidden transition-all duration-300',
        isHovered ? 'shadow-lg scale-[1.02]' : 'shadow-card hover:shadow-lg'
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image Container */}
      <div className="relative aspect-[4/5] overflow-hidden bg-muted">
        {/* Loading skeleton */}
        {!imageLoaded && (
          <div className="absolute inset-0 animate-pulse bg-muted flex items-center justify-center">
            <ShoppingBag className="h-12 w-12 text-muted-foreground/30" />
          </div>
        )}

        <img
          src={product.image_url}
          alt={product.name}
          className={cn(
            'w-full h-full object-cover transition-transform duration-500',
            isHovered && 'scale-110',
            !imageLoaded && 'opacity-0'
          )}
          onLoad={() => setImageLoaded(true)}
        />

        {/* Match Score Badge */}
        <div className="absolute bottom-3 right-3">
          <Badge
            variant="outline"
            className={cn('font-semibold px-2 py-1', getMatchColor(matchScore))}
          >
            {matchScore}% Match
          </Badge>
        </div>

        {/* Favorite Button */}
        <button
          onClick={handleFavoriteClick}
          className={cn(
            'absolute top-3 right-3 p-2 rounded-full transition-all',
            localFavorite
              ? 'bg-red-500 text-white'
              : 'bg-white/80 text-muted-foreground hover:bg-white hover:text-red-500'
          )}
        >
          <Heart className={cn('h-4 w-4', localFavorite && 'fill-current')} />
        </button>

        {/* Quick View Overlay */}
        <div className={cn(
          'absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 transition-opacity duration-300',
          isHovered && 'opacity-100'
        )}>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => onTryOn(product)}
            className="gap-2"
          >
            <Eye className="h-4 w-4" />
            Quick Try-On
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 space-y-3">
        {/* Title */}
        <h3 className="font-medium text-foreground line-clamp-2 leading-snug">
          {product.name}
        </h3>

        {/* Description */}
        <p className="text-sm text-muted-foreground line-clamp-1">
          {product.description || `Premium ${product.category} with modern fit`}
        </p>

        {/* Price & Colors Row */}
        <div className="flex items-center justify-between">
          <div className="flex items-baseline gap-2">
            <span className="text-lg font-bold text-foreground">
              ₹{product.price.toFixed(2)}
            </span>
            {Math.random() > 0.7 && (
              <span className="text-sm text-muted-foreground line-through">
                ₹{(product.price * 1.3).toFixed(2)}
              </span>
            )}
          </div>

          {/* Color Swatches */}
          <div className="flex gap-1">
            {colorSwatches.map((swatch, idx) => (
              <div
                key={idx}
                className="w-4 h-4 rounded-full border border-border"
                style={{ backgroundColor: swatch.color }}
                title={swatch.name}
              />
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 pt-2">
          <Button
            onClick={() => onViewDetails(product)}
            className="flex-1 bg-primary hover:bg-primary/90"
          >
            View Details
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => addToCart({
              product_id: null,
              product_name: product.name,
              product_image_url: product.image_url,
              price: product.price,
              quantity: 1,
              selected_size: 'M'
            })}
            className="shrink-0"
          >
            <ShoppingBag className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
