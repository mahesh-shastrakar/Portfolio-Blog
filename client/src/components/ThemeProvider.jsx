// the theme toggle button and the sign in button are displayed in the header component
import React from "react";
import { useSelector } from "react-redux";

// the children prop is passed to the ThemeProvider component to render the child components
const ThemeProvider = ({ children }) => {
  const { theme } = useSelector((state) => state.theme);
  return (
    <div className={theme}>
      <div className="bg-white text-grey-700 dark:text-white dark:bg-[rgb(16,23,42)] min-h-screen">
        {children}
      </div>
    </div>
  );
};

export default ThemeProvider;
