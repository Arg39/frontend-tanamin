import React, { useState, useEffect } from 'react';
import Checkbox from '../form/checkbox';
import StarRating from '../content/star/star';
import { useFilterCourseStore } from '../../zustand/public/course/filterCourseStore';
import Icon from '../icons/icon';
import { motion, AnimatePresence } from 'framer-motion';

function handleIndividualCheckboxChange(items, name, checked, state, setState, key = 'title') {
  const newState = { ...state };

  if (name === 'semua' && checked) {
    items.forEach((item) => {
      newState[item[key]] = item[key] === 'semua';
    });
  } else if (name === 'semua' && !checked) {
    newState['semua'] = false;
  } else if (name !== 'semua' && checked) {
    newState[name] = true;
    newState['semua'] = false;
  } else if (name !== 'semua' && !checked) {
    newState[name] = false;
    newState['semua'] = false;
  }
  setState(newState);
}

function handleSingleActiveCheckboxChange(items, name, checked, setState, key = 'type') {
  const newState = {};
  if (checked) {
    items.forEach((item) => {
      newState[item[key]] = item[key] === name;
    });
  } else {
    items.forEach((item) => {
      newState[item[key]] = item[key] === 'all';
    });
  }
  setState(newState);
}

export default function FilterCard({ isMobile = false, onResetFilter }) {
  // Zustand store hooks
  const categories = useFilterCourseStore((state) => state.categories);
  const instructor = useFilterCourseStore((state) => state.instructor);
  const ratings = useFilterCourseStore((state) => state.ratings);
  const prices = useFilterCourseStore((state) => state.prices);
  const levels = useFilterCourseStore((state) => state.levels);

  const loading = useFilterCourseStore((state) => state.loading);
  const error = useFilterCourseStore((state) => state.error);
  const fetchFilterData = useFilterCourseStore((state) => state.fetchFilterData);

  const checkedCategories = useFilterCourseStore((state) => state.checkedCategories);
  const setCheckedCategories = useFilterCourseStore((state) => state.setCheckedCategories);

  const checkedInstructor = useFilterCourseStore((state) => state.checkedInstructor);
  const setCheckedInstructor = useFilterCourseStore((state) => state.setCheckedInstructor);

  const checkedRatings = useFilterCourseStore((state) => state.checkedRatings);
  const setCheckedRatings = useFilterCourseStore((state) => state.setCheckedRatings);

  const checkedPrice = useFilterCourseStore((state) => state.checkedPrice);
  const setCheckedPrice = useFilterCourseStore((state) => state.setCheckedPrice);

  const checkedLevel = useFilterCourseStore((state) => state.checkedLevel);
  const setCheckedLevel = useFilterCourseStore((state) => state.setCheckedLevel);

  const getActiveFilters = useFilterCourseStore((state) => state.getActiveFilters);

  const resetFilters = useFilterCourseStore((state) => state.resetFilters);

  const hasActiveFilters = useFilterCourseStore((state) => state.hasActiveFilters());

  // State untuk "lihat lebih"
  const [visibleCategories, setVisibleCategories] = useState(6);
  const [visibleInstructor, setVisibleInstructor] = useState(6);

  useEffect(() => {
    fetchFilterData();
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    const activeFilters = getActiveFilters();
  }, [
    checkedCategories,
    checkedInstructor,
    checkedRatings,
    checkedPrice,
    checkedLevel,
    getActiveFilters,
  ]);

  if (loading) {
    return (
      <div className="w-full flex flex-col h-fit p-6 sm:p-8 shadow-md rounded-md bg-white">
        <p>Loading filter data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full flex flex-col h-fit p-6 sm:p-8 shadow-md rounded-md bg-white">
        <p className="text-red-600">Error: {error}</p>
      </div>
    );
  }

  const filterContent = (
    <div
      className={
        isMobile
          ? 'w-full flex flex-col h-fit p-6 sm:p-8 shadow-md rounded-md bg-white overflow-y-auto max-h-[90vh]'
          : 'w-full flex flex-col h-fit p-6 sm:p-8 shadow-md rounded-md bg-white mt-16 lg:mt-0'
      }
    >
      <div className="w-full p-2 justify-center items-center flex flex-col gap-2">
        <p className="text-xl text-center text-secondary-800">Filter Kursus</p>
        {/* Tombol Reset Filter dengan animasi */}
        <AnimatePresence>
          {hasActiveFilters && (
            <motion.div
              key="reset-filter-btn"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="w-full flex justify-center"
            >
              <button
                className="mt-2 flex items-center gap-2 px-6 py-2 rounded bg-error-500 text-white hover:bg-error-600 border border-error-600 text-sm font-medium shadow-sm focus:outline-none focus:ring-2 focus:ring-error-400 transition"
                onClick={() => {
                  resetFilters();
                  if (onResetFilter) onResetFilter();
                }}
                type="button"
              >
                <Icon type="trash" className="" />
                Reset Filter
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <div className="mt-8 flex flex-col gap-8">
        {/* Kategori */}
        <div className="flex flex-col gap-2">
          <p className="pb-1 border-b border-secondary-800 text-secondary-800">Kategori</p>
          <div className="flex flex-col gap-2">
            {categories.slice(0, visibleCategories).map((cat) => (
              <div key={cat.id} className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <Checkbox
                    box
                    name={cat.id}
                    checked={!!checkedCategories[cat.id]}
                    onChange={({ target: { name, checked } }) => {
                      // Perubahan: trigger filter langsung
                      const newState = {};
                      categories.forEach((item) => {
                        newState[item.id] = item.id === name ? checked : false;
                      });
                      // Jika uncheck, fallback ke 'all-categories'
                      if (!checked) {
                        newState['all-categories'] = true;
                      }
                      setCheckedCategories(newState);
                    }}
                    className="w-4 h-4"
                  />
                  <p>{cat.title}</p>
                </div>
                <p
                  className={`p-[1px] px-2 rounded-md text-white ${
                    checkedCategories[cat.id] ? 'bg-primary-700' : 'bg-secondary-500'
                  }`}
                >
                  {cat.count}
                </p>
              </div>
            ))}
            {categories.length > visibleCategories && (
              <button
                className="text-tertiary-600 text-base mt-1 self-start"
                onClick={() => setVisibleCategories((prev) => prev + 6)}
              >
                Lihat lebih...
              </button>
            )}
          </div>
        </div>

        {/* Rating */}
        <div className="flex flex-col gap-2">
          <p className="pb-1 border-b border-secondary-800 text-secondary-800">Rating</p>
          <div className="flex flex-col gap-2">
            {ratings.map((rate) => (
              <div key={rate.rating} className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <Checkbox
                    box
                    name={String(rate.rating)}
                    checked={!!checkedRatings[rate.rating]}
                    onChange={({ target: { name, checked } }) =>
                      setCheckedRatings({
                        ...checkedRatings,
                        [name]: checked,
                      })
                    }
                    className="w-4 h-4"
                  />
                  <StarRating value={rate.rating} size={6} />
                </div>
                <p
                  className={`p-[1px] px-2 rounded-md text-white ${
                    checkedRatings[rate.rating] ? 'bg-primary-700' : 'bg-secondary-500'
                  }`}
                >
                  {rate.count}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Instruktur */}
        <div className="flex flex-col gap-2">
          <p className="pb-1 border-b border-secondary-800 text-secondary-800">Instruktur</p>
          <div className="flex flex-col gap-2">
            {instructor.slice(0, visibleInstructor).map((ins) => (
              <div key={ins.id} className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <Checkbox
                    box
                    name={ins.name}
                    checked={!!checkedInstructor[ins.name]}
                    onChange={({ target: { name, checked } }) =>
                      handleIndividualCheckboxChange(
                        instructor,
                        name,
                        checked,
                        checkedInstructor,
                        setCheckedInstructor,
                        'name'
                      )
                    }
                    className="w-4 h-4"
                  />
                  <p>{ins.name}</p>
                </div>
                <p
                  className={`p-[1px] px-2 rounded-md text-white ${
                    checkedInstructor[ins.name] ? 'bg-primary-700' : 'bg-secondary-500'
                  }`}
                >
                  {ins.count}
                </p>
              </div>
            ))}
            {instructor.length > visibleInstructor && (
              <button
                className="text-tertiary-600 text-base mt-1 self-start"
                onClick={() => setVisibleInstructor((prev) => prev + 6)}
              >
                Lihat lebih...
              </button>
            )}
          </div>
        </div>

        {/* Harga */}
        <div className="flex flex-col gap-2">
          <p className="pb-1 border-b border-secondary-800 text-secondary-800">Harga</p>
          <div className="flex flex-col gap-2">
            {prices.map((p) => (
              <div key={p.type} className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <Checkbox
                    box
                    name={p.type}
                    checked={!!checkedPrice[p.type]}
                    onChange={({ target: { name, checked } }) =>
                      handleSingleActiveCheckboxChange(
                        prices,
                        name,
                        checked,
                        setCheckedPrice,
                        'type'
                      )
                    }
                    className="w-4 h-4"
                  />
                  <p>{p.title}</p>
                </div>
                <p
                  className={`p-[1px] px-2 rounded-md text-white ${
                    checkedPrice[p.type] ? 'bg-primary-700' : 'bg-secondary-500'
                  }`}
                >
                  {p.count}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Level */}
        <div className="flex flex-col gap-2">
          <p className="pb-1 border-b border-secondary-800 text-secondary-800">Level</p>
          <div className="flex flex-col gap-2">
            {levels.map((lvl) => (
              <div key={lvl.type} className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <Checkbox
                    box
                    name={lvl.type}
                    checked={!!checkedLevel[lvl.type]}
                    onChange={({ target: { name, checked } }) =>
                      handleSingleActiveCheckboxChange(
                        levels,
                        name,
                        checked,
                        setCheckedLevel,
                        'type'
                      )
                    }
                    className="w-4 h-4"
                  />
                  <p>{lvl.title}</p>
                </div>
                <p
                  className={`p-[1px] px-2 rounded-md text-white ${
                    checkedLevel[lvl.type] ? 'bg-primary-700' : 'bg-secondary-500'
                  }`}
                >
                  {lvl.count}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  return filterContent;
}
