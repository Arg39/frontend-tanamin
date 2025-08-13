import { create } from 'zustand';

const categories = [
  { id: 'all-categories', title: 'semua', count: 7 },
  { id: 'cat-1', title: 'Programming', count: 3 },
  { id: 'cat-2', title: 'Design', count: 2 },
  { id: 'cat-3', title: 'Marketing', count: 2 },
  { id: 'cat-4', title: 'Business', count: 4 },
  { id: 'cat-5', title: 'Finance', count: 1 },
  { id: 'cat-6', title: 'Photography', count: 2 },
  { id: 'cat-7', title: 'Music', count: 3 },
  { id: 'cat-8', title: 'Cooking', count: 2 },
  { id: 'cat-9', title: 'Language', count: 2 },
  { id: 'cat-10', title: 'Science', count: 1 },
  { id: 'cat-11', title: 'Health', count: 2 },
];

const instructor = [
  { id: 'all-instructor', name: 'semua', count: 21 },
  { id: 'ins-1', name: 'Angra blastsada', count: 7 },
  { id: 'ins-2', name: 'bras', count: 7 },
  { id: 'ins-3', name: 'vasterio', count: 7 },
  { id: 'ins-4', name: 'Rina', count: 2 },
  { id: 'ins-5', name: 'Budi', count: 3 },
  { id: 'ins-6', name: 'Siti', count: 2 },
  { id: 'ins-7', name: 'Joko', count: 1 },
  { id: 'ins-8', name: 'Dewi', count: 2 },
  { id: 'ins-9', name: 'Tono', count: 2 },
  { id: 'ins-10', name: 'Lisa', count: 1 },
  { id: 'ins-11', name: 'Andi', count: 2 },
  { id: 'ins-12', name: 'Rudi', count: 1 },
  { id: 'ins-13', name: 'Sari', count: 2 },
  { id: 'ins-14', name: 'Eko', count: 1 },
  { id: 'ins-15', name: 'Wati', count: 2 },
];

const rating = [
  { rating: 5, count: 17 },
  { rating: 4, count: 2 },
  { rating: 3, count: 4 },
  { rating: 2, count: 3 },
  { rating: 1, count: 2 },
];

const price = [
  { title: 'semua', type: 'all', count: 21 },
  { title: 'gratis', type: 'free', count: 8 },
  { title: 'berbayar', type: 'paid', count: 13 },
];

const level = [
  { title: 'semua', type: 'all', count: 21 },
  { title: 'pemula', type: 'beginner', count: 7 },
  { title: 'menengah', type: 'intermediate', count: 7 },
  { title: 'mahir', type: 'advance', count: 7 },
];

function getInitialChecked(items, key = 'title') {
  const checked = {};
  items.forEach((item) => {
    checked[item[key]] = item[key] === 'semua';
  });
  return checked;
}

function getInitialCheckedSingle(items, key = 'type') {
  const checked = {};
  items.forEach((item) => {
    checked[item[key]] = item[key] === 'all';
  });
  return checked;
}

export const useFilterCourseStore = create((set, get) => ({
  checkedCategories: getInitialChecked(categories, 'title'),
  checkedInstructor: getInitialChecked(instructor, 'name'),
  checkedRatings: {},
  checkedPrice: getInitialCheckedSingle(price, 'type'),
  checkedLevel: getInitialCheckedSingle(level, 'type'),

  setCheckedCategories: (newState) => set({ checkedCategories: newState }),
  setCheckedInstructor: (newState) => set({ checkedInstructor: newState }),
  setCheckedRatings: (newState) => set({ checkedRatings: newState }),
  setCheckedPrice: (newState) => set({ checkedPrice: newState }),
  setCheckedLevel: (newState) => set({ checkedLevel: newState }),

  // Utility to get only active filters (id/type)
  getActiveFilters: () => {
    const state = get();

    // Categories: get ids of checked categories except 'semua'
    const activeCategories = categories
      .filter((cat) => state.checkedCategories[cat.title] && cat.title !== 'semua')
      .map((cat) => cat.id);

    // Instructor: get ids of checked instructors except 'semua'
    const activeInstructor = instructor
      .filter((ins) => state.checkedInstructor[ins.name] && ins.name !== 'semua')
      .map((ins) => ins.id);

    // Ratings: get ratings that are checked
    const activeRatings = rating.filter((r) => state.checkedRatings[r.rating]).map((r) => r.rating);

    // Price: get type that is checked
    const activePrice = price.find((p) => state.checkedPrice[p.type]);
    const activePriceType = activePrice ? activePrice.type : null;

    // Level: get type that is checked
    const activeLevel = level.find((lvl) => state.checkedLevel[lvl.type]);
    const activeLevelType = activeLevel ? activeLevel.type : null;

    return {
      categories: activeCategories,
      instructor: activeInstructor,
      ratings: activeRatings,
      price: activePriceType,
      level: activeLevelType,
    };
  },
}));

// Export data for use in FilterCard
export { categories, instructor, rating, price, level };
