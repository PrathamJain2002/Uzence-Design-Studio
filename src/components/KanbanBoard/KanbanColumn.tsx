import React, { useState, useRef, useEffect } from 'react';
import clsx from 'clsx';
import type { KanbanTask, KanbanColumn as KanbanColumnType } from './KanbanBoard.types';
import { KanbanCard } from './KanbanCard';
import { Button } from '../primitives/Button';
import { isAtWipLimit, isApproachingWipLimit } from '@/utils/column.utils';

interface KanbanColumnProps {
  column: KanbanColumnType & { tasks: KanbanTask[] };
  isDragging: boolean;
  draggedTaskId: string | null;
  dropTargetIndex: number | null;
  onTaskClick: (task: KanbanTask) => void;
  onAddTask: (columnId: string) => void;
  onDragStart: (taskId: string, columnId: string, index: number) => void;
  onDragOver: (columnId: string, index: number) => void;
  onDragEnd: () => void;
  onDrop: (columnId: string, index: number) => void;
}

export const KanbanColumn: React.FC<KanbanColumnProps> = React.memo(({
  column,
  isDragging,
  draggedTaskId,
  dropTargetIndex,
  onTaskClick,
  onAddTask,
  onDragStart,
  onDragOver,
  onDragEnd,
  onDrop,
}) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const columnRef = useRef<HTMLDivElement>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

  const taskCount = column.tasks.length;
  const isAtLimit = isAtWipLimit(taskCount, column.maxTasks);
  const isApproachingLimit = isApproachingWipLimit(taskCount, column.maxTasks);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!columnRef.current) return;

    const taskId = e.dataTransfer.getData('text/plain');
    if (!taskId) return;

    const rect = columnRef.current.getBoundingClientRect();
    const y = e.clientY - rect.top;
    const scrollTop = columnRef.current.scrollTop;
    const cardHeight = 120; // Approximate card height
    const headerHeight = 60;
    const padding = 16; // p-4 = 16px
    
    const relativeY = y + scrollTop - headerHeight - padding;
    let index = Math.max(0, Math.min(column.tasks.length, Math.floor(relativeY / (cardHeight + 12)))); // 12px gap
    
    // If dragging within same column, adjust index if dragging past the dragged item
    if (taskId === draggedTaskId) {
      const draggedIndex = column.tasks.findIndex(t => t.id === taskId);
      if (draggedIndex !== -1 && index > draggedIndex) {
        index = Math.max(0, index - 1);
      }
    }
    
    setDragOverIndex(index);
    onDragOver(column.id, index);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    const taskId = e.dataTransfer.getData('text/plain');
    if (!taskId) {
      setDragOverIndex(null);
      return;
    }
    
    // Use the calculated drop index from dragOver, or use dropTargetIndex from props
    const finalIndex = dropTargetIndex !== null ? dropTargetIndex : (dragOverIndex !== null ? dragOverIndex : column.tasks.length);
    
    // If dropping on the same task at the same position in the same column, don't move
    const currentIndex = column.tasks.findIndex(t => t.id === taskId);
    const task = column.tasks.find(t => t.id === taskId);
    if (currentIndex === finalIndex && currentIndex !== -1 && task && task.status === column.id) {
      setDragOverIndex(null);
      onDragEnd();
      return;
    }
    
    onDrop(column.id, finalIndex);
    setDragOverIndex(null);
  };

  const handleDragLeave = () => {
    setDragOverIndex(null);
  };

  return (
    <div
      ref={columnRef}
      role="region"
      aria-label={`${column.title} column. ${taskCount} tasks.`}
      className="flex flex-col h-full min-w-[280px] max-w-[320px] bg-neutral-50 rounded-lg border border-neutral-200"
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      onDragLeave={handleDragLeave}
    >
      {/* Header */}
      <div
        className="sticky top-0 z-10 p-4 border-b border-neutral-200 bg-white rounded-t-lg"
        style={{ borderLeftColor: column.color, borderLeftWidth: '4px' }}
      >
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <h3 className="font-semibold text-neutral-900">{column.title}</h3>
            <span className="text-sm text-neutral-500 bg-neutral-100 px-2 py-0.5 rounded">
              {taskCount}
            </span>
          </div>
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="text-neutral-400 hover:text-neutral-600 transition-colors"
            aria-label={isCollapsed ? 'Expand column' : 'Collapse column'}
          >
            <svg
              className={clsx('w-5 h-5 transition-transform', { 'rotate-180': isCollapsed })}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>

        {/* WIP Limit Indicator */}
        {column.maxTasks && (
          <div className="flex items-center gap-2">
            <div className="flex-1 h-2 bg-neutral-200 rounded-full overflow-hidden">
              <div
                className={clsx('h-full transition-all', {
                  'bg-success-500': !isAtLimit && !isApproachingLimit,
                  'bg-warning-500': isApproachingLimit && !isAtLimit,
                  'bg-error-500': isAtLimit,
                })}
                style={{ width: `${Math.min(100, (taskCount / column.maxTasks) * 100)}%` }}
              />
            </div>
            <span
              className={clsx('text-xs font-medium', {
                'text-neutral-600': !isAtLimit && !isApproachingLimit,
                'text-warning-700': isApproachingLimit && !isAtLimit,
                'text-error-700': isAtLimit,
              })}
            >
              {taskCount}/{column.maxTasks}
            </span>
          </div>
        )}
      </div>

      {/* Task List */}
      {!isCollapsed && (
        <div 
          className="flex-1 overflow-y-auto p-4 space-y-3"
          data-column-id={column.id}
        >
          {column.tasks.length === 0 ? (
            <div className="text-center py-8 text-neutral-400 text-sm">
              <p>No tasks</p>
              <p className="text-xs mt-1">Drop tasks here or add new</p>
            </div>
          ) : (
            <>
              {column.tasks.map((task, index) => {
                const isDragOver = isDragging && dropTargetIndex === index && draggedTaskId !== task.id;
                const isBeingDragged = draggedTaskId === task.id;

                return (
                  <div 
                    key={task.id} 
                    className="relative"
                    data-column-id={column.id}
                    data-task-index={index}
                  >
                    {isDragOver && (
                      <div className="absolute -top-1 left-0 right-0 h-1 bg-primary-500 rounded z-20" />
                    )}
                    <KanbanCard
                      task={task}
                      isDragging={isBeingDragged}
                      isDragOver={isDragOver}
                      onEdit={onTaskClick}
                      onDelete={() => {}}
                      onDragStart={(taskId, colId, idx) => onDragStart(taskId, colId, idx)}
                      onDragEnd={onDragEnd}
                      onDragOver={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                      }}
                    />
                  </div>
                );
              })}
              {/* Drop zone at the end */}
              {isDragging && dropTargetIndex === column.tasks.length && (
                <div className="h-1 bg-primary-500 rounded" />
              )}
            </>
          )}
        </div>
      )}

      {/* Add Task Button */}
      {!isCollapsed && (
        <div className="p-4 border-t border-neutral-200">
          <Button
            variant="ghost"
            size="sm"
            className="w-full"
            onClick={() => onAddTask(column.id)}
          >
            + Add Task
          </Button>
        </div>
      )}
    </div>
  );
});

KanbanColumn.displayName = 'KanbanColumn';

