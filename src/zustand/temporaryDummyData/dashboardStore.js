import { create } from 'zustand';

const dashboardStore = create(() => ({
  data: {
    course: 32323,
    user: 23232,
    message: 32,
  },
  getTotal: (key) => {
    const state = dashboardStore.getState();
    return state.data[key] || 0;
  },
}));

export default dashboardStore;
