import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '../store/hooks';
import api from '../api/axios';
import { clearCart } from '../store/slices/cartSlice';
import type { AxiosError } from 'axios';

interface Book {
  id: number;
  title: string;
  author?: string;
  category: string;
  image: string;
  quantity?: number;
}

export default function CheckOut() {
  const auth = useAppSelector((s) => s.auth);
  const cart = useAppSelector((s) => s.cart.items);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const [checkoutItems, setCheckoutItems] = useState<Book[]>([]);
  const [borrowDate, setBorrowDate] = useState<string>('');
  const [days, setDays] = useState<number>(3);
  const [agree, setAgree] = useState(false);
  const [accept, setAccept] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('checkoutItems');
    if (saved) {
      setCheckoutItems(JSON.parse(saved));
    } else {
      setCheckoutItems(cart);
    }
  }, [cart]);

  const returnDate = borrowDate
    ? new Date(new Date(borrowDate).getTime() + days * 24 * 60 * 60 * 1000)
    : null;

  const handleSubmit = async () => {
    if (!agree || !accept || !borrowDate) return;

    try {
      for (const book of checkoutItems) {
        await api.post('/api/loans', {
          bookId: book.id,
          days, // ⬅️ hanya ini yang dikirim
        });
      }

      dispatch(clearCart());
      localStorage.removeItem('checkoutItems');

      navigate('/success');
    } catch (err) {
      const error = err as AxiosError<{ message?: string }>;
      console.error('Borrow failed', error.response?.data || error.message);
      alert(
        `Borrow failed: ${error.response?.data?.message || 'Please try again.'}`
      );
    }
  };

  return (
    <div className='w-full flex justify-center px-4 py-8'>
      <div className='w-full max-w-[1000px] mx-auto flex flex-col md:flex-row gap-8'>
        {/* Left */}
        <div className='flex-1'>
          <h1 className='text-2xl font-bold text-gray-800 mb-6'>Checkout</h1>

          {/* User Info */}
          <div className='mb-6'>
            <h2 className='font-semibold text-gray-700 mb-2'>
              User Information
            </h2>
            <p className='text-sm text-gray-600'>
              <span className='font-medium'>Name:</span>{' '}
              {auth.user?.name || 'Guest'}
            </p>
            <p className='text-sm text-gray-600'>
              <span className='font-medium'>Email:</span>{' '}
              {auth.user?.email || '-'}
            </p>
            <p className='text-sm text-gray-600'>
              <span className='font-medium'>Nomor Handphone:</span> 081234567890
            </p>
          </div>

          {/* Book List */}
          <h2 className='font-semibold text-gray-700 mb-4'>Book List</h2>
          <div className='flex flex-col gap-4'>
            {checkoutItems.length === 0 ? (
              <p className='text-gray-500'>No books selected.</p>
            ) : (
              checkoutItems.map((item) => (
                <div
                  key={item.id}
                  className='w-full md:w-[466px] flex items-center bg-white rounded-lg shadow overflow-hidden'
                >
                  <img
                    src={item.image}
                    alt={item.title}
                    className='w-[92px] h-[138px] object-cover'
                  />
                  <div className='flex flex-col justify-center px-4 flex-1'>
                    <span className='px-2 py-1 border rounded text-xs text-gray-600 w-fit'>
                      {item.category}
                    </span>
                    <h2 className='text-base font-semibold text-gray-800 mt-1'>
                      {item.title}
                    </h2>
                    <p className='text-sm text-gray-600'>
                      {item.author ?? 'Unknown Author'}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right */}
        <div className='w-full md:w-[400px]'>
          <div className='bg-white rounded-2xl p-6 shadow'>
            <h2 className='font-semibold text-gray-800 mb-4'>
              Complete Your Borrow Request
            </h2>

            {/* Borrow Date */}
            <div className='mb-4'>
              <label className='block text-sm font-medium text-gray-700 mb-1'>
                Borrow Date
              </label>
              <input
                type='date'
                value={borrowDate}
                onChange={(e) => setBorrowDate(e.target.value)}
                className='w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500'
              />
            </div>

            {/* Duration */}
            <div className='mb-4'>
              <label className='block text-sm font-medium text-gray-700 mb-2'>
                Borrow Duration
              </label>
              <div className='flex flex-col gap-2'>
                {[3, 5, 10].map((d) => (
                  <label
                    key={d}
                    className='flex items-center gap-2 cursor-pointer'
                  >
                    <input
                      type='radio'
                      checked={days === d}
                      onChange={() => setDays(d)}
                      className='w-4 h-4 accent-blue-600'
                    />
                    <span>{d} Days</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Return Date */}
            <div className='mb-4 bg-gray-50 rounded-lg p-3 text-sm'>
              <span className='font-medium text-gray-700'>Return Date: </span>
              {returnDate ? (
                <span className='text-red-600 font-medium'>
                  {returnDate.toLocaleDateString('en-GB', {
                    day: '2-digit',
                    month: 'long',
                    year: 'numeric',
                  })}
                </span>
              ) : (
                <span className='text-gray-500'>Please select borrow date</span>
              )}
            </div>

            {/* Agreements */}
            <div className='flex flex-col gap-2 mb-4 text-sm text-gray-700'>
              <label className='flex items-center gap-2 cursor-pointer'>
                <input
                  type='checkbox'
                  checked={agree}
                  onChange={(e) => setAgree(e.target.checked)}
                  className='w-4 h-4 accent-blue-600'
                />
                I agree to return the book(s) before the due date.
              </label>
              <label className='flex items-center gap-2 cursor-pointer'>
                <input
                  type='checkbox'
                  checked={accept}
                  onChange={(e) => setAccept(e.target.checked)}
                  className='w-4 h-4 accent-blue-600'
                />
                I accept the library borrowing policy.
              </label>
            </div>

            <button
              onClick={handleSubmit}
              disabled={
                !borrowDate || !agree || !accept || checkoutItems.length === 0
              }
              className='w-full rounded-full bg-blue-700 text-white font-medium py-2 hover:bg-blue-800 disabled:opacity-50 disabled:cursor-not-allowed'
            >
              Confirm & Borrow
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
