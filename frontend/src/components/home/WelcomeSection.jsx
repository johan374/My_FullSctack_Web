// In WelcomeSection.jsx
const WelcomeSection = () => {
    const username = localStorage.getItem('username');
    return (
        <div className="py-8">
            {username && (
                <h1 className="text-4xl font-bold text-gray-900">
                    Welcome back, {username}!
                </h1>
            )}
        </div>
    );
};

export default WelcomeSection;