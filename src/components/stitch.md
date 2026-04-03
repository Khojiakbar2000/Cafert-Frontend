<!DOCTYPE html>

<html class="light" lang="en"><head>
<meta charset="utf-8"/>
<meta content="width=device-width, initial-scale=1.0" name="viewport"/>
<title>Your Selection | The Modern Alchemist</title>
<script src="https://cdn.tailwindcss.com?plugins=forms,container-queries"></script>
<link href="https://fonts.googleapis.com/css2?family=Newsreader:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500&amp;family=Manrope:wght@300;400;500;600;700&amp;display=swap" rel="stylesheet"/>
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet"/>
<script id="tailwind-config">
      tailwind.config = {
        darkMode: "class",
        theme: {
          extend: {
            colors: {
              "on-tertiary-container": "#aca29f",
              "inverse-surface": "#30302f",
              "primary-fixed": "#ffdad2",
              "surface-variant": "#e4e2e0",
              "tertiary": "#292421",
              "primary-fixed-dim": "#e5beb5",
              "on-error": "#ffffff",
              "on-secondary-container": "#4c6c4f",
              "on-error-container": "#93000a",
              "surface-container-low": "#f5f3f1",
              "secondary-fixed": "#c7ecc7",
              "secondary-fixed-dim": "#acd0ac",
              "on-surface-variant": "#504442",
              "on-secondary": "#ffffff",
              "on-surface": "#1b1c1b",
              "secondary": "#466649",
              "background": "#fbf9f7",
              "on-primary-container": "#c19c94",
              "on-tertiary": "#ffffff",
              "tertiary-fixed-dim": "#cfc4c0",
              "surface-tint": "#755750",
              "on-primary": "#ffffff",
              "primary-container": "#4e342e",
              "on-primary-fixed": "#2b1611",
              "outline-variant": "#d4c3bf",
              "inverse-on-surface": "#f2f0ee",
              "tertiary-fixed": "#ece0dc",
              "primary": "#361f1a",
              "on-secondary-fixed-variant": "#2f4e33",
              "error": "#ba1a1a",
              "error-container": "#ffdad6",
              "surface": "#fbf9f7",
              "surface-container-highest": "#e4e2e0",
              "on-primary-fixed-variant": "#5c403a",
              "surface-container-high": "#eae8e6",
              "on-tertiary-fixed-variant": "#4c4542",
              "surface-container": "#efedec",
              "inverse-primary": "#e5beb5",
              "outline": "#827471",
              "on-tertiary-fixed": "#201a18",
              "secondary-container": "#c7ecc7",
              "surface-bright": "#fbf9f7",
              "surface-container-lowest": "#ffffff",
              "tertiary-container": "#403936",
              "on-background": "#1b1c1b",
              "on-secondary-fixed": "#02210a",
              "surface-dim": "#dbdad8"
            },
            fontFamily: {
              "headline": ["Newsreader", "serif"],
              "body": ["Manrope", "sans-serif"],
              "label": ["Manrope", "sans-serif"]
            },
            borderRadius: {"DEFAULT": "0.125rem", "lg": "0.25rem", "xl": "0.5rem", "full": "0.75rem"},
            keyframes: {
              'pop-in': {
                '0%': { transform: 'scale(0.95) translateY(10px)', opacity: '0' },
                '100%': { transform: 'scale(1) translateY(0)', opacity: '1' },
              }
            },
            animation: {
              'pop-in': 'pop-in 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) forwards',
            }
          },
        },
      }
    </script>
