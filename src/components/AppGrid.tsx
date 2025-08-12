import React, { useState, useEffect } from 'react';
import { Search, Filter, Grid, List } from 'lucide-react';

interface App {
  slug: string;
  data: {
    title: string;
    tagline: string;
    description: string;
    category: string;
    icon?: string;
    playUrl: string;
    price?: string;
    version?: string;
    tags?: string[];
    locale?: string;
    lastUpdated?: string;
    screenshots?: string[];
  };
}

interface AppGridProps {
  apps: App[];
  showFilters?: boolean;
}

const categories = [
  'All',
  'Books & Reference',
  'Productivity',
  'Education', 
  'Entertainment',
  'Lifestyle',
  'Social',
  'Games',
  'Utilities',
  'Business',
  'Health & Fitness',
  'Photography'
];

export default function AppGrid({ apps, showFilters = true }: AppGridProps) {
  const [filteredApps, setFilteredApps] = useState(apps);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    
    // Simulate filtering delay for better UX
    const timeoutId = setTimeout(() => {
      let filtered = apps;
      
      // Filter by category
      if (selectedCategory !== 'All') {
        filtered = filtered.filter(app => app.data.category === selectedCategory);
      }
      
      // Filter by search query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        filtered = filtered.filter(app =>
          app.data.title.toLowerCase().includes(query) ||
          app.data.tagline.toLowerCase().includes(query) ||
          app.data.description.toLowerCase().includes(query) ||
          app.data.category.toLowerCase().includes(query) ||
          app.data.tags?.some(tag => tag.toLowerCase().includes(query))
        );
      }
      
      setFilteredApps(filtered);
      setIsLoading(false);
    }, 200);

    return () => clearTimeout(timeoutId);
  }, [apps, searchQuery, selectedCategory]);

  const AppCard = ({ app }: { app: App }) => {
    const rating = 4.5; // Default rating since it's not in the data structure
    const downloads = '1K+'; // Default downloads
    const price = app.data.price || 'Free';

    if (viewMode === 'list') {
      return (
        <div className="app-grid__item--list card p-6 hover:scale-[1.02] transition-all duration-200">
          <a href={`/apps/${app.slug}`} className="flex items-center gap-6">
            <img 
              src={app.data.icon ?? '/placeholder-app.svg'} 
              alt={`${app.data.title} icon`}
              className="w-16 h-16 rounded-2xl shadow-lg flex-shrink-0"
              loading="lazy"
            />
            
            <div className="flex-1 min-w-0">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white truncate">
                {app.data.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mt-1 line-clamp-2">
                {app.data.tagline}
              </p>
              
              <div className="flex items-center gap-4 mt-3">
                <div className="flex items-center gap-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <svg 
                      key={i}
                      className={`w-3 h-3 ${i < Math.floor(rating) ? 'text-yellow-400' : 'text-gray-300 dark:text-gray-600'}`}
                      fill="currentColor" 
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                  <span className="text-xs text-gray-500 dark:text-gray-400 ml-1">{rating}</span>
                </div>
                <span className="text-xs text-gray-500 dark:text-gray-400">{downloads}</span>
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300">
                  {app.data.category}
                </span>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                price === 'Free' 
                  ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                  : 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400'
              }`}>
                {price}
              </span>
              
              <div className="flex items-center text-brand-600 dark:text-brand-400 text-sm font-medium">
                <span>Download</span>
                <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </div>
            </div>
          </a>
        </div>
      );
    }

    return (
      <div className="app-grid__item card card--elevated group hover:scale-105 transition-all duration-300">
        <a href={`/apps/${app.slug}`} className="block">
          <div className="p-6 pb-4">
            <div className="flex items-start gap-4">
              <img 
                src={app.data.icon ?? '/placeholder-app.svg'} 
                alt={`${app.data.title} icon`}
                className="w-16 h-16 rounded-2xl shadow-lg group-hover:shadow-xl transition-shadow duration-300" 
                loading="lazy" 
              />
              
              <div className="flex-1 min-w-0">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors duration-200 truncate">
                  {app.data.title}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 line-clamp-2">
                  {app.data.tagline}
                </p>
                
                <div className="flex items-center gap-4 mt-3">
                  <div className="flex items-center gap-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <svg 
                        key={i}
                        className={`w-3 h-3 ${i < Math.floor(rating) ? 'text-yellow-400' : 'text-gray-300 dark:text-gray-600'}`}
                        fill="currentColor" 
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                    <span className="text-xs text-gray-500 dark:text-gray-400 ml-1">{rating}</span>
                  </div>
                  <span className="text-xs text-gray-500 dark:text-gray-400">{downloads}</span>
                </div>
              </div>
              
              <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                price === 'Free' 
                  ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                  : 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400'
              }`}>
                {price}
              </span>
            </div>
          </div>
          
          <div className="px-6 pb-4">
            <p className="text-sm text-gray-700 dark:text-gray-300 line-clamp-3 leading-relaxed">
              {app.data.description}
            </p>
          </div>
          
          <div className="px-6 pb-6">
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300">
                {app.data.category}
              </span>
              
              <div className="flex items-center text-brand-600 dark:text-brand-400 text-sm font-medium group-hover:text-brand-700 dark:group-hover:text-brand-300 transition-colors">
                <span>Download</span>
                <svg className="w-4 h-4 ml-1 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </div>
            </div>
          </div>
        </a>
      </div>
    );
  };

  return (
    <div className="app-grid">
      {showFilters && (
        <div className="app-grid__filters bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search apps..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-colors"
                />
              </div>
            </div>
            
            {/* Category Filter */}
            <div className="lg:w-64">
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full pl-10 pr-8 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-colors appearance-none"
                >
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>
            </div>
            
            {/* View Mode Toggle */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-3 rounded-xl transition-colors ${
                  viewMode === 'grid'
                    ? 'bg-brand-500 text-white'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:text-brand-600 dark:hover:text-brand-400'
                }`}
                aria-label="Grid view"
              >
                <Grid className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-3 rounded-xl transition-colors ${
                  viewMode === 'list'
                    ? 'bg-brand-500 text-white'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:text-brand-600 dark:hover:text-brand-400'
                }`}
                aria-label="List view"
              >
                <List className="w-5 h-5" />
              </button>
            </div>
          </div>
          
          {/* Results count */}
          <div className="mt-4 text-sm text-gray-600 dark:text-gray-400">
            {isLoading ? (
              <span>Searching...</span>
            ) : (
              <span>
                {filteredApps.length} app{filteredApps.length !== 1 ? 's' : ''} found
                {selectedCategory !== 'All' && ` in ${selectedCategory}`}
                {searchQuery && ` for "${searchQuery}"`}
              </span>
            )}
          </div>
        </div>
      )}
      
      {/* Apps Grid/List */}
      {isLoading ? (
        <div className="app-grid__loading">
          <div className={`grid gap-6 ${viewMode === 'grid' ? 'md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' : ''}`}>
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="card p-6 animate-pulse">
                <div className="flex items-start gap-4">
                  <div className="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-2xl"></div>
                  <div className="flex-1">
                    <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-3"></div>
                    <div className="flex gap-2">
                      <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-12"></div>
                      <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-8"></div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : filteredApps.length > 0 ? (
        <div className={`app-grid__content grid gap-6 ${
          viewMode === 'grid' 
            ? 'md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' 
            : 'grid-cols-1'
        }`}>
          {filteredApps.map((app) => (
            <AppCard key={app.slug} app={app} />
          ))}
        </div>
      ) : (
        <div className="app-grid__empty text-center py-16">
          <div className="w-24 h-24 bg-gray-100 dark:bg-gray-800 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Search className="w-12 h-12 text-gray-400" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            No apps found
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            {searchQuery ? (
              <>No apps match your search for "{searchQuery}"</>
            ) : (
              <>No apps found in the {selectedCategory} category</>
            )}
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('All');
            }}
            className="button button--primary"
          >
            Clear Filters
          </button>
        </div>
      )}
    </div>
  );
}

