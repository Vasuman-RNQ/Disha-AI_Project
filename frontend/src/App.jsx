import React, { useState, useEffect } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import axios from "axios";
import TaskModal from "./components/TaskModal";

const api = import.meta.env.VITE_API_URL;

const COLUMNS = [
  { id: "todo", title: "To Do", color: "bg-blue-100" },
  { id: "inprogress", title: "In Progress", color: "bg-yellow-100" },
  { id: "done", title: "Done", color: "bg-green-100" },
];

function App() {
  const [tasks, setTasks] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);

  // Fetch tasks from backend
  const fetchTasks = async () => {
    try {
      const response = await axios.get(`${api}/tasks`);
      setTasks(response.data);
    } catch (error) {
      console.error("Failed to fetch tasks:", error);
    }
  };

  // Handle drag-and-drop
  const handleDragEnd = async (result) => {
    if (!result.destination) return;

    const taskId = result.draggableId;
    const newStatus = result.destination.droppableId;

    try {
      // Optimistic UI update
      const updatedTasks = tasks.map(task => 
        task.id === taskId ? { ...task, status: newStatus } : task
      );
      setTasks(updatedTasks);

      // Update backend
      await axios.put(`${api}/tasks/${taskId}`, { status: newStatus });
    } catch (error) {
      console.error("Move failed:", error);
      fetchTasks(); // Revert if API fails
    }
  };

  // Open modal for editing
  const handleEdit = (task) => {
    setSelectedTask(task);
    setShowModal(true);
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  return (
    <div className="p-4 min-h-screen bg-gray-50">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Task Board</h1>
        <button
          onClick={() => {
            setSelectedTask(null);
            setShowModal(true);
          }}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
        >
          + Add Task
        </button>
      </div>

      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="flex gap-4">
          {COLUMNS.map((column) => (
            <Droppable key={column.id} droppableId={column.id}>
              {(provided) => (
                <div
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  className={`${column.color} p-4 rounded-lg w-80 flex flex-col gap-2`}
                >
                  <h2 className="text-xl font-semibold mb-4">{column.title}</h2>
                  {tasks
                    .filter((task) => task.status === column.id)
                    .map((task, index) => (
                      <Draggable key={task.id} draggableId={task.id} index={index}>
                        {(provided) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className="bg-white p-4 rounded shadow-sm hover:shadow-md cursor-move"
                            onClick={() => handleEdit(task)}
                          >
                            <h3 className="font-medium">{task.title}</h3>
                            <p className="text-gray-600 text-sm mt-1">
                              {task.description}
                            </p>
                          </div>
                        )}
                      </Draggable>
                    ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          ))}
        </div>
      </DragDropContext>

      {showModal && (
        <TaskModal
          task={selectedTask}
          onClose={() => {
            setShowModal(false);
            setSelectedTask(null);
          }}
          fetchTasks={fetchTasks}
        />
      )}
    </div>
  );
}

export default App;
