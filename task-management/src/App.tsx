import { useState } from "react";
import { TaskProvider } from "./context/TaskContext";
import TaskForm from "./components/TaskForm";
import TaskList from "./components/TaskList";
import type { Task } from "./types/task";

function Dashboard() {
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        <h1 className="text-3xl font-bold">
          Task Management Dashboard
        </h1>

        <TaskForm
          editingTask={editingTask}
          setEditingTask={setEditingTask}
        />

        <TaskList onEdit={setEditingTask} />
      </div>
    </div>
  );
}

function App() {
  return (
    <TaskProvider>
      <Dashboard />
    </TaskProvider>
  );
}

export default App;