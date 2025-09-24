import { useNavigate } from 'react-router-dom';

const categories = [
  { id: 1, name: 'Fiction', img: '/categories/fiction.png' },
  { id: 2, name: 'Non-Fiction', img: '/categories/non-fiction.png' },
  { id: 3, name: 'Self-Improvement', img: '/categories/self-improvement.png' },
  { id: 4, name: 'Finance', img: '/categories/finance.png' },
  { id: 5, name: 'Science', img: '/categories/science.png' },
  { id: 6, name: 'Education', img: '/categories/education.png' },
];

export default function Categories() {
  const navigate = useNavigate();

  return (
    <div className='mb-8'>
      <div className='grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6'>
        {categories.map((cat) => (
          <div
            key={cat.id}
            onClick={() => navigate(`/books?categoryId=${cat.id}`)}
            className='flex flex-col items-center gap-2 cursor-pointer hover:scale-[1.01] transition'
            role='button'
            aria-label={`Open ${cat.name} books`}
          >
            <img
              src={cat.img}
              alt={cat.name}
              width={163}
              height={64}
              className='rounded-md object-cover'
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).src =
                  '/categories/placeholder.png';
              }}
            />
            <p className='text-sm font-medium'>{cat.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
