import { create } from "zustand";

interface UiState {
  darkMode: boolean;
  toggleTheme: () => void;
}

export const useUiStore = create<UiState>((set, get) => ({
  darkMode: localStorage.getItem("projectpilot-theme") === "dark",
  toggleTheme: () => {
    const next = !get().darkMode;
    document.documentElement.classList.toggle("dark", next);
    localStorage.setItem("projectpilot-theme", next ? "dark" : "light");
    set({ darkMode: next });
  }
}));

document.documentElement.classList.toggle("dark", localStorage.getItem("projectpilot-theme") === "dark");
