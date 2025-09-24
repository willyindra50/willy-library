import { useNavigate } from 'react-router-dom';

interface BookCardProps {
  book: {
    id: number;
    title: string;
    coverImage?: string | null;
    rating?: number | null;
    author?: { name?: string | null } | null;
  };
}

export default function BookCard({ book }: BookCardProps) {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(`/books/${book.id}`)}
      className='w-[205px] h-[440px] bg-white rounded-lg overflow-hidden shadow-md cursor-pointer flex flex-col'
    >
      <div className='w-[205px] h-[307px] flex-shrink-0'>
        <img
          src={
            book.coverImage && book.coverImage.trim() !== ''
              ? book.coverImage
              : '/recomendation.png'
          }
          alt={book.title}
          className='w-[205px] h-[307px] object-cover'
          onError={(e) => {
            (e.currentTarget as HTMLImageElement).src = '/recomendation.png';
          }}
        />
      </div>

      <div className='p-3 flex-1 flex flex-col justify-between'>
        <div>
          <h3
            className='text-sm font-semibold mb-1 line-clamp-2'
            style={{
              WebkitLineClamp: 2,
              display: '-webkit-box',
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
            }}
          >
            {book.title}
          </h3>
          <p className='text-xs text-gray-500 mb-3'>
            {book.author?.name ?? 'Author name'}
          </p>
        </div>

        <div className='flex items-center gap-2'>
          <span className='text-yellow-400'>★</span>
          <span className='text-sm'>{(book.rating ?? 0).toFixed(1)}</span>
        </div>
      </div>
    </div>
  );
}
