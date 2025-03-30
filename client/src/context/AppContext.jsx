import React, { createContext, useContext } from "react";

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const API_URL = "http://localhost:3000"; // Centralized API URL

  return (
    <AppContext.Provider value={{ API_URL }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  return useContext(AppContext);
};