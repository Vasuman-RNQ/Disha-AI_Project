import React, { useState } from "react";
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import TaskCard from './TaskCard';

export default function Column({ column, tasks, onEdit, onDelete }) {
  return (
    <div className="w-80 bg-gray-50 rounded-lg shadow-md p-4">
      <h2 className="text-xl font-semibold mb-4">{column.title}</h2>
      <Droppable droppableId={column.id}>
        {(provided) => (
          <div 
            {...provided.droppableProps}
            ref={provided.innerRef}
            className="min-h-[500px]"
          >
            {tasks.map((task, index) => (
              <TaskCard 
                key={task.id}
                task={task}
                index={index}
                onEdit={onEdit}
                onDelete={onDelete}
              />
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </div>
  );
}
