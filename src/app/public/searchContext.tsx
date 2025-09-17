"use client";
import { createContext, useContext, useState, ReactNode } from "react";

type SearchContextType = {
  searchQuery: string;
  setSearchQuery: (q: string) => void;
};

const SearchContext = createContext<SearchContextType | undefined>(undefined);

export function PublicSearchProvider({ children }: { children: ReactNode }) {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <SearchContext.Provider value={{ searchQuery, setSearchQuery }}>
      {children}
    </SearchContext.Provider>
  );
}

export function usePublicSearch() {
  const context = useContext(SearchContext);
  if (!context) throw new Error("usePublicSearch must be used inside PublicSearchProvider");
  return context;
}
