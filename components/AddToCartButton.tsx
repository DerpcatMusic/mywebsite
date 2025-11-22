"use client";

import { Button } from "@/components/ui/button";
import { CartItem, useCartStore } from "@/lib/cart-store";
import { ShoppingCart } from "lucide-react";
import { toast } from "sonner";

interface AddToCartButtonProps {
  item: Omit<CartItem, "quantity">;
  className?: string;
  variant?:
    | "default"
    | "outline"
    | "secondary"
    | "ghost"
    | "link"
    | "destructive";
  size?: "default" | "sm" | "lg" | "icon";
}

export default function AddToCartButton({
  item,
  className,
  variant = "default",
  size = "default",
}: AddToCartButtonProps) {
  const addItem = useCartStore(state => state.addItem);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem({ ...item, quantity: 1 });
    toast.success(`Added ${item.name} to cart`);
  };

  return (
    <Button
      onClick={handleAddToCart}
      className={className}
      variant={variant}
      size={size}
    >
      <ShoppingCart className="mr-2 h-4 w-4" />
      Add to Cart
    </Button>
  );
}
