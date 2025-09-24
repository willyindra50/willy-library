import { motion } from 'framer-motion';
import Categories from '../components/home/Categories';
import Recommendation from '../components/home/Recommendation';
import PopularAuthors from '../components/home/PopularAuthors';

export default function Home() {
  // Variants animasi reusable
  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <div className='flex flex-col min-h-screen'>
      <main className='flex-1'>
        <div className='max-w-[1200px] mx-auto px-4 py-8 space-y-12'>
          {/* Cover Image */}
          <motion.div
            className='mb-8'
            variants={fadeInUp}
            initial='hidden'
            animate='visible'
            transition={{ duration: 0.8, ease: 'easeOut' }}
          >
            <img
              src='/welcome.png'
              alt='Welcome'
              width={1200}
              height={441}
              className='w-full h-auto rounded-lg shadow'
            />
          </motion.div>

          {/* Categories */}
          <motion.div
            variants={fadeInUp}
            initial='hidden'
            whileInView='visible'
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
          >
            <Categories />
          </motion.div>

          {/* Recommendation */}
          <motion.div
            variants={fadeInUp}
            initial='hidden'
            whileInView='visible'
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.7, ease: 'easeOut', delay: 0.1 }}
          >
            <Recommendation />
          </motion.div>

          {/* Popular Authors */}
          <motion.div
            variants={fadeInUp}
            initial='hidden'
            whileInView='visible'
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.7, ease: 'easeOut', delay: 0.2 }}
          >
            <PopularAuthors />
          </motion.div>
        </div>
      </main>
    </div>
  );
}
