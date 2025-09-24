import { useNavigate } from 'react-router-dom';

export default function Success() {
  const navigate = useNavigate();

  return (
    <div className='flex flex-col min-h-screen bg-white'>
      {/* Content */}
      <main className='flex flex-1 justify-center items-center px-4 py-8'>
        <div className='w-full max-w-[638px] h-auto bg-white rounded-2xl flex flex-col justify-center items-center text-center p-6 shadow'>
          {/* Icon */}
          <div className='w-[80px] h-[80px] flex items-center justify-center rounded-full bg-blue-100 mb-6'>
            <svg
              className='w-10 h-10 text-blue-600'
              fill='none'
              stroke='currentColor'
              strokeWidth={2.5}
              viewBox='0 0 24 24'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                d='M5 13l4 4L19 7'
              />
            </svg>
          </div>

          {/* Text */}
          <h1 className='text-xl md:text-2xl font-semibold text-gray-800 mb-2'>
            Borrowing Successful!
          </h1>
          <p className='text-sm md:text-base text-gray-600 mb-6'>
            Your book has been successfully borrowed. Please return it by{' '}
            <span className='text-red-600 font-medium'>31 August 2025</span>
          </p>

          {/* Button */}
          <button
            onClick={() => navigate('/borrowed-list')}
            className='w-[220px] rounded-full bg-blue-600 text-white font-medium py-2 hover:bg-blue-700'
          >
            See Borrowed List
          </button>
        </div>
      </main>
    </div>
  );
}
