import { create } from 'zustand';

const useConfirmationModalStore = create((set) => ({
  isOpen: false,
  title: '',
  message: '',
  onConfirm: () => {},
  onCancel: () => {},

  openModal: ({ title, message, onConfirm, onCancel }) =>
    set({
      isOpen: true,
      title,
      message,
      onConfirm,
      onCancel,
    }),

  closeModal: () =>
    set({
      isOpen: false,
      title: '',
      message: '',
      onConfirm: () => {},
      onCancel: () => {},
    }),
}));

export default useConfirmationModalStore;
