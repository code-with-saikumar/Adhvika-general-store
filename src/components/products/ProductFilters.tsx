import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';

interface ProductFiltersProps {
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  priceRange: [number, number];
  setPriceRange: (range: [number, number]) => void;
  maxPrice: number;
  onClearFilters: () => void;
}

type PriceMode = 'preset' | 'slider' | 'custom';

const PRICE_PRESETS = [
  { label: 'Under ₹100', min: 0, max: 100 },
  { label: 'Under ₹500', min: 0, max: 500 },
  { label: 'Under ₹1000', min: 0, max: 1000 },
  { label: '₹100 - ₹500', min: 100, max: 500 },
  { label: '₹500 - ₹1000', min: 500, max: 1000 },
  { label: '₹1000 - ₹2000', min: 1000, max: 2000 },
  { label: 'Above ₹2000', min: 2000, max: 999999 },
];

const ProductFilters: React.FC<ProductFiltersProps> = ({
  selectedCategory,
  onCategoryChange,
  priceRange,
  setPriceRange,
  maxPrice,
  onClearFilters,
}) => {
  const [priceMode, setPriceMode] = useState<PriceMode>('preset');
  const [selectedPreset, setSelectedPreset] = useState<string>('');
  const [customMin, setCustomMin] = useState<string>('');
  const [customMax, setCustomMax] = useState<string>('');

  const handlePresetChange = (presetLabel: string) => {
    setSelectedPreset(presetLabel);
    const preset = PRICE_PRESETS.find(p => p.label === presetLabel);
    if (preset) {
      setPriceRange([preset.min, Math.min(preset.max, maxPrice)]);
    }
  };

  const handleSliderChange = (value: number[]) => {
    setPriceRange([value[0], value[1]]);
    setSelectedPreset('');
  };

  const handleCustomApply = () => {
    const min = parseInt(customMin) || 0;
    const max = parseInt(customMax) || maxPrice;
    setPriceRange([min, max]);
    setSelectedPreset('');
  };

  const handleClearAll = () => {
    setSelectedPreset('');
    setCustomMin('');
    setCustomMax('');
    onClearFilters();
  };

  return (
    <div className="bg-card border border-border rounded-lg p-5">
      {/* Filters Header */}
      <h3 className="font-semibold text-lg text-foreground mb-5">Filters</h3>

      {/* Categories */}
      <div className="mb-6">
        <h4 className="font-medium text-foreground mb-3">Categories</h4>
        <RadioGroup 
          value={selectedCategory || 'all'} 
          onValueChange={onCategoryChange}
          className="space-y-2"
        >
          <div className="flex items-center space-x-3">
            <RadioGroupItem value="all" id="cat-all" className="border-primary text-primary" />
            <Label htmlFor="cat-all" className="text-sm text-foreground cursor-pointer">
              All Products
            </Label>
          </div>
          <div className="flex items-center space-x-3">
            <RadioGroupItem value="general" id="cat-general" className="border-primary text-primary" />
            <Label htmlFor="cat-general" className="text-sm text-foreground cursor-pointer">
              General Store
            </Label>
          </div>
          <div className="flex items-center space-x-3">
            <RadioGroupItem value="bangles" id="cat-bangles" className="border-primary text-primary" />
            <Label htmlFor="cat-bangles" className="text-sm text-foreground cursor-pointer">
              Bangles
            </Label>
          </div>
          <div className="flex items-center space-x-3">
            <RadioGroupItem value="fancy" id="cat-fancy" className="border-primary text-primary" />
            <Label htmlFor="cat-fancy" className="text-sm text-foreground cursor-pointer">
              Fancy Items
            </Label>
          </div>
        </RadioGroup>
      </div>

      <Separator className="my-5" />

      {/* Price Range */}
      <div className="mb-6">
        <h4 className="font-medium text-foreground mb-3">Price Range</h4>
        
        {/* Price Mode Selection */}
        <RadioGroup 
          value={priceMode} 
          onValueChange={(value) => setPriceMode(value as PriceMode)}
          className="space-y-2 mb-4"
        >
          <div className="flex items-center space-x-3">
            <RadioGroupItem value="preset" id="mode-preset" className="border-primary text-primary" />
            <Label htmlFor="mode-preset" className="text-sm text-foreground cursor-pointer">
              Preset Ranges
            </Label>
          </div>
          <div className="flex items-center space-x-3">
            <RadioGroupItem value="slider" id="mode-slider" className="border-primary text-primary" />
            <Label htmlFor="mode-slider" className="text-sm text-foreground cursor-pointer">
              Slider
            </Label>
          </div>
          <div className="flex items-center space-x-3">
            <RadioGroupItem value="custom" id="mode-custom" className="border-primary text-primary" />
            <Label htmlFor="mode-custom" className="text-sm text-foreground cursor-pointer">
              Custom Range
            </Label>
          </div>
        </RadioGroup>

        {/* Preset Ranges */}
        {priceMode === 'preset' && (
          <div className="space-y-3 mt-4 pl-1">
            {PRICE_PRESETS.map((preset) => (
              <button
                key={preset.label}
                onClick={() => handlePresetChange(preset.label)}
                className={`block w-full text-left text-sm py-1 transition-colors ${
                  selectedPreset === preset.label 
                    ? 'text-primary font-medium' 
                    : 'text-foreground hover:text-primary'
                }`}
              >
                {preset.label}
              </button>
            ))}
          </div>
        )}

        {/* Slider */}
        {priceMode === 'slider' && (
          <div className="mt-4 px-1">
            <Slider
              value={[priceRange[0], priceRange[1]]}
              onValueChange={handleSliderChange}
              max={maxPrice}
              min={0}
              step={50}
              className="mb-3"
            />
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <span>₹{priceRange[0]}</span>
              <span>₹{priceRange[1]}</span>
            </div>
          </div>
        )}

        {/* Custom Range */}
        {priceMode === 'custom' && (
          <div className="mt-4 space-y-3">
            <div className="flex items-center gap-2">
              <div className="flex-1">
                <Label htmlFor="min-price" className="text-xs text-muted-foreground mb-1 block">
                  Min
                </Label>
                <Input
                  id="min-price"
                  type="number"
                  placeholder="₹0"
                  value={customMin}
                  onChange={(e) => setCustomMin(e.target.value)}
                  className="h-9"
                />
              </div>
              <span className="text-muted-foreground mt-5">-</span>
              <div className="flex-1">
                <Label htmlFor="max-price" className="text-xs text-muted-foreground mb-1 block">
                  Max
                </Label>
                <Input
                  id="max-price"
                  type="number"
                  placeholder={`₹${maxPrice}`}
                  value={customMax}
                  onChange={(e) => setCustomMax(e.target.value)}
                  className="h-9"
                />
              </div>
            </div>
            <Button 
              onClick={handleCustomApply} 
              size="sm" 
              className="w-full"
            >
              Apply
            </Button>
          </div>
        )}
      </div>

      <Separator className="my-5" />

      {/* Clear Filters */}
      <Button 
        variant="outline" 
        onClick={handleClearAll}
        className="w-full"
      >
        Clear Filters
      </Button>
    </div>
  );
};

export default ProductFilters;
