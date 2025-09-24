import Categories from '../components/home/Categories';
import Recommendation from '../components/home/Recommendation';
import PopularAuthors from '../components/home/PopularAuthors';

export default function Home() {
  return (
    <div className='flex flex-col min-h-screen'>
      <main className='flex-1'>
        <div className='max-w-[1200px] mx-auto px-4 py-8'>
          {/* Cover Image */}
          <div className='mb-8'>
            <img
              src='/welcome.png'
              alt='Welcome'
              width={1200}
              height={441}
              className='w-full h-auto rounded-lg shadow'
            />
          </div>

          {/* Categories */}
          <Categories />

          {/* Recommendation */}
          <Recommendation />

          {/* Popular Authors */}
          <PopularAuthors />
        </div>
      </main>
    </div>
  );
}
