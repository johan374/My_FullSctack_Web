// Import shopping cart icon from lucide-react library
import { ShoppingCart } from 'lucide-react';

// Component takes product object and onBuy function as props
const ProductCard = ({ product, onBuy }) => {
    return (
        // Main card container with white background, rounded corners, shadow
        <div className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow flex flex-col">
            {/* Image container with fixed height and gray background*/}
            <div className="flex items-center justify-center p-6 bg-gray-50" style={{ height: "250px" }}>
                <img src={product.image} alt={product.name} className="max-h-full max-w-full object-contain" />
            </div>
            
            {/* Content container with padding and flex-1 to take remaining space¨*/}
            <div className="p-6 flex-1">
                {/* Header section with product name, description, and price*/}
                <div className="flex justify-between items-start mb-4">
                    <div>
                        <h3 className="text-xl font-bold text-gray-900">{product.name}</h3>
                        <p className="text-sm text-gray-500">{product.description}</p>
                    </div>
                    <span className="text-2xl font-bold text-blue-600">${product.price}</span>
                </div>

                {/* Features list with bullet points*/}
                <ul className="mb-6 space-y-2">
                    {product.features.map((feature, index) => (
                        <li key={index} className="text-sm text-gray-600">• {feature}</li>
                    ))}
                </ul>

                {/* Buy button with shopping cart icon*/}
                <button onClick={() => onBuy(product)} 
                    className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2">
                    <ShoppingCart size={20} />
                    Buy Now
                </button>
            </div>
        </div>
    );
};

export default ProductCard;