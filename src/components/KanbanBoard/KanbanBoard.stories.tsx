import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { KanbanBoard } from './KanbanBoard';
import type { KanbanColumn, KanbanTask } from './KanbanBoard.types';

const meta: Meta<typeof KanbanBoard> = {
  title: 'Components/KanbanBoard',
  component: KanbanBoard,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'A fully functional Kanban Board View component with drag-and-drop, task management, and responsive design.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    onTaskMove: { action: 'task moved' },
    onTaskCreate: { action: 'task created' },
    onTaskUpdate: { action: 'task updated' },
    onTaskDelete: { action: 'task deleted' },
  },
};

export default meta;
type Story = StoryObj<typeof KanbanBoard>;

// Sample data generators
const generateTask = (
  id: string,
  title: string,
  status: string,
  priority: KanbanTask['priority'] = 'medium',
  assignee?: string
): KanbanTask => ({
  id,
  title,
  description: `Description for ${title}`,
  status,
  priority,
  assignee,
  tags: ['frontend', 'feature'],
  createdAt: new Date(2024, 0, 10),
  dueDate: new Date(2024, 0, 20),
});

const defaultColumns: KanbanColumn[] = [
  { id: 'todo', title: 'To Do', color: '#6b7280', taskIds: ['task-1', 'task-2'], maxTasks: 10 },
  { id: 'in-progress', title: 'In Progress', color: '#3b82f6', taskIds: ['task-3'], maxTasks: 5 },
  { id: 'review', title: 'Review', color: '#f59e0b', taskIds: [], maxTasks: 3 },
  { id: 'done', title: 'Done', color: '#10b981', taskIds: ['task-4', 'task-5'] },
];

const defaultTasks: Record<string, KanbanTask> = {
  'task-1': generateTask('task-1', 'Implement drag and drop', 'todo', 'high', 'John Doe'),
  'task-2': generateTask('task-2', 'Design task modal', 'todo', 'medium', 'Jane Smith'),
  'task-3': generateTask('task-3', 'Setup TypeScript', 'in-progress', 'urgent', 'John Doe'),
  'task-4': generateTask('task-4', 'Create project structure', 'done', 'low', 'Jane Smith'),
  'task-5': generateTask('task-5', 'Install dependencies', 'done', 'low', 'John Doe'),
};

// Default Story
export const Default: Story = {
  args: {
    columns: defaultColumns,
    tasks: defaultTasks,
    onTaskMove: fn(),
    onTaskCreate: fn(),
    onTaskUpdate: fn(),
    onTaskDelete: fn(),
  },
  parameters: {
    docs: {
      description: {
        story: 'Default Kanban board with sample tasks across multiple columns.',
      },
    },
  },
};

// Empty State Story
export const Empty: Story = {
  args: {
    columns: [
      { id: 'todo', title: 'To Do', color: '#6b7280', taskIds: [] },
      { id: 'in-progress', title: 'In Progress', color: '#3b82f6', taskIds: [] },
      { id: 'review', title: 'Review', color: '#f59e0b', taskIds: [] },
      { id: 'done', title: 'Done', color: '#10b981', taskIds: [] },
    ],
    tasks: {},
    onTaskMove: fn(),
    onTaskCreate: fn(),
    onTaskUpdate: fn(),
    onTaskDelete: fn(),
  },
  parameters: {
    docs: {
      description: {
        story: 'Empty Kanban board with no tasks. Shows empty state messages in each column.',
      },
    },
  },
};

// Large Dataset Story
export const WithManyTasks: Story = {
  args: (() => {
    const columns: KanbanColumn[] = [
      { id: 'todo', title: 'To Do', color: '#6b7280', taskIds: [], maxTasks: 20 },
      { id: 'in-progress', title: 'In Progress', color: '#3b82f6', taskIds: [], maxTasks: 10 },
      { id: 'review', title: 'Review', color: '#f59e0b', taskIds: [], maxTasks: 5 },
      { id: 'done', title: 'Done', color: '#10b981', taskIds: [] },
    ];

    const tasks: Record<string, KanbanTask> = {};
    const priorities: KanbanTask['priority'][] = ['low', 'medium', 'high', 'urgent'];
    const assignees = ['John Doe', 'Jane Smith', 'Bob Johnson', 'Alice Williams'];

    // Generate 30+ tasks
    for (let i = 1; i <= 35; i++) {
      const taskId = `task-${i}`;
      const columnIndex = Math.floor(Math.random() * columns.length);
      const column = columns[columnIndex];
      
      tasks[taskId] = generateTask(
        taskId,
        `Task ${i}: ${['Implement feature', 'Fix bug', 'Review code', 'Write tests', 'Update docs'][i % 5]}`,
        column.id,
        priorities[i % 4],
        assignees[i % 4]
      );
      
      column.taskIds.push(taskId);
    }

    return {
      columns,
      tasks,
      onTaskMove: fn(),
      onTaskCreate: fn(),
      onTaskUpdate: fn(),
      onTaskDelete: fn(),
    };
  })(),
  parameters: {
    docs: {
      description: {
        story: 'Kanban board with 35+ tasks to test performance and virtualization.',
      },
    },
  },
};

// Different Priorities Story
export const DifferentPriorities: Story = {
  args: {
    columns: defaultColumns,
    tasks: {
      'task-1': generateTask('task-1', 'Low priority task', 'todo', 'low', 'John Doe'),
      'task-2': generateTask('task-2', 'Medium priority task', 'todo', 'medium', 'Jane Smith'),
      'task-3': generateTask('task-3', 'High priority task', 'in-progress', 'high', 'Bob Johnson'),
      'task-4': generateTask('task-4', 'Urgent priority task', 'in-progress', 'urgent', 'Alice Williams'),
      'task-5': generateTask('task-5', 'Completed low priority', 'done', 'low', 'John Doe'),
      'task-6': generateTask('task-6', 'Completed high priority', 'done', 'high', 'Jane Smith'),
    },
    onTaskMove: fn(),
    onTaskCreate: fn(),
    onTaskUpdate: fn(),
    onTaskDelete: fn(),
  },
  parameters: {
    docs: {
      description: {
        story: 'Kanban board showcasing all priority levels with color-coded indicators.',
      },
    },
  },
};

// Interactive Demo Story
export const InteractiveDemo: Story = {
  args: {
    columns: defaultColumns,
    tasks: defaultTasks,
    onTaskMove: fn(),
    onTaskCreate: fn(),
    onTaskUpdate: fn(),
    onTaskDelete: fn(),
  },
  parameters: {
    docs: {
      description: {
        story: 'Fully interactive Kanban board. Try dragging tasks between columns, clicking to edit, and adding new tasks.',
      },
    },
  },
};

// Mobile View Story
export const MobileView: Story = {
  args: {
    columns: defaultColumns,
    tasks: defaultTasks,
    onTaskMove: fn(),
    onTaskCreate: fn(),
    onTaskUpdate: fn(),
    onTaskDelete: fn(),
  },
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
    docs: {
      description: {
        story: 'Kanban board optimized for mobile devices. Columns stack vertically and are swipeable.',
      },
    },
  },
};

// Accessibility Story
export const Accessibility: Story = {
  args: {
    columns: defaultColumns,
    tasks: defaultTasks,
    onTaskMove: fn(),
    onTaskCreate: fn(),
    onTaskUpdate: fn(),
    onTaskDelete: fn(),
  },
  parameters: {
    docs: {
      description: {
        story: 'Keyboard navigation demonstration. Use Tab to navigate, Space/Enter to grab tasks, Arrow keys to move, and Escape to cancel.',
      },
    },
  },
};

