// Import React to define the component and ReactTyped for the typing animation effect
import React from 'react';
import { ReactTyped } from 'react-typed'; // Importing the ReactTyped component for the typing effect
import { useNavigate } from 'react-router-dom'; // Add this import

// Define the Hero functional component
function Hero() {
  const navigate = useNavigate(); // Initialize useNavigate hook

  return (
    // Outer div with white text color for all child elements
    <div className="text-white">
      {/* Centered container for the hero content, with width, height, and margin settings */}
      <div className="max-w-[800px] w-full h-screen mx-auto text-center flex flex-col justify-center">
        
        {/* Tagline above the main heading */}
        <p className="text-[#00df9a] font-bold p-2">
          GROWING WITH DATA ANALYTICS
        </p>

        {/* Main heading with responsive font sizes for different screen sizes */}
        <h1 className="md:text-7xl sm:text-5xl text-3xl font-bold">
          Grow with data..
        </h1>

        {/* Container for the subheading and typing animation */}
        <div className="flex justify-center items-center">
          {/* Static text for the subheading */}
          <p className="md:text-2xl text-xl font-bold text-gray-500 py-4">
            Fast, flexible financing for
          </p>

          {/* The typing effect using ReactTyped */}
          <ReactTyped
            // Tailwind classes for styling the typed text
            className="md:text-5xl sm:text-4xl text-xl font-bold pl-2"
            strings={['BTB', 'BTC', 'SASS']} // The array of strings to display in the typing animation
            typeSpeed={120} // Speed of typing each character (in milliseconds)
            backSpeed={140} // Speed of deleting each character (in milliseconds)
            loop // Ensures that the animation loops continuously
          />
        </div>

        {/* Additional text with description about data analytics */}
        <p className="md:text-2xl text-xl font-bold text-gray-500">
          Monitor your data analytics to increase revenue for BTB, BTC, & SASS platforms.
        </p>

        {/* Button to prompt users to take action */}
        <button 
        className="
          /* Base button styling */
          bg-[#00df9a]       /* Custom background color (light green) */
          w-[200px]          /* Fixed width of 200 pixels */
          rounded-md         /* Medium border radius for rounded corners */
          font-medium        /* Medium font weight */
          my-6              /* Margin top and bottom of 1.5rem (24px) */
          mx-auto           /* Auto horizontal margins for centering */
          py-3              /* Padding top and bottom of 0.75rem (12px) */
          text-black        /* Black text color */

          /* Hover effects */
          hover:bg-blue-400  /* Changes background to blue on hover */
          hover:scale-105    /* Scales up to 105% size on hover */

          /* Transition effects */
          transition-colors  /* Enables smooth transition for color changes */
          duration-300      /* Transition takes 300 milliseconds */
          delay-150         /* Waits 150 milliseconds before starting transition */
        "
        /* Click handler - navigates to register page when clicked */
        onClick={() => navigate('/register')}
        >
        Get Started  {/* Button text */}
        </button>
      </div>
    </div>
  );
}

export default Hero;
