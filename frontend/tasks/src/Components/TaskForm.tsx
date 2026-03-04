import { useState } from "react";
import { useNavigate } from "react-router-dom";     
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Validation schema with Yup
const TaskSchema = Yup.object().shape({
  title: Yup.string()
    .min(3, "Title too short!")
    .max(50, "Title too long!")
    .required("Title is required"),
  description: Yup.string()
    .min(5, "Description too short!")
    .max(500, "Description too long!")
    .required("Description is required"),
  status: Yup.string().oneOf(
    ["Pending", "In Progress", "Completed"],
    "Invalid status"
  ),
});

function TaskForm() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (values: {
    title: string;
    description: string;
    status: string;
  }) => {
    setLoading(true);

    // Show spinner for 2 seconds
    setTimeout(async () => {
      try {
        const token = localStorage.getItem("accessToken");
        const response = await fetch("http://localhost:8000/api/tasks/", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          },
          body: JSON.stringify(values),
        });

        if (!response.ok) {
          toast.error("Failed to create task ❌", { position: "top-right" });
          setLoading(false);
          return;
        }

        toast.success("Task added successfully! ✅", { position: "top-right" });

        // Redirect after 1 second
        setTimeout(() => {
          navigate("/tasks");
        }, 1000);

      } catch (error) {
        toast.error("Network error ❌", { position: "top-right" });
        setLoading(false);
      }
    }, 2000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <Formik
        initialValues={{ title: "", description: "", status: "Pending" }}
        validationSchema={TaskSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting, isValid, dirty }) => (
          <Form className="bg-white w-full max-w-md p-8 rounded-2xl shadow-lg">
            <h2 className="text-3xl font-bold text-center mb-6 text-blue-600">
              📝 Create Task
            </h2>

            {/* Title */}
            <div className="mb-4">
              <label className="block font-semibold text-gray-700 mb-1">
                Task Title
              </label>
              <Field
                type="text"
                name="title"
                placeholder="Enter task title"
                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
              <ErrorMessage
                name="title"
                component="div"
                className="text-red-500 text-sm mt-1"
              />
            </div>

            {/* Description */}
            <div className="mb-4">
              <label className="block font-semibold text-gray-700 mb-1">
                Description
              </label>
              <Field
                as="textarea"
                name="description"
                placeholder="Enter task description"
                rows={4}
                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
              <ErrorMessage
                name="description"
                component="div"
                className="text-red-500 text-sm mt-1"
              />
            </div>

            {/* Status */}
            <div className="mb-6">
              <label className="block font-semibold text-gray-700 mb-1">
                Status
              </label>
              <Field
                as="select"
                name="status"
                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              >
                <option value="Pending">Pending</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
              </Field>
              <ErrorMessage
                name="status"
                component="div"
                className="text-red-500 text-sm mt-1"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting || !isValid || !dirty || loading}
              className={`w-full py-3 rounded-lg font-semibold transition duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed
                ${
                  loading
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700 text-white"
                }`}
            >
              {loading ? (
                <>
                  <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                  Loading...
                </>
              ) : (
                "➕ Add Task"
              )}
            </button>
          </Form>
        )}
      </Formik>

      <ToastContainer />
    </div>
  );
}

export default TaskForm;