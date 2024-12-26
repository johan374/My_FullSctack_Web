// Import React library - necessary for creating React components
import React from 'react';

// Import BrowserRouter from react-router-dom 
// BrowserRouter enables client-side routing using HTML5 history API
import { BrowserRouter } from 'react-router-dom';

// Import our custom AppRoutes component which contains all route definitions
import AppRoutes from './AppRoutes';

// Import ToastContainer component and its styles from react-toastify
// ToastContainer is used to show notification popups
import { ToastContainer } from 'react-toastify';
// Import the default CSS styles for toast notifications
import 'react-toastify/dist/ReactToastify.css';

// Define the main App component
function App() {
  return (
    // BrowserRouter wraps the entire app to enable routing functionality
    // It creates a routing context that manages navigation and URL updates
    <BrowserRouter>
      {/* AppRoutes component contains all our route configurations
          It defines which components should render at which URLs */}
      <AppRoutes />

      {/* ToastContainer configuration for notifications
          This component doesn't render anything visible by default,
          but creates a container where toast notifications will appear */}
      <ToastContainer 
        // Position toast notifications in the top-right corner
        position="top-right"
        
        // Auto close toasts after 5000ms (5 seconds)
        autoClose={5000}
        
        // Show the progress bar at the bottom of each toast
        hideProgressBar={false}
        
        // New toasts appear at the top of the stack
        newestOnTop={false}
        
        // Allow clicking on a toast to dismiss it
        closeOnClick
        
        // RTL (Right-to-left) support - set to false for LTR languages
        rtl={false}
        
        // Pause toast timeout when the window loses focus
        pauseOnFocusLoss

        // Allow dragging toasts to dismiss them
        draggable
        
        // Pause toast timeout when hovering over it
        pauseOnHover
      />
    </BrowserRouter>
  );
}
// Export the App component as the default export
// This allows other files to import it using 'import App from './App''
export default App;