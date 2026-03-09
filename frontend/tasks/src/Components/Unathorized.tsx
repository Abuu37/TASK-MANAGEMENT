function Unauthorized() {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <h1 className="text-4xl font-bold text-red-500 mb-4">403 - Access Denied</h1>
      <p className="text-lg text-gray-700">You do not have permission to access this page.</p>
    </div>
  );
}
export default Unauthorized;
