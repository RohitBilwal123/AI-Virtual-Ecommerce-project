import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';

interface FilterBarProps {
  selectedSize: string;
  selectedColor: string;
  selectedStyle: string;
  selectedPriceRange: string;
  onSizeChange: (value: string) => void;
  onColorChange: (value: string) => void;
  onStyleChange: (value: string) => void;
  onPriceRangeChange: (value: string) => void;
  onClearFilters: () => void;
  itemCount: number;
}

export function FilterBar({
  selectedSize,
  selectedColor,
  selectedStyle,
  selectedPriceRange,
  onSizeChange,
  onColorChange,
  onStyleChange,
  onPriceRangeChange,
  onClearFilters,
  itemCount,
}: FilterBarProps) {
  const hasFilters = selectedSize !== 'all' || selectedColor !== 'all' || selectedStyle !== 'all' || selectedPriceRange !== 'all';

  return (
    <div className="bg-card rounded-xl border border-border p-4 shadow-sm">
      <div className="flex flex-col lg:flex-row lg:items-center gap-4">
        <span className="font-medium text-sm text-foreground shrink-0">Filter Options</span>

        <div className="flex flex-wrap items-center gap-3 flex-1">
          {/* Size Filter */}
          <div className="space-y-1">
            <label className="text-xs text-muted-foreground">Size</label>
            <Select value={selectedSize} onValueChange={onSizeChange}>
              <SelectTrigger className="w-24 h-9">
                <SelectValue placeholder="Size" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="xs">XS</SelectItem>
                <SelectItem value="s">S</SelectItem>
                <SelectItem value="m">M</SelectItem>
                <SelectItem value="l">L</SelectItem>
                <SelectItem value="xl">XL</SelectItem>
                <SelectItem value="xxl">XXL</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Color Filter */}
          <div className="space-y-1">
            <label className="text-xs text-muted-foreground">Color</label>
            <Select value={selectedColor} onValueChange={onColorChange}>
              <SelectTrigger className="w-28 h-9">
                <SelectValue placeholder="Color" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Colors</SelectItem>
                <SelectItem value="black">Black</SelectItem>
                <SelectItem value="white">White</SelectItem>
                <SelectItem value="blue">Blue</SelectItem>
                <SelectItem value="red">Red</SelectItem>
                <SelectItem value="green">Green</SelectItem>
                <SelectItem value="navy">Navy</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Style Filter */}
          <div className="space-y-1">
            <label className="text-xs text-muted-foreground">Style</label>
            <Select value={selectedStyle} onValueChange={onStyleChange}>
              <SelectTrigger className="w-28 h-9">
                <SelectValue placeholder="Style" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Styles</SelectItem>
                <SelectItem value="casual">Casual</SelectItem>
                <SelectItem value="formal">Formal</SelectItem>
                <SelectItem value="sportswear">Sportswear</SelectItem>
                <SelectItem value="seasonal">Seasonal</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Price Range Filter */}
          <div className="space-y-1">
            <label className="text-xs text-muted-foreground">Price Range</label>
            <Select value={selectedPriceRange} onValueChange={onPriceRangeChange}>
              <SelectTrigger className="w-28 h-9">
                <SelectValue placeholder="Price" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Prices</SelectItem>
                <SelectItem value="0-500">₹0 - ₹500</SelectItem>
                <SelectItem value="500-1000">₹500 - ₹1000</SelectItem>
                <SelectItem value="1000-2000">₹1000 - ₹2000</SelectItem>
                <SelectItem value="2000+">₹2000+</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Item Count & Clear */}
        <div className="flex items-center gap-4 shrink-0">
          <span className="text-sm text-muted-foreground">
            {itemCount} products found
          </span>
          {hasFilters && (
            <Button
              variant="link"
              size="sm"
              onClick={onClearFilters}
              className="text-primary p-0 h-auto gap-1"
            >
              Clear Filters
              <X className="h-3 w-3" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
