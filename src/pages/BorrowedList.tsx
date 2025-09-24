import { useEffect, useState, useCallback } from 'react';
import { useAppSelector } from '../store/hooks';
import api from '../api/axios';
import ReviewModal from '../components/ReviewModal';

interface BorrowedBook {
  loanId: number;
  bookId: number;
  title: string;
  category: string;
  image: string;
  status: 'Active' | 'Returned' | 'Overdue';
  borrowDate: string;
  dueDate: string;
  duration: number;
}

interface LoanApiItem {
  id: number;
  book?: {
    id?: number;
    title?: string;
    coverImage?: string;
    category?: { name?: string };
  };
  status?: 'BORROWED' | 'RETURNED' | 'OVERDUE' | string;
  borrowedAt?: string;
  dueAt?: string;
  returnedAt?: string | null;
}

type FilterTab = 'All' | 'Active' | 'Returned' | 'Overdue';

export default function BorrowedList() {
  const auth = useAppSelector((s) => s.auth);
  const [filter, setFilter] = useState<FilterTab>('All');
  const [books, setBooks] = useState<BorrowedBook[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reviewBookId, setReviewBookId] = useState<number | null>(null);

  const fetchBorrowed = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const res = await api.get<{ data?: { loans?: LoanApiItem[] } }>(
        '/api/loans/my',
        { headers: { Authorization: `Bearer ${auth.token}` } }
      );

      const raw = Array.isArray(res.data?.data?.loans)
        ? res.data?.data?.loans
        : [];

      const mapped: BorrowedBook[] = raw.map((item) => {
        let duration = 0;
        if (item.borrowedAt && item.dueAt) {
          const borrowDate = new Date(item.borrowedAt);
          const dueDate = new Date(item.dueAt);
          duration = Math.ceil(
            (dueDate.getTime() - borrowDate.getTime()) / (1000 * 60 * 60 * 24)
          );
        }

        return {
          loanId: item.id,
          bookId: item.book?.id ?? 0,
          title: item.book?.title ?? 'Unknown Title',
          category: item.book?.category?.name ?? 'General',
          image: item.book?.coverImage ?? '/recomendation.png',
          status:
            item.status === 'BORROWED'
              ? 'Active'
              : item.status === 'RETURNED'
              ? 'Returned'
              : 'Overdue',
          borrowDate: item.borrowedAt
            ? new Date(item.borrowedAt).toLocaleDateString('en-GB', {
                day: '2-digit',
                month: 'short',
                year: 'numeric',
              })
            : '-',
          dueDate: item.dueAt
            ? new Date(item.dueAt).toLocaleDateString('en-GB', {
                day: '2-digit',
                month: 'short',
                year: 'numeric',
              })
            : '-',
          duration,
        };
      });

      setBooks(mapped);
    } catch (err) {
      console.error('❌ Failed to fetch borrowed books:', err);
      setError('Failed to load borrowed books.');
    } finally {
      setLoading(false);
    }
  }, [auth.token]);

  useEffect(() => {
    if (auth.token) {
      fetchBorrowed();
    }
  }, [auth.token, fetchBorrowed]);

  const handleReturn = async (loanId: number) => {
    try {
      await api.patch(
        `/api/loans/${loanId}/return`,
        {},
        { headers: { Authorization: `Bearer ${auth.token}` } }
      );

      setBooks((prev) =>
        prev.map((b) =>
          b.loanId === loanId ? { ...b, status: 'Returned' } : b
        )
      );
    } catch (err) {
      console.error('❌ Failed to return book:', err);
      alert('Failed to return this book.');
    }
  };

  const filteredBooks =
    filter === 'All' ? books : books.filter((b) => b.status === filter);

  const tabs: FilterTab[] = ['All', 'Active', 'Returned', 'Overdue'];

  return (
    <div className='flex flex-col min-h-screen bg-white'>
      <main className='flex-1 w-full max-w-[1000px] mx-auto px-4 py-8'>
        <h1 className='text-2xl font-bold text-gray-800 mb-6'>Borrowed List</h1>

        <div className='flex gap-2 mb-6'>
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`px-4 py-1 rounded-full text-sm ${
                filter === tab
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {loading && <p className='text-gray-500'>Loading...</p>}
        {error && <p className='text-red-500'>{error}</p>}
        {!loading && !error && filteredBooks.length === 0 && (
          <p className='text-gray-600'>No borrowed books found.</p>
        )}

        <div className='flex flex-col gap-4'>
          {filteredBooks.map((book, idx) => (
            <div
              key={`${book.loanId}-${idx}`}
              className='w-full bg-white rounded-lg shadow p-4 flex flex-col gap-3 md:h-[100px] md:flex-row md:items-center'
            >
              {/* Top bar for mobile */}
              <div className='flex justify-between items-center w-full md:hidden'>
                <span
                  className={`px-3 py-1 text-xs font-medium rounded-full ${
                    book.status === 'Active'
                      ? 'bg-green-100 text-green-700'
                      : book.status === 'Returned'
                      ? 'bg-gray-100 text-green-600'
                      : 'bg-red-100 text-red-600'
                  }`}
                >
                  {book.status}
                </span>
                <p className='text-xs'>
                  <span className='font-medium text-gray-600'>Due:</span>{' '}
                  <span className='text-red-600 font-medium'>
                    {book.dueDate}
                  </span>
                </p>
              </div>

              {/* Content */}
              <div className='flex gap-3 md:flex-row w-full'>
                <img
                  src={book.image}
                  alt={book.title}
                  className='w-[60px] h-[80px] object-cover rounded'
                  onError={(e) =>
                    ((e.target as HTMLImageElement).src = '/recomendation.png')
                  }
                />
                <div className='flex-1'>
                  <span className='px-2 py-0.5 border rounded text-xs text-gray-600'>
                    {book.category}
                  </span>
                  <h2 className='text-base font-semibold text-gray-800 mt-1'>
                    {book.title}
                  </h2>
                  <p className='text-xs text-gray-500'>
                    {book.borrowDate} • {book.duration} Days
                  </p>
                </div>
              </div>

              {/* Buttons */}
              <div className='flex gap-2 w-full md:w-auto md:flex-row md:items-center md:ml-auto'>
                {book.status === 'Active' && (
                  <button
                    onClick={() => handleReturn(book.loanId)}
                    className='flex-1 md:flex-none px-4 py-2 rounded-full bg-red-500 text-white text-sm hover:bg-red-600'
                  >
                    Return
                  </button>
                )}
                <button
                  onClick={() => setReviewBookId(book.bookId)}
                  className='flex-1 md:flex-none px-4 py-2 rounded-full bg-blue-600 text-white text-sm hover:bg-blue-700'
                >
                  Give Review
                </button>
              </div>
            </div>
          ))}
        </div>

        {reviewBookId && (
          <ReviewModal
            open={!!reviewBookId}
            onClose={() => setReviewBookId(null)}
            bookId={reviewBookId}
            onUpdated={fetchBorrowed}
          />
        )}
      </main>
    </div>
  );
}
