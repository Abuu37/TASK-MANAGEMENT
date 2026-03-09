import {BrowserRouter as Router, Routes, Route, useLocation} from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Navbar from './Components/Navbar';
import Login from './Components/Login';
import Register from './Components/Register';
import ForgotPassword from './Components/ForgotPassword';
import ResetPassword from './Components/ResetPassword';
import TaskList from './Components/TaskList';
import TaskForm from './Components/TaskForm';
import AdminDashboard from './Components/AdminDashboard';
import Unauthorized from './Components/Unauthorized';
import AuthGuard from './guards/AuthGuard';
import RoleGuard from './guards/RoleGuard';

function AppContent() {

  const location = useLocation();
  const token = localStorage.getItem("accessToken");
  const isProtectedPath =
    location.pathname.startsWith("/tasks") ||
    location.pathname.startsWith("/admin");

  const hideNavbar =
    location.pathname === "/" ||
    location.pathname === "/register" ||
    location.pathname === "/forgot-password" ||
    location.pathname === "/reset-password" ||
    (isProtectedPath && !token);

  return (
    <>
      {!hideNavbar && <Navbar />}

      <div className="p-6"> 
        <Routes>
          {/* Public routes */ }
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/unauthorized" element={<Unauthorized />} />

          {/* Protected routes */}
          <Route path="/tasks" element={
            <AuthGuard>
              <TaskList />
            </AuthGuard>
          } 
        />

          <Route path="/tasks/create" element={
            <AuthGuard>
              <TaskForm />
            </AuthGuard>
          } 
        />

          <Route path="/admin" element={
            <AuthGuard>
              <RoleGuard allowedRoles={["ADMIN"]}>
                <AdminDashboard />
              </RoleGuard>
            </AuthGuard>
          }
        />
        </Routes>
      </div>
    </>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
      <ToastContainer 
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </Router>
  );
}

export default App;