import React, { useState, useEffect } from "react";
import axios from "axios";
import TaskModal from "./components/TaskModal";

const api = import.meta.env.VITE_API_URL;

function App() {
  const [tasks, setTasks] = useState([]);
  const [showModal, setShowModal] = useState(false);

  // Fetch tasks from backend
  const fetchTasks = async () => {
    try {
      const response = await axios.get(`${api}/tasks`);
      setTasks(response.data);
    } catch (error) {
      console.error("Failed to fetch tasks:", error);
    }
  };

  // Fetch tasks on initial load
  useEffect(() => {
    fetchTasks();
  }, []);

  return (
    <div className="app-container">
      <div className="header">
        <h1>Task Board</h1>
        <button 
          className="add-task-btn" 
          onClick={() => setShowModal(true)}
        >
          + Add Task
        </button>
      </div>

      {/* Task List */}
      <div className="task-list">
        {tasks.map((task) => (
          <div key={task.id} className="task-card">
            <h3>{task.title}</h3>
            <p>{task.description}</p>
            <span className={`status ${task.status}`}>{task.status}</span>
          </div>
        ))}
      </div>

      {/* Task Modal */}
      {showModal && (
        <TaskModal
          onClose={() => setShowModal(false)}
          fetchTasks={fetchTasks}
        />
      )}
    </div>
  );
}

export default App;
