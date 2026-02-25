import { useState } from "react";
import { TaskProvider, useTaskContext } from "./context/TaskContext";
import TaskForm from "./components/TaskForm";
import TaskList from "./components/TaskList";
import type{ Task, Status } from "./types/task";

function Dashboard() {
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [activeStatus, setActiveStatus] = useState<Status | "All">("All");
  const { state } = useTaskContext();

  const hasTasks = state.tasks.length > 0;

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

        {/* Show filter only if tasks exist */}
        {hasTasks && (
          <div className="flex gap-4 border-b pb-2">
            {["All", "To Do", "In Progress", "Done"].map((status) => (
              <button
                key={status}
                onClick={() => setActiveStatus(status as any)}
                className={`px-4 py-2 rounded-md ${
                  activeStatus === status
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200 text-gray-700"
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        )}

        <TaskList
          onEdit={setEditingTask}
          activeStatus={activeStatus}
        />

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