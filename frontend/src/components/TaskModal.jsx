import React, { useState } from "react";
import axios from "axios";

const api = import.meta.env.VITE_API_URL;

const TaskModal = ({ onClose, fetchTasks }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${api}/tasks`, {
        title,
        description,
        status: "todo",
      });
      console.log("Task saved:", response.data);

      // Safely call callbacks if provided
      if (typeof fetchTasks === "function") fetchTasks();
      if (typeof onClose === "function") onClose();

      // Optionally clear form fields
      setTitle("");
      setDescription("");
    } catch (error) {
      console.error("Failed to save task:", error);
      alert("Failed to save task. See console for details.");
    }
  };

  return (
    <div className="modal">
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Task Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <textarea
          placeholder="Task Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <button type="submit">Save</button>
        <button type="button" onClick={onClose}>Cancel</button>
      </form>
    </div>
  );
};

export default TaskModal;
