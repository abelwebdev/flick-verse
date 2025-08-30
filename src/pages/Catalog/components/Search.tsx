import React, { useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { GoSearch } from "react-icons/go";

interface SearchProps {
  setQuery: (val: { search?: string }) => void;
}

const Search: React.FC<SearchProps> = ({ setQuery }) => {
  const { category } = useParams();
  const [searchParams] = useSearchParams();
  const [search, setSearch] = useState<string>(searchParams.get("search") || "");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!search) {
      setQuery({});
      return;
    }
    // Set search query for both movies and TV series
    setQuery({ search });
  };
  const handleClearSearch = () => {
    setSearch("");
    setQuery({});
  };

  return (
    <form
      className="text-[14px] lg:py-10 md:pt-9 md:pb-10 sm:pt-8 sm:pb-10 pt-6 pb-8 flex flex-row items-center justify-center"
      onSubmit={handleSubmit}
    >
      <input
        type="text"
        className="py-[8px] pl-[20px] pr-[36px] rounded-full outline-none w-[300px] md:w-[340px] shadow-md transition-all duration-300 focus:shadow-sm text-[#666] focus:bg-[#ffffff] bg-[#fdfdfd] font-medium dark:bg-[#302d3a] dark:text-primary dark:focus:bg-[#474550]"
        onChange={(e) => setSearch(e.target.value)}
        value={search}
        placeholder={`Search ${category === "movies" ? "movies" : "tv series"}`}
      />
      <div className="flex items-center -ml-[32px] z-[1]">
        <button type="submit" className="text-[18px] text-[#ff0000]">
          <GoSearch style={{ color: "#73f340" }} />
        </button>
        {search && (
          <button 
            type="button" 
            onClick={handleClearSearch}
            className="ml-2 text-[14px] text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
          </button>
        )}
      </div>
    </form>
  );
};

export default Search;
