import React, { useMemo, useState } from 'react';
import { Search, Filter, Grid, List, Star, Download } from 'lucide-react';

export type App = {
  slug: string;
  title: string;
  tagline: string;
  description: string;
  category: string;
  icon?: string;
  playUrl: string;
  price?: string;              // "Free" | "$1.99" | ...
  tags?: string[];
  rating?: number;             // e.g., 4.6
  downloadsLabel?: string;     // e.g., "1K+"
};

type Props = {
  apps: App[];
  showFilters?: boolean;
};

function useDebounced<T>(value: T, delay = 180) {
  const [v, setV] = useState(value);
  React.useEffect(() => {
    const id = setTimeout(() => setV(value), delay);
    return () => clearTimeout(id);
  }, [value, delay]);
  return v;
}

const StarRow = ({ rating = 4.5 }: { rating?: number }) => {
  const full = Math.floor(rating);
  return (
    <div className="flex items-center gap-1" aria-label={`Rating ${rating} out of 5`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={`w-3 h-3 ${i < full ? 'text-yellow-400 fill-current' : 'text-gray-300 dark:text-gray-600'}`}
          aria-hidden="true"
        />
      ))}
      <span className="text-xs text-gray-500 dark:text-gray-400 ml-1">{rating}</span>
    </div>
  );
};

const AppCard = React.memo(function AppCard({
  app,
  mode,
}: {
  app: App;
  mode: 'grid' | 'list';
}) {
  const price = app.price ?? 'Free';
  const priceBadge =
    price === 'Free'
      ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 border border-green-200 dark:border-green-700'
      : 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-blue-700';

  if (mode === 'list') {
    return (
      <article className="card card--elevated p-6 flex flex-col md:flex-row items-center gap-6" aria-labelledby={`app-${app.slug}`}>
        <a href={`/apps/${app.slug}`} className="flex items-center gap-6 w-full">
          <img
            src={app.icon ?? '/placeholder-app.svg'}
            alt={`${app.title} icon`}
            className="w-16 h-16 rounded-2xl shadow-lg bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800"
            loading="lazy"
            width={64}
            height={64}
          />
          <div className="flex-1 min-w-0">
            <h3 id={`app-${app.slug}`} className="text-lg font-bold text-gray-900 dark:text-white truncate">
              {app.title}
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mt-1 line-clamp-2">{app.tagline}</p>
            <div className="flex items-center gap-4 mt-3">
              <StarRow rating={app.rating} />
              <span className="text-xs text-gray-500 dark:text-gray-400">{app.downloadsLabel ?? '—'}</span>
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700">
                {app.category}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold ${priceBadge}`}>{price}</span>
            <a
              href={app.playUrl}
              target="_blank"
              rel="noopener noreferrer sponsored"
              className="flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium bg-brand-50 dark:bg-brand-900/20 text-brand-700 dark:text-brand-400 border border-brand-200 dark:border-brand-700 hover:bg-brand-100 dark:hover:bg-brand-800 transition-colors"
              aria-label={`Download ${app.title} on Google Play`}
            >
              <Download className="w-4 h-4" />
              <span>Download</span>
            </a>
          </div>
        </a>
      </article>
    );
  }

  return (
    <article className="card card--elevated group" aria-labelledby={`app-${app.slug}`}>
      <a href={`/apps/${app.slug}`} className="block focus-ring rounded-2xl">
        <div className="p-6 pb-4">
          <div className="flex items-start gap-4">
            <img
              src={app.icon ?? '/placeholder-app.svg'}
              alt={`${app.title} icon`}
              className="w-16 h-16 rounded-2xl shadow-lg bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800"
              loading="lazy"
              width={64}
              height={64}
            />
            <div className="flex-1 min-w-0">
              <h3 id={`app-${app.slug}`} className="text-lg font-bold text-gray-900 dark:text-white group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors truncate">
                {app.title}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 line-clamp-2">{app.tagline}</p>
              <div className="flex items-center gap-4 mt-3">
                <StarRow rating={app.rating} />
                <span className="text-xs text-gray-500 dark:text-gray-400">{app.downloadsLabel ?? '—'}</span>
              </div>
            </div>
            <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${priceBadge}`}>{price}</span>
          </div>
        </div>

        <div className="px-6 pb-4">
          <p className="text-sm text-gray-700 dark:text-gray-300 line-clamp-3 leading-relaxed">{app.description}</p>
        </div>

        <div className="px-6 pb-6">
          <div className="flex items-center justify-between">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700">
              {app.category}
            </span>
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium bg-brand-50 dark:bg-brand-900/20 text-brand-700 dark:text-brand-400 border border-brand-200 dark:border-brand-700">
              <Download className="w-4 h-4" />
              Download
            </span>
          </div>
        </div>
      </a>
    </article>
  );
});

