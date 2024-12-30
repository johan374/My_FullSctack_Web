// Import necessary icons from lucide-react library
import { ShoppingCart, Bookmark, BookmarkCheck } from 'lucide-react';

// ProductCard component accepts product details and callback functions as props
const ProductCard = ({ 
   product,    // Product object containing details
   onBuy,      // Function to handle purchase
   isSaved,    // Boolean indicating if product is saved
   onSave,     // Function to save product
   onRemove    // Function to remove from saved
}) => {
   return (
       // Main card container with white background and hover effects
       <div className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow flex flex-col">
           
           {/* Image section with relative positioning for bookmark button */}
           <div className="relative flex items-center justify-center p-6 bg-gray-50" style={{ height: "250px" }}>
               <img 
                   src={product.image} 
                   alt={product.name} 
                   className="max-h-full max-w-full object-contain" 
               />
               
               {/* Bookmark button - changes appearance based on saved state */}
               <button 
                   onClick={() => isSaved ? onRemove(product.id) : onSave(product)}
                   className={`absolute top-4 right-4 p-2 rounded-full ${
                       isSaved 
                           ? 'bg-green-100 text-green-600 hover:bg-green-200' // Saved state
                           : 'bg-white text-gray-600 hover:bg-gray-100'       // Unsaved state
                   } shadow-md transition-colors`}
               >
                   {isSaved ? <BookmarkCheck size={20} /> : <Bookmark size={20} />}
               </button>
           </div>
           
           {/* Product information section */}
           <div className="p-6 flex-1">
               {/* Header with name, description, and price */}
               <div className="flex justify-between items-start mb-4">
                   <div>
                       <h3 className="text-xl font-bold text-gray-900">{product.name}</h3>
                       <p className="text-sm text-gray-500">{product.description}</p>
                   </div>
                   <span className="text-2xl font-bold text-blue-600">${product.price}</span>
               </div>

               {/* Features list with bullet points */}
               <ul className="mb-6 space-y-2">
                   {product.features.map((feature, index) => (
                       <li key={index} className="text-sm text-gray-600">• {feature}</li>
                   ))}
               </ul>

               {/* Purchase button */}
               <button 
                   onClick={() => onBuy(product)} 
                   className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
               >
                   <ShoppingCart size={20} />
                   Buy Now
               </button>
           </div>
       </div>
   );
};

export default ProductCard;