import { useState, useCallback } from 'react';
import type { DragState } from '@/components/KanbanBoard/KanbanBoard.types';

export const useDragAndDrop = () => {
  const [dragState, setDragState] = useState<DragState>({
    isDragging: false,
    draggedId: null,
    draggedFromColumn: null,
    draggedFromIndex: null,
    dropTargetColumn: null,
    dropTargetIndex: null,
  });

  const handleDragStart = useCallback((taskId: string, columnId: string, index: number) => {
    setDragState({
      isDragging: true,
      draggedId: taskId,
      draggedFromColumn: columnId,
      draggedFromIndex: index,
      dropTargetColumn: null,
      dropTargetIndex: null,
    });
  }, []);

  const handleDragOver = useCallback((columnId: string, index: number) => {
    setDragState((prev) => {
      if (prev.isDragging) {
        return {
          ...prev,
          dropTargetColumn: columnId,
          dropTargetIndex: index,
        };
      }
      return prev;
    });
  }, []);

  const handleDragEnd = useCallback(() => {
    setDragState({
      isDragging: false,
      draggedId: null,
      draggedFromColumn: null,
      draggedFromIndex: null,
      dropTargetColumn: null,
      dropTargetIndex: null,
    });
  }, []);

  const handleDragCancel = useCallback(() => {
    setDragState({
      isDragging: false,
      draggedId: null,
      draggedFromColumn: null,
      draggedFromIndex: null,
      dropTargetColumn: null,
      dropTargetIndex: null,
    });
  }, []);

  return {
    dragState,
    handleDragStart,
    handleDragOver,
    handleDragEnd,
    handleDragCancel,
  };
};

