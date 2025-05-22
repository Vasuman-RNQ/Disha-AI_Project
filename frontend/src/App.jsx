// App.jsx
import { useState, useRef } from 'react';
import TaskModal from './TaskModal';

const initialTasks = {
  todo: [],
  inProgress: [],
  done: []
};

export default function App() {
  const [tasks, setTasks] = useState(initialTasks);
  const [showModal, setShowModal] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const dragItem = useRef(null);
  const dragCategory = useRef(null);

  // CRUD Operations
  const createTask = (task) => {
    setTasks(prev => ({
      ...prev,
      todo: [...prev.todo, { ...task, id: Date.now() }]
    }));
  };

  const updateTask = (updatedTask) => {
    setTasks(prev => {
      const newState = { ...prev };
      Object.keys(newState).forEach(category => {
        newState[category] = newState[category].map(task => 
          task.id === updatedTask.id ? updatedTask : task
        );
      });
      return newState;
    });
  };

  const deleteTask = (taskId) => {
    setTasks(prev => {
      const newState = { ...prev };
      Object.keys(newState).forEach(category => {
        newState[category] = newState[category].filter(t => t.id !== taskId);
      });
      return newState;
    });
  };

  // Drag and Drop Handlers
  const handleDragStart = (e, taskId, category) => {
    dragItem.current = taskId;
    dragCategory.current = category;
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e, targetCategory) => {
    e.preventDefault();
    if (!dragItem.current || dragCategory.current === targetCategory) return;

    setTasks(prev => {
      const sourceCategory = dragCategory.current;
      const task = prev[sourceCategory].find(t => t.id === dragItem.current);
      
      return {
        ...prev,
        [sourceCategory]: prev[sourceCategory].filter(t => t.id !== dragItem.current),
        [targetCategory]: [...prev[targetCategory], task]
      };
    });

    dragItem.current = null;
    dragCategory.current = null;
  };

  return (
    <div className="app">
      <header>
        <h1>Task Board</h1>
        <button onClick={() => setShowModal(true)}>Create Task</button>
      </header>

      <div className="board">
        {Object.keys(tasks).map((category) => (
          <div 
            key={category}
            className="column"
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, category)}
          >
            <h2>{category.replace(/([A-Z])/g, ' $1').toUpperCase()}</h2>
            <div className="tasks">
              {tasks[category].map((task) => (
                <div
                  key={task.id}
                  className="task"
                  draggable
                  onDragStart={(e) => handleDragStart(e, task.id, category)}
                  onClick={() => {
                    setEditingTask(task);
                    setShowModal(true);
                  }}
                >
                  <h3>{task.title}</h3>
                  <p>{task.description}</p>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteTask(task.id);
                    }}
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <TaskModal
          task={editingTask}
          onClose={() => {
            setShowModal(false);
            setEditingTask(null);
          }}
          onSubmit={(taskData) => {
            editingTask ? updateTask({ ...editingTask, ...taskData }) : createTask(taskData);
          }}
        />
      )}
    </div>
  );
}
