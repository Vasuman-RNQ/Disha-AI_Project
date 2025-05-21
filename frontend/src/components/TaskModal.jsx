// import React, { useState } from "react";
import axios from "axios";

const api = import.meta.env.VITE_API_URL;

const TaskModal = ({ onClose, fetchTasks }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent page reload

    try {
      // Send POST request to backend
      const response = await axios.post(`${api}/tasks`, {
        title: title,
        description: description,
        status: "todo", // Default status for new tasks
      });

      // Log success (optional)
      console.log("Task saved:", response.data);

      // Close modal and refresh task list
      onClose();
      fetchTasks();

      // Clear form fields
      setTitle("");
      setDescription("");
    } catch (error) {
      console.error("Failed to save task:", error);
      alert("Failed to save task. Check the console for details.");
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
        <button type="button" onClick={onClose}>
          Cancel
        </button>
      </form>
    </div>
  );
};

export default TaskModal;
