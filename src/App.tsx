import React, { useState, useEffect } from "react";
import {
  ShoppingCart,
  Search,
  Sparkles,
  ChefHat,
  Heart,
  User,
  Clock,
  MapPin,
  Star,
  Plus,
  Minus,
  Trash2,
  CheckCircle2,
  Truck,
  ShieldCheck,
  Tag,
  ArrowRight,
  RefreshCw,
  Flame,
  Award,
  ChevronRight,
  X,
  MessageSquare,
  SlidersHorizontal,
  Info,
  DollarSign,
  HeartPulse
} from "lucide-react";

// Types
interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  originalPrice?: number;
  unit: string;
  image: string;
  rating: number;
  reviewsCount: number;
  isOrganic?: boolean;
  isBogo?: boolean;
  isBestSeller?: boolean;
  dietary: string[]; // ["Vegan", "Gluten-Free", "Organic"]
  description: string;
  nutrition: {
    calories: number;
    protein: string;
    carbs: string;
    fat: string;
  };
}

interface CartItem extends Product {
  quantity: number;
}

interface RecipeResult {
  recipeName: string;
  description: string;
  prepTime: string;
  servings: number;
  ingredients: {
    name: string;
    category: string;
    estimatedPrice: number;
    quantity: string;
  }[];
  instructions: string[];
}

interface Order {
  id: string;
  date: string;
  items: CartItem[];
  total: number;
  status: "Preparing" | "Out for Delivery" | "Delivered";
  address: string;
  estimatedDelivery: string;
}

// Initial Mock Products
const INITIAL_PRODUCTS: Product[] = [
  {
    id: "p1",
    name: "Organic Hass Avocados",
    category: "Produce",
    price: 4.99,
    originalPrice: 6.49,
    unit: "4 pack",
    image: "/src/assets/images/fresh_produce_category_1793455260440.jpg",
    rating: 4.8,
    reviewsCount: 342,
    isOrganic: true,
    isBogo: true,
    isBestSeller: true,
    dietary: ["Organic", "Vegan", "Gluten-Free"],
    description: "Creamy, nutrient-dense organic Hass avocados harvested at peak ripeness. Rich in heart-healthy monounsaturated fats.",
    nutrition: { calories: 160, protein: "2g", carbs: "9g", fat: "15g" }
  },
  {
    id: "p2",
    name: "Artisanal Sourdough Bread",
    category: "Bakery",
    price: 5.49,
    unit: "1 loaf (650g)",
    image: "/src/assets/images/bakery_artisanal_category_1793455260211.jpg",
    rating: 4.9,
    reviewsCount: 512,
    isOrganic: true,
    isBestSeller: true,
    dietary: ["Organic", "Vegan"],
    description: "Naturally fermented for 36 hours with a crisp golden crust and tender, airy crumb. Made with stone-milled organic flour.",
    nutrition: { calories: 180, protein: "7g", carbs: "36g", fat: "1g" }
  },
  {
    id: "p3",
    name: "Fresh Atlantic Salmon Fillet",
    category: "Meat & Seafood",
    price: 14.99,
    originalPrice: 17.99,
    unit: "1 lb",
    image: "/src/assets/images/smart_kitchen_banner_1793455260219.jpg",
    rating: 4.9,
    reviewsCount: 289,
    isBestSeller: true,
    dietary: ["Gluten-Free", "High Protein"],
    description: "Premium sustainably sourced Atlantic salmon rich in Omega-3 fatty acids. Clean flavor and buttery texture.",
    nutrition: { calories: 220, protein: "22g", carbs: "0g", fat: "13g" }
  },
  {
    id: "p4",
    name: "Organic Greek Yogurt",
    category: "Dairy & Eggs",
    price: 4.29,
    unit: "32 oz",
    image: "/src/assets/images/fresh_produce_category_1793455260440.jpg",
    rating: 4.7,
    reviewsCount: 198,
    isOrganic: true,
    dietary: ["Organic", "High Protein", "Gluten-Free"],
    description: "Thick, ultra-creamy whole milk Greek yogurt crafted from pasture-raised grass-fed cow's milk.",
    nutrition: { calories: 130, protein: "18g", carbs: "6g", fat: "4g" }
  },
  {
    id: "p5",
    name: "Crisp Organic Kale Bunch",
    category: "Produce",
    price: 2.99,
    unit: "1 bunch",
    image: "/src/assets/images/fresh_produce_category_1793455260440.jpg",
    rating: 4.6,
    reviewsCount: 145,
    isOrganic: true,
    dietary: ["Organic", "Vegan", "Gluten-Free"],
    description: "Dark leafy green powerhouse loaded with vitamins A, C, and K. Perfect for salads, smoothies, or chips.",
    nutrition: { calories: 33, protein: "3g", carbs: "6g", fat: "0.6g" }
  },
  {
    id: "p6",
    name: "Organic Honeycrisp Apples",
    category: "Produce",
    price: 3.99,
    unit: "2 lb bag",
    image: "/src/assets/images/fresh_produce_category_1793455260440.jpg",
    rating: 4.9,
    reviewsCount: 420,
    isOrganic: true,
    isBogo: true,
    dietary: ["Organic", "Vegan", "Gluten-Free"],
    description: "Exquisitely crisp with an exceptionally juicy, sweet-tart flavor balance. Grown in pristine orchards.",
    nutrition: { calories: 95, protein: "0.5g", carbs: "25g", fat: "0.3g" }
  },
  {
    id: "p7",
    name: "Organic Free-Range Eggs",
    category: "Dairy & Eggs",
    price: 5.99,
    unit: "1 dozen",
    image: "/src/assets/images/fresh_produce_category_1793455260440.jpg",
    rating: 4.8,
    reviewsCount: 310,
    isOrganic: true,
    isBestSeller: true,
    dietary: ["Organic", "Gluten-Free"],
    description: "Grade A large eggs from pasture-raised hens foraging on lush green organic pastures.",
    nutrition: { calories: 70, protein: "6g", carbs: "0.4g", fat: "5g" }
  },
  {
    id: "p8",
    name: "Organic Cold-Pressed Olive Oil",
    category: "Pantry & Snacks",
    price: 12.99,
    originalPrice: 15.49,
    unit: "500 ml",
    image: "/src/assets/images/smart_kitchen_banner_1793455260219.jpg",
    rating: 4.9,
    reviewsCount: 221,
    isOrganic: true,
    dietary: ["Organic", "Vegan", "Gluten-Free", "Keto"],
    description: "Early-harvest extra virgin olive oil with robust fruity notes and a peppery finish. Cold extracted.",
    nutrition: { calories: 119, protein: "0g", carbs: "0g", fat: "14g" }
  },
  {
    id: "p9",
    name: "Almond Milk Unsweetened",
    category: "Beverages",
    price: 3.79,
    unit: "1 quart",
    image: "/src/assets/images/fresh_produce_category_1793455260440.jpg",
    rating: 4.5,
    reviewsCount: 167,
    isOrganic: false,
    dietary: ["Vegan", "Gluten-Free", "Dairy-Free"],
    description: "Smooth, nutty plant-based milk made from real California almonds with zero added sugars.",
    nutrition: { calories: 30, protein: "1g", carbs: "1g", fat: "2.5g" }
  },
  {
    id: "p10",
    name: "Organic Cold Brew Coffee",
    category: "Beverages",
    price: 4.49,
    unit: "32 fl oz",
    image: "/src/assets/images/smart_kitchen_banner_1793455260219.jpg",
    rating: 4.8,
    reviewsCount: 234,
    isOrganic: true,
    isBestSeller: true,
    dietary: ["Organic", "Vegan", "Gluten-Free"],
    description: "Slow-steeped for 18 hours using 100% Arabica single-origin organic beans. Smooth, low acidity.",
    nutrition: { calories: 5, protein: "0g", carbs: "1g", fat: "0g" }
  },
  {
    id: "p11",
    name: "Organic Baby Spinach",
    category: "Produce",
    price: 3.49,
    unit: "10 oz container",
    image: "/src/assets/images/fresh_produce_category_1793455260440.jpg",
    rating: 4.7,
    reviewsCount: 189,
    isOrganic: true,
    dietary: ["Organic", "Vegan", "Gluten-Free"],
    description: "Tender, pre-washed baby spinach leaves packed with iron, folate, and antioxidants.",
    nutrition: { calories: 23, protein: "2.9g", carbs: "3.6g", fat: "0.4g" }
  },
  {
    id: "p12",
    name: "Organic Free-Range Chicken Breast",
    category: "Meat & Seafood",
    price: 9.99,
    unit: "1.2 lb pack",
    image: "/src/assets/images/smart_kitchen_banner_1793455260219.jpg",
    rating: 4.8,
    reviewsCount: 276,
    isOrganic: true,
    isBestSeller: true,
    dietary: ["Organic", "Gluten-Free", "High Protein"],
    description: "Boneless, skinless organic chicken breasts raised without antibiotics or animal byproducts.",
    nutrition: { calories: 165, protein: "31g", carbs: "0g", fat: "3.6g" }
  }
];

