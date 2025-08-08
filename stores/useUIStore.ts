import { create } from 'zustand';

interface UIStore {
  // State
  loading: boolean;
  searchLoading: boolean;
  modalVisible: boolean;
  selectedTab: string;
  theme: 'light' | 'dark';
  refreshing: boolean;
  
  // Actions
  setLoading: (loading: boolean) => void;
  setSearchLoading: (searchLoading: boolean) => void;
  setModalVisible: (visible: boolean) => void;
  setSelectedTab: (tab: string) => void;
  toggleTheme: () => void;
  setTheme: (theme: 'light' | 'dark') => void;
  setRefreshing: (refreshing: boolean) => void;
  
  // Modal helpers
  openModal: () => void;
  closeModal: () => void;
  
  // Loading helpers
  startLoading: () => void;
  stopLoading: () => void;
  startSearchLoading: () => void;
  stopSearchLoading: () => void;
  startRefreshing: () => void;
  stopRefreshing: () => void;
  
  // Getters
  isLoading: () => boolean;
  isSearchLoading: () => boolean;
  isDarkTheme: () => boolean;
  isRefreshing: () => boolean;
}

// UI Store - Handles loading states, modals, and UI-related state
const useUIStore = create<UIStore>((set, get) => ({
  // State
  loading: false,
  searchLoading: false,
  modalVisible: false,
  selectedTab: 'movies',
  theme: 'light',
  refreshing: false,
  
  // Actions
  setLoading: (loading) => set({ loading }),
  
  setSearchLoading: (searchLoading) => set({ searchLoading }),
  
  setModalVisible: (visible) => set({ modalVisible: visible }),
  
  setSelectedTab: (tab) => set({ selectedTab: tab }),
  
  toggleTheme: () => set((state) => ({
    theme: state.theme === 'light' ? 'dark' : 'light'
  })),
  
  setTheme: (theme) => set({ theme }),
  
  setRefreshing: (refreshing) => set({ refreshing }),
  
  // Modal helpers
  openModal: () => set({ modalVisible: true }),
  closeModal: () => set({ modalVisible: false }),
  
  // Loading helpers
  startLoading: () => set({ loading: true }),
  stopLoading: () => set({ loading: false }),
  
  startSearchLoading: () => set({ searchLoading: true }),
  stopSearchLoading: () => set({ searchLoading: false }),
  
  startRefreshing: () => set({ refreshing: true }),
  stopRefreshing: () => set({ refreshing: false }),
  
  // Getters
  isLoading: () => get().loading,
  isSearchLoading: () => get().searchLoading,
  isDarkTheme: () => get().theme === 'dark',
  isRefreshing: () => get().refreshing
}));

export default useUIStore;