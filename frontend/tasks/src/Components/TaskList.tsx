import { useEffect, useState } from "react";

interface Task {
  id: number;
  title: string;
  description: string;
  status: string;
}

function TaskList() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [editTask, setEditTask] = useState<Task | null>(null);
  const [viewTask, setViewTask] = useState<Task | null>(null);

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "in_progress":
        return "bg-blue-100 text-blue-800";
      case "completed":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const fetchTasks = async () => {
    const token = localStorage.getItem("accessToken");
    const res = await fetch("http://localhost:8000/api/tasks/", {
      headers: {
        "Authorization": `Bearer ${token}`
      }
    });
    const data = await res.json();
    setTasks(data);
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const updateTask = async () => {
    if (!editTask) return;

    const token = localStorage.getItem("accessToken");
    await fetch(`http://localhost:8000/api/tasks/${editTask.id}/`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify(editTask),
    });

    setEditTask(null);
    fetchTasks();
  };

  const deleteTask = async (id: number) => {
    if (!confirm("Are you sure?")) return;
    const token = localStorage.getItem("accessToken");
    await fetch(`http://localhost:8000/api/tasks/${id}/`, {
      method: "DELETE",
      headers: {
        "Authorization": `Bearer ${token}`
      }
    });
    fetchTasks();
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6 relative">
      <div className="bg-white max-w-7xl mx-auto p-10 rounded-3xl shadow-xl">
        <h2 className="text-4xl font-bold text-center mb-8 text-blue-600">
          📋 Task List
        </h2>

        {/* VIEW CARD */}
        {viewTask && (
          <div className="fixed inset-0 flex justify-center items-center z-50 pointer-events-none">
            <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md pointer-events-auto animate-fadeIn relative">
              <button
                onClick={() => setViewTask(null)}
                className="absolute top-3 right-3 text-gray-500 hover:text-red-500 text-xl font-bold"
              >
                ✕
              </button>

              <h3 className="text-2xl font-bold mb-4 text-blue-600">
                {viewTask.title}
              </h3>

              <p className="mb-3 text-lg">
                <b>Description:</b> {viewTask.description}
              </p>

              <p className="mb-4 text-lg">
                <b>Status:</b>{" "}
                <span className={`px-3 py-1 rounded-full ${getStatusColor(viewTask.status)}`}>
                  {viewTask.status}
                </span>
              </p>
            </div>
          </div>
        )}

        {/* EDIT CARD */}
        {editTask && (
          <div className="fixed inset-0 flex justify-center items-center z-50">
            <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md relative animate-fadeIn">

              {/* CLOSE ICON */}
              <button
                onClick={() => setEditTask(null)}
                className="absolute top-3 right-3 text-gray-500 hover:text-red-500 text-xl font-bold"
              >
                ✕
              </button>

              <h3 className="text-2xl font-bold mb-6 text-blue-600">
                Edit Task
              </h3>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  updateTask();
                }}
              >
                <input
                  className="w-full p-3 border rounded-lg mb-4 focus:ring-2 focus:ring-blue-400"
                  value={editTask.title}
                  onChange={(e) =>
                    setEditTask({ ...editTask, title: e.target.value })
                  }
                  placeholder="Task Title"
                />

                <textarea
                  className="w-full p-3 border rounded-lg mb-4 focus:ring-2 focus:ring-blue-400"
                  value={editTask.description}
                  onChange={(e) =>
                    setEditTask({ ...editTask, description: e.target.value })
                  }
                  placeholder="Task Description"
                />

                <select
                  className="w-full p-3 border rounded-lg mb-6 focus:ring-2 focus:ring-blue-400"
                  value={editTask.status}
                  onChange={(e) =>
                    setEditTask({ ...editTask, status: e.target.value })
                  }
                >
                  <option value="pending">Pending</option>
                  <option value="in_progress">In Progress</option>
                  <option value="completed">Completed</option>
                </select>

                {/* ONLY SAVE BUTTON */}
                <button
                  type="submit"
                  className="w-full bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 transition font-semibold"
                >
                  Save 
                </button>
              </form>
            </div>
          </div>
        )}

        {/* TABLE */}
        <div className="overflow-x-auto">
          <table className="w-full border rounded-xl shadow-md">
            <thead className="bg-blue-500 text-white">
              <tr>
                <th className="py-4 px-6">Title</th>
                <th className="py-4 px-6">Description</th>
                <th className="py-4 px-6">Status</th>
                <th className="py-4 px-6">Actions</th>
              </tr>
            </thead>

            <tbody>
              {tasks.map((task) => (
                <tr key={task.id} className="border-b hover:bg-blue-50">
                  <td className="py-4 px-6">{task.title}</td>
                  <td className="py-4 px-6">{task.description}</td>
                  <td className="py-4 px-6">
                    <span className={`px-3 py-1 rounded-full ${getStatusColor(task.status)}`}>
                      {task.status}
                    </span>
                  </td>

                  <td className="py-4 px-6 flex gap-3 justify-center">
                    <button
                      onClick={() => setViewTask(task)}
                      className="bg-indigo-500 text-white px-4 py-2 rounded-lg"
                    >
                      View
                    </button>
                    <button
                      onClick={() => setEditTask(task)}
                      className="bg-yellow-500 text-white px-4 py-2 rounded-lg"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => deleteTask(task.id)}
                      className="bg-red-500 text-white px-4 py-2 rounded-lg"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>
    </div>
  );
}

export default TaskList;