const CATEGORIES = [
  "All",
  "Produce",
  "Bakery",
  "Dairy & Eggs",
  "Meat & Seafood",
  "Pantry & Snacks",
  "Beverages"
];

export default function App() {
  const [activeTab, setActiveTab] = useState<"shop" | "kitchen" | "deals" | "orders">("shop");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDietary, setSelectedDietary] = useState<string>("All");
  const [sortBy, setSortBy] = useState<"popular" | "price-asc" | "price-desc" | "rating">("popular");

  // Cart state
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [promoCode, setPromoCode] = useState("");
  const [discount, setDiscount] = useState(0);
  const [deliveryType, setDeliveryType] = useState<"express" | "scheduled">("express");

  // Favorites
  const [favorites, setFavorites] = useState<string[]>(["p1", "p3"]);

  // Quick View Product Modal
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);

  // AI Recipe Planner State
  const [recipeQuery, setRecipeQuery] = useState("");
  const [isGeneratingRecipe, setIsGeneratingRecipe] = useState(false);
  const [generatedRecipe, setGeneratedRecipe] = useState<RecipeResult | null>(null);

  // AI Assistant Chatbot State
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState<{ role: "user" | "model"; text: string }[]>([
    { role: "model", text: "Hello! I'm FreshBot, your AI grocery shopping and culinary assistant. How can I help you today?" }
  ]);
  const [chatInput, setChatInput] = useState("");
  const [isChatLoading, setIsChatLoading] = useState(false);

  // AI Substitution State
  const [substituteItem, setSubstituteItem] = useState<Product | null>(null);
  const [substitutesList, setSubstitutesList] = useState<{ name: string; reason: string; priceDelta: string }[]>([]);
  const [isLoadingSubstitutes, setIsLoadingSubstitutes] = useState(false);

  // AI Nutrition Analysis State
  const [nutritionData, setNutritionData] = useState<{ healthScore: number; summary: string; strengths: string[]; suggestedSwaps: string[] } | null>(null);
  const [isAnalyzingNutrition, setIsAnalyzingNutrition] = useState(false);

  // Checkout & Orders State
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [checkoutStep, setCheckoutStep] = useState<1 | 2 | 3>(1);
  const [deliveryAddress, setDeliveryAddress] = useState("742 Evergreen Terrace, Springfield");
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [orders, setOrders] = useState<Order[]>([]);
  const [orderSuccess, setOrderSuccess] = useState<Order | null>(null);

  // FreshPoints loyalty
  const loyaltyPoints = cart.reduce((acc, item) => acc + Math.floor(item.price * item.quantity * 10), 120);

  // Filter & Sort Products
  const filteredProducts = INITIAL_PRODUCTS.filter((product) => {
    const matchesCategory = selectedCategory === "All" || product.category === selectedCategory;
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          product.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDietary = selectedDietary === "All" || product.dietary.includes(selectedDietary);
    return matchesCategory && matchesSearch && matchesDietary;
  }).sort((a, b) => {
    if (sortBy === "price-asc") return a.price - b.price;
    if (sortBy === "price-desc") return b.price - a.price;
    if (sortBy === "rating") return b.rating - a.rating;
    return b.reviewsCount - a.reviewsCount;
  });

  // Cart operations
  const addToCart = (product: Product, e?: React.MouseEvent) => {
    e?.stopPropagation();
    setCart((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const updateQuantity = (id: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.id === id) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[]
    );
  };

  const removeFromCart = (id: string) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  const toggleFavorite = (id: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((fav) => fav !== id) : [...prev, id]
    );
  };

  const cartTotalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const cartSubtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const deliveryFee = deliveryType === "express" ? 4.99 : 1.99;
  const tax = cartSubtotal * 0.08;
  const finalTotal = Math.max(0, cartSubtotal + (cartSubtotal > 50 ? 0 : deliveryFee) - discount + tax);

  const applyPromo = () => {
    if (promoCode.toUpperCase() === "FRESH10") {
      setDiscount(cartSubtotal * 0.1);
    } else if (promoCode.toUpperCase() === "ORGANIC20") {
      setDiscount(5.00);
    } else {
      alert("Invalid promo code. Try FRESH10 or ORGANIC20");
    }
  };

  // AI Recipe Generator handler
  const handleGenerateRecipe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!recipeQuery.trim()) return;

    setIsGeneratingRecipe(true);
    setGeneratedRecipe(null);
    try {
      const res = await fetch("/api/ai/recipe-to-cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ recipeQuery })
      });
      const data = await res.json();
      if (res.ok) {
        setGeneratedRecipe(data);
      } else {
        alert(data.error || "Failed to generate recipe");
      }
    } catch (err) {
      console.error(err);
      alert("Error connecting to AI recipe generator");
    } finally {
      setIsGeneratingRecipe(false);
    }
  };

  const addRecipeIngredientsToCart = () => {
    if (!generatedRecipe) return;
    generatedRecipe.ingredients.forEach((ing) => {
      // Find matching product or create temporary
      const matched = INITIAL_PRODUCTS.find((p) => p.name.toLowerCase().includes(ing.name.toLowerCase().split(" ")[0]));
      if (matched) {
        addToCart(matched);
      } else {
        // Add custom item
        const newItem: Product = {
          id: `custom-${Date.now()}-${Math.random()}`,
          name: ing.name,
          category: ing.category || "Produce",
          price: ing.estimatedPrice || 3.99,
          unit: ing.quantity || "1 unit",
          image: "/src/assets/images/fresh_produce_category_1793455260440.jpg",
          rating: 5.0,
          reviewsCount: 1,
          dietary: ["Organic"],
          description: `Custom ingredient for ${generatedRecipe.recipeName}`,
          nutrition: { calories: 100, protein: "3g", carbs: "10g", fat: "2g" }
        };
        addToCart(newItem);
      }
    });
    setIsCartOpen(true);
  };

  // Chatbot handler
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim() || isChatLoading) return;

    const userText = chatInput;
    setChatInput("");
    setChatMessages((prev) => [...prev, { role: "user", text: userText }]);
    setIsChatLoading(true);

    try {
      const res = await fetch("/api/ai/smart-assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: userText,
          cartItems: cart,
          history: chatMessages
        })
      });
      const data = await res.json();
      if (res.ok) {
        setChatMessages((prev) => [...prev, { role: "model", text: data.reply }]);
      } else {
        setChatMessages((prev) => [...prev, { role: "model", text: "Sorry, I encountered an error connecting to FreshBot." }]);
      }
    } catch (err) {
      console.error(err);
      setChatMessages((prev) => [...prev, { role: "model", text: "Network error connecting to AI assistant." }]);
    } finally {
      setIsChatLoading(false);
    }
  };

  // Substitution handler
  const handleFindSubstitutes = async (product: Product) => {
    setSubstituteItem(product);
    setIsLoadingSubstitutes(true);
    setSubstitutesList([]);
    try {
      const res = await fetch("/api/ai/substitute", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ itemName: product.name, dietaryPreference: selectedDietary })
      });
      const data = await res.json();
      if (res.ok) {
        setSubstitutesList(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoadingSubstitutes(false);
    }
  };

  // Nutrition Analysis handler
  const handleAnalyzeNutrition = async () => {
    if (cart.length === 0) return;
    setIsAnalyzingNutrition(true);
    try {
      const res = await fetch("/api/ai/nutrition-analysis", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items: cart })
      });
      const data = await res.json();
      if (res.ok) {
        setNutritionData(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsAnalyzingNutrition(false);
    }
  };

  // Checkout Completion
  const handleCompleteCheckout = (e: React.FormEvent) => {
    e.preventDefault();
    const newOrder: Order = {
      id: `FM-${Math.floor(100000 + Math.random() * 900000)}`,
      date: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" }),
      items: [...cart],
      total: finalTotal,
      status: "Preparing",
      address: deliveryAddress,
      estimatedDelivery: deliveryType === "express" ? "30 mins" : "Today, 4:00 PM - 5:00 PM"
    };
    setOrders((prev) => [newOrder, ...prev]);
    setOrderSuccess(newOrder);
    setCart([]);
    setIsCheckoutOpen(false);
    setCheckoutStep(1);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-emerald-500 selection:text-white">
      {/* Top Announcement Bar */}
      <div className="bg-emerald-900 text-emerald-100 text-xs py-2 px-4 text-center font-medium flex items-center justify-center gap-2">
        <Sparkles className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
        <span>Free Express Delivery on orders over $50 · Use code <strong className="text-white underline">FRESH10</strong> for 10% off</span>
      </div>

      {/* Top Bar Contract (Brand - Nav Links - Primary Action) */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 px-6 py-4 flex items-center justify-between gap-8">
        {/* Zone 1: Brand wordmark */}
        <div className="flex items-center gap-3 shrink-0 cursor-pointer" onClick={() => setActiveTab("shop")}>
          <div className="w-10 h-10 rounded-xl bg-emerald-600 flex items-center justify-center text-white shadow-md shadow-emerald-600/20">
            <LeafIcon className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-lg font-bold tracking-tight text-slate-900 whitespace-nowrap">FreshMart</h1>
            <p className="text-[10px] text-slate-500 font-medium tracking-wider uppercase">Organic & Smart Groceries</p>
          </div>
        </div>

        {/* Zone 2: 4-5 Navigation Links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600">
          <button
            onClick={() => setActiveTab("shop")}
            className={`transition-colors whitespace-nowrap shrink-0 pb-1 border-b-2 ${activeTab === "shop" ? "border-emerald-600 text-emerald-700 font-semibold" : "border-transparent hover:text-slate-900"}`}
          >
            Store Catalog
          </button>
          <button
            onClick={() => setActiveTab("kitchen")}
            className={`transition-colors whitespace-nowrap shrink-0 pb-1 border-b-2 flex items-center gap-1.5 ${activeTab === "kitchen" ? "border-emerald-600 text-emerald-700 font-semibold" : "border-transparent hover:text-slate-900"}`}
          >
            <ChefHat className="w-4 h-4 text-emerald-600" />
            AI Kitchen & Meal Planner
          </button>
          <button
            onClick={() => setActiveTab("deals")}
            className={`transition-colors whitespace-nowrap shrink-0 pb-1 border-b-2 flex items-center gap-1.5 ${activeTab === "deals" ? "border-emerald-600 text-emerald-700 font-semibold" : "border-transparent hover:text-slate-900"}`}
          >
            <Flame className="w-4 h-4 text-amber-500" />
            Deals & Savings
          </button>
          <button
            onClick={() => setActiveTab("orders")}
            className={`transition-colors whitespace-nowrap shrink-0 pb-1 border-b-2 flex items-center gap-1.5 ${activeTab === "orders" ? "border-emerald-600 text-emerald-700 font-semibold" : "border-transparent hover:text-slate-900"}`}
          >
            <Truck className="w-4 h-4 text-blue-600" />
            Orders & Tracking ({orders.length})
          </button>
        </nav>

        {/* Zone 3: Primary Action & Utilities */}
        <div className="flex items-center gap-3 shrink-0">
          {/* FreshPoints loyalty badge */}
          <div className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 border border-emerald-200 rounded-full text-xs font-semibold text-emerald-800">
            <Award className="w-3.5 h-3.5 text-emerald-600" />
            <span>{loyaltyPoints} FreshPoints</span>
          </div>

          {/* AI Assistant Chat Trigger */}
          <button
            onClick={() => setIsChatOpen(true)}
            className="p-2.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-100 transition-colors relative flex items-center gap-2 text-xs font-medium"
            title="AI Shopping Assistant"
          >
            <Sparkles className="w-4 h-4 text-emerald-600" />
            <span className="hidden sm:inline">FreshBot</span>
          </button>

          {/* Cart Drawer Trigger */}
          <button
            onClick={() => setIsCartOpen(true)}
            className="flex items-center gap-2.5 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-medium transition-colors shadow-sm shadow-emerald-600/30 whitespace-nowrap"
          >
            <ShoppingCart className="w-4 h-4" />
            <span>${cartSubtotal.toFixed(2)}</span>
            {cartTotalItems > 0 && (
              <span className="w-5 h-5 rounded-full bg-white text-emerald-700 text-xs font-bold flex items-center justify-center">
                {cartTotalItems}
              </span>
            )}
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {activeTab === "shop" && (
          <div className="space-y-8">
            {/* Hero Banner */}
            <div className="relative rounded-3xl overflow-hidden bg-slate-900 text-white shadow-xl">
              <div className="absolute inset-0 z-0">
                <img
                  src="/src/assets/images/supermarket_hero_banner_1793455260683.jpg"
                  alt="Supermarket Produce"
                  className="w-full h-full object-cover opacity-40"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/70 to-transparent" />
              </div>
              <div className="relative z-10 p-8 sm:p-12 md:p-16 max-w-2xl space-y-6">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-xs font-semibold backdrop-blur-md">
                  <ShieldCheck className="w-4 h-4" />
                  <span>100% Certified Organic & Farm Fresh</span>
                </div>
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight leading-tight text-wrap">
                  Fresh Groceries Delivered in 30 Minutes
                </h2>
                <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
                  Hand-picked from local sustainable farms and artisanal bakers, delivered straight to your doorstep with zero compromise on freshness.
                </p>
                <div className="flex flex-wrap items-center gap-4 pt-2">
                  <button
                    onClick={() => {
                      const el = document.getElementById("catalog-section");
                      el?.scrollIntoView({ behavior: "smooth" });
                    }}
                    className="px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-xl shadow-lg shadow-emerald-600/30 transition-all flex items-center gap-2"
                  >
                    <span>Start Shopping</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setActiveTab("kitchen")}
                    className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-xl backdrop-blur-md border border-white/20 transition-all flex items-center gap-2"
                  >
                    <ChefHat className="w-4 h-4 text-emerald-400" />
                    <span>AI Meal Planner</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Catalog Section */}
            <div id="catalog-section" className="space-y-6 pt-4">
              {/* Search & Filters Header */}
              <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
                {/* Search Input */}
                <div className="relative flex-1">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search organic produce, artisanal bakery, salmon..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-800 placeholder:text-slate-400"
                  />
                  {searchQuery && (
                    <button onClick={() => setSearchQuery("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>

                {/* Filters & Sorting */}
                <div className="flex flex-wrap items-center gap-3">
                  {/* Dietary Filter */}
                  <select
                    value={selectedDietary}
                    onChange={(e) => setSelectedDietary(e.target.value)}
                    className="px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="All">All Dietary</option>
                    <option value="Organic">Organic Only</option>
                    <option value="Vegan">Vegan</option>
                    <option value="Gluten-Free">Gluten-Free</option>
                    <option value="High Protein">High Protein</option>
                  </select>

                  {/* Sort By */}
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as any)}
                    className="px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="popular">Most Popular</option>
                    <option value="price-asc">Price: Low to High</option>
                    <option value="price-desc">Price: High to Low</option>
                    <option value="rating">Highest Rated</option>
                  </select>
                </div>
              </div>

              {/* Categories Tabs */}
              <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${selectedCategory === cat ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/20" : "bg-white border border-slate-200 text-slate-600 hover:border-slate-300"}`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* Products Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {filteredProducts.map((product) => {
                  const isFav = favorites.includes(product.id);
                  return (
                    <div
                      key={product.id}
                      onClick={() => setQuickViewProduct(product)}
                      className="group bg-white rounded-2xl border border-slate-200 overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col cursor-pointer relative"
                    >
                      {/* Product Image & Badges */}
                      <div className="relative aspect-square bg-slate-100 overflow-hidden">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          referrerPolicy="no-referrer"
                        />
                        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
                          {product.isOrganic && (
                            <span className="px-2.5 py-1 rounded-full bg-emerald-600 text-white text-[10px] font-bold tracking-wider uppercase shadow-sm">
                              Organic
                            </span>
                          )}
                          {product.isBogo && (
                            <span className="px-2.5 py-1 rounded-full bg-amber-500 text-white text-[10px] font-bold tracking-wider uppercase shadow-sm">
                              BOGO Free
                            </span>
                          )}
                        </div>
                        <button
                          onClick={(e) => toggleFavorite(product.id, e)}
                          className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-md transition-colors ${isFav ? "bg-rose-500 text-white" : "bg-white/80 text-slate-600 hover:bg-white"}`}
                          title="Save to favorites"
                        >
                          <Heart className={`w-4 h-4 ${isFav ? "fill-current" : ""}`} />
                        </button>
                      </div>

                      {/* Product Content */}
                      <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                        <div>
                          <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
                            <span>{product.category}</span>
                            <div className="flex items-center gap-1">
                              <Star className="w-3 h-3 text-amber-400 fill-current" />
                              <span className="font-medium text-slate-700">{product.rating}</span>
                              <span className="text-slate-400">({product.reviewsCount})</span>
                            </div>
                          </div>
                          <h3 className="font-semibold text-slate-900 group-hover:text-emerald-700 transition-colors line-clamp-1">
                            {product.name}
                          </h3>
                          <p className="text-xs text-slate-500 mt-0.5">{product.unit}</p>
                        </div>

                        {/* Price & Add to Cart */}
                        <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                          <div>
                            <div className="flex items-baseline gap-1.5">
                              <span className="text-lg font-bold text-slate-900">${product.price.toFixed(2)}</span>
                              {product.originalPrice && (
                                <span className="text-xs text-slate-400 line-through">${product.originalPrice.toFixed(2)}</span>
                              )}
                            </div>
                          </div>
                          <button
                            onClick={(e) => addToCart(product, e)}
                            className="p-2.5 rounded-xl bg-emerald-50 hover:bg-emerald-600 text-emerald-700 hover:text-white transition-colors shadow-sm flex items-center justify-center"
                            title="Add to Cart"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {filteredProducts.length === 0 && (
                <div className="text-center py-16 bg-white rounded-3xl border border-slate-200">
                  <p className="text-slate-500 text-base">No products found matching your search or filters.</p>
                  <button
                    onClick={() => { setSearchQuery(""); setSelectedCategory("All"); setSelectedDietary("All"); }}
                    className="mt-4 px-4 py-2 bg-emerald-600 text-white rounded-xl text-sm font-medium"
                  >
                    Reset Filters
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === "kitchen" && (
          <div className="space-y-8 max-w-4xl mx-auto">
            {/* AI Kitchen Header */}
            <div className="bg-gradient-to-r from-emerald-900 to-slate-900 text-white rounded-3xl p-8 sm:p-12 shadow-xl relative overflow-hidden">
              <div className="absolute right-0 bottom-0 opacity-20 transform translate-x-10 translate-y-10">
                <ChefHat className="w-64 h-64 text-emerald-400" />
              </div>
              <div className="relative z-10 space-y-4 max-w-xl">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-xs font-semibold backdrop-blur-md">
                  <Sparkles className="w-4 h-4" />
                  <span>Powered by Gemini AI</span>
                </div>
                <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">AI Smart Kitchen & Meal Planner</h2>
                <p className="text-slate-300 text-sm leading-relaxed">
                  Enter any dish name or cuisine (e.g. "Creamy Tuscan Garlic Salmon", "Vegan Avocado Buddha Bowl", "Gluten-Free Chocolate Cake"). Our AI will generate the recipe and instantly add all missing ingredients to your shopping cart!
                </p>
                <form onSubmit={handleGenerateRecipe} className="flex gap-2 pt-2">
                  <input
                    type="text"
                    placeholder="What would you like to cook today?"
                    value={recipeQuery}
                    onChange={(e) => setRecipeQuery(e.target.value)}
                    className="flex-1 px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder:text-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400 backdrop-blur-md"
                  />
                  <button
                    type="submit"
                    disabled={isGeneratingRecipe}
                    className="px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-xl shadow-lg transition-all flex items-center gap-2 shrink-0 disabled:opacity-50"
                  >
                    {isGeneratingRecipe ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        <span>Crafting...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4" />
                        <span>Generate Recipe</span>
                      </>
                    )}
                  </button>
                </form>
              </div>
            </div>

            {/* Generated Recipe Result */}
            {generatedRecipe && (
              <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-xl space-y-8 animate-fadeIn">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-6">
                  <div>
                    <h3 className="text-2xl font-bold text-slate-900">{generatedRecipe.recipeName}</h3>
                    <p className="text-sm text-slate-600 mt-1">{generatedRecipe.description}</p>
                  </div>
                  <div className="flex items-center gap-4 text-xs font-semibold text-slate-700 bg-slate-50 px-4 py-2.5 rounded-xl border border-slate-200">
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4 text-emerald-600" />
                      <span>{generatedRecipe.prepTime}</span>
                    </div>
                    <span>·</span>
                    <div>Servings: {generatedRecipe.servings}</div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Ingredients List */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="font-bold text-slate-900 flex items-center gap-2">
                        <ShoppingCart className="w-4 h-4 text-emerald-600" />
                        <span>Ingredients Required</span>
                      </h4>
                      <button
                        onClick={addRecipeIngredientsToCart}
                        className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-xl transition-colors shadow-sm"
                      >
                        Add All to Cart
                      </button>
                    </div>
                    <ul className="space-y-2.5">
                      {generatedRecipe.ingredients.map((ing, idx) => (
                        <li key={idx} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-200 text-sm">
                          <div>
                            <span className="font-medium text-slate-900">{ing.name}</span>
                            <span className="text-xs text-slate-500 block">{ing.quantity}</span>
                          </div>
                          <span className="font-semibold text-emerald-700">${ing.estimatedPrice.toFixed(2)}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Instructions */}
                  <div className="space-y-4">
                    <h4 className="font-bold text-slate-900 flex items-center gap-2">
                      <ChefHat className="w-4 h-4 text-emerald-600" />
                      <span>Step-by-Step Instructions</span>
                    </h4>
                    <ol className="space-y-3">
                      {generatedRecipe.instructions.map((step, idx) => (
                        <li key={idx} className="flex gap-3 text-sm text-slate-700 bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                          <span className="w-6 h-6 rounded-full bg-emerald-600 text-white text-xs font-bold flex items-center justify-center shrink-0">
                            {idx + 1}
                          </span>
                          <span className="leading-relaxed">{step}</span>
                        </li>
                      ))}
                    </ol>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === "deals" && (
          <div className="space-y-8">
            <div className="bg-gradient-to-r from-amber-500 to-orange-600 text-white rounded-3xl p-8 sm:p-12 shadow-xl">
              <div className="max-w-xl space-y-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 text-white text-xs font-semibold backdrop-blur-md">
                  <Flame className="w-4 h-4 text-amber-200" />
                  <span>Weekly Circular & Special Discounts</span>
                </div>
                <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">Super Saver Deals & BOGO Offers</h2>
                <p className="text-amber-100 text-sm leading-relaxed">
                  Save big on organic produce, pasture-raised meats, and artisanal bakery items this week. Earn double FreshPoints on all clearance items.
                </p>
              </div>
            </div>

            {/* Deals Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {INITIAL_PRODUCTS.filter((p) => p.isBogo || p.originalPrice).map((product) => (
                <div key={product.id} className="bg-white rounded-2xl border border-slate-200 overflow-hidden hover:shadow-xl transition-all flex flex-col">
                  <div className="relative aspect-square bg-slate-100">
                    <img src={product.image} alt={product.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                    <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-amber-500 text-white text-[10px] font-bold uppercase shadow-sm">
                      Special Deal
                    </span>
                  </div>
                  <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                    <div>
                      <h3 className="font-semibold text-slate-900">{product.name}</h3>
                      <p className="text-xs text-slate-500">{product.unit}</p>
                    </div>
                    <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                      <div className="flex items-baseline gap-2">
                        <span className="text-lg font-bold text-slate-900">${product.price.toFixed(2)}</span>
                        {product.originalPrice && (
                          <span className="text-xs text-slate-400 line-through">${product.originalPrice.toFixed(2)}</span>
                        )}
                      </div>
                      <button
                        onClick={(e) => addToCart(product, e)}
                        className="p-2.5 rounded-xl bg-emerald-600 text-white hover:bg-emerald-700 transition-colors shadow-sm"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "orders" && (
          <div className="space-y-8 max-w-3xl mx-auto">
            <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm space-y-6">
              <div className="flex items-center justify-between border-b border-slate-100 pb-6">
                <div>
                  <h2 className="text-2xl font-bold text-slate-900">Your Orders & Live Tracking</h2>
                  <p className="text-sm text-slate-500 mt-1">Track active deliveries and view past grocery orders</p>
                </div>
                <div className="px-4 py-2 bg-emerald-50 text-emerald-800 rounded-xl font-semibold text-sm">
                  {orders.length} Total Orders
                </div>
              </div>

              {orders.length === 0 ? (
                <div className="text-center py-12 space-y-4">
                  <Truck className="w-12 h-12 text-slate-300 mx-auto" />
                  <p className="text-slate-500">No active or past orders found.</p>
                  <button
                    onClick={() => setActiveTab("shop")}
                    className="px-6 py-2.5 bg-emerald-600 text-white rounded-xl text-sm font-semibold shadow-sm"
                  >
                    Start Shopping Now
                  </button>
                </div>
              ) : (
                <div className="space-y-6">
                  {orders.map((order) => (
                    <div key={order.id} className="border border-slate-200 rounded-2xl p-6 space-y-4 bg-slate-50/50">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div>
                          <div className="flex items-center gap-3">
                            <span className="font-bold text-slate-900 text-lg">{order.id}</span>
                            <span className="px-2.5 py-1 rounded-full bg-amber-100 text-amber-800 text-xs font-semibold">
                              {order.status}
                            </span>
                          </div>
                          <p className="text-xs text-slate-500 mt-0.5">Placed on {order.date}</p>
                        </div>
                        <div className="text-right">
                          <span className="text-lg font-bold text-slate-900">${order.total.toFixed(2)}</span>
                          <p className="text-xs text-slate-500">Estimated Delivery: {order.estimatedDelivery}</p>
                        </div>
                      </div>

                      {/* Timeline simulation */}
                      <div className="py-3 border-y border-slate-200 flex items-center justify-between text-xs font-medium text-slate-600">
                        <div className="flex items-center gap-2 text-emerald-700">
                          <CheckCircle2 className="w-4 h-4" />
                          <span>Order Received</span>
                        </div>
                        <div className="flex items-center gap-2 text-emerald-700">
                          <CheckCircle2 className="w-4 h-4" />
                          <span>Packing Items</span>
                        </div>
                        <div className="flex items-center gap-2 text-blue-600 font-bold animate-pulse">
                          <Truck className="w-4 h-4" />
                          <span>Out for Delivery</span>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <p className="text-xs font-semibold text-slate-700 uppercase tracking-wider">Items in Order ({order.items.length})</p>
                        <div className="flex flex-wrap gap-2">
                          {order.items.map((item, idx) => (
                            <span key={idx} className="px-3 py-1 bg-white border border-slate-200 rounded-xl text-xs text-slate-700">
                              {item.name} (x{item.quantity})
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </main>

      {/* Quick View Product Modal */}
      {quickViewProduct && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl animate-fadeIn relative">
            <button
              onClick={() => { setQuickViewProduct(null); setSubstitutesList([]); }}
              className="absolute top-4 right-4 p-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors z-10"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="grid grid-cols-1 md:grid-cols-2">
              <div className="aspect-square bg-slate-100 relative">
                <img
                  src={quickViewProduct.image}
                  alt={quickViewProduct.name}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="p-6 sm:p-8 flex flex-col justify-between space-y-6">
                <div className="space-y-4">
                  <div>
                    <span className="text-xs font-semibold text-emerald-700 tracking-wider uppercase">{quickViewProduct.category}</span>
                    <h3 className="text-2xl font-bold text-slate-900 mt-1">{quickViewProduct.name}</h3>
                    <p className="text-xs text-slate-500 mt-0.5">{quickViewProduct.unit}</p>
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-bold text-slate-900">${quickViewProduct.price.toFixed(2)}</span>
                    {quickViewProduct.originalPrice && (
                      <span className="text-sm text-slate-400 line-through">${quickViewProduct.originalPrice.toFixed(2)}</span>
                    )}
                  </div>
                  <p className="text-sm text-slate-600 leading-relaxed">{quickViewProduct.description}</p>

                  {/* Dietary Badges */}
                  <div className="flex flex-wrap gap-1.5 pt-2">
                    {quickViewProduct.dietary.map((tag, idx) => (
                      <span key={idx} className="px-2.5 py-1 bg-emerald-50 text-emerald-800 rounded-full text-xs font-semibold">
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Nutrition info */}
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 grid grid-cols-4 gap-2 text-center text-xs">
                    <div>
                      <span className="text-slate-400 block">Cal</span>
                      <strong className="text-slate-800">{quickViewProduct.nutrition.calories}</strong>
                    </div>
                    <div>
                      <span className="text-slate-400 block">Protein</span>
                      <strong className="text-slate-800">{quickViewProduct.nutrition.protein}</strong>
                    </div>
                    <div>
                      <span className="text-slate-400 block">Carbs</span>
                      <strong className="text-slate-800">{quickViewProduct.nutrition.carbs}</strong>
                    </div>
                    <div>
                      <span className="text-slate-400 block">Fat</span>
                      <strong className="text-slate-800">{quickViewProduct.nutrition.fat}</strong>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <button
                    onClick={() => {
                      addToCart(quickViewProduct);
                      setQuickViewProduct(null);
                      setIsCartOpen(true);
                    }}
                    className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl shadow-lg shadow-emerald-600/30 transition-all flex items-center justify-center gap-2"
                  >
                    <ShoppingCart className="w-4 h-4" />
                    <span>Add to Cart - ${quickViewProduct.price.toFixed(2)}</span>
                  </button>

                  <button
                    onClick={() => handleFindSubstitutes(quickViewProduct)}
                    className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl text-xs transition-colors flex items-center justify-center gap-2"
                  >
                    <Sparkles className="w-4 h-4 text-emerald-600" />
                    <span>AI Smart Substitution Finder</span>
                  </button>

                  {/* Substitutes List if generated */}
                  {substitutesList.length > 0 && (
                    <div className="space-y-2 pt-2 border-t border-slate-200">
                      <p className="text-xs font-bold text-slate-800">AI Recommended Alternatives:</p>
                      {substitutesList.map((sub, idx) => (
                        <div key={idx} className="p-2 bg-emerald-50/50 rounded-xl border border-emerald-200 text-xs flex justify-between items-center">
                          <div>
                            <strong className="text-slate-900">{sub.name}</strong>
                            <p className="text-slate-500">{sub.reason}</p>
                          </div>
                          <span className="font-semibold text-emerald-700">{sub.priceDelta}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Cart Drawer */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex justify-end">
          <div className="bg-white w-full max-w-md h-full flex flex-col shadow-2xl animate-slideLeft">
            <div className="p-6 border-b border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <ShoppingCart className="w-5 h-5 text-emerald-600" />
                <h3 className="font-bold text-lg text-slate-900">Your Shopping Cart ({cartTotalItems})</h3>
              </div>
              <button onClick={() => setIsCartOpen(false)} className="p-2 rounded-full hover:bg-slate-100 text-slate-500">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {cart.length === 0 ? (
                <div className="text-center py-16 space-y-4">
                  <ShoppingCart className="w-12 h-12 text-slate-300 mx-auto" />
                  <p className="text-slate-500 text-sm">Your cart is currently empty.</p>
                  <button
                    onClick={() => setIsCartOpen(false)}
                    className="px-6 py-2.5 bg-emerald-600 text-white rounded-xl text-sm font-semibold"
                  >
                    Browse Products
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  {cart.map((item) => (
                    <div key={item.id} className="flex items-center justify-between gap-3 p-3 bg-slate-50 rounded-2xl border border-slate-200">
                      <img src={item.image} alt={item.name} className="w-14 h-14 object-cover rounded-xl shrink-0" referrerPolicy="no-referrer" />
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-sm text-slate-900 truncate">{item.name}</h4>
                        <p className="text-xs text-slate-500">${item.price.toFixed(2)} / {item.unit}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <button onClick={() => updateQuantity(item.id, -1)} className="p-1.5 rounded-lg bg-white border border-slate-200 text-slate-700 hover:bg-slate-100">
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="text-sm font-bold text-slate-800 w-5 text-center">{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.id, 1)} className="p-1.5 rounded-lg bg-white border border-slate-200 text-slate-700 hover:bg-slate-100">
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                        <button onClick={() => removeFromCart(item.id)} className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50 ml-1">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Cart Footer */}
            {cart.length > 0 && (
              <div className="p-6 border-t border-slate-200 bg-slate-50 space-y-4">
                {/* Promo Code Input */}
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Promo Code (FRESH10)"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                    className="flex-1 px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs uppercase placeholder:normal-case font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                  <button onClick={applyPromo} className="px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-semibold hover:bg-slate-800">
                    Apply
                  </button>
                </div>

                {/* AI Nutrition Health Check Trigger */}
                <button
                  onClick={handleAnalyzeNutrition}
                  disabled={isAnalyzingNutrition}
                  className="w-full py-2.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 rounded-xl text-xs font-semibold border border-emerald-200 transition-colors flex items-center justify-center gap-2"
                >
                  <HeartPulse className="w-4 h-4 text-emerald-600" />
                  <span>{isAnalyzingNutrition ? "Analyzing Health Score..." : "AI Cart Health & Nutrition Score"}</span>
                </button>

                {nutritionData && (
                  <div className="p-3 bg-white rounded-xl border border-emerald-200 text-xs space-y-1.5 animate-fadeIn">
                    <div className="flex justify-between font-bold text-slate-900">
                      <span>Health Score:</span>
                      <span className="text-emerald-700">{nutritionData.healthScore}/100</span>
                    </div>
                    <p className="text-slate-600">{nutritionData.summary}</p>
                  </div>
                )}

                <div className="space-y-1.5 text-sm">
                  <div className="flex justify-between text-slate-600">
                    <span>Subtotal</span>
                    <span>${cartSubtotal.toFixed(2)}</span>
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between text-emerald-700 font-medium">
                      <span>Discount</span>
                      <span>-${discount.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-slate-600">
                    <span>Delivery Fee</span>
                    <span>{cartSubtotal > 50 ? "FREE" : `$${deliveryFee.toFixed(2)}`}</span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>Estimated Tax</span>
                    <span>${tax.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-lg font-bold text-slate-900 pt-2 border-t border-slate-200">
                    <span>Total</span>
                    <span>${finalTotal.toFixed(2)}</span>
                  </div>
                </div>

                <button
                  onClick={() => {
                    setIsCartOpen(false);
                    setIsCheckoutOpen(true);
                  }}
                  className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl shadow-lg shadow-emerald-600/30 transition-all flex items-center justify-center gap-2"
                >
                  <span>Proceed to Checkout</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Checkout Modal */}
      {isCheckoutOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full p-8 shadow-2xl space-y-6 animate-fadeIn relative">
            <button onClick={() => setIsCheckoutOpen(false)} className="absolute top-4 right-4 p-2 rounded-full hover:bg-slate-100 text-slate-500">
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-2xl font-bold text-slate-900">Checkout & Delivery</h3>

            <form onSubmit={handleCompleteCheckout} className="space-y-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Delivery Address</label>
                  <div className="relative">
                    <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="text"
                      value={deliveryAddress}
                      onChange={(e) => setDeliveryAddress(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Delivery Slot</label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setDeliveryType("express")}
                      className={`p-3 rounded-xl border text-left text-xs font-medium transition-all ${deliveryType === "express" ? "border-emerald-600 bg-emerald-50/50 text-emerald-900" : "border-slate-200 text-slate-600"}`}
                    >
                      <strong>Express (30 Mins)</strong>
                      <span className="block text-[10px] text-slate-500 mt-0.5">+$4.99 priority fee</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setDeliveryType("scheduled")}
                      className={`p-3 rounded-xl border text-left text-xs font-medium transition-all ${deliveryType === "scheduled" ? "border-emerald-600 bg-emerald-50/50 text-emerald-900" : "border-slate-200 text-slate-600"}`}
                    >
                      <strong>Scheduled Slot</strong>
                      <span className="block text-[10px] text-slate-500 mt-0.5">Today 4:00 PM - 5:00 PM ($1.99)</span>
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Payment Method</label>
                  <select
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="card">Credit / Debit Card (•••• 4242)</option>
                    <option value="apple">Apple Pay</option>
                    <option value="cod">Cash on Delivery</option>
                  </select>
                </div>
              </div>

              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between">
                <div>
                  <span className="text-xs text-slate-500">Total Amount to Pay</span>
                  <strong className="text-xl font-bold text-slate-900 block">${finalTotal.toFixed(2)}</strong>
                </div>
                <button
                  type="submit"
                  className="px-6 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl shadow-lg shadow-emerald-600/30 transition-all"
                >
                  Place Order Now
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Order Success Popup */}
      {orderSuccess && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-8 text-center space-y-6 shadow-2xl animate-fadeIn">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-inner">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-slate-900">Order Placed Successfully!</h3>
              <p className="text-sm text-slate-600 mt-1">Order ID: <strong className="text-slate-800">{orderSuccess.id}</strong></p>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">
              Your fresh groceries are being carefully packed and will arrive in approximately <strong className="text-slate-800">{orderSuccess.estimatedDelivery}</strong>.
            </p>
            <button
              onClick={() => {
                setOrderSuccess(null);
                setActiveTab("orders");
              }}
              className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl shadow-lg transition-all"
            >
              Track Order Status
            </button>
          </div>
        </div>
      )}

      {/* FreshBot AI Assistant Modal / Drawer */}
      {isChatOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/40 backdrop-blur-sm flex items-end sm:items-center justify-end sm:justify-center p-0 sm:p-4">
          <div className="bg-white w-full sm:max-w-lg h-[80vh] sm:h-[600px] rounded-t-3xl sm:rounded-3xl flex flex-col shadow-2xl animate-fadeIn">
            <div className="p-4 sm:p-6 border-b border-slate-200 flex items-center justify-between bg-gradient-to-r from-emerald-900 to-slate-900 text-white rounded-t-3xl sm:rounded-t-3xl">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-emerald-400" />
                </div>
                <div>
                  <h3 className="font-bold text-base">FreshBot AI Assistant</h3>
                  <p className="text-[10px] text-emerald-300">Ask anything about recipes, nutrition, or grocery items</p>
                </div>
              </div>
              <button onClick={() => setIsChatOpen(false)} className="p-2 rounded-full hover:bg-white/10 text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Chat messages */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 bg-slate-50">
              {chatMessages.map((msg, idx) => (
                <div key={idx} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`max-w-[80%] p-4 rounded-2xl text-sm leading-relaxed ${msg.role === "user" ? "bg-emerald-600 text-white rounded-br-none shadow-sm" : "bg-white text-slate-800 rounded-bl-none border border-slate-200 shadow-sm"}`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}
              {isChatLoading && (
                <div className="flex justify-start">
                  <div className="bg-white text-slate-500 p-4 rounded-2xl rounded-bl-none border border-slate-200 text-xs flex items-center gap-2">
                    <RefreshCw className="w-3.5 h-3.5 animate-spin text-emerald-600" />
                    <span>FreshBot is thinking...</span>
                  </div>
                </div>
              )}
            </div>

            {/* Chat Input */}
            <form onSubmit={handleSendMessage} className="p-4 border-t border-slate-200 bg-white flex gap-2 rounded-b-3xl sm:rounded-b-3xl">
              <input
                type="text"
                placeholder="Ask FreshBot for recipe advice or healthy swaps..."
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                className="flex-1 px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
              <button
                type="submit"
                disabled={isChatLoading}
                className="px-5 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl text-sm shadow-md transition-all disabled:opacity-50"
              >
                Send
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

function LeafIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.4 19 2c2 2 2.6 3.5 3.7 9.2a7 7 0 0 1-13.9 8.8z" />
      <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.5 12 13 13 11" />
    </svg>
  );
}
