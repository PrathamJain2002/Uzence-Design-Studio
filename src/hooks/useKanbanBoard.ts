import { useState, useCallback, useMemo } from 'react';
import type { KanbanTask, KanbanColumn } from '@/components/KanbanBoard/KanbanBoard.types';
import { reorderTasks, moveTaskBetweenColumns } from '@/utils/column.utils';

interface UseKanbanBoardProps {
  initialColumns: KanbanColumn[];
  initialTasks: Record<string, KanbanTask>;
  onTaskMove?: (taskId: string, fromColumn: string, toColumn: string, newIndex: number) => void;
  onTaskCreate?: (columnId: string, task: KanbanTask) => void;
  onTaskUpdate?: (taskId: string, updates: Partial<KanbanTask>) => void;
  onTaskDelete?: (taskId: string) => void;
}

export const useKanbanBoard = ({
  initialColumns,
  initialTasks,
  onTaskMove,
  onTaskCreate,
  onTaskUpdate,
  onTaskDelete,
}: UseKanbanBoardProps) => {
  const [columns, setColumns] = useState<KanbanColumn[]>(initialColumns);
  const [tasks, setTasks] = useState<Record<string, KanbanTask>>(initialTasks);

  const moveTask = useCallback(
    (taskId: string, fromColumnId: string, toColumnId: string, newIndex: number) => {
      const fromColumn = columns.find((col) => col.id === fromColumnId);
      const toColumn = columns.find((col) => col.id === toColumnId);

      if (!fromColumn || !toColumn) return;

      const fromIndex = fromColumn.taskIds.indexOf(taskId);
      if (fromIndex === -1) return;

      let newColumns: KanbanColumn[];

      if (fromColumnId === toColumnId) {
        // Reorder within same column
        const newTaskIds = reorderTasks(fromColumn.taskIds, fromIndex, newIndex);
        newColumns = columns.map((col) =>
          col.id === fromColumnId ? { ...col, taskIds: newTaskIds } : col
        );
      } else {
        // Move between columns
        const { source, destination } = moveTaskBetweenColumns(
          fromColumn.taskIds,
          toColumn.taskIds,
          fromIndex,
          newIndex
        );
        newColumns = columns.map((col) => {
          if (col.id === fromColumnId) {
            return { ...col, taskIds: source };
          }
          if (col.id === toColumnId) {
            return { ...col, taskIds: destination };
          }
          return col;
        });

        // Update task status
        setTasks((prev) => ({
          ...prev,
          [taskId]: { ...prev[taskId], status: toColumnId },
        }));
      }

      setColumns(newColumns);
      onTaskMove?.(taskId, fromColumnId, toColumnId, newIndex);
    },
    [columns, onTaskMove]
  );

  const createTask = useCallback(
    (columnId: string, task: KanbanTask) => {
      setTasks((prev) => ({ ...prev, [task.id]: task }));
      setColumns((prev) =>
        prev.map((col) =>
          col.id === columnId ? { ...col, taskIds: [...col.taskIds, task.id] } : col
        )
      );
      onTaskCreate?.(columnId, task);
    },
    [onTaskCreate]
  );

  const updateTask = useCallback(
    (taskId: string, updates: Partial<KanbanTask>) => {
      setTasks((prev) => {
        if (!prev[taskId]) return prev;
        return { ...prev, [taskId]: { ...prev[taskId], ...updates } };
      });
      onTaskUpdate?.(taskId, updates);
    },
    [onTaskUpdate]
  );

  const deleteTask = useCallback(
    (taskId: string) => {
      const task = tasks[taskId];
      if (!task) return;

      setTasks((prev) => {
        const newTasks = { ...prev };
        delete newTasks[taskId];
        return newTasks;
      });

      setColumns((prev) =>
        prev.map((col) => ({
          ...col,
          taskIds: col.taskIds.filter((id) => id !== taskId),
        }))
      );

      onTaskDelete?.(taskId);
    },
    [tasks, onTaskDelete]
  );

  const columnsWithTasks = useMemo(() => {
    return columns.map((column) => ({
      ...column,
      tasks: column.taskIds
        .map((taskId) => tasks[taskId])
        .filter((task): task is KanbanTask => task !== undefined),
    }));
  }, [columns, tasks]);

  return {
    columns: columnsWithTasks,
    tasks,
    moveTask,
    createTask,
    updateTask,
    deleteTask,
  };
};

