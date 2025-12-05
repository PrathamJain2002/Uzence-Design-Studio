import React, { useState, useCallback, useRef, useEffect } from 'react';
import type { KanbanViewProps, KanbanTask } from './KanbanBoard.types';
import { KanbanColumn } from './KanbanColumn';
import { TaskModal } from './TaskModal';
import { useDragAndDrop } from '@/hooks/useDragAndDrop';
import { useKanbanBoard } from '@/hooks/useKanbanBoard';

export const KanbanBoard: React.FC<KanbanViewProps> = ({
  columns: initialColumns,
  tasks: initialTasks,
  onTaskMove,
  onTaskCreate,
  onTaskUpdate,
  onTaskDelete,
}) => {
  const {
    dragState,
    handleDragStart,
    handleDragOver,
    handleDragEnd,
    handleDragCancel,
  } = useDragAndDrop();

  const {
    columns,
    moveTask,
    createTask,
    updateTask,
    deleteTask,
  } = useKanbanBoard({
    initialColumns,
    initialTasks,
    onTaskMove,
    onTaskCreate,
    onTaskUpdate,
    onTaskDelete,
  });

  const [selectedTask, setSelectedTask] = useState<KanbanTask | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCreatingTask, setIsCreatingTask] = useState(false);
  const [creatingColumnId, setCreatingColumnId] = useState<string | null>(null);
  const boardRef = useRef<HTMLDivElement>(null);

  const handleTaskClick = useCallback((task: KanbanTask) => {
    setSelectedTask(task);
    setIsModalOpen(true);
    setIsCreatingTask(false);
  }, []);

  const handleAddTask = useCallback((columnId: string) => {
    setCreatingColumnId(columnId);
    setIsCreatingTask(true);
    setIsModalOpen(true);
    
    // Create a temporary task for the modal
    const newTask: KanbanTask = {
      id: `temp-${Date.now()}`,
      title: '',
      status: columnId,
      priority: 'medium',
      createdAt: new Date(),
    };
    setSelectedTask(newTask);
  }, []);

  const handleSaveTask = useCallback((taskId: string, updates: Partial<KanbanTask>) => {
    if (isCreatingTask) {
      // Create new task
      const newTask: KanbanTask = {
        ...selectedTask!,
        ...updates,
        id: `task-${Date.now()}`,
        createdAt: new Date(),
      };
      createTask(creatingColumnId!, newTask);
      setIsCreatingTask(false);
      setCreatingColumnId(null);
    } else {
      // Update existing task
      updateTask(taskId, updates);
    }
    setIsModalOpen(false);
    setSelectedTask(null);
  }, [isCreatingTask, selectedTask, creatingColumnId, createTask, updateTask]);

  const handleDeleteTask = useCallback((taskId: string) => {
    deleteTask(taskId);
    setIsModalOpen(false);
    setSelectedTask(null);
  }, [deleteTask]);

  const handleColumnDragStart = useCallback((taskId: string, columnId: string, index: number) => {
    handleDragStart(taskId, columnId, index);
  }, [handleDragStart]);

  const handleColumnDragOver = useCallback((columnId: string, index: number) => {
    handleDragOver(columnId, index);
  }, [handleDragOver]);

  const handleColumnDrop = useCallback((columnId: string, index: number) => {
    if (dragState.draggedId && dragState.draggedFromColumn) {
      moveTask(
        dragState.draggedId,
        dragState.draggedFromColumn,
        columnId,
        index
      );
    }
    handleDragEnd();
  }, [dragState, moveTask, handleDragEnd]);

  // Handle global drag end to reset state if dropped outside
  useEffect(() => {
    const handleGlobalDrop = (e: DragEvent) => {
      // Only handle if not dropped on a column
      const target = e.target as HTMLElement;
      if (!target.closest('[data-column-id]')) {
        if (dragState.isDragging) {
          handleDragCancel();
        }
      }
    };

    document.addEventListener('drop', handleGlobalDrop, true);

    return () => {
      document.removeEventListener('drop', handleGlobalDrop, true);
    };
  }, [dragState.isDragging, handleDragCancel]);

  return (
    <div className="w-full h-full">
      <div
        ref={boardRef}
        className="flex gap-4 overflow-x-auto pb-4 h-full"
        style={{ scrollSnapType: 'x mandatory' }}
        role="application"
        aria-label="Kanban board"
      >
        {columns.map((column) => (
          <div
            key={column.id}
            style={{ scrollSnapAlign: 'start' }}
            className="flex-shrink-0"
          >
            <KanbanColumn
              column={column}
              isDragging={dragState.isDragging}
              draggedTaskId={dragState.draggedId}
              dropTargetIndex={
                dragState.dropTargetColumn === column.id
                  ? dragState.dropTargetIndex
                  : null
              }
              onTaskClick={handleTaskClick}
              onAddTask={handleAddTask}
              onDragStart={handleColumnDragStart}
              onDragOver={handleColumnDragOver}
              onDragEnd={handleDragEnd}
              onDrop={handleColumnDrop}
            />
          </div>
        ))}
      </div>

      {selectedTask && (
        <TaskModal
          isOpen={isModalOpen}
          task={selectedTask}
          columns={initialColumns}
          isCreating={isCreatingTask}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedTask(null);
            setIsCreatingTask(false);
            setCreatingColumnId(null);
          }}
          onSave={handleSaveTask}
          onDelete={handleDeleteTask}
        />
      )}
    </div>
  );
};

