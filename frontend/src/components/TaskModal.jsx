// src/components/TaskModal.jsx
const api = import.meta.env.VITE_API_URL;
import { useState, useEffect } from "react";
import axios from "axios";

export default function TaskModal({ task, onClose }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  // Initialize form with task data (for edit mode)
  useEffect(() => {
    if (task) {
      setTitle(task.title);
      setDescription(task.description || "");
    } else {
      setTitle("");
      setDescription("");
    }
  }, [task]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (task) {
        // Update existing task
        await axios.put(`http://localhost:5000/tasks/${task.id}`, {
          title,
          description,
          status: task.status
        });
      } else {
        // Create new task
        await axios.post("http://localhost:5000/tasks", {
          title,
          description,
          status: "todo"
        });
      }
      onClose(); // Close modal and refresh tasks
    } catch (error) {
      console.error("Save failed:", error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg w-96">
        <h2 className="text-xl font-bold mb-4">
          {task ? "Edit Task" : "Add Task"}
        </h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full mb-4 p-2 border rounded"
            required
          />
          <textarea
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full mb-4 p-2 border rounded"
          />
          <div className="flex gap-2 justify-end">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-500 hover:text-gray-700"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
