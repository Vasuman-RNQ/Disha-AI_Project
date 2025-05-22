// src/components/TaskCard.jsx
import React, { useState } from "react";
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { FiEdit, FiTrash2 } from 'react-icons/fi';

export default function TaskCard({ task, index, onEdit, onDelete }) {
  return (
    <Draggable draggableId={String(task.id)} index={index}>
      {(provided) => (
        <div
          className="bg-white rounded-lg shadow p-4 mb-4 flex justify-between items-start"
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
        >
          <div>
            <div className="font-semibold text-lg">{task.title}</div>
            {task.description && (
              <div className="text-gray-500 text-sm mt-1">{task.description}</div>
            )}
          </div>
          <div className="flex gap-2 ml-2">
            <button
              onClick={() => onEdit(task)}
              className="text-blue-500 hover:text-blue-700"
              title="Edit"
            >
              <FiEdit size={18} />
            </button>
            <button
              onClick={async () => {
                if (window.confirm('Are you sure you want to delete this task?')) {
                  await fetch(`http://localhost:5000/tasks/${task.id}`, { method: 'DELETE' });
                  onDelete(); // Refresh tasks in parent
                }
              }}
              className="text-red-500 hover:text-red-700"
              title="Delete"
            >
              <FiTrash2 size={18} />
            </button>
          </div>
        </div>
      )}
    </Draggable>
  );
}
