import { useState } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { toast } from "react-toastify";

function ResetPassword() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [passwordMatch, setPasswordMatch] = useState(true);
  const navigate = useNavigate();
  const [searchParams] =useSearchParams();
  const token = searchParams.get("token");

  const handleConfirmPasswordChange = (value: string) => {
    setConfirmPassword(value);
    if (password && value) {
      setPasswordMatch(password === value);
    } else {
      setPasswordMatch(true);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!token) {
      toast.error("Invalid or missing reset token ❌");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match ❌");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("http://localhost:8000/api/users/password-reset-confirm/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data?.error || "Failed to reset password ❌");
        return;
      }

      toast.success("Password reset successful!");
      setTimeout(() => {
        navigate("/");
      }, 2000);
    } catch {
      toast.error("Network error");
    } finally {
      setLoading(false);
    }
  };

  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white p-8 rounded shadow-lg text-center max-w-md">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Invalid Reset Link</h2>
          <p className="text-gray-600 mb-6">
            This password reset link is invalid or has expired.
          </p>
          <Link
            to="/"
            className="inline-block w-full py-2 rounded font-semibold text-white bg-purple-600 hover:bg-purple-700 transition"
          >
            Back to Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex">
      {/* Left side - Gradient background */}
      <div className="flex-1 bg-gradient-to-br from-purple-500 via-pink-500 to-orange-400 flex items-center justify-center">
        <div className="text-white text-center px-8">
          <h1 className="text-5xl font-bold mb-4">Reset Password</h1>
          <p className="text-xl">Enter your new password below</p>
        </div>
      </div>

      {/* Right side - Reset Password form */}
      <div className="flex-1 bg-white flex items-center justify-center">
        <form onSubmit={handleSubmit} className="w-full max-w-md px-8">
          <h2 className="text-3xl font-bold mb-6">New Password</h2>

          <p className="text-gray-600 mb-6">
            Please enter your new password.
          </p>
          
          {/* Password input */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              New Password
            </label>
            <input
              type="password"
              className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="New Password"
              minLength={6}
              required
            />
          </div>

          {/* Confirm Password input */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Confirm Password
            </label>
            <input
              type="password"
              className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
              value={confirmPassword}
              onChange={(e) => handleConfirmPasswordChange(e.target.value)}
              placeholder="Confirm New Password"
              minLength={6}
              required
            />
            {!passwordMatch && confirmPassword && (
              <p className="text-red-500 text-sm mt-2">Passwords do not match</p>
            )}
            {passwordMatch && confirmPassword && password && (
              <p className="text-green-500 text-sm mt-2">Passwords match</p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading || !passwordMatch}
            className={`w-full py-2 rounded font-semibold text-white transition mt-4 ${
              loading || !passwordMatch
                ? "bg-gray-400 cursor-not-allowed" 
                : "bg-purple-600 hover:bg-purple-700"
            }`}
          >
            {loading ? "Resetting..." : "Reset Password"}
          </button>

          <p className="text-center mt-6 text-sm text-gray-600">
            Remember your password?{" "}
            <Link to="/" className="text-purple-600 font-semibold hover:underline">
              Login
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}

export default ResetPassword;
