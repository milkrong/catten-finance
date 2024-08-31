import { create } from 'zustand';

type EditAccountStore = {
  id?: string;
  isOpen: boolean;
  onOpen: (id: string) => void;
  onClose: () => void;
};

export const useEditAccountStore = create<EditAccountStore>((set) => ({
  id: undefined,
  isOpen: false,
  onOpen: (id) => set({ id, isOpen: true }),
  onClose: () => set({ id: undefined, isOpen: false }),
}));
