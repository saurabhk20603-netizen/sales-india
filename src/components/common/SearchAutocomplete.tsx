import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { CATEGORIES } from '../../data/mockData';
import { Product } from '../../types';
import { 
  Search, 
  X, 
  TrendingUp, 
  Tag, 
  ArrowRight, 
  Sparkles,
  ShoppingBag,
  ExternalLink,
  Camera
} from 'lucide-react';

interface SearchAutocompleteProps {
  isMobile?: boolean;
}

const POPULAR_SEARCHES = [
  'boAt Headphones',
  'Silk Saree Surat',
  'Tata Tea Gold',
  'Smart Watch Calling',
  'Prestige Mixer Grinder',
  'Basmati Rice 5kg',
  'Cotton Kurta'
];

export const SearchAutocomplete: React.FC<SearchAutocompleteProps> = ({ isMobile = false }) => {
  const { 
    products, 
    searchQuery, 
    setSearchQuery, 
    setSelectedProduct, 
    setSelectedCategoryFilter,
    language,
    t,
    openAiPhotoSearch
  } = useApp();

  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState<number>(-1);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Compute suggestions based on current query
  const { suggestedProducts, suggestedCategories, suggestedBrands } = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) {
      return { suggestedProducts: [], suggestedCategories: [], suggestedBrands: [] };
    }

    // Matching products
    const matchedProds = products.filter(p => {
      const titleMatch = p.title.toLowerCase().includes(q) || (p.titleHi && p.titleHi.toLowerCase().includes(q));
      const brandMatch = p.brand.toLowerCase().includes(q);
      const descMatch = p.description.toLowerCase().includes(q);
      const categoryMatch = p.category.toLowerCase().includes(q);
      const sellerMatch = p.sellerName.toLowerCase().includes(q);
      return titleMatch || brandMatch || descMatch || categoryMatch || sellerMatch;
    }).slice(0, 4);

    // Matching categories
    const matchedCats = CATEGORIES.filter(c => 
      c.nameEn.toLowerCase().includes(q) || 
      c.nameHi.toLowerCase().includes(q) ||
      c.id.toLowerCase().includes(q)
    ).slice(0, 3);

    // Unique matching brands
    const allBrands = Array.from(new Set(products.map(p => p.brand)));
    const matchedBrands = allBrands.filter(b => 
      b.toLowerCase().includes(q)
    ).slice(0, 3);

    return {
      suggestedProducts: matchedProds,
      suggestedCategories: matchedCats,
      suggestedBrands: matchedBrands
    };
  }, [products, searchQuery]);

  // Total navigable items count
  const allNavigableItems = useMemo(() => {
    if (!searchQuery.trim()) {
      return POPULAR_SEARCHES.map(item => ({ type: 'popular' as const, value: item }));
    }

    const items: Array<
      | { type: 'brand'; value: string }
      | { type: 'category'; value: typeof CATEGORIES[0] }
      | { type: 'product'; value: Product }
    > = [];

    suggestedBrands.forEach(b => items.push({ type: 'brand', value: b }));
    suggestedCategories.forEach(c => items.push({ type: 'category', value: c }));
    suggestedProducts.forEach(p => items.push({ type: 'product', value: p }));

    return items;
  }, [searchQuery, suggestedBrands, suggestedCategories, suggestedProducts]);

  // Click outside listener
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Handle keyboard events (ArrowUp, ArrowDown, Enter, Escape)
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!isOpen && (e.key === 'ArrowDown' || e.key === 'ArrowUp')) {
      setIsOpen(true);
      return;
    }

    if (e.key === 'Escape') {
      setIsOpen(false);
      inputRef.current?.blur();
      return;
    }

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => (prev + 1 < allNavigableItems.length ? prev + 1 : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => (prev - 1 >= 0 ? prev - 1 : allNavigableItems.length - 1));
    } else if (e.key === 'Enter') {
      if (selectedIndex >= 0 && selectedIndex < allNavigableItems.length) {
        e.preventDefault();
        const selected = allNavigableItems[selectedIndex];
        handleSelectNavigable(selected);
      } else {
        // Normal enter submission: just close dropdown and let catalog filter
        setIsOpen(false);
      }
    }
  };

  const handleSelectNavigable = (item: typeof allNavigableItems[0]) => {
    if (item.type === 'popular' || item.type === 'brand') {
      setSearchQuery(item.value);
    } else if (item.type === 'category') {
      setSelectedCategoryFilter(item.value.id);
      setSearchQuery('');
    } else if (item.type === 'product') {
      setSelectedProduct(item.value);
    }
    setIsOpen(false);
    setSelectedIndex(-1);
  };

  const handleSelectPopular = (query: string) => {
    setSearchQuery(query);
    setIsOpen(false);
  };

  const handleSelectCategory = (catId: string) => {
    setSelectedCategoryFilter(catId);
    setSearchQuery('');
    setIsOpen(false);
  };

  const handleSelectProduct = (product: Product) => {
    setSelectedProduct(product);
    setIsOpen(false);
  };

  // Helper to highlight matching text
  const highlightMatch = (text: string, query: string) => {
    if (!query.trim()) return text;
    const parts = text.split(new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi'));
    return (
      <>
        {parts.map((part, i) => 
          part.toLowerCase() === query.toLowerCase() ? (
            <mark key={i} className="bg-amber-100 text-orange-950 font-bold px-0.5 rounded">
              {part}
            </mark>
          ) : (
            part
          )
        )}
      </>
    );
  };

  const hasSuggestions = 
    suggestedProducts.length > 0 || 
    suggestedCategories.length > 0 || 
    suggestedBrands.length > 0;

  return (
    <div ref={containerRef} className="relative w-full">
      {/* Input Field */}
      <div className="relative flex items-center">
        <input
          ref={inputRef}
          type="text"
          value={searchQuery}
          onFocus={() => setIsOpen(true)}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setIsOpen(true);
            setSelectedIndex(-1);
          }}
          onKeyDown={handleKeyDown}
          placeholder={t.searchPlaceholder}
          className={`w-full ${
            isMobile 
              ? 'pl-9 pr-20 py-2 text-xs bg-slate-100 focus:bg-white rounded-full' 
              : 'pl-10 pr-24 py-2 text-xs md:text-sm bg-slate-100 hover:bg-slate-100/90 focus:bg-white rounded-full'
          } border border-transparent focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/20 transition`}
          autoComplete="off"
        />

        <Search className={`${isMobile ? 'w-3.5 h-3.5 left-3' : 'w-4 h-4 left-3.5'} text-slate-500 absolute`} />

        {/* Right Action Icons: Clear + Photo Search + AI Search */}
        <div className={`absolute ${isMobile ? 'right-2' : 'right-2.5'} flex items-center gap-1`}>
          {searchQuery && (
            <button
              type="button"
              onClick={() => {
                setSearchQuery('');
                setIsOpen(false);
                inputRef.current?.focus();
              }}
              className="text-slate-400 hover:text-slate-600 p-1"
              title="Clear search"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}

          {/* Camera / Photo Search Button */}
          <button
            type="button"
            onClick={() => {
              setIsOpen(false);
              openAiPhotoSearch('photo');
            }}
            className="p-1 rounded-full text-slate-500 hover:text-orange-600 hover:bg-orange-100/80 transition cursor-pointer"
            title="Photo Visual Search (फोटो सर्च)"
          >
            <Camera className="w-4 h-4" />
          </button>

          {/* AI Search Assistant Button */}
          <button
            type="button"
            onClick={() => {
              setIsOpen(false);
              openAiPhotoSearch('ai');
            }}
            className="p-1 rounded-full text-amber-500 hover:text-orange-600 hover:bg-amber-100/80 transition cursor-pointer"
            title="Ask AI Shopping Assistant (एआई सर्च)"
          >
            <Sparkles className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Autocomplete Dropdown */}
      {isOpen && (
        <div 
          className={`absolute left-0 right-0 top-full mt-2 bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden z-50 text-xs animate-in fade-in slide-in-from-top-2 duration-150 ${
            isMobile ? 'max-h-[75vh]' : 'max-h-[480px]'
          } overflow-y-auto`}
        >
          {/* Top Banner: AI & Photo Search Shortcuts */}
          <div className="bg-gradient-to-r from-orange-50 via-amber-50 to-orange-50 p-2.5 border-b border-orange-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-orange-600 shrink-0" />
              <span className="text-[11px] font-bold text-slate-800">
                {language === 'hi' ? 'फोटो या बोलकर खोजें' : 'Visual Photo & AI Search'}
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => {
                  setIsOpen(false);
                  openAiPhotoSearch('photo');
                }}
                className="bg-white hover:bg-orange-100 border border-orange-200 text-orange-700 font-extrabold text-[10px] px-2.5 py-1 rounded-lg flex items-center gap-1 transition cursor-pointer shadow-xs"
              >
                <Camera className="w-3 h-3 text-orange-600" />
                <span>{language === 'hi' ? 'फोटो सर्च' : 'Photo Search'}</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsOpen(false);
                  openAiPhotoSearch('ai');
                }}
                className="bg-orange-500 hover:bg-orange-600 text-white font-extrabold text-[10px] px-2.5 py-1 rounded-lg flex items-center gap-1 transition cursor-pointer shadow-xs"
              >
                <Sparkles className="w-3 h-3" />
                <span>{language === 'hi' ? 'एआई' : 'Ask AI'}</span>
              </button>
            </div>
          </div>

          {searchQuery.trim() === '' ? (
            /* Empty Query: Trending / Popular Searches */
            <div className="p-3.5 space-y-3">
              <div className="flex items-center gap-1.5 text-slate-700 font-extrabold text-[11px] uppercase tracking-wider">
                <TrendingUp className="w-3.5 h-3.5 text-orange-600" />
                <span>Trending Searches in India</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {POPULAR_SEARCHES.map((query, idx) => (
                  <button
                    key={query}
                    onClick={() => handleSelectPopular(query)}
                    className="flex items-center gap-1.5 bg-slate-50 hover:bg-orange-50 hover:border-orange-200 border border-slate-200 text-slate-700 hover:text-orange-700 font-medium px-3 py-1.5 rounded-xl transition text-xs"
                  >
                    <Search className="w-3 h-3 text-slate-400" />
                    <span>{query}</span>
                  </button>
                ))}
              </div>

              {/* Quick Category Jump */}
              <div className="pt-2 border-t border-slate-100">
                <span className="text-[11px] font-bold text-slate-500 block mb-2">
                  Popular Categories
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {CATEGORIES.slice(0, 4).map(c => (
                    <button
                      key={c.id}
                      onClick={() => handleSelectCategory(c.id)}
                      className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-slate-50 text-left border border-slate-100 hover:border-slate-200 transition"
                    >
                      <img src={c.image} alt={c.nameEn} className="w-7 h-7 rounded-lg object-cover shrink-0" />
                      <span className="text-[11px] font-semibold text-slate-800 truncate">
                        {language === 'hi' ? c.nameHi : c.nameEn}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : hasSuggestions ? (
            /* Active Query with Results */
            <div className="divide-y divide-slate-100">
              {/* 1. Brand Suggestions */}
              {suggestedBrands.length > 0 && (
                <div className="p-2.5 bg-slate-50/60">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider px-2 block mb-1">
                    Matching Brands
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {suggestedBrands.map(brand => (
                      <button
                        key={brand}
                        onClick={() => {
                          setSearchQuery(brand);
                          setIsOpen(false);
                        }}
                        className="flex items-center gap-1.5 bg-white hover:bg-orange-50 border border-slate-200 text-slate-800 hover:text-orange-600 font-semibold px-2.5 py-1 rounded-lg transition text-xs"
                      >
                        <Tag className="w-3 h-3 text-orange-500" />
                        <span>{highlightMatch(brand, searchQuery)}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* 2. Category Shortcuts */}
              {suggestedCategories.length > 0 && (
                <div className="p-2">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider px-2 block mb-1">
                    In Category
                  </span>
                  <div className="space-y-1">
                    {suggestedCategories.map(cat => (
                      <button
                        key={cat.id}
                        onClick={() => handleSelectCategory(cat.id)}
                        className="w-full flex items-center justify-between p-2 rounded-xl hover:bg-orange-50/70 text-left transition group"
                      >
                        <div className="flex items-center gap-2.5">
                          <img src={cat.image} alt={cat.nameEn} className="w-8 h-8 rounded-lg object-cover" />
                          <div>
                            <p className="font-bold text-slate-800 text-xs group-hover:text-orange-600">
                              {highlightMatch(cat.nameEn, searchQuery)}
                            </p>
                            <span className="text-[10px] text-slate-500">
                              {cat.itemCount}+ products listed
                            </span>
                          </div>
                        </div>
                        <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-orange-600" />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* 3. Product Suggestions */}
              {suggestedProducts.length > 0 && (
                <div className="p-2">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider px-2 block mb-1">
                    Matching Products
                  </span>
                  <div className="space-y-1">
                    {suggestedProducts.map(prod => (
                      <div
                        key={prod.id}
                        onClick={() => handleSelectProduct(prod)}
                        className="flex items-center gap-3 p-2 rounded-xl hover:bg-orange-50/70 cursor-pointer transition group"
                      >
                        <img 
                          src={prod.images[0]} 
                          alt={prod.title} 
                          className="w-10 h-10 rounded-lg object-contain bg-slate-50 p-1 border shrink-0" 
                        />
                        <div className="flex-1 min-w-0">
                          <h5 className="font-semibold text-xs text-slate-800 line-clamp-1 group-hover:text-orange-600">
                            {highlightMatch(prod.title, searchQuery)}
                          </h5>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className="font-black text-xs text-slate-900">
                              ₹{prod.price.toLocaleString('en-IN')}
                            </span>
                            {prod.mrp > prod.price && (
                              <span className="text-[10px] text-slate-400 line-through">
                                ₹{prod.mrp}
                              </span>
                            )}
                            <span className="text-[10px] text-emerald-600 font-bold">
                              {prod.discountPercent}% off
                            </span>
                            <span className="text-[10px] text-slate-500 truncate">
                              • by {prod.sellerName}
                            </span>
                          </div>
                        </div>
                        <div className="shrink-0 text-slate-400 group-hover:text-orange-600">
                          <ExternalLink className="w-3.5 h-3.5" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* View all results footer */}
              <div className="p-2.5 bg-slate-50 flex items-center justify-between text-xs">
                <span className="text-slate-500">
                  Showing top suggestions for &ldquo;<strong>{searchQuery}</strong>&rdquo;
                </span>
                <button
                  onClick={() => setIsOpen(false)}
                  className="font-bold text-orange-600 hover:text-orange-700 flex items-center gap-1"
                >
                  <span>View All Results</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          ) : (
            /* No Results Found */
            <div className="p-6 text-center space-y-2">
              <Search className="w-8 h-8 text-slate-300 mx-auto" />
              <p className="font-bold text-slate-700 text-xs">
                No instant match for &ldquo;{searchQuery}&rdquo;
              </p>
              <p className="text-[11px] text-slate-500 max-w-xs mx-auto">
                Press Enter to search the full catalog or try popular terms like &ldquo;boAt&rdquo;, &ldquo;Saree&rdquo;, or &ldquo;Rice&rdquo;.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
