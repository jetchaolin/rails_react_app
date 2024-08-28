import { useRef } from "react";

function SearchBar({ searchTerm, onSearchTextChange, onImmediateChange }) {
  const searchDeBounceRef = useRef(null);

  const handleSearchChange = (e) => {
    const searchValue = e.target.value;

    // Update the searchTerm immediately
    onImmediateChange(searchValue);

    // Clear the existing timeout if it exists
    if (searchDeBounceRef.current) {
      clearTimeout(searchDeBounceRef.current);
    }

    // Set a new timeout
    searchDeBounceRef.current = setTimeout(() => {
      onSearchTextChange(searchValue);
    }, 500);
  };

  return (
    <>
      <div>
        <input
          type="text"
          value={searchTerm}
          placeholder="Search..."
          onChange={handleSearchChange}
        />
      </div>
    </>
  );
}
export default SearchBar;