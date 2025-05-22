import React, { useState } from "react";
import axios from "axios";

const api = import.meta.env.VITE_API_URL;

const TaskModal = ({ onClose, fetchTasks }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) return alert("Title is required!");

    try {
      // Send task to backend
      await axios.post(`${api}/tasks`, {
        title: title.trim(),
        description: description.trim(),
        status: "todo",
      });

      // Refresh tasks and close modal
      if (typeof fetchTasks === "function") fetchTasks();
      if (typeof onClose === "function") onClose();

      // Clear form
      setTitle("");
      setDescription("");
    } catch (error) {
      console.error("Save failed:", error);
      alert("Failed to save task. Check console for details.");
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h2>Create New Task</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Task Title *"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
          <textarea
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <div className="modal-actions">
            <button type="button" onClick={onClose}>
              Cancel
            </button>
            <button type="submit">Save Task</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TaskModal;
