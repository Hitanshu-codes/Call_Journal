import { Link } from "react-router-dom"
import logo from "../assets/2.png"
function Navbar({ user, logout }) {
    return (
        <nav className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
            <div className="container mx-auto px-4 py-2 flex justify-between items-center">

                <Link to="/" className="text-xl font-bold text-gray-800 dark:text-white pl-0">
                    <div className="flex items-center gap-2">
                        <img src={logo} alt="Call Journal" className="w-9 h-7 pr-2 m-0" />
                        <h1>Call Journal</h1>
                    </div>

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
                    {user ? (
                        <button onClick={logout} className="px-4 py-2 bg-red-500 text-white rounded-md">Logout</button>
                    ) : (
                        <Link to="/login" className="px-4 py-2 bg-blue-500 text-white rounded-md">Login</Link>
                    )}
                </div>
            </div>
        </nav>
    )
}

export default Navbar

