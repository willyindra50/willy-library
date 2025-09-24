import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { logout } from '../store/slices/authSlice';
import { ShoppingCart, Menu } from 'lucide-react';

export default function Navbar() {
  const { user } = useAppSelector((s) => s.auth);
  const cartItems = useAppSelector((s) => s.cart.items);
  const dispatch = useAppDispatch();
  const [open, setOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();

  const initials =
    user?.name
      ?.split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase() || '?';

  return (
    <nav className='w-full bg-white relative px-4 sm:px-6 py-4'>
      <div className='w-full max-w-[1440px] mx-auto flex items-center justify-between'>
        {/* Left: Logo */}
        <Link to='/' className='flex items-center gap-2'>
          <img
            src='/navbar.png'
            alt='Booky logo'
            className='w-[42px] h-[42px] object-contain'
          />
          <span className='hidden md:flex w-[98px] h-[42px] items-center font-bold text-gray-800 text-[24px] leading-none'>
            Booky
          </span>
        </Link>

        {/* Middle: Search bar (desktop only) */}
        <div className='hidden md:block absolute left-1/2 -translate-x-1/2 w-full max-w-lg'>
          <div className='relative'>
            <img
              src='/search.png'
              alt='search icon'
              className='absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4'
            />
            <input
              type='text'
              placeholder='Search book'
              className='w-full border border-neutral-300 rounded-full pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500'
            />
          </div>
        </div>

        {/* Right */}
        <div className='flex items-center gap-4 relative'>
          {/* Mobile Hamburger */}
          {!user && (
            <button
              onClick={() => setMobileOpen((p) => !p)}
              className='block md:hidden'
            >
              <Menu className='w-6 h-6 text-gray-700' />
            </button>
          )}

          {/* Search icon (mobile only) */}
          <button
            onClick={() => navigate('/search')}
            className='block md:hidden'
          >
            <img src='/search.png' alt='search icon' className='w-6 h-6' />
          </button>

          {/* Cart */}
          <Link to='/my-cart' className='relative'>
            <ShoppingCart className='w-6 h-6 text-gray-700' />
            {cartItems.length > 0 && (
              <span className='absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full px-1'>
                {cartItems.reduce((sum, item) => sum + (item.quantity || 1), 0)}
              </span>
            )}
          </Link>

          {/* User */}
          {user ? (
            <div className='relative'>
              <button
                onClick={() => setOpen((p) => !p)}
                className='flex items-center gap-2'
              >
                <div className='w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center text-white text-sm font-bold'>
                  {initials}
                </div>
                <span className='hidden md:inline text-sm font-medium text-gray-800'>
                  {user.name}
                </span>
                <svg
                  className='hidden md:block w-4 h-4 text-gray-600'
                  fill='none'
                  stroke='currentColor'
                  viewBox='0 0 24 24'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M19 9l-7 7-7-7'
                  />
                </svg>
              </button>

              {open && (
                <div className='absolute right-0 mt-2 w-40 bg-white border rounded-lg shadow-lg py-2 z-50'>
                  <Link
                    to='/profile'
                    className='block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100'
                    onClick={() => setOpen(false)}
                  >
                    Profile
                  </Link>
                  <Link
                    to='/borrowed-list'
                    className='block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100'
                    onClick={() => setOpen(false)}
                  >
                    Borrowed List
                  </Link>
                  <button
                    onClick={() => {
                      dispatch(logout());
                      setOpen(false);
                    }}
                    className='block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100'
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              {/* Desktop Login & Register */}
              <div className='hidden md:flex items-center gap-3'>
                <Link
                  to='/login'
                  className='px-4 py-2 border border-gray-300 rounded-full text-sm font-medium text-gray-700 hover:bg-gray-100'
                >
                  Login
                </Link>
                <Link
                  to='/register'
                  className='px-4 py-2 bg-blue-700 text-white rounded-full text-sm font-medium hover:bg-blue-800'
                >
                  Register
                </Link>
              </div>

              {/* Mobile dropdown (Hamburger menu) */}
              {mobileOpen && (
                <div className='absolute top-14 right-0 w-40 bg-white border rounded-lg shadow-lg py-2 z-50 md:hidden'>
                  <Link
                    to='/login'
                    className='block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100'
                    onClick={() => setMobileOpen(false)}
                  >
                    Login
                  </Link>
                  <Link
                    to='/register'
                    className='block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100'
                    onClick={() => setMobileOpen(false)}
                  >
                    Register
                  </Link>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