<style>
        .material-symbols-outlined {
            font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
        }
        body { font-family: 'Manrope', sans-serif; overflow-x: hidden; }
        h1, h2, h3, .font-serif { font-family: 'Newsreader', serif; }
        .section-divider { background-color: transparent; }
        .ben-day { background-image: radial-gradient(#1A0F0D 10%, transparent 11%); background-size: 10px 10px; background-color: #FFF9F0; opacity: 0.05; position: absolute; inset: 0; pointer-events: none; z-index: 0; }
        .comic-slant { font-family: 'Bungee', cursive; transform: skew(-5deg); display: inline-block; }
        
        /* Parallax Layer Styles */
        .parallax-wrapper { perspective: 1px; height: 100vh; overflow-x: hidden; overflow-y: auto; scroll-behavior: smooth; }
        .parallax-section { position: relative; transform-style: preserve-3d; }
        .parallax-bg { position: absolute; top: 0; right: 0; bottom: 0; left: 0; transform: translateZ(-1px) scale(2); z-index: -1; }
        
        .stagger-1 { animation-delay: 0.1s; opacity: 0; }
        .stagger-2 { animation-delay: 0.2s; opacity: 0; }
        .stagger-3 { animation-delay: 0.3s; opacity: 0; }
        .stagger-4 { animation-delay: 0.4s; opacity: 0; }
    </style>
<link href="https://fonts.googleapis.com/css2?family=Bungee&amp;family=Inter:wght@400;700;900&amp;display=swap" rel="stylesheet"/>
</head>
<body class="bg-background text-on-surface-variant selection:bg-secondary-fixed selection:text-on-secondary-fixed">
<div class="parallax-wrapper">
<!-- TopAppBar -->
<header class="fixed top-0 w-full z-50 bg-[#fbf9f7]/80 dark:bg-[#361f1a]/80 backdrop-blur-xl shadow-sm transition-colors duration-300">
<div class="flex justify-between items-center px-8 py-6 max-w-7xl mx-auto">
<div class="text-2xl font-serif italic text-[#361f1a] dark:text-[#fbf9f7]">The Modern Alchemist</div>
<nav class="hidden md:flex gap-8 items-center">
<a class="font-serif font-medium tracking-tight text-lg text-[#504442] dark:text-[#d4c3bf] hover:text-[#361f1a] dark:hover:text-[#ffffff] hover:opacity-80 transition-opacity duration-200" href="#">Menu</a>
<a class="font-serif font-medium tracking-tight text-lg text-[#504442] dark:text-[#d4c3bf] hover:text-[#361f1a] dark:hover:text-[#ffffff] hover:opacity-80 transition-opacity duration-200" href="#">About</a>
<a class="font-serif font-medium tracking-tight text-lg text-[#504442] dark:text-[#d4c3bf] hover:text-[#361f1a] dark:hover:text-[#ffffff] hover:opacity-80 transition-opacity duration-200" href="#">Locations</a>
</nav>
<div class="flex items-center gap-4">
<button class="text-[#361f1a] dark:text-[#fbf9f7] scale-95 active:scale-100 transition-transform">
<span class="material-symbols-outlined" data-icon="shopping_bag">shopping_bag</span>
</button>
</div>
</div>
</header>
<main class="pt-32 pb-20 px-6 max-w-7xl mx-auto relative z-10">
<div class="grid grid-cols-1 lg:grid-cols-12 gap-16">
<!-- Checkout Content (Left Side) -->
<div class="lg:col-span-7 space-y-12">
<header class="space-y-2 animate-pop-in">
<h1 class="text-5xl font-serif font-medium text-primary tracking-tight">Your Selection</h1>
<p class="text-on-surface-variant font-body">Review your items and choose your fulfillment method.</p>
</header>
<!-- Fulfillment Method Selection -->
<section class="grid grid-cols-1 md:grid-cols-2 gap-4 animate-pop-in stagger-1">
<button class="flex flex-col items-start p-6 bg-surface-container-lowest border-2 border-primary rounded-xl text-left transition-all hover:translate-y-[-2px] hover:shadow-md">
<span class="material-symbols-outlined text-primary mb-3" data-icon="local_shipping">local_shipping</span>
<span class="font-serif text-xl text-primary font-semibold">Shipping</span>
<span class="text-sm opacity-70">Freshly roasted beans to your door</span>
</button>
<button class="flex flex-col items-start p-6 bg-surface-container-low border-2 border-transparent hover:border-outline-variant rounded-xl text-left transition-all hover:translate-y-[-2px] hover:shadow-sm">
<span class="material-symbols-outlined text-on-surface-variant mb-3" data-icon="storefront">storefront</span>
<span class="font-serif text-xl text-primary font-semibold">In-Store Pickup</span>
<span class="text-sm opacity-70">Ready in 15 minutes at Heritage Row</span>
</button>
</section>
<!-- Cart Items Editorial List -->
<section class="space-y-10">
<h3 class="font-serif text-2xl text-primary italic border-b border-outline-variant/20 pb-4 animate-pop-in stagger-2">Selected Items</h3>
<div class="space-y-12">
<!-- Item 1 -->
<div class="flex gap-8 group animate-pop-in stagger-3">
<div class="w-32 h-40 bg-surface-container-high rounded-lg overflow-hidden flex-shrink-0">
<img class="w-full h-full object-cover grayscale-[20%] group-hover:scale-105 transition-transform duration-500" data-alt="Close-up of a premium bag of artisanal coffee beans" src="https://lh3.googleusercontent.com/aida-public/AB6AXuA2VEVNAu-bMx9vmPh7Y9xdsYKMgINPpTrJFn_NAw8EOxU3FaETa1Im8UyYMZj86MX9kfOxqZFjjL-nNmuthWiYJJy1uN3pdKsOGeSkdPogc4x4RhjGzATF34SOzIhE6JyfpBl_W-nrAeXdMRC4j10OjNw2dXC8QvhPe-P4F_U1LVrOefPLmlsp8f1eMK2veDpMVzga9fPsOv06wlWzJ8wthaOIzIXvM5pnJ0WvqO6BFFkq10ciTCCFqEwaO3p75b5xCnMTRSGn2hcg"/>
</div>
<div class="flex-grow flex flex-col justify-between py-1">
<div class="flex justify-between items-start">
<div>
<h4 class="font-serif text-2xl text-primary">Ethiopian Yirgacheffe</h4>
<p class="text-on-surface-variant text-sm mt-1">Light Roast • Floral &amp; Citrus Notes</p>
<div class="mt-2 inline-flex bg-secondary-container text-on-secondary-container px-2 py-0.5 rounded text-xs font-bold uppercase tracking-wider">Organic Certified</div>
</div>
<span class="font-serif text-xl text-primary">$24.00</span>
</div>
<div class="flex items-center justify-between">
<div class="flex items-center bg-surface-container-low rounded-full px-3 py-1 gap-4">
<button class="p-1 hover:text-primary transition-colors"><span class="material-symbols-outlined text-sm" data-icon="remove">remove</span></button>
<span class="font-medium text-primary">1</span>
<button class="p-1 hover:text-primary transition-colors"><span class="material-symbols-outlined text-sm" data-icon="add">add</span></button>
</div>
<button class="text-sm text-outline hover:text-error transition-colors flex items-center gap-1">
<span class="material-symbols-outlined text-lg" data-icon="delete_outline">delete_outline</span>
<span>Remove</span>
</button>
</div>
</div>
</div>
<!-- Item 2 -->
<div class="flex gap-8 group animate-pop-in stagger-4">
<div class="w-32 h-40 bg-surface-container-high rounded-lg overflow-hidden flex-shrink-0">
<img class="w-full h-full object-cover grayscale-[20%] group-hover:scale-105 transition-transform duration-500" data-alt="Handcrafted ceramic coffee mug" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBLcKeVXGmDdzDHMjNmHqGfXqul563jxCmnpU7SJQdG3FGZ26PtHHbQ_ODqG8M7tsqBYkFfZE9SwBDHfL-I0xViR9DKNqcCfFrQFdvhjUAq2z3tOrogOa0bOqcM6Knv-inV1u7Hx4IOZXLc1xNP143oWqQsU50Z7F6blVgxF_mRXgE7kSevMV-tYJtSrdFYadD0usXvZtiqrBc-FDvXVZv2tQ-vpZI-TBmtQOzfJ68vmoR69uV3GnqXcA6Fh67gTT0X8aZZKMOmXp4F"/>
</div>
<div class="flex-grow flex flex-col justify-between py-1">
<div class="flex justify-between items-start">
<div>
<h4 class="font-serif text-2xl text-primary">Alchemist Ceramic Vessel</h4>
<p class="text-on-surface-variant text-sm mt-1">12oz • Hand-thrown Sandstone</p>
</div>
<span class="font-serif text-xl text-primary">$38.00</span>
</div>
<div class="flex items-center justify-between">
<div class="flex items-center bg-surface-container-low rounded-full px-3 py-1 gap-4">
<button class="p-1 hover:text-primary transition-colors"><span class="material-symbols-outlined text-sm" data-icon="remove">remove</span></button>
<span class="font-medium text-primary">2</span>
<button class="p-1 hover:text-primary transition-colors"><span class="material-symbols-outlined text-sm" data-icon="add">add</span></button>
</div>
<button class="text-sm text-outline hover:text-error transition-colors flex items-center gap-1">
<span class="material-symbols-outlined text-lg" data-icon="delete_outline">delete_outline</span>
<span>Remove</span>
</button>
</div>
</div>
</div>
</div>
</section>
</div>
<!-- Summary Sidebar (Right Side) -->
<aside class="lg:col-span-5 relative">
<div class="sticky top-32 p-10 bg-[#FFF9F0] border-4 border-[#1A0F0D] rounded-lg shadow-[8px_8px_0px_#1A0F0D] space-y-10 relative overflow-hidden animate-pop-in stagger-2 transition-transform duration-500">
<div class="ben-day"></div>
<h2 class="font-black uppercase tracking-tighter text-3xl text-[#1A0F0D]">Order Summary</h2>
<div class="space-y-4 relative z-10">
<div class="flex justify-between text-on-surface-variant">
<span class="font-body uppercase tracking-wider text-xs font-bold">Subtotal</span>
<span class="text-lg comic-slant text-[#1A0F0D]">$100.00</span>
</div>
<div class="flex justify-between text-on-surface-variant">
<span class="font-body uppercase tracking-wider text-xs font-bold">Shipping</span>
<span class="text-lg comic-slant text-[#1A0F0D]">$8.50</span>
</div>
<div class="flex justify-between text-on-surface-variant">
<span class="font-body uppercase tracking-wider text-xs font-bold">Estimated Tax</span>
<span class="text-lg comic-slant text-[#1A0F0D]">$6.20</span>
</div>
<div class="pt-6 mt-6 border-t border-outline-variant/30 flex justify-between items-baseline">
<span class="font-black uppercase text-2xl text-[#1A0F0D]">Total</span>
<span class="text-4xl text-primary font-bold comic-slant text-[#1A0F0D]">$114.70</span>
</div>
</div>
<div class="space-y-6 relative z-10">
<button class="w-full bg-[#FF4E00] text-white py-5 rounded-lg border-4 border-[#1A0F0D] shadow-[4px_4px_0px_#1A0F0D] font-black uppercase text-xl tracking-wide hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all">
<span class="flex items-center justify-center gap-2">
<span class="material-symbols-outlined">shopping_cart</span> 
                                    Proceed to Order
                                </span>
</button>
<div class="flex flex-col items-center gap-4 pt-4">
<p class="text-[10px] uppercase tracking-widest font-bold text-outline">Encrypted &amp; Secure</p>
<div class="flex gap-6 opacity-30 grayscale">
<span class="material-symbols-outlined text-3xl" data-icon="credit_card">credit_card</span>
<span class="material-symbols-outlined text-3xl" data-icon="account_balance_wallet">account_balance_wallet</span>
<span class="material-symbols-outlined text-3xl" data-icon="lock">lock</span>
</div>
</div>
</div>
</div>
</aside>
</div>
</main>
<!-- Footer -->
<footer class="w-full rounded-t-[2rem] mt-20 bg-[#f5f3f1] dark:bg-[#1a0f0d] relative z-10">
<div class="flex flex-col md:flex-row justify-between items-start px-12 py-16 gap-12 max-w-7xl mx-auto">
<div class="space-y-4">
<div class="text-xl font-serif text-[#361f1a] dark:text-[#fbf9f7]">The Modern Alchemist</div>
<p class="font-sans text-sm tracking-wide uppercase font-semibold text-[#504442] dark:text-[#d4c3bf]">© 2024 The Modern Alchemist. Crafted with intention.</p>
</div>
<div class="flex flex-wrap gap-x-12 gap-y-6">
<a class="font-sans text-sm tracking-wide uppercase font-semibold text-[#504442] dark:text-[#d4c3bf] hover:underline decoration-[#466649] underline-offset-4 transition-all duration-300 ease-in-out" href="#">Instagram</a>
<a class="font-sans text-sm tracking-wide uppercase font-semibold text-[#504442] dark:text-[#d4c3bf] hover:underline decoration-[#466649] underline-offset-4 transition-all duration-300 ease-in-out" href="#">Privacy</a>
<a class="font-sans text-sm tracking-wide uppercase font-semibold text-[#504442] dark:text-[#d4c3bf] hover:underline decoration-[#466649] underline-offset-4 transition-all duration-300 ease-in-out" href="#">Terms</a>
<a class="font-sans text-sm tracking-wide uppercase font-semibold text-[#504442] dark:text-[#d4c3bf] hover:underline decoration-[#466649] underline-offset-4 transition-all duration-300 ease-in-out" href="#">Shipping</a>
</div>
</div>
</footer>
<!-- Parallax Background Elements -->
<div class="parallax-bg pointer-events-none opacity-[0.03]">
<div class="absolute top-[20%] left-[10%] w-64 h-64 border-[20px] border-primary rounded-full"></div>
<div class="absolute top-[60%] right-[5%] w-96 h-96 border-[40px] border-primary rotate-12"></div>
<div class="absolute top-[80%] left-[20%] w-48 h-48 bg-primary rounded-lg -rotate-6"></div>
</div>
</div>
</body></html>
