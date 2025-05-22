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

  useEffect(() => {
    fetchTasks();
  }, []);

  return (
    <div>
      <h1>Task Board</h1>
      <button onClick={() => setShowModal(true)}>Add Task</button>
      {showModal && (
        <TaskModal
          onClose={() => setShowModal(false)}
          fetchTasks={fetchTasks}
        />
      )}
      <ul>
        {tasks.map((task) => (
          <li key={task.id}>
            <strong>{task.title}</strong>: {task.description}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
