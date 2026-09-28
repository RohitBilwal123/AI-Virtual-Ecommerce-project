import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Slider } from '@/components/ui/slider';
import { Input } from '@/components/ui/input';
import { 
  ChevronDown, 
  ChevronUp, 
  X, 
  SlidersHorizontal,
  Shirt
} from 'lucide-react';
import { cn } from '@/lib/utils';

export interface FilterState {
  categories: string[];
  sizes: string[];
  colors: string[];
  styles: string[];
  priceRange: [number, number];
  fits: string[];
  materials: string[];
}

interface FilterSidebarProps {
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
  itemCount: number;
  onClearFilters: () => void;
  userImage?: string | null;
  currentItem?: { name: string; size: string; fit: string } | null;
  onChangePhoto?: () => void;
}

const CATEGORIES = ['Tops', 'Bottoms', 'Dresses', 'Outerwear', 'Accessories'];
const SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
const COLORS = [
  { name: 'Black', value: '#000000' },
  { name: 'White', value: '#FFFFFF' },
  { name: 'Navy', value: '#1e3a5f' },
  { name: 'Red', value: '#ef4444' },
  { name: 'Green', value: '#22c55e' },
  { name: 'Blue', value: '#3b82f6' },
  { name: 'Pink', value: '#ec4899' },
  { name: 'Brown', value: '#92400e' },
];
const STYLES = ['Casual', 'Formal', 'Sportswear', 'Seasonal'];
const FITS = ['Slim', 'Regular', 'Relaxed'];
const MATERIALS = ['Cotton', 'Polyester', 'Wool', 'Blend', 'Sustainable'];

interface CollapsibleSectionProps {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}

function CollapsibleSection({ title, children, defaultOpen = true }: CollapsibleSectionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="border-b border-border pb-4">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between py-2 text-sm font-semibold text-foreground hover:text-primary transition-colors"
      >
        {title}
        {isOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
      </button>
      {isOpen && <div className="mt-2 space-y-2">{children}</div>}
    </div>
  );
}

