import { create } from 'zustand';

const dashboardStore = create(() => ({
  data: {
    course: 32323,
    user: 23232,
    message: 32,
    chartData: [10, 20, 15, 30, 25, 40, 35], // Data dummy untuk grafik
  },
  getTotal: (key) => {
    const state = dashboardStore.getState();
    return state.data[key] || 0;
  },
}));

export default dashboardStore;
