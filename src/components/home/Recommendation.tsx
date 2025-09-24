import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axios';
import type { Book } from '../../types';

export default function Recommendation() {
  const [visible, setVisible] = useState(10);
  const navigate = useNavigate();

  const { data, isLoading } = useQuery<Book[]>({
    queryKey: ['recommendation'],
    queryFn: async () => {
      const res = await api.get<{
        success: boolean;
        message: string;
        data: { mode: string; books: Book[] };
      }>('/api/books/recommend', {
        params: { limit: 50 },
      });
      return res.data.data.books;
    },
  });

  if (isLoading) return <p>Loading...</p>;

  const books = data ?? [];
  const displayBooks = books.slice(0, visible);

  return (
    <div className='mb-12'>
      <h2 className='text-xl font-semibold mb-4'>Recommendation</h2>

      <div className='grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6'>
        {displayBooks.map((book) => (
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
        ))}
      </div>

      {books.length > visible && (
        <div className='flex justify-center mt-6'>
          <button
            onClick={() => setVisible((prev) => prev + 10)}
            className='px-6 py-2 border rounded-full hover:bg-gray-100'
          >
            Load More
          </button>
        </div>
      )}
    </div>
  );
}
