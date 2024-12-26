// Import the React library, which is required to use React components.
import React, { useState } from 'react';
// Import specific icons (AiOutlineClose and AiOutlineMenu) from the 'react-icons' library.
import { AiOutlineClose, AiOutlineMenu } from 'react-icons/ai';
import { Link } from 'react-router-dom';

// Define the Navbar component as a functional component.
function Navbar() {
  // Declare a state variable `nav` and a function `setNav` to update it, using the `useState` hook.
  // - `nav` holds a boolean value: `true` if the mobile navigation menu is open, `false` if it's closed.
  // - Initially, `nav` is set to `false`, meaning the menu is closed.
  const [nav, setNav] = useState(false);

  // Function to toggle the `nav` state between `true` and `false`.
  const handleNav = () => {
    setNav(!nav); // If `nav` is `true`, set it to `false`; if `false`, set it to `true`.
  };

  // The component's return statement contains JSX, defining the HTML structure and behavior of the Navbar.
  return (
    <div
      // Outer container for the Navbar.
      // - Flexbox ensures proper alignment (`flex`), with items spaced between (`justify-between`) and centered vertically (`items-center`).
      // - The `h-24` sets the height, and `max-w-[1240px]` restricts the maximum width.
      // - `mx-auto` centers the navbar horizontally within the parent container, and `px-4` adds horizontal padding.
      // - `text-white` ensures all text inside is white.
      className="flex justify-between items-center h-24 max-w-[1240px] mx-auto px-4 text-white"
    >
      {/* Logo Section */}
      <h1
        // Logo text styled as a full-width element with a green color and bold, large font.
        className="w-full text-3xl font-bold text-[#00df9a]"
      >
        REACT.
      </h1>

      {/* Desktop Navigation Menu */}
      {/* 
        This unordered list (`ul`) contains links for desktop view.
        - `hidden md:flex`: The menu is hidden on small screens (below `md`) and visible as a flexbox on medium (`md`) screens and larger.
      */}
     <ul className="hidden md:flex uppercase p-4">
            <li className="p-4">
                <Link to="/dashboard" className="hover:text-[#00df9a] transition-colors duration-300">Home</Link>
            </li>
            <li className="p-4">
                <Link to="/" className="hover:text-[#00df9a] transition-colors duration-300">Company</Link>
            </li>
            <li className="p-4">
                <Link to="/" className="hover:text-[#00df9a] transition-colors duration-300">Resources</Link>
            </li>
            <li className="p-4">
                <Link to="/" className="hover:text-[#00df9a] transition-colors duration-300">Contact</Link>
            </li>
            <li className="p-4">
                <Link to="/" className="hover:text-[#00df9a] transition-colors duration-300">About</Link>
            </li>
        </ul>
      {/* Hamburger Menu Icon for Mobile */}
      {/* 
        A clickable icon displayed only on small screens (`block md:hidden`).
        - The `onClick` event triggers the `handleNav` function to toggle the mobile menu state.
      */}
      <div onClick={handleNav} className="block md:hidden">
        {/* 
          Conditional rendering to display either:
          - Close icon (`AiOutlineClose`) if `nav` is `true` (menu open), or
          - Menu icon (`AiOutlineMenu`) if `nav` is `false` (menu closed).
        */}
        {nav ? <AiOutlineClose size={20} /> : <AiOutlineMenu size={20} />}
      </div>

      {/* Mobile Navigation Menu */}
      {/* 
        A fixed-position container for the mobile navigation menu.
        - Conditional classes are used to control visibility:
          - If `nav` is `true`, the menu slides in from the left.
          - If `nav` is `false`, the menu is hidden off-screen.
        */}
      <div
        className={
          nav
            ? 'fixed left-0 top-0 w-[80%] h-full border-r border-r-gray-900 bg-[#000300] ease-in-out duration-500 z-50'
            : 'fixed left-[-100%] ease-in-out duration-500'
        }
      >
        {/* Mobile Navigation Logo */}
        {/* Display the same logo at the top of the mobile menu. */}
        <h1 className="w-full text-3xl font-bold text-[#00df9a]">REACT.</h1>

        {/* Mobile Navigation Links */}
        {/* 
          Unordered list with navigation links for mobile.
          - Each link (`li`) has padding for spacing and a bottom border for separation.
          - `uppercase` transforms text to uppercase.
        */}
        {/* Desktop Navigation Menu */}
        <ul className="uppercase p-4">
            <li className="p-4">
                <Link to="/dashboard" className="hover:text-[#00df9a] transition-colors duration-300">Home</Link>
            </li>
            <li className="p-4">
                <Link to="/" className="hover:text-[#00df9a] transition-colors duration-300">Company</Link>
            </li>
            <li className="p-4">
                <Link to="/" className="hover:text-[#00df9a] transition-colors duration-300">Resources</Link>
            </li>
            <li className="p-4">
                <Link to="/" className="hover:text-[#00df9a] transition-colors duration-300">Contact</Link>
            </li>
            <li className="p-4">
                <Link to="/" className="hover:text-[#00df9a] transition-colors duration-300">About</Link>
            </li>
        </ul>
      </div>
    </div>
  );
}

// Export the Navbar component to allow it to be imported and used in other files.
export default Navbar;
