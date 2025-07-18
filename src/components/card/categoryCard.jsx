import Icon from '../icons/icon';
import { motion } from 'framer-motion';

export default function CategoryCard({ category, onClick }) {
  return (
    <motion.button
      type="button"
      className="w-full max-w-xs h-24 bg-white rounded-lg flex overflow-hidden focus:outline-none focus:ring-2 focus:ring-primary-400 transition"
      style={{ boxShadow: '0px 4px 20px 0px rgba(0,0,0,0.2)' }}
      onClick={onClick}
      aria-label={`Cari kategori ${category.name}`}
      whileHover={{ y: -8 }}
      transition={{ type: 'spring', stiffness: 300 }}
    >
      <img
        className="h-full w-20 sm:w-24 object-cover"
        src={category.imageUrl}
        alt={category.name}
      />
      <div className="w-full flex p-2">
        <div className="w-full flex flex-col justify-center">
          <h1 className="text-base sm:text-xl font-medium w-[120px] sm:w-[200px] overflow-hidden text-primary-900 line-clamp-2 text-left">
            {category.name}
          </h1>
          <div className="w-full flex items-center gap-2">
            <p className="text-sm sm:text-base text-secondary-500">{category.used ?? 0} Courses</p>
            <div className="text-secondary-500">
              <Icon type={'arrow-right'} className={'w-4 h-4'} />
            </div>
          </div>
        </div>
      </div>
    </motion.button>
  );
}
