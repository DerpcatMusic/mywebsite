"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useCartStore } from "@/lib/cart-store";
import { FourthwallProduct } from "@/lib/fourthwall";
import { Check, ChevronLeft, ChevronRight, ShoppingCart } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { toast } from "sonner";

interface ProductModalProps {
  product: FourthwallProduct | null;
  isOpen: boolean;
  onClose: () => void;
}

interface VariantAttribute {
  color?: { name: string; swatch?: string };
  size?: { name: string };
  description?: string;
}

export default function ProductModal({
  product,
  isOpen,
  onClose,
}: ProductModalProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [selectedVariantId, setSelectedVariantId] = useState<string | null>(
    null
  );
  const addItem = useCartStore(state => state.addItem);

  // Reset state when product changes
  useEffect(() => {
    if (product) {
      setCurrentImageIndex(0);
      // Auto-select first variant if available
      if (product.variants && product.variants.length > 0) {
        setSelectedVariantId(product.variants[0].id);
      }
    }
  }, [product]);

  if (!product) {
    return null;
  }

  const images = product.images || [];
  const variants = product.variants || [];
  const selectedVariant = variants.find(v => v.id === selectedVariantId);

  // Extract unique colors and sizes from variants
  const uniqueColors = new Map<string, { name: string; swatch?: string }>();
  const uniqueSizes = new Map<string, string>();

  variants.forEach(variant => {
    const attrs = variant.attributes as VariantAttribute | null;
    if (attrs?.color) {
      uniqueColors.set(attrs.color.name, attrs.color);
    }
    if (attrs?.size) {
      uniqueSizes.set(attrs.size.name, attrs.size.name);
    }
  });

  const colors = Array.from(uniqueColors.values());
  const sizes = Array.from(uniqueSizes.values());

  // Get selected color and size from current variant
  const selectedAttrs = selectedVariant?.attributes as VariantAttribute | null;
  const selectedColor = selectedAttrs?.color?.name;
  const selectedSize = selectedAttrs?.size?.name;

  // Handle variant selection by color/size
  const handleColorSelect = (colorName: string) => {
    const variant = variants.find(v => {
      const attrs = v.attributes as VariantAttribute | null;
      return (
        attrs?.color?.name === colorName &&
        (selectedSize ? attrs?.size?.name === selectedSize : true)
      );
    });
    if (variant) {
      setSelectedVariantId(variant.id);
    }
  };

  const handleSizeSelect = (sizeName: string) => {
    const variant = variants.find(v => {
      const attrs = v.attributes as VariantAttribute | null;
      return (
        attrs?.size?.name === sizeName &&
        (selectedColor ? attrs?.color?.name === selectedColor : true)
      );
    });
    if (variant) {
      setSelectedVariantId(variant.id);
    }
  };

  const handleAddToCart = () => {
    if (!selectedVariant) {
      toast.error("Please select a variant");
      return;
    }

    const price = selectedVariant.unitPrice?.value || 0;
    const image = images[0]?.url || "";

    addItem({
      id: `${product.id}-${selectedVariant.id}`,
      name: product.name,
      price,
      image,
      quantity: 1,
      type: "product",
      variantId: selectedVariant.id,
      variantName: selectedVariant.name,
      variantAttributes: selectedVariant.attributes as Record<string, unknown>,
    });

    toast.success(`Added ${product.name} to cart`);
    onClose();
  };

  const nextImage = () => {
    setCurrentImageIndex(prev => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex(prev => (prev - 1 + images.length) % images.length);
  };

  const price = selectedVariant?.unitPrice?.value || 0;
  const currency = selectedVariant?.unitPrice?.currency || "USD";
  const formattedPrice = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
  }).format(price);

  const inStock =
    selectedVariant?.stock &&
    typeof selectedVariant.stock === "object" &&
    "inStock" in selectedVariant.stock
      ? (selectedVariant.stock as { inStock?: number }).inStock
      : undefined;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-h-[90vh] max-w-4xl overflow-hidden p-0">
        <div className="grid grid-cols-1 gap-0 md:grid-cols-2">
          {/* Image Gallery */}
          <div className="relative bg-black">
            {images.length > 0 ? (
              <>
                <div className="relative aspect-square">
                  <Image
                    src={images[currentImageIndex].url}
                    alt={product.name}
                    fill
                    className="object-cover"
                  />
                </div>
                {images.length > 1 && (
                  <>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70"
                      onClick={prevImage}
                    >
                      <ChevronLeft className="h-6 w-6" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70"
                      onClick={nextImage}
                    >
                      <ChevronRight className="h-6 w-6" />
                    </Button>
                    <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-2">
                      {images.map((_, idx) => (
                        <button
                          key={idx}
                          onClick={() => setCurrentImageIndex(idx)}
                          className={`h-2 w-2 rounded-full transition-all ${
                            idx === currentImageIndex
                              ? "w-6 bg-white"
                              : "bg-white/50"
                          }`}
                        />
                      ))}
                    </div>
                  </>
                )}
              </>
            ) : (
              <div className="flex aspect-square items-center justify-center bg-secondary/20">
                <p className="text-muted-foreground">No image available</p>
              </div>
            )}
          </div>

          {/* Product Details */}
          <div className="flex flex-col p-6">
            <DialogHeader className="mb-4">
              <DialogTitle className="font-pixel text-2xl text-primary">
                {product.name}
              </DialogTitle>
              <DialogDescription className="text-xl font-bold text-foreground">
                {formattedPrice}
              </DialogDescription>
            </DialogHeader>

            <ScrollArea className="flex-1 pr-4">
              {/* Description */}
              {product.description && (
                <div className="mb-6">
                  <h3 className="mb-2 font-semibold">Description</h3>
                  <div
                    className="text-sm text-muted-foreground"
                    dangerouslySetInnerHTML={{ __html: product.description }}
                  />
                </div>
              )}

              {/* Color Selection */}
              {colors.length > 0 && (
                <div className="mb-6">
                  <h3 className="mb-3 font-semibold">
                    Color: {selectedColor || "Select"}
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {colors.map(color => (
                      <button
                        key={color.name}
                        onClick={() => handleColorSelect(color.name)}
                        className={`relative flex items-center gap-2 rounded-lg border-2 px-4 py-2 transition-all ${
                          selectedColor === color.name
                            ? "border-primary bg-primary/10"
                            : "border-border hover:border-primary/50"
                        }`}
                      >
                        {color.swatch && (
                          <div
                            className="h-5 w-5 rounded-full border border-border"
                            style={{ backgroundColor: color.swatch }}
                          />
                        )}
                        <span className="text-sm">{color.name}</span>
                        {selectedColor === color.name && (
                          <Check className="absolute -right-1 -top-1 h-4 w-4 text-primary" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Size Selection */}
              {sizes.length > 0 && (
                <div className="mb-6">
                  <h3 className="mb-3 font-semibold">
                    Size: {selectedSize || "Select"}
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {sizes.map(size => (
                      <button
                        key={size}
                        onClick={() => handleSizeSelect(size)}
                        className={`rounded-lg border-2 px-4 py-2 transition-all ${
                          selectedSize === size
                            ? "border-primary bg-primary/10"
                            : "border-border hover:border-primary/50"
                        }`}
                      >
                        <span className="text-sm font-medium">{size}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Stock Status */}
              {inStock !== undefined && (
                <div className="mb-4">
                  <div className="flex items-center gap-2">
                    <div
                      className={`h-2 w-2 rounded-full ${
                        inStock > 0
                          ? "bg-green-500 shadow-[0_0_5px_#22c55e]"
                          : "bg-red-500 shadow-[0_0_5px_#ef4444]"
                      } animate-pulse`}
                    />
                    <span className="font-pixel text-sm uppercase tracking-wider">
                      {inStock > 0 ? `In Stock (${inStock})` : "Out of Stock"}
                    </span>
                  </div>
                </div>
              )}
            </ScrollArea>

            {/* Add to Cart Button */}
            <div className="mt-6 border-t pt-4">
              <Button
                onClick={handleAddToCart}
                disabled={!selectedVariant || inStock === 0}
                className="pixel-btn w-full py-6 text-base"
                size="lg"
              >
                <ShoppingCart className="mr-2 h-5 w-5" />
                Add to Cart
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
