import { axiosInstance } from "@/lib/axios";
import { create } from "zustand";

interface AuthStore {
  isAdmin: boolean;
  isLoading: boolean;
  error: string | null;
  hasCheckedAdmin: boolean;

  checkAdminStatus: () => Promise<void>;
  reset: () => void;
}

export const useAuthStore = create<AuthStore>((set, get) => ({
  isAdmin: false,
  isLoading: false,
  error: null,
  hasCheckedAdmin: false,

  checkAdminStatus: async () => {
    const { hasCheckedAdmin } = get();
    if (hasCheckedAdmin) return;

    set({ isLoading: true, error: null });
    try {
      const response = await axiosInstance.get("/admin/check");
      set({ isAdmin: response.data.admin, hasCheckedAdmin: true });
    } catch (error: any) {
      set({
        isAdmin: false,
        error: error.response.data.message,
        hasCheckedAdmin: true,
      });
    } finally {
      set({ isLoading: false });
    }
  },

  reset: () => {
    set({
      isAdmin: false,
      isLoading: false,
      error: null,
      hasCheckedAdmin: false,
    });
  },
}));
