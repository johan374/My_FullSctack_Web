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
   const [savedProducts, setSavedProducts] = useState([]); // Track saved/favorited products
   const navigate = useNavigate(); // Hook for programmatic navigation

    // Handler to add a product to saved list
    const handleSaveProduct = (product) => {
        setSavedProducts([...savedProducts, product]);
    };

    // Handler to remove a product from saved list
    const handleRemoveProduct = (productId) => {
        setSavedProducts(savedProducts.filter(p => p.id !== productId));
    };

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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <WelcomeSection/>
            
            {/* Search and filter component with props */}
            <SearchFilter 
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                categories={categories}
                selectedCategory={selectedCategory}
                onCategoryChange={setSelectedCategory}
                totalResults={totalResults}
            />
 
            {/* Product grid with responsive layout */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                {filteredProducts.map((product) => (
                    <ProductCard 
                        key={product.id}
                        product={product}
                        onBuy={handlePayment}
                        onSave={handleSaveProduct}
                        onRemove={handleRemoveProduct}
                        isSaved={savedProducts.some(p => p.id === product.id)} // Check if product is saved
                    />
                ))}
            </div>
        </div>
    );
 }
 
 export default Home;