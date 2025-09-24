import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '../store/hooks';
import { removeFromCart } from '../store/slices/cartSlice';

export default function MyCart() {
  const cart = useAppSelector((s) => s.cart.items);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [selected, setSelected] = useState<number[]>([]);

  const toggleSelect = (id: number) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (selected.length === cart.length) {
      setSelected([]);
    } else {
      setSelected(cart.map((b) => b.id));
    }
  };

  const handleBorrow = () => {
    if (selected.length === 0) return;

    const selectedBooks = cart.filter((item) => selected.includes(item.id));
    localStorage.setItem('checkoutItems', JSON.stringify(selectedBooks));

    navigate('/checkout');
  };

  const handleDelete = (id: number) => {
    dispatch(removeFromCart(id));
    setSelected((prev) => prev.filter((x) => x !== id)); // biar hilang dari selected juga
  };

  const totalBooks = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);

  return (
    <div className='w-full flex justify-center px-4 py-8'>
      <div className='w-full max-w-[1000px] mx-auto flex flex-col md:flex-row gap-8'>
        {/* Left: Cart Items */}
        <div className='flex-1'>
          <h1 className='text-2xl font-bold text-gray-800 mb-4'>My Cart</h1>

          {/* Select All */}
          <label className='flex items-center gap-2 mb-6 text-gray-700 cursor-pointer'>
            <input
              type='checkbox'
              checked={selected.length === cart.length && cart.length > 0}
              onChange={toggleSelectAll}
              className='w-4 h-4 accent-blue-600'
            />
            <span className='text-sm font-medium'>Select All</span>
          </label>

          {/* Cart Items */}
          <div className='flex flex-col gap-4'>
            {cart.length === 0 ? (
              <p className='text-gray-600'>Your cart is empty.</p>
            ) : (
              cart.map((item) => (
                <div
                  key={item.id}
                  className='w-full md:w-[642px] h-auto md:h-[138px] flex items-center bg-white rounded-lg shadow overflow-hidden relative'
                >
                  <input
                    type='checkbox'
                    checked={selected.includes(item.id)}
                    onChange={() => toggleSelect(item.id)}
                    className='ml-3 mr-3 w-4 h-4 accent-blue-600'
                  />

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

                  {/* Delete Button */}
                  <button
                    onClick={() => handleDelete(item.id)}
                    className='absolute top-2 right-2 text-red-500 hover:text-red-700 text-sm font-medium'
                  >
                    ✕
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right: Loan Summary */}
        <div className='w-full md:w-[300px]'>
          <div className='bg-white rounded-2xl p-6'>
            <h2 className='font-semibold text-gray-800 mb-4'>Loan Summary</h2>
            <div className='flex justify-between text-sm text-gray-700 mb-6'>
              <span>Total Book</span>
              <span className='font-medium'>{totalBooks} Items</span>
            </div>
            <button
              onClick={handleBorrow}
              disabled={selected.length === 0}
              className='w-full md:w-[278px] h-[48px] rounded-full bg-blue-800 text-white font-medium hover:bg-blue-900 disabled:opacity-50 disabled:cursor-not-allowed'
            >
              Borrow Book
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
