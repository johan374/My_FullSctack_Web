import React from 'react';
import { Link } from 'react-router-dom';

// Success page component for payment confirmation
const SuccessPage = () => {
    return (
        // Main container with full screen height and gray background
        // flex items-center and justify-center center the content both vertically and horizontally
        <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
            {/* Card container with white background and shadow*/}
            <div className="max-w-md w-full bg-white rounded-lg shadow-xl p-8 text-center">
                {/* SVG checkmark container with margin bottom*/}
                <div className="mb-6">
                    {/* SVG checkmark icon
                        - w-16 h-16: Sets width and height to 4rem (64px)
                        - mx-auto: Centers horizontally
                        - text-green-500: Sets the stroke color to green
                    */}
                    <svg 
                        className="w-16 h-16 mx-auto text-green-500"
                        fill="none"          // No fill color
                        stroke="currentColor" // Uses the text color (green from class)
                        viewBox="0 0 24 24"  // Defines the coordinate system
                    >
                        {/* Path element that draws the checkmark
                            - strokeLinecap="round": Rounds the ends of the lines
                            - strokeLinejoin="round": Rounds the corners where lines meet
                            - strokeWidth="2": Sets line thickness
                            - d="M5 13l4 4L19 7": The path commands that draw the checkmark:
                              M5 13: Move to point (5,13)
                              l4 4: Draw line 4 units right and 4 units down (relative)
                              L19 7: Draw line to point (19,7) (absolute)
                        */}
                        <path 
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M5 13l4 4L19 7"
                        />
                    </svg>
                </div>

                {/* Success message title */}
                <h2 className="text-2xl font-bold mb-4">
                    Payment Successful!
                </h2>

                {/* Confirmation message */}
                <p className="text-gray-600 mb-6">
                    Thank you for your purchase. Your subscription is now active.
                </p>

                {/* Return home link styled as a button
                    - inline-block: Makes the link behave like a button
                    - bg-[#00df9a]: Custom green background color
                    - hover effects for interactivity
                */}
                <Link 
                    to="/dashboard"
                    className="inline-block bg-[#00df9a] text-white px-6 py-3 rounded-md font-medium hover:bg-[#00c589] transition-colors duration-300"
                >
                    Return Home
                </Link>
            </div>
        </div>
    );
};


export default SuccessPage;