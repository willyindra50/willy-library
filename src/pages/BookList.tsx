import { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Menu } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_BASE_URL || '';

interface Book {
  id: number;
  title: string;
  coverImage?: string | null;
  rating?: number | null;
  author?: { name?: string | null } | null;
  category?: { id?: number; name?: string } | null;
  publishedYear?: number | null;
  reviewCount?: number | null;
}

interface Category {
  id: number;
  name: string;
}

export default function BookList() {
  const location = useLocation();
  const navigate = useNavigate();
  const params = useMemo(
    () => new URLSearchParams(location.search),
    [location.search]
  );

  const initialCategory = params.get('categoryId')
    ? Number(params.get('categoryId'))
    : 0;

  const [categoryId, setCategoryId] = useState<number>(initialCategory);
  const [selectedRatings, setSelectedRatings] = useState<number[]>([]);
  const [books, setBooks] = useState<Book[]>([]);
  const [categories, setCategories] = useState<Category[]>([
    { id: 0, name: 'All' },
  ]);
  const [loading, setLoading] = useState(false);
  const [page] = useState(1);
  const [limit] = useState(50);

  // mobile drawer state
  const [showFilters, setShowFilters] = useState(false);

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch(`${API_URL}/api/categories`);
        const json = await res.json();
        if (Array.isArray(json.data?.categories)) {
          setCategories([{ id: 0, name: 'All' }, ...json.data.categories]);
        }
      } catch (err) {
        console.error('Error fetching categories:', err);
      }
    };
    fetchCategories();
  }, []);

  // Sync URL
  useEffect(() => {
    if (categoryId && categoryId !== 0) {
      navigate(`/books?categoryId=${categoryId}`, { replace: true });
    } else {
      navigate('/books', { replace: true });
    }
  }, [categoryId, navigate]);

  // Fetch books
  useEffect(() => {
    const fetchBooks = async () => {
      setLoading(true);
      try {
        const url = new URL(`${API_URL}/api/books`);
        url.searchParams.set('page', String(page));
        url.searchParams.set('limit', String(limit));

        if (categoryId && categoryId !== 0) {
          url.searchParams.set('categoryId', String(categoryId));
        }

        const res = await fetch(url.toString());
        const json = await res.json();
        setBooks(json.data?.books ?? []);
      } catch (err) {
        console.error('Error fetching books:', err);
        setBooks([]);
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, [categoryId, page, limit]);

  const handleCategorySelect = (id: number) => {
    setCategoryId((prev) => (prev === id ? 0 : id));
  };

  const toggleRating = (r: number) => {
    setSelectedRatings((prev) =>
      prev.includes(r) ? prev.filter((x) => x !== r) : [...prev, r]
    );
  };

  const filteredBooks = books.filter((b) => {
    if (selectedRatings.length === 0) return true;
    const rounded = Math.round(Number(b.rating ?? 0));
    return selectedRatings.includes(rounded);
  });

  const FilterContent = (
    <div className='bg-white border rounded-lg p-4 shadow-md w-full'>
      <h3 className='font-bold mb-3'>FILTER</h3>

      <div className='mb-4'>
        <p className='font-semibold mb-2'>Category</p>
        <div className='space-y-2'>
          {categories.map((cat) => (
            <label
              key={cat.id}
              className='flex items-center gap-3 cursor-pointer select-none'
            >
              <input
                type='checkbox'
                checked={categoryId === cat.id}
                onChange={() => handleCategorySelect(cat.id)}
              />
              <span className='text-sm'>{cat.name}</span>
            </label>
          ))}
        </div>
      </div>

      <div>
        <p className='font-semibold mb-2'>Rating</p>
        <div className='space-y-2'>
          {[5, 4, 3, 2, 1].map((r) => (
            <label
              key={r}
              className='flex items-center gap-3 cursor-pointer select-none'
            >
              <input
                type='checkbox'
                checked={selectedRatings.includes(r)}
                onChange={() => toggleRating(r)}
              />
              <div className='flex items-center gap-2'>
                <span className='text-yellow-400'>★</span>
                <span className='text-sm'>{r}</span>
              </div>
            </label>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className='max-w-[1200px] mx-auto px-4 py-8'>
      <div className='flex items-center justify-between mb-6'>
        <h1 className='text-3xl font-bold'>Book List</h1>

        {/* hamburger only on mobile */}
        <button
          className='md:hidden p-2 border rounded-lg'
          onClick={() => setShowFilters(true)}
        >
          <Menu className='w-6 h-6' />
        </button>
      </div>

      <div className='flex flex-col md:flex-row gap-6'>
        {/* LEFT: filter (desktop only) */}
        <aside className='hidden md:block w-72 md:flex-shrink-0'>
          {FilterContent}
        </aside>

        {/* RIGHT: book grid */}
        <div className='flex-1'>
          {loading ? (
            <p>Loading books...</p>
          ) : (
            <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4 md:gap-6'>
              {filteredBooks.length > 0 ? (
                filteredBooks.map((book) => (
                  <div
                    key={book.id}
                    onClick={() => navigate(`/books/${book.id}`)}
                    className='w-full max-w-[180px] sm:max-w-[200px] md:max-w-[224px] mx-auto shadow rounded-lg overflow-hidden bg-white cursor-pointer hover:shadow-lg transition'
                  >
                    <img
                      src={
                        book.coverImage && book.coverImage.trim() !== ''
                          ? book.coverImage
                          : '/recomendation.png'
                      }
                      alt={book.title}
                      className='object-cover w-full aspect-[2/3]'
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).src =
                          '/recomendation.png';
                      }}
                    />
                    <div className='p-2'>
                      <h3 className='font-semibold truncate'>{book.title}</h3>
                      <p className='text-sm text-gray-500 truncate'>
                        {book.author?.name ?? 'Unknown Author'}
                      </p>
                      <div className='flex items-center gap-1 text-yellow-500 text-sm'>
                        ⭐ {book.rating?.toFixed(1) ?? '0.0'}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className='col-span-full'>
                  <p className='text-gray-500'>No books found.</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* mobile filter drawer */}
      {showFilters && (
        <div className='fixed inset-0 z-50 flex'>
          <div className='w-72 bg-white shadow-lg p-4 overflow-y-auto'>
            {FilterContent}
          </div>
          <div
            className='flex-1 bg-black/50'
            onClick={() => setShowFilters(false)}
          />
        </div>
      )}
    </div>
  );
}
