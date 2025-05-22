import React, { useState, useEffect } from "react";
import axios from "axios";

const api = import.meta.env.VITE_API_URL;

const TaskModal = ({ task, onClose, fetchTasks }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("todo");

  // Pre-fill form if editing
  useEffect(() => {
    if (task) {
      setTitle(task.title);
      setDescription(task.description);
      setStatus(task.status);
    }
  }, [task]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) return alert("Title is required!");

    try {
      if (task) {
        // Update existing task
        await axios.put(`${api}/tasks/${task.id}`, {
          title: title.trim(),
          description: description.trim(),
          status,
        });
      } else {
        // Create new task
        await axios.post(`${api}/tasks`, {
          title: title.trim(),
          description: description.trim(),
          status: status,
        });
      }

      fetchTasks();
      onClose();
    } catch (error) {
      console.error("Save failed:", error);
      alert("Failed to save task. Check console for details.");
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg w-96">
        <h2 className="text-xl font-bold mb-4">
          {task ? "Edit Task" : "New Task"}
        </h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Title *"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full mb-3 p-2 border rounded"
            required
          />
          <textarea
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full mb-3 p-2 border rounded h-24"
          />
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="w-full mb-4 p-2 border rounded"
          >
            <option value="todo">To Do</option>
            <option value="inprogress">In Progress</option>
            <option value="done">Done</option>
          </select>
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded"
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
};

export default TaskModal;
