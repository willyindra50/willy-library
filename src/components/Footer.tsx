import { Facebook, Instagram, Linkedin, Music2 } from 'lucide-react';

export default function Footer() {
  return (
    <footer className='w-full border-t border-gray-200 bg-white mt-12'>
      <div className='w-full max-w-[1200px] mx-auto px-4 sm:px-6 py-10 flex flex-col items-center text-center gap-6'>
        {/* Logo + Booky */}
        <div className='flex items-center gap-2'>
          <img
            src='/navbar.png'
            alt='Booky Logo'
            className='w-[42px] h-[42px] object-contain'
          />
          <h2 className='text-xl font-bold text-gray-900'>Booky</h2>
        </div>

        {/* Description */}
        <p className='text-gray-600 text-sm max-w-xl'>
          Discover inspiring stories & timeless knowledge, ready to borrow
          anytime. Explore online or visit our nearest library branch.
        </p>

        {/* Follow Text */}
        <span className='text-sm font-medium text-gray-800'>
          Follow on Social Media
        </span>

        {/* Social Icons */}
        <div className='flex gap-6'>
          <a
            href='#'
            className='w-9 h-9 rounded-full border flex items-center justify-center hover:bg-gray-100'
          >
            <Facebook className='w-4 h-4 text-gray-800' />
          </a>
          <a
            href='#'
            className='w-9 h-9 rounded-full border flex items-center justify-center hover:bg-gray-100'
          >
            <Instagram className='w-4 h-4 text-gray-800' />
          </a>
          <a
            href='#'
            className='w-9 h-9 rounded-full border flex items-center justify-center hover:bg-gray-100'
          >
            <Linkedin className='w-4 h-4 text-gray-800' />
          </a>
          <a
            href='#'
            className='w-9 h-9 rounded-full border flex items-center justify-center hover:bg-gray-100'
          >
            {/* TikTok pakai Music2 icon */}
            <Music2 className='w-4 h-4 text-gray-800' />
          </a>
        </div>
      </div>
    </footer>
  );
}
