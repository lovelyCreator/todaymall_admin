import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { API } from '@/services/ant-design-pro/typings';

export interface CategoryState {
  platform: string;
  status: 'all' | 'active' | 'inactive';
  setPlatform: (platform: string) => void;
  setStatus: (status: 'all' | 'active' | 'inactive') => void;
  categories: API.Category[];
  setCategories: (categories: API.Category[]) => void;
}

export const useCategoryStore = create<CategoryState>()(
  persist(
    (set) => ({
      platform: '1688',
      status: 'all',
      categories: [],
      setPlatform: (platform) => set({ platform }),
      setStatus: (status) => set({ status }),
      setCategories: (categories) => set({ categories }),
    }),
    {
      name: 'category-storage',
      partialize: (state) => ({
        platform: state.platform,
        status: state.status,
      }),
    },
  ),
);

