import { useQuery } from '@tanstack/react-query';
import api from '../../api/axios';

type Author = {
  id: number;
  name: string;
  bio: string;
  createdAt: string;
  updatedAt: string;
  books?: number; // jumlah buku (sementara hardcode/0 kalau BE belum kasih)
};

export default function PopularAuthors() {
  const { data, isLoading } = useQuery<Author[]>({
    queryKey: ['authors'],
    queryFn: async () => {
      const res = await api.get<{
        success: boolean;
        message: string;
        data: { authors: Author[] };
      }>('/api/authors');
      return res.data.data.authors;
    },
  });

  if (isLoading) return <p>Loading...</p>;

  const authors = (data ?? []).slice(0, 4); // ✅ hanya ambil 4

  return (
    <div className='mb-12'>
      <h2 className='text-xl font-semibold mb-4'>Popular Authors</h2>
      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6'>
        {authors.map((author) => (
          <div
            key={author.id}
            className='flex items-center w-full max-w-[500px] lg:max-w-none mx-auto h-[113px] shadow rounded-lg bg-white overflow-hidden p-3'
          >
            <img
              src='/author.png'
              alt={author.name}
              width={81}
              height={81}
              className='w-[81px] h-[81px] object-cover rounded'
            />
            <div className='ml-3 flex-1'>
              <p className='font-medium truncate'>{author.name}</p>
              <p className='text-sm text-gray-500 truncate'>
                {author.books ?? 0} books
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
