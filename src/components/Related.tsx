import { useEffect, useState } from 'react';

interface RelatedBook {
  id: number;
  title: string;
  coverImage: string;
  author?: { name: string };
  rating: number;
}

const API_URL = import.meta.env.VITE_API_BASE_URL;

export default function Related() {
  const [related, setRelated] = useState<RelatedBook[]>([]);

  useEffect(() => {
    const fetchRelated = async () => {
      try {
        const res = await fetch(`${API_URL}/api/books/recommend?limit=10`);
        const json = await res.json();
        setRelated(json.data?.books ?? []);
      } catch (err) {
        console.error('Error fetching related books:', err);
      }
    };

    fetchRelated();
  }, []);

  return (
    <div className='max-w-[1200px] mx-auto'>
      <h2 className='text-xl font-bold mb-6'>Related Books</h2>
      <div className='grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6'>
        {related.slice(0, 5).map((b) => (
          <div
            key={b.id}
            className='w-full bg-white rounded-xl shadow overflow-hidden cursor-pointer hover:shadow-lg transition'
          >
            <img
              src={b.coverImage || '/recomendation.png'}
              alt={b.title}
              className='w-full h-[336px] object-cover'
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).src =
                  '/recomendation.png';
              }}
            />
            <div className='p-3'>
              <h3 className='text-sm font-semibold truncate'>{b.title}</h3>
              <p className='text-xs text-gray-500 truncate mt-1'>
                {b.author?.name ?? 'Unknown'}
              </p>
              <div className='text-xs mt-1'>
                ⭐ {b.rating?.toFixed(1) ?? '0.0'}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
