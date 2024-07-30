// the slice is responsible for managing the theme state and toggling between light and dark themes
import { createSlice } from "@reduxjs/toolkit";

// Create a slice for theme with initialState
const initialState = {
  theme: "light",
};

// Create a themeSlice with a reducer for toggleTheme to toggle between light and dark themes
const themeSlice = createSlice({
  name: "theme",
  initialState,
  reducers: {
    toggleTheme: (state) => {
      state.theme = state.theme === "light" ? "dark" : "light";
    },
  },
});

// Export the toggleTheme action from the themeSlice and the reducer
export const { toggleTheme } = themeSlice.actions;
export default themeSlice.reducer;
