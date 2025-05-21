// src/App.jsx
const api = import.meta.env.VITE_API_URL;
import { useState, useEffect } from 'react';
import { DragDropContext } from '@hello-pangea/dnd';
import axios from 'axios';
import Column from './components/Column';
import TaskModal from './components/TaskModal';

const initialColumns = [
  { id: 'todo', title: 'To Do' },
  { id: 'inprogress', title: 'In Progress' },
  { id: 'done', title: 'Done' },
];

export default function App() {
  const [tasks, setTasks] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editTask, setEditTask] = useState(null);

  // Fetch tasks from backend
  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await axios.get('http://localhost:5000/tasks');
      setTasks(response.data);
    } catch (error) {
      console.error("Failed to fetch tasks:", error);
    }
  };

  // Handle drag-and-drop
  const onDragEnd = async (result) => {
    if (!result.destination) return;

    const sourceColumn = result.source.droppableId;
    const destColumn = result.destination.droppableId;
    
    // Only proceed if column changed
    if (sourceColumn === destColumn) return;

    const taskId = result.draggableId;
    const updatedTasks = [...tasks];
    const movedTask = updatedTasks.find(t => String(t.id) === taskId);

    if (!movedTask) return;

    // Update task status
    movedTask.status = destColumn;

    try {
      // Update backend first
      await axios.put(`http://localhost:5000/tasks/${movedTask.id}`, movedTask);
      // Then update frontend state
      setTasks(updatedTasks);
    } catch (error) {
      console.error("Drag update failed:", error);
      fetchTasks(); // Revert to latest data
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="flex justify-between mb-8">
        <h1 className="text-3xl font-bold">Task Board</h1>
        <button 
          onClick={() => {
            setEditTask(null);
            setShowModal(true);
          }}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
        >
          Add Task
        </button>
      </div>

      <DragDropContext onDragEnd={onDragEnd}>
        <div className="flex gap-4">
          {initialColumns.map((column) => (
            <Column 
              key={column.id}
              column={column}
              tasks={tasks.filter(t => t.status === column.id)}
              onEdit={(task) => {
                setEditTask(task);
                setShowModal(true);
              }}
              onDelete={fetchTasks}
            />
          ))}
        </div>
      </DragDropContext>

      {showModal && (
        <TaskModal 
          key={editTask ? editTask.id : 'new'}
          task={editTask}
          onClose={() => {
            setShowModal(false);
            setEditTask(null);
            fetchTasks();
          }}
        />
      )}
    </div>
  );
}
