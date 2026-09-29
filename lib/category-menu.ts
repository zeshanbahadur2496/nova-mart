import type { LucideIcon } from "lucide-react";
import {
  Armchair,
  Book,
  Camera,
  Car,
  Cpu,
  Dumbbell,
  Footprints,
  Gamepad2,
  Headphones,
  Home,
  Laptop,
  PawPrint,
  PenTool,
  Puzzle,
  Shirt,
  ShoppingBasket,
  Smartphone,
  Sparkles,
  Tv,
  WashingMachine,
  Watch,
  Zap
} from "lucide-react";

export type CategoryMenuGroup = {
  id: string;
  title: string;
  icon: LucideIcon;
  categories: string[];
  promo?: { label: string; href: string };
};

export const categoryIcons: Record<string, LucideIcon> = {
  "Mobiles & Accessories": Smartphone,
  "Laptops & Computers": Laptop,
  Electronics: Cpu,
  "Headphones & Audio": Headphones,
  TVs: Tv,
  Cameras: Camera,
  Watches: Watch,
  "Men's Fashion": Shirt,
  "Women's Fashion": Shirt,
  Shoes: Footprints,
  "Home & Kitchen": Home,
  Furniture: Armchair,
  "Beauty & Personal Care": Sparkles,
  Grocery: ShoppingBasket,
  "Sports & Fitness": Dumbbell,
  Books: Book,
  "Toys & Games": Puzzle,
  Gaming: Gamepad2,
  "Office & Stationery": PenTool,
  Appliances: WashingMachine,
  Automotive: Car,
  "Pet Supplies": PawPrint
};

export const categoryMenuGroups: CategoryMenuGroup[] = [
  {
    id: "electronics",
    title: "Electronics & Tech",
    icon: Cpu,
    categories: ["Mobiles & Accessories", "Laptops & Computers", "Electronics", "Headphones & Audio", "TVs", "Cameras", "Gaming"],
    promo: { label: "Flash tech deals", href: "/search?category=Electronics&deal=flash" }
  },
  {
    id: "fashion",
    title: "Fashion & Accessories",
    icon: Shirt,
    categories: ["Men's Fashion", "Women's Fashion", "Shoes", "Watches"],
    promo: { label: "New season styles", href: "/search?category=Women%27s%20Fashion" }
  },
  {
    id: "home",
    title: "Home & Living",
    icon: Home,
    categories: ["Home & Kitchen", "Furniture", "Appliances", "Office & Stationery"],
    promo: { label: "Home essentials", href: "/search?category=Home%20%26%20Kitchen" }
  },
  {
    id: "lifestyle",
    title: "Health, Sports & More",
    icon: Dumbbell,
    categories: ["Beauty & Personal Care", "Sports & Fitness", "Grocery", "Books", "Toys & Games", "Automotive", "Pet Supplies"],
    promo: { label: "Top rated picks", href: "/search?sort=rating" }
  }
];

export function getCategoryGroup(category: string): CategoryMenuGroup | undefined {
  return categoryMenuGroups.find((group) => group.categories.includes(category));
}
