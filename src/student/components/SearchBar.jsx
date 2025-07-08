import { FaSearch } from 'react-icons/fa';

export default function SearchBar({ searchQuery, setSearchQuery }) {
  return (
    <div className="p-4 bg-gray-200">
      <div className="relative max-w-2xl mx-auto">
        <input
          type="text"
          placeholder="Search courses, resources..."
          className="w-full p-3 pl-10 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-navy-500"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <FaSearch className="absolute left-3 top-4 text-gray-500" />
      </div>
    </div>
  );
}