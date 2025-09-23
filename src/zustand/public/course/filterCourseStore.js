import { create } from 'zustand';

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

export const useFilterCourseStore = create((set, get) => ({
  categories: [],
  instructor: [],
  loading: false,
  error: null,

  checkedCategories: {},
  checkedInstructor: {},
  checkedRatings: {},
  checkedPrice: getInitialCheckedSingle(price, 'type'),
  checkedLevel: getInitialCheckedSingle(level, 'type'),

  setCheckedCategories: (newState) => set({ checkedCategories: newState }),
  setCheckedInstructor: (newState) => set({ checkedInstructor: newState }),
  setCheckedRatings: (newState) => set({ checkedRatings: newState }),
  setCheckedPrice: (newState) => set({ checkedPrice: newState }),
  setCheckedLevel: (newState) => set({ checkedLevel: newState }),

  fetchFilterData: async () => {
    set({ loading: true, error: null });
    try {
      const res = await fetch(
        `${process.env.REACT_APP_BACKEND_BASE_URL}/api/tanamin-courses/filtering`,
        {
          headers: { 'Content-Type': 'application/json' },
        }
      );
      const json = await res.json();
      if (json.status !== 'success') throw new Error(json.message || 'Failed to fetch filter data');

      // Transform category and instructor objects to arrays
      const categoriesArr = [
        {
          id: 'all-categories',
          title: 'semua',
          count: Object.values(json.data.category).reduce((a, b) => a + b, 0),
        },
        ...Object.entries(json.data.category).map(([title, count], idx) => ({
          id: `cat-${idx + 1}`,
          title,
          count,
        })),
      ];
      const instructorArr = [
        {
          id: 'all-instructor',
          name: 'semua',
          count: Object.values(json.data.instructor).reduce((a, b) => a + b, 0),
        },
        ...Object.entries(json.data.instructor).map(([name, count], idx) => ({
          id: `ins-${idx + 1}`,
          name,
          count,
        })),
      ];

      set({
        categories: categoriesArr,
        instructor: instructorArr,
        checkedCategories: getInitialChecked(categoriesArr, 'title'),
        checkedInstructor: getInitialChecked(instructorArr, 'name'),
        loading: false,
        error: null,
      });
    } catch (e) {
      set({ error: e.message, loading: false });
    }
  },

  // Utility to get only active filters (id/type)
  getActiveFilters: () => {
    const state = get();

    const activeCategories = state.categories
      .filter((cat) => state.checkedCategories[cat.title] && cat.title !== 'semua')
      .map((cat) => cat.id);

    const activeInstructor = state.instructor
      .filter((ins) => state.checkedInstructor[ins.name] && ins.name !== 'semua')
      .map((ins) => ins.id);

    const activeRatings = rating.filter((r) => state.checkedRatings[r.rating]).map((r) => r.rating);

    const activePrice = price.find((p) => state.checkedPrice[p.type]);
    const activePriceType = activePrice ? activePrice.type : null;

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

export { rating, price, level };
