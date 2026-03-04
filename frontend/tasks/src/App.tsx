import {BrowserRouter as Router, Routes, Route, useLocation} from 'react-router-dom';
import Navbar from './Components/Navbar';
import Login from './Components/Login';
import Register from './Components/Register';
import TaskList from './Components/TaskList';
import TaskForm from './Components/TaskForm';
import AuthGuard from './guards/AuthGuard';

function AppContent() {

  const location = useLocation();

  const hideNavbar = location.pathname === "/" || location.pathname === "/register";

  return (
    <>
      {!hideNavbar && <Navbar />}

      <div className="p-6"> 
        <Routes>
          {/* Public routes */ }
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} />

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
        </Routes>
      </div>
    </>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;