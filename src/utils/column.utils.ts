/**
 * Reorders tasks after drag and drop within the same column
 */
export const reorderTasks = (
  tasks: string[],
  startIndex: number,
  endIndex: number
): string[] => {
  const result = Array.from(tasks);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);
  return result;
};

/**
 * Moves task between columns
 */
export const moveTaskBetweenColumns = (
  sourceColumn: string[],
  destColumn: string[],
  sourceIndex: number,
  destIndex: number
): { source: string[]; destination: string[] } => {
  const sourceClone = Array.from(sourceColumn);
  const destClone = Array.from(destColumn);
  const [removed] = sourceClone.splice(sourceIndex, 1);
  destClone.splice(destIndex, 0, removed);
  return {
    source: sourceClone,
    destination: destClone,
  };
};

/**
 * Checks if column is at WIP limit
 */
export const isAtWipLimit = (taskCount: number, maxTasks?: number): boolean => {
  if (!maxTasks) return false;
  return taskCount >= maxTasks;
};

/**
 * Checks if column is approaching WIP limit
 */
export const isApproachingWipLimit = (taskCount: number, maxTasks?: number): boolean => {
  if (!maxTasks) return false;
  return taskCount >= maxTasks * 0.8;
};

