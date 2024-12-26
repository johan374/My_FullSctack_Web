// imageRegistry.js
const importImage = (imageName) => {
    try {
        // /\s space"one spaec" and +/g "global" and replace with "_"
        // Convert the image name to lowercase and remove spaces
        const formattedName = imageName.toLowerCase().replace(/\s+/g, '_');
        // Return the dynamic path to the image
        return new URL(`../assets/${formattedName}.png`, import.meta.url).href;
        // This will correctly resolve to the full path of your image

        // Without import.meta.url, relative paths might break when your code is bundled
    } catch (error) {
        console.error(`Error loading image: ${imageName}`, error);
        return null;
    }
};

// products.js
export const products = [
    {
        id: 1,
        name: "Basic Plan",
        price: 149,
        category: "subscription",
        description: "Perfect for individual users",
        features: ["500 GB Storage", "1 User", "Send up to 2 GB"],
        image: importImage("single")
    },
    {
        id: 2,
        name: "Pro Plan",
        price: 199,
        category: "subscription",
        description: "Ideal for small teams",
        features: ["1TB Storage", "3 Users", "Send up to 10 GB"],
        image: importImage("double")
    },
     // Enterprise Plan - Top-tier subscription
    {
        id: 3,
        name: "Enterprise Plan",
        price: 299,
        category: "subscription",
        description: "For large organizations",
        features: [
            "5TB Storage",              // Maximum storage offering
            "10 Users",                 // Support for larger teams
            "Send up to 20 GB"          // Maximum file transfer size
        ],
        image: importImage("triple")
    },
    {
        id: 4,
        name: "Custom Domain",
        price: 29,
        category: "addon",
        description: "Get your own custom domain",
        features: ["SSL Certificate", "Email Support", "DNS Management"],
        image: importImage("domain")
    },
    {
        id: 5,
        name: "API Access",
        price: 99,
        category: "addon",
        description: "Full API access with documentation",
        features: ["REST API", "GraphQL Support", "Developer Tools"],
        image: importImage("api_access")
    },
    {
        id: 6,
        name: "Premium Support",
        price: 49,
        category: "support",
        description: "24/7 priority support",
        features: ["Phone Support", "1-hour Response", "Dedicated Agent"],
        image: importImage("agent")
    },
    {
        id: 7,
        name: "Backup & Recovery",
        price: 79,
        category: "addon",
        description: "Enterprise backup solution",
        features: ["Automated Backups", "Version History", "Disaster Recovery"],
        image: importImage("backup")
    },
    {
        id: 8,
        name: "Analytics Suite",
        price: 129,
        category: "addon",
        description: "Advanced data insights",
        features: ["Real-time Analytics", "Custom Reports", "User Behavior Tracking", "Export Capabilities"],
        image: importImage("analytics")
    },
    {
        id: 9,
        name: "Collaboration Pro",
        price: 169,
        category: "addon",
        description: "Enhanced team features",
        features: ["Team Workspaces", "Real-time Editing", "Version Control", "Advanced Permissions"],
        image: importImage("collaboration")
    }
];

export const categories = [
    { id: "all", name: "All Products" },
    { id: "subscription", name: "Subscriptions" },
    { id: "addon", name: "Add-ons" },
    { id: "support", name: "Support Plans" }
];
