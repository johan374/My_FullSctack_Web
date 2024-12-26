// Import necessary dependencies from React and other libraries
import React, { useState, useEffect } from "react";  // React core and hooks
import { Link, useNavigate } from 'react-router-dom'; // Router components
import { toast } from 'react-toastify'; // Toast notifications
import api from '../../utils/api'; // Custom API utility

// Define Newsletter component using functional component syntax
const Newsletter = () => {
    // State management using useState hook
    // State for email input value
    const [email, setEmail] = useState('');
    // State to track loading status during API calls
    const [loading, setLoading] = useState(false);
    // State to track subscription status ('success', 'error', or '')
    const [status, setStatus] = useState('');
    
    // Hook for programmatic navigation
    const navigate = useNavigate();

    // useEffect hook runs when component mounts
    useEffect(() => {
        // Check localStorage for previously saved email
        const savedEmail = localStorage.getItem('newsletter_email');
        // If found, set it in the email state
        if (savedEmail) setEmail(savedEmail);
    }, []); // Empty dependency array means this runs once on mount

    // Email validation function using regex
    const validateEmail = (email) => {
        // Regex pattern checks for:
        // - At least one character before @
        // - @ symbol
        // - At least one character after @
        // - At least one dot after @
        // - At least one character after the dot
        return email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
    };

    // Handle form submission
    const handleSubmit = async () => {
        // First validate email
        if (!validateEmail(email)) {
            // Show error toast if email is invalid
            toast.error('Please enter a valid email address');
            return;
        }

        // Set loading state to true before API call
        setLoading(true);
        
        try {
            // Attempt to subscribe user via API
            const response = await api.post('/api/newsletter/subscribe', { email });
            
            // If successful:
            // 1. Save email to localStorage
            localStorage.setItem('newsletter_email', email);
            // 2. Update status to success
            setStatus('success');
            // 3. Show success toast
            toast.success('Successfully subscribed! Redirecting to registration...');
            // 4. Navigate to register page after 2 seconds
            setTimeout(() => navigate('/register'), 2000);
            
        } catch (error) {
            // If API call fails:
            // 1. Set status to error
            setStatus('error');
            // 2. Get error message from API response or use fallback
            const errorMessage = error.response?.data?.error || 'Subscription failed. Please try again.';
            // 3. Show error toast
            toast.error(errorMessage);
            
        } finally {
            // Whether success or failure, set loading to false
            setLoading(false);
        }
      };

// Newsletter component JSX structure with Tailwind CSS classes
return (
  // Main container with full width, padding, and white text
  <div className="w-full py-16 text-white px-4">
      {/* Content container with max width and 3-column grid on large screens */}
      <div className="max-w-[1240px] mx-auto grid lg:grid-cols-3">
          {/* Header section spanning 2 columns on large screens */}
          <div className="lg:col-span-2">
              {/* Responsive heading with different font sizes based on breakpoints */}
              <h1 className="md:text-4xl sm:text-3x text-2xl font-bold py-2">
                  Want tips & tricks to optimize your flow?
              </h1>
              <p>Sign up to our newsletter and stay up to date.</p>
          </div>

          {/* Form section */}
          <div className="my-4">
              {/* Flex container that changes direction based on screen size */}
              <div className="flex flex-col sm:flex-row items-center justify-between w-full gap-4">
                  {/* Input container */}
                  <div className="relative w-full">
                      {/* Email input field */}
                      <input
                          type="email"
                          value={email} // Controlled input bound to email state
                          onChange={(e) => setEmail(e.target.value)} // Update email state on change
                          className="p-3 flex w-full rounded-md text-black"
                          placeholder="Enter Email"
                          disabled={loading} // Disable input while loading
                      />
                      
                      {/* Success message shown conditionally */}
                      {status === 'success' && (
                          <div className="text-green-500 mt-2">
                              Successfully subscribed! Redirecting...
                          </div>
                      )}
                  </div>

                  {/* Submit button */}
                  <button 
                      onClick={handleSubmit} // Handle form submission
                      disabled={loading || !email} // Disable when loading or no email
                      className={`
                          bg-[#00df9a]  w-full sm:w-[200px] rounded-md font-medium 
                          my-2 sm:my-6" py-3 text-black 
                          transition-all duration-300
                          hover:bg-blue-400 hover:scale-105
                          disabled:opacity-50 disabled:cursor-not-allowed
                      `}
                  >
                      {/* Dynamic button text based on loading state */}
                      {loading ? 'Subscribing...' : 'Notify me'}
                  </button>
              </div>
          </div>

          {/* Privacy policy link section */}
          <p>
              We care about the protection of your data. Read our{" "}
              <span className="text-[#00df9a] hover:underline">
                  <Link to="/privacy">Privacy Policy.</Link>
              </span>
          </p>
      </div>
  </div>
  );
};

// Export the Newsletter component for use in other parts of the application
export default Newsletter;