import { create } from 'zustand';

const useConfirmationModalStore = create((set) => ({
  isOpen: false,
  title: '',
  message: '',
  variant: 'danger',
  onConfirm: () => {},
  onCancel: () => {},

  openModal: ({ title, message, onConfirm, onCancel, variant = 'danger' }) =>
    set({
      isOpen: true,
      title,
      message,
      onConfirm,
      onCancel,
      variant, // Set the variant dynamically
    }),

  closeModal: () =>
    set({
      isOpen: false,
      title: '',
      message: '',
      variant: 'danger', // Reset to default variant
      onConfirm: () => {},
      onCancel: () => {},
    }),
}));

export default useConfirmationModalStore;
