// Import the Search icon from lucide-react library
import { Search } from 'lucide-react';

// SearchFilter component with destructured props
const SearchFilter = ({ 
    searchQuery,        // The current search text input value
    onSearchChange,     // Function to update search text (setState function)
    categories,         // Array of category objects [{id: "all", name: "All"}, ...]
    selectedCategory,   // Currently active category ID ("all", "domain", etc)
    onCategoryChange,   // Function to update selected category (setState function)
    totalResults = 0    // Number of filtered results, defaults to 0 if not provided
}) => {
    return (
        // Main container with bottom margin
        <div className="mb-8">
            {/* Flex container for search and categories
                - flex-col on mobile (stacked)
                - flex-row on sm screens and up (side by side) */}
            <div className="flex flex-col sm:flex-row gap-4 justify-between items-center">
                {/* Search input container
                    - relative positioning for the search icon
                    - flex-1 to take available space
                    - max-w-xl to limit width */}
                <div className="relative flex-1 max-w-xl">
                    {/* Search input field */}
                    <input
                        type="text"
                        placeholder="Search products..."
                        value={searchQuery}
                        onChange={(e) => onSearchChange(e.target.value)}
                        // Styling:
                        // - w-full for full width
                        // - pl-10 for padding-left (space for search icon)
                        // - pr-4 for padding-right
                        // - py-2 for vertical padding
                        className="w-full pl-10 pr-4 py-2 border rounded-lg"
                    />
                    {/* Search icon
                        - absolute positioning relative to container
                        - positioned to the left of the input */}
                    <Search className="absolute left-3 top-2.5 text-gray-400" size={20} />
                    <Search className="absolute left-3 top-2.5 text-gray-400" size={20} />
                    
                    
                </div>

                {/* Category buttons container
                    - flex with gap for spacing between buttons */}
                <div className="flex gap-2">
                    {/* Map through categories array to create filter buttons */}
                    {categories.map(category => (
                        <button
                            key={category.id}  // Unique key for React list rendering
                            onClick={() => onCategoryChange(category.id)}
                            // Dynamic className based on whether category is selected:
                            // - If selected: blue background with white text
                            // - If not selected: light gray background with dark text
                            className={`px-4 py-2 rounded-lg ${
                                selectedCategory === category.id
                                    ? 'bg-blue-600 text-white'    // Selected state
                                    : 'bg-gray-100 text-gray-700' // Unselected state
                            }`}
                        >
                            {category.name}
                        </button>
                    ))}
                </div>
            </div>
                {/* Add search results summary */}
            {searchQuery && (
                <div className="mt-2 text-sm text-gray-600">
                    {totalResults === 0 
                        ? 'No products found' 
                        : `Found ${totalResults} product${totalResults === 1 ? '' : 's'}`
                    }
                </div>
            )}
        </div>
    );
};

export default SearchFilter;