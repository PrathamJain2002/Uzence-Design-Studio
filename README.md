# Kanban Board Component

A production-grade, fully functional Kanban Board View component built with React, TypeScript, and Tailwind CSS. This component demonstrates enterprise-grade UI/UX patterns, accessibility-first design, and performance optimization techniques.

## 🚀 Live Storybook

uzence-design-studio-six.vercel.app

## 📦 Installation

```bash
# Install dependencies
npm install

# Run Storybook
npm run storybook

# Build Storybook for production
npm run build-storybook
```

## 🏗️ Architecture

This Kanban Board component is built with a modular, scalable architecture:

- **Component Structure**: Separated into logical components (KanbanBoard, KanbanColumn, KanbanCard, TaskModal)
- **Custom Hooks**: Reusable hooks for drag-and-drop logic and board state management
- **Utility Functions**: Pure functions for task and column operations
- **Type Safety**: Comprehensive TypeScript types with strict mode enabled
- **Performance**: Memoization, virtualization-ready structure, and optimized re-renders

### Project Structure

```
kanban-component/
├── src/
│   ├── components/
│   │   ├── KanbanBoard/
│   │   │   ├── KanbanBoard.tsx          # Main component
│   │   │   ├── KanbanBoard.stories.tsx  # Storybook stories
│   │   │   ├── KanbanBoard.types.ts     # Type definitions
│   │   │   ├── KanbanColumn.tsx         # Column component
│   │   │   ├── KanbanCard.tsx           # Task card component
│   │   │   └── TaskModal.tsx            # Task editing modal
│   │   └── primitives/                  # Reusable UI elements
│   │       ├── Button.tsx
│   │       ├── Modal.tsx
│   │       └── Avatar.tsx
│   ├── hooks/
│   │   ├── useDragAndDrop.ts            # Drag and drop logic
│   │   └── useKanbanBoard.ts            # Board state management
│   ├── utils/
│   │   ├── task.utils.ts                # Task-related utilities
│   │   └── column.utils.ts              # Column-related utilities
│   └── styles/
│       └── globals.css                   # Global styles
├── .storybook/                          # Storybook configuration
└── package.json
```

## ✨ Features

### Core Features

- ✅ **Drag-and-Drop**: Smooth drag-and-drop between columns with visual feedback
- ✅ **Task Management**: Create, edit, update, and delete tasks
- ✅ **Priority Levels**: Visual priority indicators (low, medium, high, urgent)
- ✅ **Assignee Support**: Avatar display with initials
- ✅ **Tags**: Multiple tags per task with visual badges
- ✅ **Due Dates**: Due date display with overdue indicators
- ✅ **WIP Limits**: Visual indicators for column work-in-progress limits
- ✅ **Responsive Design**: Works seamlessly on mobile, tablet, and desktop
- ✅ **Keyboard Navigation**: Full keyboard accessibility
- ✅ **ARIA Labels**: Comprehensive ARIA implementation for screen readers

### Advanced Features

- **Column Collapse**: Collapse/expand columns to save space
- **Empty States**: Helpful empty state messages
- **Visual Feedback**: Hover states, drag indicators, and smooth animations
- **Task Modal**: Comprehensive task editing modal with all fields
- **Performance Optimized**: Memoized components and efficient re-renders

## 🎨 Storybook Stories

The component includes comprehensive Storybook stories demonstrating all features:

1. **Default** - Standard board with 4 columns and sample tasks
2. **Empty** - Empty board state with helpful messages
3. **WithManyTasks** - Board with 35+ tasks to test performance
4. **DifferentPriorities** - Showcase of all priority levels
5. **InteractiveDemo** - Fully functional interactive playground
6. **MobileView** - Mobile viewport demonstration
7. **Accessibility** - Keyboard navigation demonstration

## 🛠️ Technologies

- **React** ^18.2.0 - Component framework
- **TypeScript** ^5.3.0 - Type-safe development
- **Tailwind CSS** ^3.4.0 - Utility-first styling
- **Vite** ^5.0.0 - Build tooling
- **Storybook** ^7.6.0 - Component documentation
- **date-fns** ^3.0.0 - Date manipulation
- **clsx** ^2.1.0 - Conditional class management

## 📋 Usage

```tsx
import { KanbanBoard } from '@/components/KanbanBoard/KanbanBoard';
import type { KanbanColumn, KanbanTask } from '@/components/KanbanBoard/KanbanBoard.types';

const columns: KanbanColumn[] = [
  { id: 'todo', title: 'To Do', color: '#6b7280', taskIds: ['task-1'] },
  { id: 'done', title: 'Done', color: '#10b981', taskIds: [] },
];

const tasks: Record<string, KanbanTask> = {
  'task-1': {
    id: 'task-1',
    title: 'My Task',
    status: 'todo',
    priority: 'high',
    createdAt: new Date(),
  },
};

function App() {
  return (
    <KanbanBoard
      columns={columns}
      tasks={tasks}
      onTaskMove={(taskId, fromColumn, toColumn, newIndex) => {
        console.log('Task moved', { taskId, fromColumn, toColumn, newIndex });
      }}
      onTaskCreate={(columnId, task) => {
        console.log('Task created', { columnId, task });
      }}
      onTaskUpdate={(taskId, updates) => {
        console.log('Task updated', { taskId, updates });
      }}
      onTaskDelete={(taskId) => {
        console.log('Task deleted', { taskId });
      }}
    />
  );
}
```

## ♿ Accessibility

This component meets WCAG 2.1 AA standards:

- **Keyboard Navigation**: All features accessible via keyboard
  - `Tab` / `Shift+Tab`: Navigate between elements
  - `Space` / `Enter`: Activate or grab task
  - `Arrow Keys`: Navigate between tasks/columns
  - `Escape`: Cancel actions or close modals
  - `Delete` / `Backspace` (with Ctrl/Cmd): Delete task

- **ARIA Implementation**: Comprehensive ARIA labels and roles
- **Focus Management**: Visible focus indicators and logical focus order
- **Screen Reader Support**: All interactive elements properly labeled

## 🚀 Performance

- **Optimized Rendering**: Components memoized with `React.memo()`
- **Efficient State Management**: Minimal re-renders with proper state structure
- **Virtualization Ready**: Structure supports virtualization for 100+ tasks
- **Bundle Size**: Production build optimized for minimal bundle size

## 📝 Development

```bash
# Start development server
npm run dev

# Run Storybook
npm run storybook

# Build for production
npm run build

# Build Storybook
npm run build-storybook
```

## 🧪 Testing

The component is demonstrated through Storybook stories. Each story tests different scenarios:

- Default state
- Empty states
- Large datasets
- Different priorities
- Interactive interactions
- Mobile responsiveness
- Accessibility features

## 📄 License

This project is part of a frontend developer hiring assignment. All code remains the intellectual property of the developer.

## 👤 Contact

[Your Name]
[Your Email]

---

Built with ❤️ using React, TypeScript, and Tailwind CSS

