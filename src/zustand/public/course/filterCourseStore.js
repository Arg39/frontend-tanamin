import { create } from 'zustand';

const FILTER_STORAGE_KEY = 'tanamin_course_filters';

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

// Helper to load filters from localStorage
function loadFiltersFromStorage() {
  try {
    const data = localStorage.getItem(FILTER_STORAGE_KEY);
    if (!data) return null;
    return JSON.parse(data);
  } catch {
    return null;
  }
}

// Helper to save filters to localStorage
function saveFiltersToStorage(filters) {
  try {
    localStorage.setItem(FILTER_STORAGE_KEY, JSON.stringify(filters));
  } catch {}
}

export const useFilterCourseStore = create((set, get) => {
  // Try to load from localStorage
  const stored = loadFiltersFromStorage();

  // Initial state
  const initialState = {
    categories: [],
    instructor: [],
    loading: false,
    error: null,
    checkedCategories: stored?.checkedCategories || {},
    checkedInstructor: stored?.checkedInstructor || {},
    checkedRatings: stored?.checkedRatings || {},
    checkedPrice: stored?.checkedPrice || getInitialCheckedSingle(price, 'type'),
    checkedLevel: stored?.checkedLevel || getInitialCheckedSingle(level, 'type'),
  };

  // Save all filters to localStorage
  function persistFilters(partial = {}) {
    const state = get();
    saveFiltersToStorage({
      checkedCategories: partial.checkedCategories ?? state.checkedCategories,
      checkedInstructor: partial.checkedInstructor ?? state.checkedInstructor,
      checkedRatings: partial.checkedRatings ?? state.checkedRatings,
      checkedPrice: partial.checkedPrice ?? state.checkedPrice,
      checkedLevel: partial.checkedLevel ?? state.checkedLevel,
    });
  }

  return {
    ...initialState,

    setCheckedCategories: (newState) => {
      set({ checkedCategories: newState });
      persistFilters({ checkedCategories: newState });
    },
    setCheckedInstructor: (newState) => {
      set({ checkedInstructor: newState });
      persistFilters({ checkedInstructor: newState });
    },
    setCheckedRatings: (newState) => {
      set({ checkedRatings: newState });
      persistFilters({ checkedRatings: newState });
    },
    setCheckedPrice: (newState) => {
      set({ checkedPrice: newState });
      persistFilters({ checkedPrice: newState });
    },
    setCheckedLevel: (newState) => {
      set({ checkedLevel: newState });
      persistFilters({ checkedLevel: newState });
    },

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
        if (json.status !== 'success')
          throw new Error(json.message || 'Failed to fetch filter data');

        // Transform category and instructor arrays to expected format
        const categoriesArr = [
          {
            id: 'all-categories',
            title: 'semua',
            count: json.data.category.reduce((a, b) => a + (b.published_courses_count || 0), 0),
          },
          ...json.data.category.map((cat) => ({
            id: cat.id,
            title: cat.name,
            count: cat.published_courses_count,
          })),
        ];
        const instructorArr = [
          {
            id: 'all-instructor',
            name: 'semua',
            count: json.data.instructor.reduce((a, b) => a + (b.published_courses_count || 0), 0),
          },
          ...json.data.instructor.map((ins) => ({
            id: ins.id,
            name: ins.full_name,
            count: ins.published_courses_count,
          })),
        ];

        // If no checkedCategories/instructor in storage, set default
        const stored = loadFiltersFromStorage();

        set({
          categories: categoriesArr,
          instructor: instructorArr,
          checkedCategories:
            stored?.checkedCategories && Object.keys(stored.checkedCategories).length > 0
              ? stored.checkedCategories
              : getInitialChecked(categoriesArr, 'title'),
          checkedInstructor:
            stored?.checkedInstructor && Object.keys(stored.checkedInstructor).length > 0
              ? stored.checkedInstructor
              : getInitialChecked(instructorArr, 'name'),
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

      const activeRatings = rating
        .filter((r) => state.checkedRatings[r.rating])
        .map((r) => r.rating);

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
  };
});

export { rating, price, level };
