import React, { useRef, useState } from 'react';
import clsx from 'clsx';
import type { KanbanTask } from './KanbanBoard.types';
import { Avatar } from '../primitives/Avatar';
import {
  isOverdue,
  formatDateShort,
  isToday,
  isTomorrow,
  getPriorityBadgeColor,
} from '@/utils/task.utils';

interface KanbanCardProps {
  task: KanbanTask;
  isDragging: boolean;
  isDragOver: boolean;
  onEdit: (task: KanbanTask) => void;
  onDelete: (taskId: string) => void;
  onDragStart: (taskId: string, columnId: string, index: number) => void;
  onDragEnd: () => void;
  onDragOver?: (e: React.DragEvent) => void;
}

export const KanbanCard: React.FC<KanbanCardProps> = React.memo(({
  task,
  isDragging,
  isDragOver,
  onEdit,
  onDelete,
  onDragStart,
  onDragEnd,
  onDragOver,
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  const handleDragStartEvent = (e: React.DragEvent) => {
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', task.id);
    e.dataTransfer.setData('application/json', JSON.stringify({ taskId: task.id, columnId: task.status }));
    // Get the column and index from the parent
    const cardElement = e.currentTarget as HTMLElement;
    const columnElement = cardElement.closest('[data-column-id]') as HTMLElement;
    if (columnElement) {
      const colId = columnElement.getAttribute('data-column-id') || task.status;
      const taskIndex = parseInt(columnElement.getAttribute('data-task-index') || '0', 10);
      onDragStart(task.id, colId, taskIndex);
    } else {
      onDragStart(task.id, task.status, 0);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === ' ' || e.key === 'Enter') {
      e.preventDefault();
      // For keyboard drag, we need to get column and index from parent
      const cardElement = e.currentTarget as HTMLElement;
      const columnElement = cardElement.closest('[data-column-id]') as HTMLElement;
      if (columnElement) {
        const colId = columnElement.getAttribute('data-column-id') || task.status;
        const taskIndex = parseInt(columnElement.getAttribute('data-task-index') || '0', 10);
        onDragStart(task.id, colId, taskIndex);
      } else {
        onDragStart(task.id, task.status, 0);
      }
    } else if (e.key === 'Delete' || e.key === 'Backspace') {
      if (e.ctrlKey || e.metaKey) {
        e.preventDefault();
        onDelete(task.id);
      }
    } else if (e.key === 'Escape') {
      onDragEnd();
    }
  };

  const priorityLabel = task.priority || 'medium';
  const priorityColor = getPriorityBadgeColor(priorityLabel);

  const getDueDateDisplay = () => {
    if (!task.dueDate) return null;
    const dueDate = new Date(task.dueDate);
    const overdue = isOverdue(dueDate);
    
    if (isToday(dueDate)) {
      return { text: 'Due today', className: 'text-orange-600' };
    }
    if (isTomorrow(dueDate)) {
      return { text: 'Due tomorrow', className: 'text-yellow-600' };
    }
    if (overdue) {
      return { text: `Overdue: ${formatDateShort(dueDate)}`, className: 'text-error-600' };
    }
    return { text: `Due: ${formatDateShort(dueDate)}`, className: 'text-neutral-500' };
  };

  const dueDateInfo = getDueDateDisplay();

  return (
    <div
      ref={cardRef}
      role="button"
      tabIndex={0}
      data-task-id={task.id}
      aria-label={`${task.title}. Status: ${task.status}. Priority: ${priorityLabel}. Press space to grab.`}
      aria-grabbed={isDragging}
      className={clsx(
        'bg-white border border-neutral-200 rounded-lg p-3 shadow-card',
        'hover:shadow-card-hover transition-all cursor-grab active:cursor-grabbing',
        'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2',
        {
          'opacity-50 scale-95': isDragging,
          'ring-2 ring-primary-500': isDragOver,
          'shadow-lg': isHovered,
        }
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onKeyDown={handleKeyDown}
      onClick={() => !isDragging && onEdit(task)}
      onDragStart={handleDragStartEvent}
      onDragEnd={onDragEnd}
      onDragOver={onDragOver}
      draggable={!isDragging}
    >
      {/* Priority indicator */}
      {task.priority && (
        <div className={clsx('h-1 w-full rounded-t-lg -mx-3 -mt-3 mb-2', {
          'bg-blue-500': task.priority === 'low',
          'bg-yellow-500': task.priority === 'medium',
          'bg-orange-500': task.priority === 'high',
          'bg-red-500': task.priority === 'urgent',
        })} />
      )}

      {/* Header */}
      <div className="flex items-start justify-between mb-2 gap-2">
        <h4 className="font-medium text-sm text-neutral-900 line-clamp-2 flex-1">
          {task.title}
        </h4>
        {task.priority && (
          <span className={clsx('text-xs px-2 py-0.5 rounded whitespace-nowrap', priorityColor)}>
            {task.priority}
          </span>
        )}
      </div>

      {/* Description */}
      {task.description && (
        <p className="text-xs text-neutral-600 mb-2 line-clamp-2">
          {task.description}
        </p>
      )}

      {/* Tags */}
      {task.tags && task.tags.length > 0 && (
        <div className="flex gap-1 flex-wrap mb-2">
          {task.tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="text-xs bg-neutral-100 text-neutral-700 px-2 py-0.5 rounded"
            >
              {tag}
            </span>
          ))}
          {task.tags.length > 3 && (
            <span className="text-xs text-neutral-500 px-2 py-0.5">
              +{task.tags.length - 3}
            </span>
          )}
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between mt-2 pt-2 border-t border-neutral-100">
        <div className="flex items-center gap-2">
          {task.assignee && <Avatar name={task.assignee} size="sm" />}
        </div>
        {dueDateInfo && (
          <div className={clsx('text-xs font-medium', dueDateInfo.className)}>
            {dueDateInfo.text}
          </div>
        )}
      </div>

      {/* Quick actions on hover */}
      {isHovered && !isDragging && (
        <div className="absolute top-2 right-2 flex gap-1 opacity-100">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEdit(task);
            }}
            className="p-1 bg-white rounded shadow-sm hover:bg-neutral-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
            aria-label="Edit task"
          >
            <svg className="w-4 h-4 text-neutral-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </button>
        </div>
      )}
    </div>
  );
});

KanbanCard.displayName = 'KanbanCard';

