import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav className="bg-gray-800 text-white p-4 rounded mb-6">
      <div className="container mx-auto flex justify-between items-center">
        <div className="text-lg font-bold">Task Management</div>
        <div className="flex gap-2">
          <Link
            to="/tasks/create"
            className="px-3 py-2 hover:bg-gray-700 rounded"
          >
            Home
          </Link>
          <Link
            to="/tasks"
            className="px-3 py-2 hover:bg-gray-700 rounded"
          >
            Tasks
          </Link>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;