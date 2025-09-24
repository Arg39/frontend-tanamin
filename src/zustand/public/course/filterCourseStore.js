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
    ratings: [], // dynamic from API
    prices: [], // dynamic from API
    levels: [], // dynamic from API
    loading: false,
    error: null,
    checkedCategories: stored?.checkedCategories || {},
    checkedInstructor: stored?.checkedInstructor || {},
    checkedRatings: stored?.checkedRatings || {},
    checkedPrice: stored?.checkedPrice || {},
    checkedLevel: stored?.checkedLevel || {},
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

    // RESET FILTERS
    resetFilters: () => {
      const state = get();
      const defaultCheckedCategories =
        state.categories && state.categories.length > 0
          ? getInitialChecked(state.categories, 'title')
          : {};
      const defaultCheckedInstructor =
        state.instructor && state.instructor.length > 0
          ? getInitialChecked(state.instructor, 'name')
          : {};
      const defaultCheckedRatings = {};
      const defaultCheckedPrice = {};
      state.prices.forEach((p) => {
        defaultCheckedPrice[p.type] = p.type === 'all';
      });
      const defaultCheckedLevel = {};
      state.levels.forEach((lvl) => {
        defaultCheckedLevel[lvl.type] = lvl.type === 'all';
      });

      set({
        checkedCategories: defaultCheckedCategories,
        checkedInstructor: defaultCheckedInstructor,
        checkedRatings: defaultCheckedRatings,
        checkedPrice: defaultCheckedPrice,
        checkedLevel: defaultCheckedLevel,
      });
      persistFilters({
        checkedCategories: defaultCheckedCategories,
        checkedInstructor: defaultCheckedInstructor,
        checkedRatings: defaultCheckedRatings,
        checkedPrice: defaultCheckedPrice,
        checkedLevel: defaultCheckedLevel,
      });
    },

    // Set category filter directly (for navigation from beranda)
    setCategoryFilter: (categoryTitle) => {
      const state = get();
      const newChecked = {};
      state.categories.forEach((cat) => {
        newChecked[cat.title] = cat.title === categoryTitle;
      });
      // 'semua' must be false if not selected
      if (newChecked['semua'] !== undefined && categoryTitle !== 'semua') {
        newChecked['semua'] = false;
      }
      set({ checkedCategories: newChecked });
      persistFilters({ checkedCategories: newChecked });
    },

    // Utility to check if any filter is active (not default)
    hasActiveFilters: () => {
      const state = get();

      // Cek kategori (selain 'semua')
      const catActive = state.categories.some(
        (cat) => cat.title !== 'semua' && state.checkedCategories[cat.title]
      );
      // Cek instruktur (selain 'semua')
      const insActive = state.instructor.some(
        (ins) => ins.name !== 'semua' && state.checkedInstructor[ins.name]
      );
      // Cek rating
      const ratingActive = Object.values(state.checkedRatings).some(Boolean);
      // Cek price (selain 'all')
      const priceActive = Object.entries(state.checkedPrice).some(
        ([key, val]) => key !== 'all' && val
      );
      // Cek level (selain 'all')
      const levelActive = Object.entries(state.checkedLevel).some(
        ([key, val]) => key !== 'all' && val
      );

      return catActive || insActive || ratingActive || priceActive || levelActive;
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

        // Transform rating
        const ratingsArr = (json.data.rating || []).map((r) => ({
          rating: r.rating,
          count: r.total,
        }));

        // Transform price
        // Always add 'semua' (all) as first option
        const pricesArr = [
          {
            title: 'semua',
            type: 'all',
            count:
              json.data.price && json.data.price[0]
                ? (json.data.price[0].free || 0) + (json.data.price[0].paid || 0)
                : 0,
          },
          {
            title: 'gratis',
            type: 'free',
            count: json.data.price && json.data.price[0] ? json.data.price[0].free || 0 : 0,
          },
          {
            title: 'berbayar',
            type: 'paid',
            count: json.data.price && json.data.price[0] ? json.data.price[0].paid || 0 : 0,
          },
        ];

        // Transform level
        // Always add 'semua' (all) as first option
        const levelsArr = [
          {
            title: 'semua',
            type: 'all',
            count: json.data.level
              ? (json.data.level.beginner || 0) +
                (json.data.level.intermediate || 0) +
                (json.data.level.advance || 0)
              : 0,
          },
          {
            title: 'pemula',
            type: 'beginner',
            count: json.data.level ? json.data.level.beginner || 0 : 0,
          },
          {
            title: 'menengah',
            type: 'intermediate',
            count: json.data.level ? json.data.level.intermediate || 0 : 0,
          },
          {
            title: 'mahir',
            type: 'advance',
            count: json.data.level ? json.data.level.advance || 0 : 0,
          },
        ];

        // If no checkedCategories/instructor in storage, set default
        const stored = loadFiltersFromStorage();

        // Checked ratings
        let checkedRatings = {};
        if (stored?.checkedRatings && Object.keys(stored.checkedRatings).length > 0) {
          checkedRatings = stored.checkedRatings;
        } else {
          ratingsArr.forEach((r) => {
            checkedRatings[r.rating] = false;
          });
        }

        // Checked price
        let checkedPrice = {};
        if (stored?.checkedPrice && Object.keys(stored.checkedPrice).length > 0) {
          checkedPrice = stored.checkedPrice;
        } else {
          pricesArr.forEach((p) => {
            checkedPrice[p.type] = p.type === 'all';
          });
        }

        // Checked level
        let checkedLevel = {};
        if (stored?.checkedLevel && Object.keys(stored.checkedLevel).length > 0) {
          checkedLevel = stored.checkedLevel;
        } else {
          levelsArr.forEach((lvl) => {
            checkedLevel[lvl.type] = lvl.type === 'all';
          });
        }

        set({
          categories: categoriesArr,
          instructor: instructorArr,
          ratings: ratingsArr,
          prices: pricesArr,
          levels: levelsArr,
          checkedCategories:
            stored?.checkedCategories && Object.keys(stored.checkedCategories).length > 0
              ? stored.checkedCategories
              : getInitialChecked(categoriesArr, 'title'),
          checkedInstructor:
            stored?.checkedInstructor && Object.keys(stored.checkedInstructor).length > 0
              ? stored.checkedInstructor
              : getInitialChecked(instructorArr, 'name'),
          checkedRatings,
          checkedPrice,
          checkedLevel,
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

      const activeRatings = state.ratings
        .filter((r) => state.checkedRatings[r.rating])
        .map((r) => r.rating);

      const activePrice = state.prices.find((p) => state.checkedPrice[p.type]);
      const activePriceType = activePrice ? activePrice.type : null;

      const activeLevel = state.levels.find((lvl) => state.checkedLevel[lvl.type]);
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
