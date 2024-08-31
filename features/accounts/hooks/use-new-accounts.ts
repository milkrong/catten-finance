import { create } from 'zustand';

type NewAccountStore = {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
};

export const useNewAccountStore = create<NewAccountStore>((set) => ({
  isOpen: false,
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false }),
}));