export function FilterSidebar({
  filters,
  onFiltersChange,
  itemCount,
  onClearFilters,
  userImage,
  currentItem,
  onChangePhoto,
}: FilterSidebarProps) {
  const toggleCategory = (cat: string) => {
    const updated = filters.categories.includes(cat)
      ? filters.categories.filter((c) => c !== cat)
      : [...filters.categories, cat];
    onFiltersChange({ ...filters, categories: updated });
  };

  const toggleSize = (size: string) => {
    const updated = filters.sizes.includes(size)
      ? filters.sizes.filter((s) => s !== size)
      : [...filters.sizes, size];
    onFiltersChange({ ...filters, sizes: updated });
  };

  const toggleColor = (color: string) => {
    const updated = filters.colors.includes(color)
      ? filters.colors.filter((c) => c !== color)
      : [...filters.colors, color];
    onFiltersChange({ ...filters, colors: updated });
  };

  const toggleStyle = (style: string) => {
    const updated = filters.styles.includes(style)
      ? filters.styles.filter((s) => s !== style)
      : [...filters.styles, style];
    onFiltersChange({ ...filters, styles: updated });
  };

  const toggleFit = (fit: string) => {
    const updated = filters.fits.includes(fit)
      ? filters.fits.filter((f) => f !== fit)
      : [...filters.fits, fit];
    onFiltersChange({ ...filters, fits: updated });
  };

  const toggleMaterial = (material: string) => {
    const updated = filters.materials.includes(material)
      ? filters.materials.filter((m) => m !== material)
      : [...filters.materials, material];
    onFiltersChange({ ...filters, materials: updated });
  };

  const hasActiveFilters = 
    filters.categories.length > 0 || 
    filters.sizes.length > 0 || 
    filters.colors.length > 0 ||
    filters.styles.length > 0 ||
    filters.fits.length > 0 ||
    filters.materials.length > 0 ||
    filters.priceRange[0] > 0 ||
    filters.priceRange[1] < 200;

  return (
    <div className="flex flex-col h-full">
      {/* User Image Preview Section */}
      <div className="bg-card rounded-xl border border-border p-4 mb-6 shadow-card">
        <h3 className="font-semibold text-foreground mb-3">Your Image</h3>
        <div className="relative aspect-square w-full max-w-[180px] mx-auto rounded-xl overflow-hidden border-2 border-dashed border-border bg-muted">
          {userImage ? (
            <img 
              src={userImage} 
              alt="Your photo" 
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
              <Shirt className="h-12 w-12 mb-2" />
              <span className="text-xs">No photo</span>
            </div>
          )}
        </div>
        <p className="text-center text-sm text-primary mt-2 font-medium">Preview</p>
        
        {currentItem && (
          <div className="mt-4 space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Current Item:</span>
              <span className="font-medium text-primary">{currentItem.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Size:</span>
              <span className="font-medium">{currentItem.size}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Fit:</span>
              <span className="font-medium text-green-600">{currentItem.fit}</span>
            </div>
          </div>
        )}
        
        <Button 
          onClick={onChangePhoto}
          className="w-full mt-4 bg-primary hover:bg-primary/90"
        >
          Change Photo
        </Button>
      </div>

      {/* Filter Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="h-4 w-4 text-muted-foreground" />
          <span className="font-semibold text-sm">Filters</span>
        </div>
        {hasActiveFilters && (
          <button
            onClick={onClearFilters}
            className="text-xs text-primary hover:text-primary/80 flex items-center gap-1"
          >
            <X className="h-3 w-3" /> Clear all
          </button>
        )}
      </div>

      {/* Filter Sections */}
      <div className="flex-1 overflow-auto space-y-1">
        {/* Categories */}
        <CollapsibleSection title="Categories">
          <div className="space-y-2">
            {CATEGORIES.map((cat) => (
              <label key={cat} className="flex items-center gap-2 cursor-pointer group">
                <Checkbox
                  checked={filters.categories.includes(cat.toLowerCase())}
                  onCheckedChange={() => toggleCategory(cat.toLowerCase())}
                />
                <span className="text-sm text-muted-foreground group-hover:text-foreground transition-colors">
                  {cat}
                </span>
              </label>
            ))}
          </div>
        </CollapsibleSection>

        {/* Sizes */}
        <CollapsibleSection title="Sizes">
          <div className="flex flex-wrap gap-2">
            {SIZES.map((size) => (
              <button
                key={size}
                onClick={() => toggleSize(size)}
                className={cn(
                  'px-3 py-1.5 text-xs font-medium rounded-lg border transition-all',
                  filters.sizes.includes(size)
                    ? 'bg-primary text-primary-foreground border-primary'
                    : 'bg-background border-border text-muted-foreground hover:border-primary hover:text-foreground'
                )}
              >
                {size}
              </button>
            ))}
          </div>
          <button className="text-xs text-primary hover:underline mt-2">
            Size Guide
          </button>
        </CollapsibleSection>

        {/* Colors */}
        <CollapsibleSection title="Colors">
          <div className="flex flex-wrap gap-2">
            {COLORS.map((color) => (
              <button
                key={color.name}
                onClick={() => toggleColor(color.name.toLowerCase())}
                className={cn(
                  'w-7 h-7 rounded-full border-2 transition-all',
                  filters.colors.includes(color.name.toLowerCase())
                    ? 'ring-2 ring-primary ring-offset-2'
                    : 'hover:scale-110'
                )}
                style={{ backgroundColor: color.value }}
                title={color.name}
              />
            ))}
          </div>
        </CollapsibleSection>

        {/* Styles */}
        <CollapsibleSection title="Style">
          <div className="space-y-2">
            {STYLES.map((style) => (
              <label key={style} className="flex items-center gap-2 cursor-pointer group">
                <Checkbox
                  checked={filters.styles.includes(style.toLowerCase())}
                  onCheckedChange={() => toggleStyle(style.toLowerCase())}
                />
                <span className="text-sm text-muted-foreground group-hover:text-foreground transition-colors">
                  {style}
                </span>
              </label>
            ))}
          </div>
        </CollapsibleSection>

        {/* Price Range */}
        <CollapsibleSection title="Price Range">
          <div className="space-y-4">
            <Slider
              value={filters.priceRange}
              onValueChange={(value) => onFiltersChange({ ...filters, priceRange: value as [number, number] })}
              min={0}
              max={200}
              step={10}
              className="w-full"
            />
            <div className="flex items-center gap-2">
              <Input
                type="number"
                value={filters.priceRange[0]}
                onChange={(e) => onFiltersChange({ 
                  ...filters, 
                  priceRange: [Number(e.target.value), filters.priceRange[1]] 
                })}
                className="w-20 h-8 text-sm"
                placeholder="Min"
              />
              <span className="text-muted-foreground">-</span>
              <Input
                type="number"
                value={filters.priceRange[1]}
                onChange={(e) => onFiltersChange({ 
                  ...filters, 
                  priceRange: [filters.priceRange[0], Number(e.target.value)] 
                })}
                className="w-20 h-8 text-sm"
                placeholder="Max"
              />
            </div>
          </div>
        </CollapsibleSection>

        {/* Fit Preference */}
        <CollapsibleSection title="Fit Preference">
          <div className="flex flex-wrap gap-2">
            {FITS.map((fit) => (
              <button
                key={fit}
                onClick={() => toggleFit(fit.toLowerCase())}
                className={cn(
                  'px-3 py-1.5 text-xs font-medium rounded-lg border transition-all',
                  filters.fits.includes(fit.toLowerCase())
                    ? 'bg-primary text-primary-foreground border-primary'
                    : 'bg-background border-border text-muted-foreground hover:border-primary hover:text-foreground'
                )}
              >
                {fit}
              </button>
            ))}
          </div>
        </CollapsibleSection>

        {/* Materials */}
        <CollapsibleSection title="Material" defaultOpen={false}>
          <div className="space-y-2">
            {MATERIALS.map((material) => (
              <label key={material} className="flex items-center gap-2 cursor-pointer group">
                <Checkbox
                  checked={filters.materials.includes(material.toLowerCase())}
                  onCheckedChange={() => toggleMaterial(material.toLowerCase())}
                />
                <span className="text-sm text-muted-foreground group-hover:text-foreground transition-colors">
                  {material}
                </span>
              </label>
            ))}
          </div>
        </CollapsibleSection>
      </div>

      {/* Item Count */}
      <div className="pt-4 mt-4 border-t border-border">
        <Badge variant="secondary" className="w-full justify-center py-2">
          {itemCount} items found
        </Badge>
      </div>
    </div>
  );
}
