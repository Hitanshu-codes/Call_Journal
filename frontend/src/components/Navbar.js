import { Link } from "react-router-dom"

function Navbar() {
    return (
        <nav className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
            <div className="container mx-auto px-4 py-2 flex justify-between items-center">
                <Link to="/" className="text-xl font-bold text-gray-800 dark:text-white">
                    Daily Journal
                </Link>
                <div className="space-x-4">
                    <Link to="/" className="text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white">
                        Home
                    </Link>
                    <Link to="/history" className="text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white">
                        History
                    </Link>
                    <Link
                        to="/monthly-summary"
                        className="text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white"
                    >
                        Monthly Summary
                    </Link>
                    <Link to="/settings" className="text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white">
                        Settings
                    </Link>
                </div>
            </div>
        </nav>
    )
}

export default Navbar

