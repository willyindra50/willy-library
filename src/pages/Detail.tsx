import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Review from '../components/Review';
import Related from '../components/Related';
import { useAppDispatch } from '../store/hooks';
import { addToCart } from '../store/slices/cartSlice';

interface Author {
  id: number;
  name: string;
  bio?: string;
}

interface Category {
  id: number;
  name: string;
}

interface Book {
  id: number;
  title: string;
  description: string;
  isbn: string;
  publishedYear: number;
  coverImage: string;
  rating: number;
  reviewCount: number;
  totalCopies: number;
  availableCopies: number;
  borrowCount: number;
  author?: Author;
  category?: Category;
  page?: number;
}

const API_URL = import.meta.env.VITE_API_BASE_URL;

export default function Detail() {
  const { id } = useParams();
  const [book, setBook] = useState<Book | null>(null);
  const [loading, setLoading] = useState(true);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (!id) return;

    const fetchBook = async () => {
      try {
        const res = await fetch(`${API_URL}/api/books/${id}`);
        const json = await res.json();
        setBook(json.data ?? null);
      } catch (err) {
        console.error('Error fetching book:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchBook();
  }, [id]);

  if (loading) {
    return (
      <div className='max-w-[1200px] mx-auto px-4 py-8'>
        <p>Loading...</p>
      </div>
    );
  }

  if (!book) {
    return (
      <div className='max-w-[1200px] mx-auto px-4 py-8'>
        <p>Book not found.</p>
      </div>
    );
  }

  return (
    <div className='max-w-[1200px] mx-auto px-4 py-8'>
      {/* Book Detail */}
      <div className='flex flex-col md:flex-row gap-8 mb-12'>
        {/* Book Cover */}
        <div className='w-full max-w-[337px] h-auto flex-shrink-0 mx-auto md:mx-0'>
          <img
            src={book.coverImage || '/recomendation.png'}
            alt={book.title}
            className='w-full h-auto object-cover rounded-lg shadow'
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).src = '/recomendation.png';
            }}
          />
        </div>

        {/* Book Info */}
        <div className='flex-1 space-y-4'>
          <span className='px-3 py-1 border rounded text-sm'>
            {book.category?.name ?? 'Uncategorized'}
          </span>
          <h1 className='text-2xl font-bold'>{book.title}</h1>
          <p className='text-neutral-700'>
            {book.author?.name ?? 'Unknown Author'}
          </p>

          {/* Rating stars */}
          <div className='flex items-center text-yellow-500'>
            ⭐ {book.rating?.toFixed(1) ?? '0.0'}
          </div>

          {/* Page / Rating / Reviews */}
          <div className='flex divide-x divide-gray-300 text-center py-3'>
            <div className='flex-1'>
              <p className='font-semibold'>{book.page ?? '-'}</p>
              <p className='text-sm text-gray-500'>Page</p>
            </div>
            <div className='flex-1'>
              <p className='font-semibold'>
                {book.rating?.toFixed(1) ?? '0.0'}
              </p>
              <p className='text-sm text-gray-500'>Rating</p>
            </div>
            <div className='flex-1'>
              <p className='font-semibold'>{book.reviewCount ?? 0}</p>
              <p className='text-sm text-gray-500'>Reviews</p>
            </div>
          </div>

          {/* Description */}
          <div className='pt-4 border-t border-gray-300'>
            <h3 className='font-semibold mb-2'>Description</h3>
            <p className='text-neutral-800'>
              {book.description ?? 'No description available.'}
            </p>
          </div>

          {/* Action Buttons */}
          <div className='flex flex-col sm:flex-row gap-4 pt-4'>
            {/* Add to Cart */}
            <button
              onClick={() => {
                if (book) {
                  dispatch(
                    addToCart({
                      id: book.id,
                      title: book.title,
                      author: book.author?.name ?? 'Unknown Author',
                      category: book.category?.name ?? 'Uncategorized',
                      image: book.coverImage || '/recomendation.png',
                    })
                  );
                }
              }}
              className='flex-1 min-w-0 h-[48px] rounded-full border hover:bg-gray-100'
            >
              Add to Cart
            </button>

            {/* Borrow Book */}
            <button className='flex-1 min-w-0 h-[48px] rounded-full bg-blue-600 hover:bg-blue-700 text-white'>
              Borrow Book
            </button>

            {/* Share */}
            <button className='w-[48px] h-[48px] rounded-full border flex items-center justify-center hover:bg-gray-100'>
              ↗
            </button>
          </div>
        </div>
      </div>

      {/* Reviews */}
      <Review bookId={book.id} />

      {/* Related Books */}
      <Related />
    </div>
  );
}
