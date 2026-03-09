import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

function Navbar() {
  const navigate = useNavigate();
  const role = localStorage.getItem("role");

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("role");
    localStorage.removeItem("username");
    toast.success("Logged out successfully ✅");
    setTimeout(() => {
      navigate("/", { replace: true });
    }, 500);
  };

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
          {role === "ADMIN" && (
            <Link
              to="/admin"
              className="px-3 py-2 hover:bg-gray-700 rounded"
            >
              Admin
            </Link>
          )}
          <button
            type="button"
            onClick={handleLogout}
            className="px-3 py-2 hover:bg-gray-700 rounded"
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
