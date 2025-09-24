import { useEffect, useState } from 'react';

interface Review {
  id: number;
  star: number; // ✅ sesuai API
  comment: string;
  createdAt: string;
  user?: {
    id: number;
    name: string;
  };
}

const API_URL = import.meta.env.VITE_API_BASE_URL;

function getInitials(name?: string) {
  if (!name) return 'U';
  const parts = name.trim().split(' ');
  if (parts.length === 1) return parts[0][0].toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export default function Review({ bookId }: { bookId: number }) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [totalReviews, setTotalReviews] = useState(0);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const res = await fetch(
          `${API_URL}/api/reviews/book/${bookId}?page=1&limit=6`
        );
        const json = await res.json();
        setReviews(json.data?.reviews ?? []);
        setTotalReviews(json.data?.pagination?.total ?? 0);
      } catch (err) {
        console.error('Error fetching reviews:', err);
      }
    };

    fetchReviews();
  }, [bookId]);

  // Hitung rata-rata rating
  const averageRating =
    reviews.length > 0
      ? reviews.reduce((acc, r) => acc + Number(r.star ?? 0), 0) /
        reviews.length
      : 0;

  return (
    <div className='max-w-[1200px] mx-auto mb-12'>
      <h2 className='text-xl font-bold mb-2'>Review</h2>

      <div className='flex items-center gap-3 mb-4'>
        <p className='text-sm text-gray-500'>{totalReviews} Ulasan</p>
        {totalReviews > 0 && (
          <div className='flex items-center gap-1'>
            {/* Bintang rata-rata */}
            {Array.from({ length: 5 }).map((_, i) => (
              <span
                key={i}
                className={
                  i < Math.round(averageRating)
                    ? 'text-yellow-400'
                    : 'text-gray-300'
                }
              >
                ★
              </span>
            ))}
            <span className='text-sm text-gray-600'>
              {averageRating.toFixed(1)}
            </span>
          </div>
        )}
      </div>

      <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
        {reviews.length > 0 ? (
          reviews.map((review) => (
            <div
              key={review.id}
              className='w-full bg-white rounded-2xl shadow p-4 flex flex-col'
            >
              {/* Top section */}
              <div className='flex items-center gap-3'>
                <div className='w-12 h-12 rounded-full bg-gray-300 flex items-center justify-center font-bold text-gray-700'>
                  {getInitials(review.user?.name)}
                </div>
                <div className='flex-1'>
                  <p className='font-semibold text-sm'>
                    {review.user?.name ?? 'Anonymous'}
                  </p>
                  <span className='text-xs text-gray-400'>
                    {new Date(review.createdAt).toLocaleDateString()}{' '}
                    {new Date(review.createdAt).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                </div>
              </div>

              {/* Rating */}
              <div className='flex mt-2'>
                {Array.from({ length: 5 }).map((_, i) => (
                  <span
                    key={i}
                    className={
                      i < Number(review.star ?? 0)
                        ? 'text-yellow-400'
                        : 'text-gray-300'
                    }
                  >
                    ★
                  </span>
                ))}
              </div>

              {/* Comment */}
              <p className='mt-2 text-sm text-gray-700 line-clamp-3'>
                {review.comment}
              </p>
            </div>
          ))
        ) : (
          <p className='text-gray-400'>Belum ada review.</p>
        )}
      </div>

      <div className='flex justify-center mt-6'>
        <button className='px-6 py-2 rounded-full border bg-white hover:bg-gray-100 text-sm'>
          Load More
        </button>
      </div>
    </div>
  );
}
