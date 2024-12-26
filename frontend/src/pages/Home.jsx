// Import required hooks, components and data
import { useState } from "react";
import { useNavigate } from 'react-router-dom';
import { products, categories } from '../data/products';
import ProductCard from '../components/home/ProductCard';
import SearchFilter from '../components/home/SearchFilter';
import WelcomeSection from '../components/home/WelcomeSection';
import "../styles/Home.css";

function Home() {
   // Initialize state variables using useState hook
   const [searchQuery, setSearchQuery] = useState(""); // For search input
   const [selectedCategory, setSelectedCategory] = useState("all"); // For category filter
   const navigate = useNavigate(); // Hook for programmatic navigation

   // Filter products based on search term and selected category
   const filteredProducts = products.filter(product => {
    // Check if search term matches product name or description
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Check if product belongs to selected category or if "all" is selected
    const matchesCategory = selectedCategory === "all" || product.category === selectedCategory;
    
    // Product must match both search and category filters
    return matchesSearch && matchesCategory;
});

   // Handle payment navigation when buying a product
   const handlePayment = (product) => {
       navigate('/payment', { 
           state: { 
               planType: product.name,
               amount: product.price 
           }
       });
   };

    // Get total results count
    const totalResults = filteredProducts.length;

   return (
       // Main container with responsive padding
       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
           {/* Welcome section showing username */}
           <WelcomeSection/>
           
           {/* Search and filter component */}
           <SearchFilter 
               searchQuery={searchQuery}
               onSearchChange={setSearchQuery}
               categories={categories}
               selectedCategory={selectedCategory}
               onCategoryChange={setSelectedCategory}
               totalResults = {totalResults}
           />

           {/* Product grid with responsive columns */}
           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
               {filteredProducts.map((product) => (
                   <ProductCard 
                       key={product.id}
                       product={product}
                       onBuy={handlePayment}
                   />
               ))}
           </div>
       </div>
   );
}

export default Home;