import { create } from 'zustand';
import type { API } from '@/services/ant-design-pro/typings';

export interface AdminState {
  selectedAdmin: API.Admin | null;
  setSelectedAdmin: (admin: API.Admin | null) => void;
  clearSelectedAdmin: () => void;
}

export const useAdminStore = create<AdminState>((set) => ({
  selectedAdmin: null,
  setSelectedAdmin: (admin) => set({ selectedAdmin: admin }),
  clearSelectedAdmin: () => set({ selectedAdmin: null }),
}));