export default function AppGrid({ apps, showFilters = true }: Props) {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [mode, setMode] = useState<'grid' | 'list'>('grid');

  const debounced = useDebounced(search, 180);

  const categories = useMemo(() => {
    const set = new Set<string>(['All']);
    apps.forEach((a) => a.category && set.add(a.category));
    return Array.from(set);
  }, [apps]);

  const filtered = useMemo(() => {
    const q = debounced.trim().toLowerCase();
    return apps.filter((a) => {
      const inCategory = category === 'All' || a.category === category;
      if (!q) return inCategory;
      const haystack =
        `${a.title} ${a.tagline} ${a.description} ${a.category} ${(a.tags ?? []).join(' ')}`.toLowerCase();
      return inCategory && haystack.includes(q);
    });
  }, [apps, debounced, category]);

  return (
    <section className="space-y-6" aria-labelledby="apps-heading">
      {showFilters && (
        <div className="app-grid__filters bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-6 mb-2">
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Search */}
            <div className="flex-1">
              <label htmlFor="app-search" className="sr-only">Search apps</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" aria-hidden="true" />
                <input
                  id="app-search"
                  type="text"
                  placeholder="Search apps..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Category */}
            <div className="lg:w-64">
              <label htmlFor="app-category" className="sr-only">Filter by category</label>
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" aria-hidden="true" />
                <select
                  id="app-category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full pl-10 pr-8 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-brand-500 focus:border-transparent appearance-none"
                >
                  {categories.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* View toggle */}
            <div className="inline-flex rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
              <button
                onClick={() => setMode('grid')}
                className={`px-4 py-2 ${mode === 'grid' ? 'bg-brand-500 text-white' : 'bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-400'}`}
                aria-pressed={mode === 'grid'}
                aria-label="Grid view"
              >
                <Grid className="w-5 h-5" />
              </button>
              <button
                onClick={() => setMode('list')}
                className={`px-4 py-2 ${mode === 'list' ? 'bg-brand-500 text-white' : 'bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-400'}`}
                aria-pressed={mode === 'list'}
                aria-label="List view"
              >
                <List className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Results */}
          <div className="mt-4 text-sm text-gray-600 dark:text-gray-400" aria-live="polite">
            {filtered.length} app{filtered.length !== 1 ? 's' : ''} found{category !== 'All' ? ` in ${category}` : ''}{debounced ? ` for "${debounced}"` : ''}
          </div>
        </div>
      )}

      {/* Content */}
      {filtered.length ? (
        <ul
          role="list"
          className={`grid gap-6 ${mode === 'grid' ? 'md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' : 'grid-cols-1'}`}
        >
          {filtered.map((app) => (
            <li key={app.slug}>
              <AppCard app={app} mode={mode} />
            </li>
          ))}
        </ul>
      ) : (
        <div className="app-grid__empty text-center py-16">
          <div className="w-24 h-24 bg-gray-100 dark:bg-gray-800 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Search className="w-12 h-12 text-gray-400" aria-hidden="true" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">No apps found</h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            {debounced ? <>No apps match your search for “{debounced}”.</> : <>Try a different category or keyword.</>}
          </p>
          <button onClick={() => { setSearch(''); setCategory('All'); }} className="button button--primary">
            Clear Filters
          </button>
        </div>
      )}
    </section>
  );
}
