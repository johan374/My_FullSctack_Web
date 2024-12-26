/**
 * Privacy Policy Component
 * 
 * This component renders a complete privacy policy page with multiple sections
 * including introduction, data collection, usage information, user rights,
 * and contact details.
 * 
 * Styling is handled through Tailwind CSS classes for responsive design
 * and consistent visual hierarchy.
 */
function Privacy() {
    return (
        /* Main Container
            - container: Creates a responsive wrapper
            - mx-auto: Centers the container horizontally
            - px-4: Adds horizontal padding (16px)
            - py-8: Adds vertical padding (32px)
            - max-w-4xl: Limits maximum width for readability
        */
        <div className="container mx-auto px-4 py-8 max-w-4xl">
            {/* Header Section
                - text-center: Centers all text content
                - mb-8: Adds bottom margin (32px) for spacing
            */}
            <div className="text-center mb-8">
                {/* Main Title
                    - text-4xl: Large font size (36px)
                    - font-bold: Heavy font weight
                    - text-gray-800: Dark gray color for emphasis
                    - mb-4: Bottom margin (16px)
                */}
                <h1 className="text-4xl font-bold text-gray-800 mb-4">Privacy Policy</h1>
                {/* Last Updated Text
                    - text-gray-600: Medium gray color for secondary text
                */}
                <p className="text-gray-600">Last updated: December 2024</p>
            </div>

            {/* Content Container
                - space-y-8: Adds vertical spacing (32px) between sections
            */}
            <div className="space-y-8">
                {/* Introduction Section */}
                <section>
                    {/* Section Title
                        - text-2xl: Medium large font size (24px)
                        - font-semibold: Semi-bold weight for sub-headings
                        - text-gray-800: Dark gray for emphasis
                        - mb-4: Bottom margin (16px)
                    */}
                    <h2 className="text-2xl font-semibold text-gray-800 mb-4">Introduction</h2>
                    {/* Section Content
                        - text-gray-600: Medium gray for body text
                        - leading-relaxed: Increased line height for readability
                    */}
                    <p className="text-gray-600 leading-relaxed">
                        We respect your privacy and are committed to protecting your personal data. 
                        This privacy policy will inform you about how we look after your personal data 
                        and tell you about your privacy rights.
                    </p>
                </section>

                {/* Information Collection Section */}
                <section>
                    <h2 className="text-2xl font-semibold text-gray-800 mb-4">Information We Collect</h2>
                    {/* List Container
                        - list-disc: Adds bullet points
                        - list-inside: Positions bullets inside content area
                        - space-y-2: Adds vertical spacing (8px) between items
                    */}
                    <ul className="list-disc list-inside text-gray-600 space-y-2">
                        <li>Personal identification information (Name, email address, phone number)</li>
                        <li>Usage data (How you interact with our services)</li>
                        <li>Technical data (IP address, browser type, device information)</li>
                    </ul>
                </section>

                {/* Information Usage Section */}
                <section>
                    <h2 className="text-2xl font-semibold text-gray-800 mb-4">How We Use Your Information</h2>
                    <p className="text-gray-600 leading-relaxed">
                        We use the information we collect to:
                    </p>
                    {/* List with Top Margin
                        - mt-2: Adds top margin (8px) for spacing from paragraph
                    */}
                    <ul className="list-disc list-inside text-gray-600 space-y-2 mt-2">
                        <li>Provide and maintain our service</li>
                        <li>Notify you about changes to our service</li>
                        <li>Provide customer support</li>
                        <li>Monitor the usage of our service</li>
                    </ul>
                </section>

                {/* User Rights Section */}
                <section>
                    <h2 className="text-2xl font-semibold text-gray-800 mb-4">Your Rights</h2>
                    {/* Rights Container
                        - bg-gray-50: Light gray background
                        - p-6: Padding all around (24px)
                        - rounded-lg: Rounded corners
                    */}
                    <div className="bg-gray-50 p-6 rounded-lg">
                        <p className="text-gray-600 leading-relaxed mb-4">
                            Under certain circumstances, you have the following rights:
                        </p>
                        <ul className="list-disc list-inside text-gray-600 space-y-2">
                            <li>The right to access your personal data</li>
                            <li>The right to request correction of your personal data</li>
                            <li>The right to request deletion of your personal data</li>
                            <li>The right to withdraw consent</li>
                        </ul>
                    </div>
                </section>

                {/* Contact Section */}
                <section>
                    <h2 className="text-244xl font-semibold text-gray-800 mb-4">Contact Us</h2>
                    <p className="text-gray-600 leading-relaxed">
                        If you have any questions about this Privacy Policy, you can contact us:
                    </p>
                    {/* Contact Information Container
                        - mt-4: Top margin (16px)
                        - bg-blue-50: Light blue background
                        - p-6: Padding all around (24px)
                        - rounded-lg: Rounded corners
                    */}
                    <div className="mt-4 bg-blue-50 p-6 rounded-lg">
                        <ul className="text-gray-600 space-y-2">
                            <li>By email: privacy@example.com</li>
                            <li>By phone: +1 234 567 8900</li>
                            <li>By mail: 123 Privacy Street, City, Country</li>
                        </ul>
                    </div>
                </section>
            </div>

            {/* Footer Section
                - mt-12: Large top margin (48px)
                - pt-8: Top padding (32px)
                - border-t: Top border
                - border-gray-200: Light gray border color
                - text-center: Centered text
                - text-gray-500: Lighter gray text for footer
            */}
            <div className="mt-12 pt-8 border-t border-gray-200 text-center text-gray-500">
                <p>© 2024 Your Company Name. All rights reserved.</p>
            </div>
        </div>
    );
}

// Export the component for use in other parts of the application
export default Privacy;